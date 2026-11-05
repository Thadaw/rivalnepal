import { Router } from "express";
import { adjustSchema } from "./inventory.schemas";
import { adjustStock, listInventory, listMovements } from "./inventory.service";

export const inventoryAdminRouter = Router();

inventoryAdminRouter.get("/", async (_req, res) => {
  res.json(await listInventory());
});

inventoryAdminRouter.get("/movements", async (_req, res) => {
  res.json(await listMovements());
});

inventoryAdminRouter.post("/adjust", async (req, res) => {
  const body = adjustSchema.parse(req.body);
  res.json(await adjustStock({ ...body, note: body.note || undefined }));
});
