export type Category = "T-Shirts" | "Hoodies" | "Jackets" | "Accessories";

export type AdminProductVariant = { color: string; colorHex: string; size: string; stock: number };

export type ProductVariantStock = {
  color: string;
  size: string;
  inStock: boolean;
  stock: number;
  status?: "out" | "limited" | "in";
};

export type Product = {
  id: string;
  name: string;
  category: Category;
  price: number;
  compareAt?: number;
  image: string;
  images?: string[];
  badge?: string;
  description: string;
  sizes: string[];
  colors: string[];
  /** Colour name to hex, supplied by the API for accurate swatches. */
  colorHexes?: Record<string, string>;
  /** Sizes currently in stock for each colour. */
  availableSizesByColor?: Record<string, string[]>;
  stock: number;
  stockStatus?: "out" | "limited" | "in";
  /** Storefront variant grid with live stock for each colour and size. */
  variants?: ProductVariantStock[];
  active?: boolean;
  /** Admin-only: the exact variant grid, so edits never disturb existing stock. */
  adminVariants?: AdminProductVariant[];
  featured?: boolean;
  designName?: string;
};
