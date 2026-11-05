import { useMutation } from "@tanstack/react-query";
import { lookupOrder } from "@/features/orders/api/orders.api";

export type LookupOrderArgs = { id: string; phone: string };

export function useOrderLookup() {
  return useMutation({
    mutationFn: ({ id, phone }: LookupOrderArgs) => lookupOrder(id.trim().toUpperCase(), phone.trim()),
  });
}
