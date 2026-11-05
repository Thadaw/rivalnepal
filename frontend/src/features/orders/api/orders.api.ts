import { apiFetch } from "@/shared/api/http";
import type { PlacedOrder } from "@/features/orders/types";

/** The phone number must match the order, so order numbers cannot be guessed. */
export function lookupOrder(id: string, phone: string): Promise<PlacedOrder> {
  return apiFetch<PlacedOrder>(
    `/orders/${encodeURIComponent(id)}?phone=${encodeURIComponent(phone)}`,
  );
}

/** Order history for the signed-in customer, matched on their checkout email. */
export function getMyOrders(): Promise<PlacedOrder[]> {
  return apiFetch<PlacedOrder[]>("/account/orders");
}
