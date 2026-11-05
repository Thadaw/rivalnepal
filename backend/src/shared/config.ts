import "dotenv/config";
import { z } from "zod";

// Origins always allowed by CORS, even when CLIENT_ORIGIN on the server still
// points at an older domain (e.g. after a Vercel project rename).
export const STOREFRONT_ORIGINS = ["https://rivalnepal.vercel.app"];

export const config = z
  .object({
    DATABASE_URL: z.string().min(1),
    JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
    // Comma separated so the apex domain and www can both call the API.
    CLIENT_ORIGIN: z
      .string()
      .default("http://localhost:5173")
      .transform((value) => value.split(",").map((origin) => origin.trim()).filter(Boolean))
      .pipe(z.array(z.string().url()).min(1)),
    PORT: z.coerce.number().default(4000),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  })
  .parse(process.env);
