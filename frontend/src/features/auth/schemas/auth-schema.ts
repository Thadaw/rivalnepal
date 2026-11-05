import { z } from "zod";

export const authSchema = z.object({
  email: z.string().trim().min(1, "Enter your email.").email("Enter a valid email address."),
  password: z.string().min(8, "Use at least 8 characters."),
});

export type AuthValues = z.infer<typeof authSchema>;
