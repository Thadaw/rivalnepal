import { Prisma, type Category } from "@prisma/client";
import { prisma } from "../../shared/db";
import { LOW_STOCK } from "../../shared/constants";
import { AppError } from "../../shared/errors";

const withVariants = { variants: { orderBy: { id: "asc" } } } satisfies Prisma.ProductInclude;
type ProductWithVariants = Prisma.ProductGetPayload<{ include: typeof withVariants }>;

const stockStatus = (stock: number) => (stock === 0 ? "out" : stock < LOW_STOCK ? "limited" : "in");

// The public shape of a product: variants are reduced to what a shopper can pick.
export function toStorefront(p: ProductWithVariants) {
  const colors = [...new Map(p.variants.map((v) => [v.color, { name: v.color, hex: v.colorHex }])).values()];
  const stock = p.variants.reduce((n, v) => n + v.stock, 0);
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: p.category,
    price: p.price,
    description: p.description,
    tag: p.tag ?? undefined,
    images: p.images,
    colors,
    sizes: [...new Set(p.variants.map((v) => v.size))],
    stock,
    stockStatus: stockStatus(stock),
    variants: p.variants.map((v) => ({
      color: v.color,
      size: v.size,
      inStock: v.stock > 0,
      stock: v.stock,
      status: stockStatus(v.stock),
    })),
  };
}

export async function listProducts(category?: Category) {
  const rows = await prisma.product.findMany({
    where: { active: true, category },
    include: withVariants,
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toStorefront);
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findFirst({ where: { slug, active: true }, include: withVariants });
  if (!product) throw new AppError(404, "Product not found");
  return toStorefront(product);
}
