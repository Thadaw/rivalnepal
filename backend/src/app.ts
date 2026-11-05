import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { config, STOREFRONT_ORIGINS } from "./shared/config";
import { AppError } from "./shared/errors";
import { csrfGuard, errorHandler } from "./shared/middleware";
import { adminApiRouter, publicApiRouter } from "./modules";

export const app = express();
app.set("trust proxy", 1); // needed behind Render/Railway so rate limits see the real IP
app.use(helmet());
const allowedOrigins = [...new Set([...config.CLIENT_ORIGIN, ...STOREFRONT_ORIGINS])];
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: "2mb" })); // payment screenshots arrive as base64
app.use(cookieParser());
app.use("/api", rateLimit({ windowMs: 15 * 60 * 1000, limit: 600, standardHeaders: true, legacyHeaders: false }));
app.use(csrfGuard);

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/admin", adminApiRouter);
app.use("/api", publicApiRouter);

app.use((_req, _res, next) => next(new AppError(404, "Not found")));
app.use(errorHandler);
