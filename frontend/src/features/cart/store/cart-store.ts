import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/features/catalog/types";

export type CartLine = { product: Product; size: string; color: string; quantity: number };

type CartState = {
  items: CartLine[];
  addItem: (product: Product, size: string, color: string, quantity?: number) => void;
  removeItem: (id: string, size: string, color: string) => void;
  changeQuantity: (id: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
};

const MAX_PER_LINE = 10;

function lineLimit(product: Product, size: string, color: string) {
  const variant = product.variants?.find((entry) => entry.color === color && entry.size === size);
  return Math.min(MAX_PER_LINE, Math.max(1, variant?.stock ?? MAX_PER_LINE));
}

export const useCartStore = create<CartState>()(persist((set) => ({
  items: [],
  addItem: (product, size, color, quantity = 1) => set((state) => {
    const found = state.items.find((item) => item.product.id === product.id && item.size === size && item.color === color);
    const limit = lineLimit(product, size, color);
    const amount = Math.min(limit, Math.max(1, quantity));
    if (found) {
      return {
        items: state.items.map((item) =>
          item === found ? { ...item, quantity: Math.min(limit, item.quantity + amount) } : item
        ),
      };
    }
    return { items: [...state.items, { product, size, color, quantity: amount }] };
  }),
  removeItem: (id, size, color) => set((state) => ({
    items: state.items.filter((item) => !(item.product.id === id && item.size === size && item.color === color)),
  })),
  changeQuantity: (id, size, color, quantity) => set((state) => ({
    items: state.items.map((item) =>
      item.product.id === id && item.size === size && item.color === color
        ? { ...item, quantity: Math.min(lineLimit(item.product, size, color), Math.max(1, quantity)) }
        : item
    ),
  })),
  clearCart: () => set({ items: [] }),
}), { name: "rival-cart" }));
