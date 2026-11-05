import { Router } from "express";
import { categorySchema } from "../../shared/schemas";
import { getProductBySlug, listProducts } from "./catalog.service";

export const catalogRouter = Router();

catalogRouter.get("/products", async (req, res) => {
  const category = categorySchema.optional().parse(req.query.category);
  res.json(await listProducts(category));
});

catalogRouter.get("/products/:slug", async (req, res) => {
  res.json(await getProductBySlug(req.params.slug));
});
