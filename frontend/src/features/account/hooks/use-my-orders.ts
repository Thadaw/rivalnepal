import { useQuery } from "@tanstack/react-query";
import { getMyOrders } from "@/features/orders/api/orders.api";

export const accountKeys = {
  orders: ["account", "orders"] as const,
};

export function useMyOrders(enabled = true) {
  return useQuery({
    queryKey: accountKeys.orders,
    queryFn: getMyOrders,
    enabled,
    retry: false,
    staleTime: 30_000,
  });
}
