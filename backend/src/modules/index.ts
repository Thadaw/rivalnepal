import { Router } from "express";
import { requireAdmin } from "../shared/middleware";
import { authRouter } from "./auth/auth.routes";
import { catalogRouter } from "./catalog/catalog.routes";
import { ordersRouter } from "./orders/orders.routes";
import { accountRouter } from "./account/account.routes";
import { newsletterRouter } from "./newsletter/newsletter.routes";
import { dashboardAdminRouter } from "./dashboard/dashboard.admin.routes";
import { analyticsAdminRouter } from "./analytics/analytics.admin.routes";
import { customersAdminRouter } from "./customers/customers.admin.routes";
import { settingsAdminRouter } from "./settings/settings.admin.routes";
import { productsAdminRouter } from "./products/products.admin.routes";
import { inventoryAdminRouter } from "./inventory/inventory.admin.routes";
import { ordersAdminRouter } from "./orders/orders.admin.routes";
import { designsAdminRouter } from "./designs/designs.admin.routes";
import { newsletterAdminRouter } from "./newsletter/newsletter.admin.routes";

// Mounted at /api — anything a shopper can reach without an account.
export const publicApiRouter = Router();
publicApiRouter.use("/auth", authRouter);
publicApiRouter.use("/account", accountRouter);
publicApiRouter.use("/newsletter", newsletterRouter);
publicApiRouter.use(catalogRouter);
publicApiRouter.use(ordersRouter);

// Mounted at /api/admin — every route here requires an admin cookie.
export const adminApiRouter = Router();
adminApiRouter.use(requireAdmin);
adminApiRouter.use(dashboardAdminRouter);
adminApiRouter.use(analyticsAdminRouter);
adminApiRouter.use(settingsAdminRouter);
adminApiRouter.use("/customers", customersAdminRouter);
adminApiRouter.use("/products", productsAdminRouter);
adminApiRouter.use("/inventory", inventoryAdminRouter);
adminApiRouter.use("/orders", ordersAdminRouter);
adminApiRouter.use("/designs", designsAdminRouter);
adminApiRouter.use("/newsletter", newsletterAdminRouter);
