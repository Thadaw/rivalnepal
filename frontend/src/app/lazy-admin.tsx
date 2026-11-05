import { lazy } from "react";

/**
 * The admin workspace is loaded on demand so shoppers never download it.
 * Each entry becomes its own chunk during `vite build`.
 */
export const AdminLayout = lazy(() =>
  import("@/features/admin/components/admin-layout").then((m) => ({ default: m.AdminLayout })),
);

export const AdminLoginPage = lazy(() =>
  import("@/features/admin/pages/login-page").then((m) => ({ default: m.LoginPage })),
);

export const AdminDashboardPage = lazy(() =>
  import("@/features/admin/pages/dashboard-page").then((m) => ({ default: m.DashboardPage })),
);

export const AdminProductsPage = lazy(() =>
  import("@/features/admin/pages/products-page").then((m) => ({ default: m.ProductsPage })),
);

export const AdminProductFormPage = lazy(() =>
  import("@/features/admin/pages/product-form-page").then((m) => ({ default: m.ProductFormPage })),
);

export const AdminOrdersPage = lazy(() =>
  import("@/features/admin/pages/orders-page").then((m) => ({ default: m.OrdersPage })),
);

export const AdminInventoryPage = lazy(() =>
  import("@/features/admin/pages/inventory-page").then((m) => ({ default: m.InventoryPage })),
);

export const AdminDesignsPage = lazy(() =>
  import("@/features/admin/pages/designs-page").then((m) => ({ default: m.DesignsPage })),
);

export const AdminNewsletterPage = lazy(() =>
  import("@/features/admin/pages/newsletter-page").then((m) => ({ default: m.NewsletterPage })),
);

export const AdminCustomersPage = lazy(() =>
  import("@/features/admin/pages/customers-page").then((m) => ({ default: m.CustomersPage })),
);

export const AdminAnalyticsPage = lazy(() =>
  import("@/features/admin/pages/analytics-page").then((m) => ({ default: m.AnalyticsPage })),
);

export const AdminSettingsPage = lazy(() =>
  import("@/features/admin/pages/settings-page").then((m) => ({ default: m.SettingsPage })),
);

export const AdminProfilePage = lazy(() =>
  import("@/features/admin/pages/profile-page").then((m) => ({ default: m.ProfilePage })),
);
