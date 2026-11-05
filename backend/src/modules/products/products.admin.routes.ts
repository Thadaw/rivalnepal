import { Router } from "express";
import { productSchema } from "./products.schemas";
import {
  createProduct,
  deleteProduct,
  getProductById,
  listProductsAdmin,
  toAdminProduct,
  updateProduct,
} from "./products.service";

export const productsAdminRouter = Router();

productsAdminRouter.get("/", async (_req, res) => {
  res.json((await listProductsAdmin()).map(toAdminProduct));
});

productsAdminRouter.get("/:id", async (req, res) => {
  res.json(toAdminProduct(await getProductById(req.params.id)));
});

productsAdminRouter.post("/", async (req, res) => {
  const body = productSchema.parse(req.body);
  res.status(201).json(toAdminProduct(await createProduct(body)));
});

productsAdminRouter.put("/:id", async (req, res) => {
  const body = productSchema.parse(req.body);
  res.json(toAdminProduct(await updateProduct(req.params.id, body)));
});

productsAdminRouter.delete("/:id", async (req, res) => {
  await deleteProduct(req.params.id);
  res.status(204).end();
});
