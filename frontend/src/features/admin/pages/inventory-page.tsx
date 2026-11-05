import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Boxes, ChevronDown, PackageMinus, PackagePlus, RefreshCw, Search, TriangleAlert, X } from "lucide-react";
import type { AdjustReason, AdminInventoryRow } from "@/features/admin/api/admin.api";
import { useAdjustStock } from "@/features/admin/hooks/use-admin-mutations";
import { useAdminInventory, useAdminMovements } from "@/features/admin/hooks/use-admin-queries";
import { adjustStockSchema, type AdjustStockValues } from "@/features/admin/schemas/adjust-stock-schema";
import { FormField } from "@/shared/components/ui/form-field";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import { stockStatus, stockStatusLabel, stockStatusTone } from "@/shared/lib/inventory";

const reasonLabel: Record<string, string> = {
  restock: "Restock",
  return: "Customer return",
  correction: "Correction",
  damaged: "Damaged",
  order: "Order",
  order_cancelled: "Order cancelled",
};

const categoryLabel: Record<string, string> = {
  tshirts: "T-Shirts",
  hoodies: "Hoodies",
  jackets: "Jackets",
  accessories: "Accessories",
};

const categoryOrder = ["tshirts", "hoodies", "jackets", "accessories"];

type InventoryProductGroup = {
  productId: string;
  name: string;
  variants: AdminInventoryRow[];
  variantCount: number;
  total: number;
  limited: number;
  out: number;
  colors: Set<string>;
  lastMovementAt?: string;
};

type InventoryCategoryGroup = {
  key: string;
  label: string;
  products: InventoryProductGroup[];
  units: number;
  variants: number;
  limited: number;
  out: number;
};

function stockTone(stock: number) {
  return stockStatusTone[stockStatus(stock)];
}

function stockLabel(stock: number) {
  return stockStatusLabel[stockStatus(stock)];
}

function formatLastMovement(value?: string) {
  if (!value) return "No changes yet";
  const date = new Date(value);
  const now = new Date();
  const time = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  if (date.toDateString() === now.toDateString()) return `Today, ${time}`;
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return `Yesterday, ${time}`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function movementTime(value: string) {
  const date = new Date(value);
  const now = new Date();
  const time = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  if (date.toDateString() === now.toDateString()) return `Today, ${time}`;
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return `Yesterday, ${time}`;
  return `${date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}, ${time}`;
}

export function InventoryPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "limited" | "out">("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<AdminInventoryRow | null>(null);
  const [direction, setDirection] = useState<"add" | "remove">("add");

  const inventory = useAdminInventory();
  const movements = useAdminMovements();
  const adjust = useAdjustStock();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AdjustStockValues>({
    resolver: zodResolver(adjustStockSchema),
    defaultValues: { quantity: 1, reason: "restock", note: "" },
  });

  const quantityValue = watch("quantity");
  const reason = watch("reason");

  const rows = inventory.data ?? [];
  const units = rows.reduce((total, row) => total + row.stock, 0);
  const low = rows.filter((row) => stockStatus(row.stock) === "limited").length;
  const out = rows.filter((row) => row.stock === 0).length;
  const movementRows = movements.data ?? [];
  const today = new Date().toDateString();
  const addedToday = movementRows.filter((movement) => movement.delta > 0 && new Date(movement.at).toDateString() === today).reduce((sum, movement) => sum + movement.delta, 0);
  const removedToday = movementRows.filter((movement) => movement.delta < 0 && new Date(movement.at).toDateString() === today).reduce((sum, movement) => sum + Math.abs(movement.delta), 0);

  const validQuantity = Number.isInteger(quantityValue) && quantityValue > 0;
  const previewStock = selected ? selected.stock + (validQuantity ? (direction === "add" ? quantityValue : -quantityValue) : 0) : 0;
  const notEnough = Boolean(selected && direction === "remove" && validQuantity && quantityValue > selected.stock);
  const reasonOptions: { value: AdjustReason; label: string }[] = direction === "add"
    ? [
        { value: "restock", label: "New stock / restock" },
        { value: "return", label: "Customer return" },
        { value: "correction", label: "Stock count correction" },
      ]
    : [
        { value: "damaged", label: "Damaged / lost" },
        { value: "correction", label: "Stock count correction" },
      ];

  const grouped = useMemo<InventoryCategoryGroup[]>(() => {
    const term = search.trim().toLowerCase();
    const visibleRows = rows.filter((row) => {
      if (categoryFilter !== "all" && row.category !== categoryFilter) return false;
      if (filter === "limited" && stockStatus(row.stock) !== "limited") return false;
      if (filter === "out" && row.stock !== 0) return false;
      if (!term) return true;
      return [row.name, row.sku, row.color, row.size].some((value) => value.toLowerCase().includes(term));
    });

    const allByProduct = new Map<string, AdminInventoryRow[]>();
    for (const row of rows) {
      const list = allByProduct.get(row.productId);
      if (list) list.push(row);
      else allByProduct.set(row.productId, [row]);
    }

    const categories = new Map<string, { key: string; label: string; products: Map<string, InventoryProductGroup> }>();
    for (const row of visibleRows) {
      const key = row.category || "other";
      let category = categories.get(key);
      if (!category) {
        category = { key, label: categoryLabel[key] ?? key, products: new Map() };
        categories.set(key, category);
      }
      let product = category.products.get(row.productId);
      if (!product) {
        const all = allByProduct.get(row.productId) ?? [row];
        product = {
          productId: row.productId,
          name: row.name,
          variants: [],
          variantCount: all.length,
          total: all.reduce((sum, variant) => sum + variant.stock, 0),
          limited: all.filter((variant) => stockStatus(variant.stock) === "limited").length,
          out: all.filter((variant) => variant.stock === 0).length,
          colors: new Set(all.map((variant) => variant.color)),
          lastMovementAt: all.reduce<string | undefined>((latest, variant) => (
            variant.lastMovementAt && (!latest || variant.lastMovementAt > latest) ? variant.lastMovementAt : latest
          ), undefined),
        };
        category.products.set(row.productId, product);
      }
      product.variants.push(row);
    }

    const order = [...categoryOrder, "other"];
    return [...categories.values()]
      .sort((a, b) => {
        const aIndex = order.indexOf(a.key);
        const bIndex = order.indexOf(b.key);
        return (aIndex === -1 ? 99 : aIndex) - (bIndex === -1 ? 99 : bIndex);
      })
      .map((category) => {
        const products = [...category.products.values()].sort((a, b) => a.name.localeCompare(b.name));
        return {
          key: category.key,
          label: category.label,
          products,
          units: products.reduce((sum, product) => sum + product.total, 0),
          variants: products.reduce((sum, product) => sum + product.variantCount, 0),
          limited: products.reduce((sum, product) => sum + product.limited, 0),
          out: products.reduce((sum, product) => sum + product.out, 0),
        };
      });
  }, [rows, filter, search, categoryFilter]);

  function toggleProduct(productId: string) {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
  }

  function changeFilter(next: "all" | "limited" | "out") {
    setFilter(next);
    setExpanded(next === "all" ? new Set() : new Set(rows.map((row) => row.productId)));
  }

  function changeSearch(next: string) {
    setSearch(next);
    setExpanded(next.trim() ? new Set(rows.map((row) => row.productId)) : new Set());
  }

  function openAdjust(row: AdminInventoryRow) {
    setSelected(row);
    setDirection("add");
    reset({ quantity: 1, reason: "restock", note: "" });
  }

  function changeDirection(next: "add" | "remove") {
    setDirection(next);
    setValue("reason", next === "add" ? "restock" : "damaged");
  }


  const submitAdjust = handleSubmit((values) => {
    if (!selected) return;
    if (direction === "remove" && values.quantity > selected.stock) return;
    adjust.mutate(
      {
        variantId: selected.variantId,
        delta: direction === "add" ? values.quantity : -values.quantity,
        reason: values.reason,
        note: values.note?.trim() || undefined,
      },
      { onSuccess: () => setSelected(null) },
    );
  });

  const refresh = () => {
    inventory.refetch();
    movements.refetch();
  };

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Stock control</p>
          <h1 className="display mt-2 text-4xl font-bold uppercase">
            Inventory<span className="text-lime-600">.</span>
          </h1>
          <p className="mt-2 text-sm text-neutral-500">Track every colour and size, and log every stock change.</p>
        </div>
        <button
          type="button"
          onClick={refresh}
          disabled={inventory.isFetching || movements.isFetching}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-5 py-3 text-xs font-bold text-neutral-700 transition hover:border-neutral-950 disabled:opacity-50"
        >
          <RefreshCw size={14} className={inventory.isFetching || movements.isFetching ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Variants tracked", value: rows.length, icon: Boxes, tone: "bg-neutral-100 text-neutral-700" },
          { label: "Units on hand", value: units, icon: PackagePlus, tone: "bg-lime-100 text-lime-700" },
          { label: "Limited stock", value: low, icon: TriangleAlert, tone: "bg-amber-50 text-amber-700" },
          { label: "Out of stock", value: out, icon: PackageMinus, tone: "bg-red-50 text-red-700" },
        ].map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs text-neutral-500">{label}</p>
              <span className={`grid h-9 w-9 place-items-center rounded-xl ${tone}`}><Icon size={17} /></span>
            </div>
            <p className="display mt-4 text-3xl font-bold">{inventory.isLoading ? "—" : value}</p>
          </div>
        ))}
      </div>

      {low + out > 0 && (
        <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50/70 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-700"><TriangleAlert size={17} /></span>
            <div>
              <p className="text-xs font-bold text-amber-900">{low + out} {low + out === 1 ? "variant needs" : "variants need"} attention</p>
              <p className="mt-0.5 text-[11px] text-amber-800/70">Limited stock means fewer than 5 units left in a variant.</p>
            </div>
          </div>
          <div className="flex gap-2">
            {low > 0 && <button type="button" onClick={() => changeFilter("limited")} className="rounded-full bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-amber-800 shadow-sm hover:bg-amber-100">Limited ({low})</button>}
            {out > 0 && <button type="button" onClick={() => changeFilter("out")} className="rounded-full bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-red-600 shadow-sm hover:bg-red-50">Out ({out})</button>}
          </div>
        </div>
      )}

      <div className="mt-5 rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex flex-wrap gap-2 border-b border-neutral-100 pb-4">
          {["all", ...categoryOrder].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setCategoryFilter(value)}
              className={`rounded-full px-3.5 py-2 text-[10px] font-bold uppercase tracking-widest transition ${
                categoryFilter === value ? "bg-neutral-950 text-white" : "border border-neutral-200 text-neutral-500 hover:border-neutral-950"
              }`}
            >
              {value === "all" ? "All categories" : categoryLabel[value] ?? value}
            </button>
          ))}
        </div>
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-2">
            {([
              ["all", "All"],
              ["limited", "Limited stock"],
              ["out", "Out of stock"],
            ] as const).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => changeFilter(value)}
                className={`rounded-full px-3.5 py-2 text-[10px] font-bold uppercase tracking-widest transition ${
                  filter === value ? "bg-neutral-950 text-white" : "border border-neutral-200 text-neutral-500 hover:border-neutral-950"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" size={15} />
            <input
              value={search}
              onChange={(event) => changeSearch(event.target.value)}
              placeholder="Product, SKU, colour or size"
              className="w-full rounded-full border-neutral-200 py-2.5 pl-9 text-xs focus:border-lime-400 focus:ring-lime-300"
              aria-label="Search inventory"
            />
          </div>
        </div>

        {inventory.isLoading ? (
          <div className="mt-6 space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-14 animate-pulse rounded-xl bg-neutral-100" />
            ))}
          </div>
        ) : inventory.isError ? (
          <div className="mt-6 rounded-xl border border-dashed border-neutral-300 px-6 py-12 text-center">
            <p className="text-sm font-bold">Inventory could not load.</p>
            <p className="mt-1 text-xs text-neutral-500">Your session may have expired. Try refreshing.</p>
          </div>
        ) : grouped.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-neutral-300 px-6 py-14 text-center">
            <p className="text-sm font-bold">{rows.length ? "No variants match this view." : "No variants yet."}</p>
            <p className="mt-1 text-xs text-neutral-500">
              {rows.length ? "Try a different filter or clear the search." : "Add a product to create its stock grid."}
            </p>
          </div>
        ) : (
          <div className="mt-5 space-y-6">
            {grouped.map((category) => (
              <section key={category.key}>
                <div className="flex flex-col gap-2 border-b border-neutral-200 pb-3 sm:flex-row sm:items-end sm:justify-between">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="display text-xl font-bold uppercase">{category.label}</h3>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                      {category.products.length} {category.products.length === 1 ? "product" : "products"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                    <span>{category.variants} variants</span>
                    <span>{category.units} units</span>
                    {category.limited > 0 && <span className="text-amber-700">{category.limited} limited</span>}
                    {category.out > 0 && <span className="text-red-600">{category.out} out</span>}
                  </div>
                </div>
                <div className="mt-3 overflow-hidden rounded-2xl border border-neutral-200">
                  {category.products.map((product) => {
                    const open = expanded.has(product.productId);
                    return (
                      <div key={product.productId} className="border-b border-neutral-100 last:border-0">
                        <button
                          type="button"
                          onClick={() => toggleProduct(product.productId)}
                          aria-expanded={open}
                          className="flex w-full items-center gap-3 px-4 py-4 text-left transition hover:bg-neutral-50"
                        >
                          <ChevronDown size={16} className={`shrink-0 text-neutral-400 transition-transform ${open ? "rotate-180" : ""}`} />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold">{product.name}</p>
                            <p className="mt-0.5 text-[10px] text-neutral-400">
                              {product.colors.size} {product.colors.size === 1 ? "colour" : "colours"} · {product.variants.length}{product.variants.length !== product.variantCount ? ` of ${product.variantCount}` : ""} {product.variantCount === 1 ? "variant" : "variants"} · {product.lastMovementAt ? `Updated ${formatLastMovement(product.lastMovementAt)}` : "No changes yet"}
                            </p>
                          </div>
                          <div className="hidden shrink-0 text-right sm:block">
                            <p className="text-[9px] font-bold uppercase tracking-widest text-neutral-400">On hand</p>
                            <p className="display mt-0.5 text-lg font-bold">{product.total}</p>
                          </div>
                          <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${stockTone(product.total)}`}>{stockLabel(product.total)}</span>
                          {product.limited > 0 && <span className="hidden shrink-0 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700 md:inline">{product.limited} limited</span>}
                          {product.out > 0 && <span className="hidden shrink-0 rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-bold text-red-600 md:inline">{product.out} out</span>}
                        </button>
                        {open && (
                          <div className="border-t border-neutral-100 bg-neutral-50/60 px-3 py-3">
                            <div className="overflow-x-auto rounded-xl bg-white">
                              <table className="w-full min-w-[720px] text-left text-xs">
                                <thead className="border-b text-[10px] uppercase tracking-widest text-neutral-400">
                                  <tr>{["Colour", "Size", "SKU", "Stock", "Status", "Last update", ""].map((heading, index) => <th className="px-3 pb-2.5 pt-3 font-semibold" key={`${heading}-${index}`}>{heading}</th>)}</tr>
                                </thead>
                                <tbody>
                                  {product.variants.map((row) => (
                                    <tr key={row.key} className="border-b border-neutral-100 last:border-0">
                                      <td className="px-3 py-3">
                                        <span className="inline-flex items-center gap-2 font-semibold">
                                          <span className="h-3 w-3 rounded-full border border-black/10" style={{ backgroundColor: row.colorHex }} />
                                          {row.color}
                                        </span>
                                      </td>
                                      <td className="px-3 py-3">{row.size}</td>
                                      <td className="px-3 py-3 font-mono text-[10px] text-neutral-500">{row.sku}</td>
                                      <td className="px-3 py-3 font-semibold">{row.stock}</td>
                                      <td className="px-3 py-3">
                                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${stockTone(row.stock)}`}>{stockLabel(row.stock)}</span>
                                      </td>
                                      <td className="whitespace-nowrap px-3 py-3 text-neutral-500">{formatLastMovement(row.lastMovementAt)}</td>
                                      <td className="px-3 py-3 text-right">
                                        <button type="button" onClick={() => openAdjust(row)} className="rounded-lg border bg-white px-2.5 py-2 font-bold hover:border-neutral-950">
                                          Adjust stock
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      <div className="mt-5 rounded-2xl bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold">Stock movements</h2>
            <p className="mt-1 text-xs text-neutral-400">Every change, newest first · last 200 entries</p>
          </div>
          <div className="flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-widest">
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">+{addedToday} in today</span>
            <span className="rounded-full bg-red-50 px-2.5 py-1 text-red-600">−{removedToday} out today</span>
          </div>
        </div>
        {movements.isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-11 animate-pulse rounded-xl bg-neutral-100" />
            ))}
          </div>
        ) : movements.isError ? (
          <p className="rounded-xl border border-dashed border-neutral-300 px-4 py-8 text-center text-xs text-neutral-500">
            Movement history could not load.
          </p>
        ) : (movements.data ?? []).length === 0 ? (
          <p className="rounded-xl border border-dashed border-neutral-300 px-4 py-8 text-center text-xs text-neutral-500">
            No stock changes recorded yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-xs">
              <thead className="border-b text-[10px] uppercase tracking-widest text-neutral-400">
                <tr>{["When", "Product", "Variant", "Change", "Stock after", "Reason", "Note"].map((heading) => <th className="pb-3 font-semibold" key={heading}>{heading}</th>)}</tr>
              </thead>
              <tbody>
                {movementRows.map((movement) => (
                  <tr key={movement.id} className="border-b border-neutral-100 last:border-0">
                    <td className="whitespace-nowrap py-3 text-neutral-500">{movementTime(movement.at)}</td>
                    <td className="py-3">
                      <p className="font-semibold">{movement.productName}</p>
                      <p className="font-mono text-[10px] text-neutral-400">{movement.sku}</p>
                    </td>
                    <td className="py-3">{movement.color} · {movement.size}</td>
                    <td className="py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-1 font-bold ${movement.delta > 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
                        {movement.delta > 0 ? "+" : ""}{movement.delta}
                      </span>
                    </td>
                    <td className="py-3 font-semibold">{movement.stockAfter}</td>
                    <td className="py-3">{reasonLabel[movement.reason] ?? movement.reason}</td>
                    <td className="py-3 text-neutral-500">{movement.note ?? movement.ref ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-neutral-100 px-6 py-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Adjust stock</p>
                <p className="display mt-1 text-2xl font-bold">{selected.name}</p>
                <p className="mt-1 text-xs text-neutral-500">{selected.color} · {selected.size} · {selected.sku}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="grid h-9 w-9 place-items-center rounded-full border border-neutral-200 hover:bg-neutral-50"
                aria-label="Close stock adjustment"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={submitAdjust} className="flex flex-1 flex-col overflow-y-auto px-6 py-5">
              <div className="rounded-2xl bg-neutral-50 p-4">
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Current</p>
                    <p className="display mt-1 text-2xl font-bold">{selected.stock}</p>
                  </div>
                  <div className={`grid h-8 w-8 place-items-center rounded-full text-sm font-bold ${direction === "add" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>
                    {direction === "add" ? "+" : "−"}
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">After</p>
                    <p className={`display mt-1 text-2xl font-bold ${notEnough ? "text-red-600" : ""}`}>{validQuantity ? previewStock : "—"}</p>
                  </div>
                </div>
                {notEnough && <p className="mt-3 text-center text-[11px] font-semibold text-red-600">Not enough stock to remove {quantityValue} units.</p>}
              </div>

              <div className="mt-5 grid grid-cols-2 gap-1 rounded-full bg-neutral-100 p-1">
                <button
                  type="button"
                  onClick={() => changeDirection("add")}
                  className={`flex items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold transition ${direction === "add" ? "bg-white text-emerald-700 shadow-sm" : "text-neutral-500 hover:text-neutral-800"}`}
                >
                  <PackagePlus size={14} /> Add stock
                </button>
                <button
                  type="button"
                  onClick={() => changeDirection("remove")}
                  className={`flex items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold transition ${direction === "remove" ? "bg-white text-red-600 shadow-sm" : "text-neutral-500 hover:text-neutral-800"}`}
                >
                  <PackageMinus size={14} /> Remove
                </button>
              </div>

              <div className="mt-5">
                <Label htmlFor="quantity" className="text-xs font-bold">
                  {direction === "add" ? "Units to add" : "Units to remove"}
                </Label>
                <div className="mt-1.5 flex gap-2">
                  <Input
                    id="quantity"
                    type="number"
                    min={1}
                    step={1}
                    aria-invalid={Boolean(errors.quantity)}
                    className="min-w-0 flex-1 rounded-xl border-neutral-200 bg-white focus-visible:border-lime-400"
                    {...register("quantity", { valueAsNumber: true })}
                  />
                  <div className="flex gap-1">
                    {[1, 5, 10].map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => setValue("quantity", amount, { shouldValidate: true })}
                        className={`rounded-lg border px-2.5 text-[11px] font-bold transition ${quantityValue === amount ? "border-neutral-950 bg-neutral-950 text-white" : "border-neutral-200 text-neutral-500 hover:border-neutral-950"}`}
                      >
                        {direction === "add" ? "+" : "−"}{amount}
                      </button>
                    ))}
                  </div>
                </div>
                <p className="mt-1 text-[11px] text-neutral-400">
                  {direction === "add" ? "Added on top of the current stock." : "Deducted from the current stock."}
                </p>
                {errors.quantity && <p className="mt-1 text-xs text-red-600">{errors.quantity.message}</p>}
                {notEnough && (
                  <p className="mt-1 text-xs text-red-600">
                    Only {selected.stock} {selected.stock === 1 ? "unit is" : "units are"} available to remove.
                  </p>
                )}
              </div>

              <div className="mt-5">
                <Label htmlFor="reason" className="text-xs font-bold">Reason</Label>
                <Select
                  value={reason}
                  onValueChange={(value) => setValue("reason", value as AdjustReason)}
                >
                  <SelectTrigger
                    id="reason"
                    className="mt-1.5 rounded-xl border-neutral-200 bg-white focus:border-lime-400"
                  >
                    <SelectValue placeholder="Choose a reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {reasonOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="mt-5">
                <FormField id="note" label="Note" optional error={errors.note?.message}>
                  <Textarea
                    id="note"
                    rows={2}
                    placeholder="e.g. New shipment from supplier"
                    className="min-h-0 rounded-xl border-neutral-200 bg-white focus-visible:border-lime-400"
                    {...register("note")}
                  />
                </FormField>
              </div>

              <div className="mt-auto border-t border-neutral-100 pt-5">
                <button
                  type="submit"
                  disabled={adjust.isPending || notEnough}
                  className={`w-full rounded-full px-5 py-3.5 text-xs font-bold text-white transition disabled:opacity-60 ${direction === "add" ? "bg-neutral-950 hover:bg-neutral-800" : "bg-red-600 hover:bg-red-700"}`}
                >
                  {adjust.isPending ? "Saving…" : direction === "add" ? "Add stock" : "Remove stock"}
                </button>
                <p className="mt-2 text-center text-[10px] leading-4 text-neutral-400">
                  Stock cannot go below zero. Every change is written to the movement log.
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
