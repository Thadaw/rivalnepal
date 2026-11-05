import { Router } from "express";
import { listSubscribers, removeSubscriber } from "./newsletter.service";

export const newsletterAdminRouter = Router();

newsletterAdminRouter.get("/subscribers", async (_req, res) => {
  res.json(await listSubscribers());
});

newsletterAdminRouter.delete("/subscribers/:id", async (req, res) => {
  await removeSubscriber(req.params.id);
  res.status(204).end();
});
