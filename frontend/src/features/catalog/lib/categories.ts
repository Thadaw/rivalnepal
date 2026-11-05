import type { Category } from "@/features/catalog/types";

/** Display label → API slug. */
export const API_CATEGORIES: Record<Category, string> = {
  "T-Shirts": "tshirts",
  Hoodies: "hoodies",
  Jackets: "jackets",
  Accessories: "accessories",
};

/** API slug → display label. */
export const CATEGORY_LABELS: Record<string, Category> = {
  tshirts: "T-Shirts",
  hoodies: "Hoodies",
  jackets: "Jackets",
  accessories: "Accessories",
};

export function toCategory(slug: string): Category {
  return CATEGORY_LABELS[slug] ?? "T-Shirts";
}

export function toApiCategory(category: Category): string {
  return API_CATEGORIES[category];
}
