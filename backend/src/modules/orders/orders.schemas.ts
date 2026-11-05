import { z } from "zod";
import { ORDER_STATUSES } from "../../shared/constants";
import { nepaliPhoneSchema } from "../../shared/schemas";

export const orderCreateSchema = z
  .object({
    fullName: z.string().trim().min(2),
    phone: nepaliPhoneSchema,
    email: z.union([z.literal(""), z.string().trim().email()]).optional(),
    district: z.string().trim().min(2),
    city: z.string().trim().min(2),
    address: z.string().trim().min(5),
    landmark: z.string().trim().optional(),
    deliveryArea: z.enum(["valley", "outside"]),
    payment: z.enum(["cod", "qr"]),
    // Compressed base64 screenshot of the transfer, required when paying by QR.
    paymentImage: z.string().max(1_600_000).optional(),
    note: z.string().trim().max(300).optional(),
    items: z
      .array(z.object({ slug: z.string(), color: z.string(), size: z.string(), qty: z.number().int().min(1).max(10) }))
      .min(1)
      .max(20),
  })
  .superRefine((value, ctx) => {
    if (value.payment !== "qr") return;
    if (!value.paymentImage)
      return ctx.addIssue({ code: "custom", path: ["paymentImage"], message: "Upload a screenshot of the payment to continue." });
    if (!/^data:image\/(png|jpe?g|webp);base64,/.test(value.paymentImage))
      return ctx.addIssue({ code: "custom", path: ["paymentImage"], message: "Upload a PNG, JPG or WEBP image." });
  });

export type OrderCreateInput = z.infer<typeof orderCreateSchema>;

export const statusSchema = z.object({ to: z.enum(ORDER_STATUSES) });
