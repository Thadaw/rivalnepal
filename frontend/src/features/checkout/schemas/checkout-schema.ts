import { z } from "zod";

export const checkoutSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name."),
  phone: z.string().trim().regex(/^9[78]\d{8}$/, "Enter a 10-digit mobile number starting with 97 or 98."),
  email: z.union([z.literal(""), z.string().trim().email("Enter a valid email address.")]),
  district: z.string().trim().min(2, "Enter your district."),
  city: z.string().trim().min(2, "Enter your city or area."),
  address: z.string().trim().min(5, "Enter your street address and house number."),
  landmark: z.string().trim().max(120, "Keep the landmark short.").optional(),
  deliveryArea: z.enum(["valley", "outside"]),
  note: z.string().trim().max(300, "Keep the note under 300 characters.").optional(),
});

export type CheckoutValues = z.infer<typeof checkoutSchema>;
