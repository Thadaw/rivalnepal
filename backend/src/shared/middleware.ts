import type { ErrorRequestHandler, Request, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { config } from "./config";
import { AppError } from "./errors";

export interface AuthPayload {
  sub: string;
  role: "ADMIN" | "CUSTOMER";
}
declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

function verifyToken(req: Request): AuthPayload {
  const token = req.cookies?.token;
  if (!token) throw new AppError(401, "Log in to continue");
  try {
    return jwt.verify(token, config.JWT_SECRET) as AuthPayload;
  } catch {
    throw new AppError(401, "Your session has expired. Log in again.");
  }
}

export const requireAuth: RequestHandler = (req, _res, next) => {
  req.user = verifyToken(req);
  next();
};

export const requireAdmin: RequestHandler = (req, _res, next) => {
  const payload = verifyToken(req);
  if (payload.role !== "ADMIN") throw new AppError(403, "Only admins can do this");
  req.user = payload;
  next();
};

// Cookies are sent automatically, so require a header that a cross-site form cannot set.
export const csrfGuard: RequestHandler = (req, _res, next) => {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();
  if (req.get("x-requested-with") !== "XMLHttpRequest") throw new AppError(403, "Request blocked");
  next();
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError)
    return res.status(400).json({ message: "Check the highlighted fields and try again", issues: err.flatten().fieldErrors });
  if (err instanceof AppError) return res.status(err.status).json({ message: err.message });
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") return res.status(409).json({ message: "That value is already in use" });
    if (err.code === "P2003") return res.status(400).json({ message: "A referenced item does not exist" });
    if (err.code === "P2025") return res.status(404).json({ message: "Not found" });
  }
  console.error(err);
  res.status(500).json({ message: "Something went wrong on our side. Try again in a moment." });
};
