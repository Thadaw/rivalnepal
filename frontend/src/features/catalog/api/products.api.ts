import { apiFetch } from "@/shared/api/http";
import { toCategory } from "@/features/catalog/lib/categories";
import { productImages } from "@/features/catalog/lib/catalog";
import type { Product } from "@/features/catalog/types";

export type ApiProduct = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  description: string;
  tag?: string;
  images: string[];
  colors: { name: string; hex: string }[];
  sizes: string[];
  variants: {
    color: string;
    size: string;
    inStock: boolean;
    stock: number;
    status: "out" | "limited" | "in";
  }[];
  stock?: number;
  stockStatus?: "out" | "limited" | "in";
};

/** API product → the shape the storefront renders. */
export function toProduct(p: ApiProduct): Product {
  const category = toCategory(p.category);
  const colorHexes: Record<string, string> = {};
  for (const color of p.colors) colorHexes[color.name] = color.hex;

  const availableSizesByColor: Record<string, string[]> = {};
  for (const variant of p.variants) {
    if (!variant.inStock) continue;
    const sizes = availableSizesByColor[variant.color] ?? [];
    if (!sizes.includes(variant.size)) sizes.push(variant.size);
    availableSizesByColor[variant.color] = sizes;
  }

  const gallery = productImages(category, p.slug, p.images);

  return {
    id: p.slug,
    name: p.name,
    category,
    price: p.price,
    image: gallery[0],
    images: gallery,
    badge: p.tag,
    description: p.description,
    sizes: p.sizes.length ? p.sizes : ["One size"],
    colors: p.colors.map((color) => color.name),
    colorHexes,
    availableSizesByColor,
    stock: p.stock ?? p.variants.filter((variant) => variant.inStock).length,
    stockStatus: p.stockStatus,
    variants: p.variants.map((variant) => ({
      color: variant.color,
      size: variant.size,
      inStock: variant.inStock,
      stock: variant.stock,
      status: variant.status,
    })),
  };
}

export async function getProducts(): Promise<Product[]> {
  const rows = await apiFetch<ApiProduct[]>("/products");
  return rows.map(toProduct);
}

export async function getProduct(id: string): Promise<Product | undefined> {
  try {
    const row = await apiFetch<ApiProduct>(`/products/${encodeURIComponent(id)}`);
    return toProduct(row);
  } catch (error) {
    if (error instanceof Error && /not found/i.test(error.message)) return undefined;
    throw error;
  }
}
