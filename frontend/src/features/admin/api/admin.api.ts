import { apiFetch } from "@/shared/api/http";
import type { OrderStatus } from "@/features/orders/types";

export type AdminOrderItem = {
  productId: string;
  name: string;
  color: string;
  size: string;
  qty: number;
  price: number;
};

export type AdminOrder = {
  id: string;
  customer: string;
  phone: string;
  email: string | null;
  district: string;
  city: string;
  address: string;
  landmark: string | null;
  note: string | null;
  deliveryArea: "valley" | "outside";
  payment: string;
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  stockDeducted: boolean;
  items: AdminOrderItem[];
};

export type AdminDashboard = {
  sales: number;
  orderCount: number;
  pending: number;
  lowStock: { id: string; product: string; color: string; size: string; stock: number }[];
  recent: { id: string; customer: string; total: number; status: OrderStatus; createdAt: string }[];
};

export type AdminInventoryRow = {
  key: string;
  variantId: string;
  productId: string;
  name: string;
  category: string;
  sku: string;
  color: string;
  colorHex: string;
  size: string;
  stock: number;
  lastMovementAt?: string;
};

export type AdminMovement = {
  id: string;
  at: string;
  variantId: string;
  productId: string;
  productName: string;
  sku: string;
  color: string;
  size: string;
  delta: number;
  stockAfter: number;
  reason: string;
  note?: string;
  ref?: string;
};

export type AdjustReason = "restock" | "return" | "correction" | "damaged";

export type AdminStockResult = {
  variantId: string;
  delta: number;
  stock: number;
};

export type AdminCustomer = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  orders: number;
  spent: number;
  joined: string;
  lastOrder: string | null;
  registered: boolean;
};

export type AdminAnalytics = {
  revenue: number;
  orderCount: number;
  liveOrders: number;
  averageOrder: number;
  customers: number;
  lowStock: number;
  byDay: { date: string; revenue: number; orders: number }[];
  byStatus: { status: OrderStatus; count: number }[];
  topProducts: { name: string; qty: number; revenue: number }[];
};

export type AdminDesign = {
  id: string;
  name: string;
  description: string;
  active: boolean;
  productIds: string[];
};

export type AdminDesignInput = {
  name: string;
  description?: string;
  active: boolean;
  productIds: string[];
};

export type AdminSubscriber = {
  id: string;
  email: string;
  joined: string;
};

export type AdminSettings = {
  storeName: string;
  currency: string;
  shipsFrom: string;
  shipping: { valley: number; outside: number };
  lowStockThreshold: number;
  adminEmail: string;
  counts: { products: number; variants: number; customers: number; orders: number };
};

export const getAdminDashboard = () => apiFetch<AdminDashboard>("/admin/dashboard");

export const getAdminOrders = () => apiFetch<AdminOrder[]>("/admin/orders");

export const setAdminOrderStatus = (id: string, to: OrderStatus) =>
  apiFetch<AdminOrder>(`/admin/orders/${encodeURIComponent(id)}/status`, {
    method: "PATCH",
    body: { to },
  });

export const getAdminInventory = () => apiFetch<AdminInventoryRow[]>("/admin/inventory");

export const getAdminMovements = () => apiFetch<AdminMovement[]>("/admin/inventory/movements");

export const adjustInventory = (input: {
  variantId: string;
  delta: number;
  reason: AdjustReason;
  note?: string;
}) =>
  apiFetch<AdminStockResult>("/admin/inventory/adjust", {
    method: "POST",
    body: input,
  });

export const getAdminCustomers = () => apiFetch<AdminCustomer[]>("/admin/customers");

export const getAdminAnalytics = () => apiFetch<AdminAnalytics>("/admin/analytics");

export const getAdminSettings = () => apiFetch<AdminSettings>("/admin/settings");

export const getAdminDesigns = () => apiFetch<AdminDesign[]>("/admin/designs");

export const createAdminDesign = (input: AdminDesignInput) =>
  apiFetch<AdminDesign>("/admin/designs", { method: "POST", body: input });

export const updateAdminDesign = (id: string, input: AdminDesignInput) =>
  apiFetch<AdminDesign>(`/admin/designs/${encodeURIComponent(id)}`, { method: "PUT", body: input });

export const deleteAdminDesign = (id: string) =>
  apiFetch<void>(`/admin/designs/${encodeURIComponent(id)}`, { method: "DELETE" });

export const getAdminSubscribers = () => apiFetch<AdminSubscriber[]>("/admin/newsletter/subscribers");

export const deleteAdminSubscriber = (id: string) =>
  apiFetch<void>(`/admin/newsletter/subscribers/${encodeURIComponent(id)}`, { method: "DELETE" });
