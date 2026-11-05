import { Router } from "express";
import rateLimit from "express-rate-limit";
import { subscribeSchema } from "./newsletter.schemas";
import { subscribe } from "./newsletter.service";

export const newsletterRouter = Router();

const subscribeLimiter = rateLimit({ windowMs: 60 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false });

newsletterRouter.post("/", subscribeLimiter, async (req, res) => {
  const { email } = subscribeSchema.parse(req.body);
  res.status(201).json(await subscribe(email));
});
