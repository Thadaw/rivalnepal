import { apiFetch } from "@/shared/api/http";
import type { PlacedOrder } from "@/features/orders/types";

export type CheckoutItem = { slug: string; color: string; size: string; qty: number };

export type CheckoutInput = {
  fullName: string;
  phone: string;
  email?: string;
  district: string;
  city: string;
  address: string;
  landmark?: string;
  note?: string;
  deliveryArea: "valley" | "outside";
  payment: "cod";
  items: CheckoutItem[];
};

export function createOrder(input: CheckoutInput): Promise<PlacedOrder> {
  return apiFetch<PlacedOrder>("/orders", {
    method: "POST",
    body: { ...input, email: input.email ?? "" },
  });
}
