import { Router } from "express";
import rateLimit from "express-rate-limit";
import { requireAuth } from "../../shared/middleware";
import { loginSchema, passwordSchema, profileSchema, registerSchema } from "./auth.schemas";
import {
  authenticate,
  clearSession,
  getSessionUser,
  registerUser,
  startSession,
  toUser,
  updateName,
  updatePassword,
} from "./auth.service";

export const authRouter = Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: { message: "Too many attempts. Wait a few minutes and try again." },
});

authRouter.post("/register", limiter, async (req, res) => {
  const { email, password } = registerSchema.parse(req.body);
  const user = await registerUser(email, password);
  res.status(201).json(startSession(res, user));
});

authRouter.post("/login", limiter, async (req, res) => {
  const { email, password } = loginSchema.parse(req.body);
  const user = await authenticate(email, password);
  res.json(startSession(res, user));
});

authRouter.get("/me", requireAuth, async (req, res) => {
  res.json(toUser(await getSessionUser(req.user!.sub)));
});

authRouter.patch("/profile", requireAuth, async (req, res) => {
  const { name } = profileSchema.parse(req.body);
  res.json(toUser(await updateName(req.user!.sub, name)));
});

authRouter.patch("/password", limiter, requireAuth, async (req, res) => {
  const { currentPassword, newPassword } = passwordSchema.parse(req.body);
  await updatePassword(req.user!.sub, currentPassword, newPassword);
  res.status(204).end();
});

authRouter.post("/logout", (_req, res) => {
  clearSession(res);
  res.status(204).end();
});
