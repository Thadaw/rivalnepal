import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createOrder, type CheckoutInput } from "@/features/checkout/api/checkout.api";
import { rememberOrder } from "@/features/checkout/lib/last-order";
import { useCartStore } from "@/features/cart/store/cart-store";

/** Places the order, clears the bag and lands on the confirmation page. */
export function usePlaceOrder() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const clearCart = useCartStore((state) => state.clearCart);

  return useMutation({
    mutationFn: (input: CheckoutInput) => createOrder(input),
    onSuccess: (order) => {
      rememberOrder(order);
      clearCart();
      queryClient.invalidateQueries({ queryKey: ["account", "orders"] });
      navigate(`/order/${order.id}`, { replace: true, state: { order } });
    },
  });
}
