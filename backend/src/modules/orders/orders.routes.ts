import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { findCustomerOrder, placeOrder, toCustomerOrder } from "./orders.service";
import { orderCreateSchema } from "./orders.schemas";

export const ordersRouter = Router();

const orderLimiter = rateLimit({ windowMs: 60 * 60 * 1000, limit: 20, standardHeaders: true, legacyHeaders: false });

ordersRouter.post("/orders", orderLimiter, async (req, res) => {
  const body = orderCreateSchema.parse(req.body);
  const order = await placeOrder(body);
  res.status(201).json(toCustomerOrder(order));
});

ordersRouter.get("/orders/:id", async (req, res) => {
  const phone = z.string().parse(req.query.phone);
  res.json(toCustomerOrder(await findCustomerOrder(req.params.id, phone)));
});
