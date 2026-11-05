import { Router } from "express";
import { getAnalytics } from "./analytics.service";

export const analyticsAdminRouter = Router();

analyticsAdminRouter.get("/analytics", async (_req, res) => {
  res.json(await getAnalytics());
});
