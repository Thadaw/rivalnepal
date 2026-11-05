// Confirm the real delivery rates with the client.
export const SHIPPING = { valley: 100, outside: 200 } as const;
export const LOW_STOCK = 5;

// The happy path for an order. Anything outside this list is cancelled.
export const ORDER_FLOW = ["pending", "confirmed", "printing", "shipped", "delivered"] as const;
export const ORDER_STATUSES = [...ORDER_FLOW, "cancelled"] as const;
