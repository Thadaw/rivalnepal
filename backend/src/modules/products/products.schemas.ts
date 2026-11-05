import { z } from "zod";
import { categorySchema } from "../../shared/schemas";

export const productSchema = z
  .object({
    name: z.string().trim().min(2),
    category: categorySchema,
    price: z.number().int().min(1),
    description: z.string().trim().min(10),
    tag: z.string().trim().max(16).optional(),
    images: z.array(z.string().trim().url()).max(6).optional(),
    active: z.boolean(),
    variants: z
      .array(
        z.object({
          color: z.string().trim().min(1),
          colorHex: z
            .string()
            .regex(/^#[0-9a-fA-F]{6}$/)
            .default("#1c1c1a"),
          size: z.string().trim().min(1),
          stock: z.number().int().min(0),
        })
      )
      .min(1),
  })
  .superRefine((v, ctx) => {
    const seen = new Set<string>();
    v.variants.forEach((x, i) => {
      const k = `${x.color.toLowerCase()}|${x.size.toLowerCase()}`;
      if (seen.has(k)) ctx.addIssue({ code: "custom", path: ["variants", i, "size"], message: "Duplicate colour and size" });
      seen.add(k);
    });
  });

export type ProductInput = z.infer<typeof productSchema>;
