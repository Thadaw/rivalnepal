import { Router } from "express";
import { getSettings } from "./settings.service";

export const settingsAdminRouter = Router();

settingsAdminRouter.get("/settings", async (req, res) => {
  res.json(await getSettings(req.user!.sub));
});
