import { z } from "zod";

export const adjustStockSchema = z.object({
  quantity: z.number().int("Enter a whole number.").min(1, "Enter at least one unit."),
  reason: z.enum(["restock", "return", "correction", "damaged"]),
  note: z.string().trim().max(200, "Keep the note under 200 characters.").optional(),
});

export type AdjustStockValues = z.infer<typeof adjustStockSchema>;
