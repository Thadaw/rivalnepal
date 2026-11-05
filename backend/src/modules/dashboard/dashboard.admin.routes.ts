import { Router } from "express";
import { getDashboard } from "./dashboard.service";

export const dashboardAdminRouter = Router();

dashboardAdminRouter.get("/dashboard", async (_req, res) => {
  res.json(await getDashboard());
});
