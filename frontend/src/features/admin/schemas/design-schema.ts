import { z } from "zod";

export const designSchema = z.object({
  name: z.string().trim().min(2, "Give the design a name."),
  description: z.string().trim().max(200, "Keep the description under 200 characters.").optional(),
  productIds: z.array(z.string()),
  active: z.boolean(),
});

export type DesignValues = z.infer<typeof designSchema>;
