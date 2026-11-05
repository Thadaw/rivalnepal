import { Router } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../../shared/db";
import { designSchema } from "./designs.schemas";

export const designsAdminRouter = Router();

const toDesign = (d: Prisma.DesignGetPayload<{ include: { products: true } }>) => ({
  id: d.id,
  name: d.name,
  description: d.description ?? "",
  active: d.active,
  productIds: d.products.map((p) => p.productId),
});

designsAdminRouter.get("/", async (_req, res) => {
  res.json((await prisma.design.findMany({ include: { products: true }, orderBy: { name: "asc" } })).map(toDesign));
});

designsAdminRouter.post("/", async (req, res) => {
  const b = designSchema.parse(req.body);
  const design = await prisma.design.create({
    data: {
      name: b.name,
      description: b.description || null,
      active: b.active,
      products: { create: b.productIds.map((productId) => ({ productId })) },
    },
    include: { products: true },
  });
  res.status(201).json(toDesign(design));
});

designsAdminRouter.put("/:id", async (req, res) => {
  const b = designSchema.parse(req.body);
  const design = await prisma.design.update({
    where: { id: req.params.id },
    data: {
      name: b.name,
      description: b.description || null,
      active: b.active,
      products: { deleteMany: {}, create: b.productIds.map((productId) => ({ productId })) },
    },
    include: { products: true },
  });
  res.json(toDesign(design));
});

designsAdminRouter.delete("/:id", async (req, res) => {
  await prisma.design.delete({ where: { id: req.params.id } });
  res.status(204).end();
});
