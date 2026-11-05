import { useQuery } from "@tanstack/react-query";
import {
  getAdminAnalytics,
  getAdminCustomers,
  getAdminDashboard,
  getAdminDesigns,
  getAdminInventory,
  getAdminMovements,
  getAdminOrders,
  getAdminSettings,
  getAdminSubscribers,
} from "@/features/admin/api/admin.api";
import { getAdminProduct, getAdminProducts } from "@/features/admin/api/products.api";

export const adminKeys = {
  all: ["admin"] as const,
  dashboard: ["admin", "dashboard"] as const,
  analytics: ["admin", "analytics"] as const,
  orders: ["admin", "orders"] as const,
  inventory: ["admin", "inventory"] as const,
  movements: ["admin", "inventory", "movements"] as const,
  customers: ["admin", "customers"] as const,
  settings: ["admin", "settings"] as const,
  designs: ["admin", "designs"] as const,
  subscribers: ["admin", "subscribers"] as const,
  products: ["admin", "products"] as const,
  product: (id: string) => ["admin", "products", id] as const,
};

export const useAdminDashboard = () =>
  useQuery({ queryKey: adminKeys.dashboard, queryFn: getAdminDashboard, retry: false });

export const useAdminAnalytics = () =>
  useQuery({ queryKey: adminKeys.analytics, queryFn: getAdminAnalytics, retry: false });

export const useAdminOrders = () =>
  useQuery({ queryKey: adminKeys.orders, queryFn: getAdminOrders, retry: false });

export const useAdminInventory = () =>
  useQuery({ queryKey: adminKeys.inventory, queryFn: getAdminInventory, retry: false });

export const useAdminMovements = () =>
  useQuery({ queryKey: adminKeys.movements, queryFn: getAdminMovements, retry: false });

export const useAdminCustomers = () =>
  useQuery({ queryKey: adminKeys.customers, queryFn: getAdminCustomers, retry: false });

export const useAdminSettings = () =>
  useQuery({ queryKey: adminKeys.settings, queryFn: getAdminSettings, retry: false });

export const useAdminDesigns = () =>
  useQuery({ queryKey: adminKeys.designs, queryFn: getAdminDesigns, retry: false });

export const useAdminSubscribers = () =>
  useQuery({ queryKey: adminKeys.subscribers, queryFn: getAdminSubscribers, retry: false });

export const useAdminProducts = () =>
  useQuery({ queryKey: adminKeys.products, queryFn: getAdminProducts, retry: false });

export const useAdminProduct = (id: string) =>
  useQuery({
    queryKey: adminKeys.product(id),
    queryFn: () => getAdminProduct(id),
    enabled: Boolean(id),
    retry: false,
  });
