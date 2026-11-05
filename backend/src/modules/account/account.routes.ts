import { Router } from "express";
import { requireAuth } from "../../shared/middleware";
import { toCustomerOrder } from "../orders/orders.service";
import { listOrderHistory } from "./account.service";

export const accountRouter = Router();

accountRouter.get("/orders", requireAuth, async (req, res) => {
  res.json((await listOrderHistory(req.user!.sub)).map(toCustomerOrder));
});
