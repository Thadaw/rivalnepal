import { useQuery } from "@tanstack/react-query";
import { getProduct, getProducts } from "@/features/catalog/api/products.api";
import { products as fallbackProducts } from "@/features/catalog/data/fallback-products";

export const productKeys = {
  all: ["products"] as const,
  detail: (id: string) => ["products", id] as const,
};

/** The shop should still render if the API is unreachable, so failures fall back to seed data. */
export function useProducts() {
  return useQuery({
    queryKey: productKeys.all,
    queryFn: async () => {
      try {
        const rows = await getProducts();
        return rows.length ? rows : fallbackProducts;
      } catch {
        return fallbackProducts;
      }
    },
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: async () => {
      try {
        return (await getProduct(id)) ?? fallbackProducts.find((product) => product.id === id) ?? null;
      } catch {
        return fallbackProducts.find((product) => product.id === id) ?? null;
      }
    },
    enabled: Boolean(id),
  });
}
