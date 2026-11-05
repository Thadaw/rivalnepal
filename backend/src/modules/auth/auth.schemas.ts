import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export const registerSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8, "Use at least 8 characters"),
});

export const profileSchema = z.object({
  name: z.string().trim().max(80, "Keep your name under 80 characters"),
});

export const passwordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8, "Use at least 8 characters"),
});
