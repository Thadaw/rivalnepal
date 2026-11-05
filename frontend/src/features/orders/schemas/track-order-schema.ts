import { z } from "zod";

export const trackOrderSchema = z.object({
  orderId: z.string().trim().min(3, "Enter the order number from your confirmation."),
  phone: z.string().trim().regex(/^9[78]\d{8}$/, "Enter the 10-digit mobile number used at checkout."),
});

export type TrackOrderValues = z.infer<typeof trackOrderSchema>;
