import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters."),
  category: z.enum(["T-Shirts", "Hoodies", "Jackets", "Accessories"]),
  price: z.number().positive("Enter a valid price."),
  stock: z.number().int().min(0, "Stock cannot be negative."),
  description: z.string().min(10, "Add a short product description."),
  image: z.string().refine(
    (value) => value.trim() === "" || /^https?:\/\/\S+\.\S+/.test(value.trim()),
    "Enter a valid image URL, or leave it empty."
  ),
  badge: z.string().trim().max(16, "Keep the badge to 16 characters.").optional(),
  active: z.boolean(),
});
export type ProductFormValues = z.infer<typeof productSchema>;
