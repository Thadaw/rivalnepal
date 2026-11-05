import { Prisma } from "@prisma/client";
import { prisma } from "../../shared/db";
import { AppError } from "../../shared/errors";
import { makeSku, slugify } from "../../shared/slug";
import type { ProductInput } from "./products.schemas";

type ProductWithVariants = Prisma.ProductGetPayload<{ include: { variants: true } }>;

export const toAdminProduct = (p: ProductWithVariants) => ({
  id: p.id,
  slug: p.slug,
  name: p.name,
  category: p.category,
  price: p.price,
  description: p.description,
  tag: p.tag ?? "",
  active: p.active,
  images: p.images,
  variants: p.variants.map((v) => ({ color: v.color, colorHex: v.colorHex, size: v.size, stock: v.stock })),
});

async function uniqueSlug(name: string) {
  const base = slugify(name) || "product";
  let slug = base;
  for (let n = 2; await prisma.product.findUnique({ where: { slug } }); n++) slug = `${base}-${n}`;
  return slug;
}

export async function listProductsAdmin() {
  return prisma.product.findMany({ include: { variants: { orderBy: { id: "asc" } } }, orderBy: { createdAt: "desc" } });
}

export async function getProductById(id: string) {
  const product = await prisma.product.findUnique({ where: { id }, include: { variants: { orderBy: { id: "asc" } } } });
  if (!product) throw new AppError(404, "Product not found");
  return product;
}

export async function createProduct(b: ProductInput) {
  const slug = await uniqueSlug(b.name);
  return prisma.$transaction(async (tx) => {
    const product = await tx.product.create({
      data: {
        slug,
        name: b.name,
        category: b.category,
        price: b.price,
        description: b.description,
        tag: b.tag || null,
        active: b.active,
        images: b.images ?? [],
        variants: {
          create: b.variants.map((v) => ({
            color: v.color,
            colorHex: v.colorHex,
            size: v.size,
            stock: v.stock,
            sku: makeSku(slug, v.color, v.size),
          })),
        },
      },
      include: { variants: true },
    });
    const opening = product.variants
      .filter((v) => v.stock > 0)
      .map((v) => ({ variantId: v.id, delta: v.stock, reason: "restock" as const, note: "Opening stock" }));
    if (opening.length) await tx.stockMovement.createMany({ data: opening });
    return product;
  });
}

// Editing a product never changes the stock of variants that already exist.
// Existing stock changes only through /inventory/adjust, so every change is logged.
export async function updateProduct(id: string, b: ProductInput) {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.product.findUnique({ where: { id }, include: { variants: true } });
    if (!existing) throw new AppError(404, "Product not found");
    await tx.product.update({
      where: { id },
      data: {
        name: b.name,
        category: b.category,
        price: b.price,
        description: b.description,
        tag: b.tag || null,
        active: b.active,
        // Omitting images leaves existing photography untouched.
        ...(b.images ? { images: b.images } : {}),
      },
    });

    const keep: string[] = [];
    for (const v of b.variants) {
      const found = existing.variants.find((x) => x.color === v.color && x.size === v.size);
      if (found) {
        keep.push(found.id);
        await tx.variant.update({ where: { id: found.id }, data: { colorHex: v.colorHex } });
      } else {
        const created = await tx.variant.create({
          data: {
            productId: id,
            color: v.color,
            colorHex: v.colorHex,
            size: v.size,
            stock: v.stock,
            sku: makeSku(existing.slug, v.color, v.size),
          },
        });
        keep.push(created.id);
        if (v.stock > 0)
          await tx.stockMovement.create({
            data: { variantId: created.id, delta: v.stock, reason: "restock", note: "Opening stock" },
          });
      }
    }
    await tx.variant.deleteMany({ where: { productId: id, id: { notIn: keep } } });
    return tx.product.findUniqueOrThrow({ where: { id }, include: { variants: { orderBy: { id: "asc" } } } });
  });
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } });
}
