import type { Category } from "@/features/catalog/types";

export type CategoryInfo = {
  name: Category;
  slug: string;
  title: string;
  kicker: string;
  blurb: string;
  image: string;
};

export const CATEGORIES: CategoryInfo[] = [
  {
    name: "T-Shirts",
    slug: "tshirts",
    title: "Tees & graphics",
    kicker: "The everyday layer",
    blurb: "Heavyweight cotton, boxed shoulders and original graphics. Built for the daily rotation.",
    image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=1400&q=85",
  },
  {
    name: "Hoodies",
    slug: "hoodies",
    title: "Hoodies & fleece",
    kicker: "Weight and warmth",
    blurb: "Brushed fleece, deep hoods and a considered drape for slow mornings and late nights.",
    image: "https://images.unsplash.com/photo-1578681994506-b8f463449011?auto=format&fit=crop&w=1100&q=85",
  },
  {
    name: "Jackets",
    slug: "jackets",
    title: "Outerwear",
    kicker: "Layer up. Move out.",
    blurb: "Weather-ready shells and leathers for days that refuse to pick a forecast.",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1100&q=85",
  },
  {
    name: "Accessories",
    slug: "accessories",
    title: "Accessories",
    kicker: "Finish the fit",
    blurb: "Caps, totes and small goods carrying the same point of view as the rest of the collection.",
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1100&q=85",
  },
];

export function categoryInfo(name: string): CategoryInfo | undefined {
  return CATEGORIES.find((category) => category.name === name);
}

/**
 * Seed products may arrive without photography. Rather than showing one repeated
 * placeholder, each product falls back to a small category-specific set picked
 * deterministically from its slug.
 */
const FALLBACK_IMAGES: Record<Category, string[]> = {
  "T-Shirts": [
    "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=85",
    "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=1000&q=85",
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1000&q=85",
  ],
  Hoodies: [
    "https://images.unsplash.com/photo-1578681994506-b8f463449011?auto=format&fit=crop&w=1000&q=85",
    "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1000&q=85",
    "https://images.unsplash.com/photo-1509942774463-acf339cf87d5?auto=format&fit=crop&w=1000&q=85",
  ],
  Jackets: [
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1000&q=85",
    "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1000&q=85",
    "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1000&q=85",
  ],
  Accessories: [
    "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1000&q=85",
    "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=1000&q=85",
    "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=85",
  ],
};

export function productImages(category: Category, key: string, images: string[]): string[] {
  if (images.length) return images;
  const pool = FALLBACK_IMAGES[category];
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) % 997;
  const start = hash % pool.length;
  return [pool[start], pool[(start + 1) % pool.length]];
}
