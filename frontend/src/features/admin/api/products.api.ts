import { apiFetch } from "@/shared/api/http";
import { getProduct } from "@/features/catalog/api/products.api";
import { toApiCategory, toCategory } from "@/features/catalog/lib/categories";
import type { AdminProductVariant, Category, Product } from "@/features/catalog/types";

type ApiAdminProduct = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  description: string;
  tag: string;
  active: boolean;
  images: string[];
  variants: AdminProductVariant[];
};

export type AdminProduct = {
  id: string;
  slug: string;
  name: string;
  category: Category;
  price: number;
  description: string;
  tag: string;
  active: boolean;
  images: string[];
  image: string;
  colors: string[];
  sizes: string[];
  variants: AdminProductVariant[];
  stock: number;
};

export type AdminProductPatch = {
  name: string;
  category: Category;
  price: number;
  description: string;
  badge?: string;
  active: boolean;
  images: string[];
  variants: AdminProductVariant[];
};

function toAdminProduct(p: ApiAdminProduct): AdminProduct {
  const colors: string[] = [];
  const sizes: string[] = [];
  for (const variant of p.variants) {
    if (!colors.includes(variant.color)) colors.push(variant.color);
    if (!sizes.includes(variant.size)) sizes.push(variant.size);
  }
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: toCategory(p.category),
    price: p.price,
    description: p.description,
    tag: p.tag,
    active: p.active,
    images: p.images,
    image: p.images[0] ?? "",
    colors,
    sizes,
    variants: p.variants,
    stock: p.variants.reduce((total, variant) => total + variant.stock, 0),
  };
}

export async function getAdminProducts(): Promise<AdminProduct[]> {
  const rows = await apiFetch<ApiAdminProduct[]>("/admin/products");
  return rows.map(toAdminProduct);
}

export async function getAdminProduct(id: string): Promise<AdminProduct> {
  const row = await apiFetch<ApiAdminProduct>(`/admin/products/${encodeURIComponent(id)}`);
  return toAdminProduct(row);
}

/**
 * Editing keeps the existing colour/size variant grid intact: stock only ever
 * changes through the inventory adjustment endpoint, so the variants pass straight through.
 */
export async function updateAdminProduct(id: string, patch: AdminProductPatch): Promise<void> {
  await apiFetch<void>(`/admin/products/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: {
      name: patch.name,
      category: toApiCategory(patch.category),
      price: patch.price,
      description: patch.description,
      tag: patch.badge || undefined,
      active: patch.active,
      images: patch.images,
      variants: patch.variants,
    },
  });
}

export function deleteAdminProduct(id: string): Promise<void> {
  return apiFetch<void>(`/admin/products/${encodeURIComponent(id)}`, { method: "DELETE" });
}

/** Creates a product from the admin form, then reads it back with live stock. */
export async function createAdminProduct(input: Product): Promise<Product> {
  const variantCount = Math.max(1, input.colors.length * input.sizes.length);
  const perVariant = Math.max(0, Math.floor((input.stock ?? 0) / variantCount));
  const variants = input.colors.flatMap((color) =>
    input.sizes.map((size) => ({
      color,
      colorHex: "#1c1c1a",
      size,
      stock: perVariant,
    })),
  );

  const created = await apiFetch<{ slug: string }>("/admin/products", {
    method: "POST",
    body: {
      name: input.name,
      category: toApiCategory(input.category),
      price: input.price,
      description: input.description,
      tag: input.badge || undefined,
      images: input.images ?? (input.image ? [input.image] : []),
      active: input.active ?? true,
      variants,
    },
  });

  return (await getProduct(created.slug)) ?? input;
}
