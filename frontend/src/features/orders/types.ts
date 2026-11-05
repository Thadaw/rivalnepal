export type OrderStatus = "pending" | "confirmed" | "printing" | "shipped" | "delivered" | "cancelled";

/** Statuses an order moves through, in order. `cancelled` is a side exit. */
export const ORDER_FLOW: OrderStatus[] = ["pending", "confirmed", "printing", "shipped", "delivered"];

export const CANCELLABLE_STATUSES: OrderStatus[] = ["pending", "confirmed", "printing"];

export function nextOrderStatus(status: OrderStatus): OrderStatus | null {
  const index = ORDER_FLOW.indexOf(status);
  if (index < 0 || index === ORDER_FLOW.length - 1) return null;
  return ORDER_FLOW[index + 1];
}

/** Shape returned by the public order endpoints and the account order history. */
export type OrderLine = { name: string; color: string; size: string; qty: number; price: number };

export type OrderCustomer = {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  district: string;
};

export type PlacedOrder = {
  id: string;
  status: OrderStatus;
  items: OrderLine[];
  subtotal: number;
  shipping: number;
  total: number;
  customer: OrderCustomer;
  createdAt: string;
};

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  printing: "Printing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};
