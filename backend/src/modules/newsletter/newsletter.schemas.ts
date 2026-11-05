import { z } from "zod";

export const subscribeSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
});
