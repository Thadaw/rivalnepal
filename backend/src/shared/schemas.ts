import { z } from "zod";

// Mirror of the frontend Zod schemas. Move both copies into one shared package later.
export const categorySchema = z.enum(["tshirts", "hoodies", "jackets", "accessories"]);

export const nepaliPhoneSchema = z
  .string()
  .trim()
  .regex(/^9[78]\d{8}$/, "Enter a 10-digit mobile number starting with 97 or 98");
