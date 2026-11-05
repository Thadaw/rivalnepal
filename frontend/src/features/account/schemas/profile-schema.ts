import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().trim().max(80, "Keep your name under 80 characters."),
});

export type ProfileValues = z.infer<typeof profileSchema>;

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password."),
    newPassword: z.string().min(8, "Use at least 8 characters."),
  })
  .refine((values) => values.currentPassword !== values.newPassword, {
    path: ["newPassword"],
    message: "Choose a password you haven't used here.",
  });

export type PasswordValues = z.infer<typeof passwordSchema>;
