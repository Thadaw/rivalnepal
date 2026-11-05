import { z } from "zod";

export const adjustSchema = z.object({
  variantId: z.string().min(1),
  delta: z.number().int().refine((n) => n !== 0, "Change cannot be zero"),
  reason: z.enum(["restock", "return", "correction", "damaged"]),
  note: z.string().trim().max(200).optional(),
});
