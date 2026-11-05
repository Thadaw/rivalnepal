export const LOW_STOCK_THRESHOLD = 5;

export type StockStatus = "out" | "limited" | "in";

export function stockStatus(stock: number): StockStatus {
  if (stock <= 0) return "out";
  if (stock < LOW_STOCK_THRESHOLD) return "limited";
  return "in";
}

export const stockStatusLabel: Record<StockStatus, string> = {
  out: "Out of stock",
  limited: "Limited stock",
  in: "In stock",
};

export const stockStatusTone: Record<StockStatus, string> = {
  out: "bg-red-50 text-red-700",
  limited: "bg-amber-50 text-amber-700",
  in: "bg-emerald-50 text-emerald-700",
};
