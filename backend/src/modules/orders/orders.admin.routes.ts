import { Router } from "express";
import { statusSchema } from "./orders.schemas";
import { getAdminOrder, listAdminOrders, setOrderStatus, toAdminOrder } from "./orders.service";

export const ordersAdminRouter = Router();

ordersAdminRouter.get("/", async (_req, res) => {
  res.json((await listAdminOrders()).map(toAdminOrder));
});

ordersAdminRouter.get("/:id", async (req, res) => {
  res.json(toAdminOrder(await getAdminOrder(req.params.id)));
});

ordersAdminRouter.patch("/:id/status", async (req, res) => {
  const { to } = statusSchema.parse(req.body);
  res.json(toAdminOrder(await setOrderStatus(req.params.id, to)));
});
