import type { PlacedOrder } from "@/features/orders/types";

const LAST_ORDER_KEY = "rival-last-order";

/** Keeps the confirmation page working after a reload or a hard navigation. */
export function rememberOrder(order: PlacedOrder) {
  try {
    sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
  } catch {
    // storage can be unavailable in private mode; the page still receives the order via router state
  }
}

export function recallOrder(): PlacedOrder | null {
  try {
    const raw = sessionStorage.getItem(LAST_ORDER_KEY);
    return raw ? (JSON.parse(raw) as PlacedOrder) : null;
  } catch {
    return null;
  }
}
