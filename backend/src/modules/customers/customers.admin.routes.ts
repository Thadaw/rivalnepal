import { Router } from "express";
import { listCustomers } from "./customers.service";

export const customersAdminRouter = Router();

customersAdminRouter.get("/", async (_req, res) => {
  res.json(await listCustomers());
});
