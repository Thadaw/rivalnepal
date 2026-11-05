import { z } from "zod";

export const designSchema = z.object({
  name: z.string().trim().min(2),
  description: z.string().trim().max(200).optional(),
  productIds: z.array(z.string()),
  active: z.boolean(),
});
