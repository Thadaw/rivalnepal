import type { Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../shared/db";
import { config } from "../../shared/config";
import { AppError } from "../../shared/errors";

// In production the storefront and this API usually live on different sites
// (e.g. Vercel + Render), so the session cookie has to be SameSite=None.
// Derive that from the configured https origins too: hosts like Render often leave
// NODE_ENV unset, and a Lax cookie is silently dropped on cross-site XHR.
const crossSite =
  config.NODE_ENV === "production" ||
  config.CLIENT_ORIGIN.some((origin) => origin.startsWith("https://") && !origin.includes("localhost"));

const COOKIE = {
  httpOnly: true,
  sameSite: crossSite ? "none" : "lax",
  secure: crossSite,
  path: "/",
} as const;

export type SessionUser = {
  id: string;
  email: string;
  name: string | null;
  role: "ADMIN" | "CUSTOMER";
  createdAt: Date;
};

export function toUser(user: SessionUser) {
  return {
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt.toISOString(),
  };
}

export function startSession(res: Response, user: SessionUser) {
  const token = jwt.sign({ sub: user.id, role: user.role }, config.JWT_SECRET, { expiresIn: "7d" });
  res.cookie("token", token, { ...COOKIE, maxAge: 7 * 24 * 60 * 60 * 1000 });
  return toUser(user);
}

export function clearSession(res: Response) {
  res.clearCookie("token", COOKIE);
}

export async function registerUser(email: string, password: string) {
  const normalized = email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email: normalized } });
  if (existing) throw new AppError(409, "An account with this email already exists");
  return prisma.user.create({
    data: { email: normalized, passwordHash: await bcrypt.hash(password, 10), role: "CUSTOMER" },
  });
}

export async function authenticate(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  const ok = user && (await bcrypt.compare(password, user.passwordHash));
  if (!user || !ok) throw new AppError(401, "Email or password is incorrect");
  return user;
}

export async function getSessionUser(id: string) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new AppError(401, "Log in to continue");
  return user;
}

export async function updateName(userId: string, name: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { name: name || null },
  });
}

export async function updatePassword(userId: string, currentPassword: string, newPassword: string) {
  const user = await getSessionUser(userId);
  const ok = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!ok) throw new AppError(401, "Current password is incorrect");
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await bcrypt.hash(newPassword, 10) },
  });
}
