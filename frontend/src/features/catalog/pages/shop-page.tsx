import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, RefreshCw, Search, SlidersHorizontal, X } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { ProductCard } from "@/features/catalog/components/product-card";
import { Breadcrumbs } from "@/shared/components/layout/Breadcrumbs";
import { PageContainer } from "@/shared/components/layout/PageContainer";
import { Button } from "@/shared/components/ui/button";
import { useProducts } from "@/features/catalog/hooks/use-products";
import { CATEGORIES } from "@/features/catalog/lib/catalog";
import { cn } from "@/shared/lib/utils";

const sorts = [
  { value: "featured", label: "Featured" },
  { value: "low", label: "Price — low to high" },
  { value: "high", label: "Price — high to low" },
  { value: "name", label: "Name — A to Z" },
];

const priceRanges = [
  { value: "under-2000", label: "Under Rs 2,000", test: (price: number) => price < 2000 },
  { value: "2000-3500", label: "Rs 2,000 — 3,500", test: (price: number) => price >= 2000 && price <= 3500 },
  { value: "3500-5000", label: "Rs 3,500 — 5,000", test: (price: number) => price > 3500 && price <= 5000 },
  { value: "over-5000", label: "Over Rs 5,000", test: (price: number) => price > 5000 },
];

const sizeOrder = ["XS", "S", "M", "L", "XL", "XXL", "One size"];

type FilterPanelProps = {
  activeCategory: string;
  onCategory: (category: string) => void;
  sizes: string[];
  activeSizes: string[];
  onSize: (size: string) => void;
  price: string | null;
  onPrice: (price: string | null) => void;
  inStock: boolean;
  onInStock: (value: boolean) => void;
  countFor: (category: string) => number;
  onClear: () => void;
  total: number;
};

function FilterPanel({
  activeCategory,
  onCategory,
  sizes,
  activeSizes,
  onSize,
  price,
  onPrice,
  inStock,
  onInStock,
  countFor,
  onClear,
  total,
}: FilterPanelProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-black/10 pb-4">
        <p className="eyebrow text-black/45">Filters</p>
        <button
          type="button"
          onClick={onClear}
          className="text-[9px] font-medium uppercase tracking-[.18em] text-black/45 underline underline-offset-4 transition hover:text-black"
        >
          Clear all
        </button>
      </div>

      <section>
        <h3 className="eyebrow text-black/40">Category</h3>
        <div className="mt-4 grid gap-1">
          {["All", ...CATEGORIES.map((category) => category.name)].map((category) => {
            const active = activeCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => onCategory(category)}
                aria-pressed={active}
                className={cn(
                  "flex items-center justify-between border border-transparent px-0 py-2 text-left text-[12px] transition",
                  active ? "font-semibold text-black" : "text-black/55 hover:text-black",
                )}
              >
                <span className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      "grid h-3.5 w-3.5 place-items-center border",
                      active ? "border-black bg-black" : "border-black/25",
                    )}
                  >
                    {active && <span className="h-1 w-1 bg-chalk" />}
                  </span>
                  {category === "All" ? "All pieces" : CATEGORIES.find((item) => item.name === category)?.title}
                </span>
                <span className="text-[10px] text-black/35">{countFor(category)}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="border-t border-black/10 pt-7">
        <h3 className="eyebrow text-black/40">Size</h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {sizes.map((size) => {
            const active = activeSizes.includes(size);
            return (
              <button
                key={size}
                type="button"
                onClick={() => onSize(size)}
                aria-pressed={active}
                className={cn(
                  "min-w-10 border px-3 py-2 text-[10px] font-medium uppercase tracking-[.08em] transition",
                  active
                    ? "border-black bg-black text-chalk"
                    : "border-black/20 text-black/65 hover:border-black hover:text-black",
                )}
              >
                {size}
              </button>
            );
          })}
        </div>
      </section>

      <section className="border-t border-black/10 pt-7">
        <h3 className="eyebrow text-black/40">Price</h3>
        <div className="mt-4 grid gap-1">
          {priceRanges.map((range) => {
            const active = price === range.value;
            return (
              <button
                key={range.value}
                type="button"
                onClick={() => onPrice(active ? null : range.value)}
                aria-pressed={active}
                className={cn(
                  "flex items-center gap-2.5 py-2 text-left text-[12px] transition",
                  active ? "font-semibold text-black" : "text-black/55 hover:text-black",
                )}
              >
                <span
                  className={cn(
                    "grid h-3.5 w-3.5 place-items-center border",
                    active ? "border-black bg-black" : "border-black/25",
                  )}
                >
                  {active && <span className="h-1 w-1 bg-chalk" />}
                </span>
                {range.label}
              </button>
            );
          })}
        </div>
      </section>

      <section className="border-t border-black/10 pt-7">
        <button
          type="button"
          role="switch"
          aria-checked={inStock}
          onClick={() => onInStock(!inStock)}
          className="flex w-full items-center justify-between gap-3 text-left"
        >
          <span className="text-[12px] text-black/60">In stock only</span>
          <span
            className={cn(
              "relative block h-5 w-9 shrink-0 border transition",
              inStock ? "border-black bg-black" : "border-black/25 bg-white",
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 h-3.5 w-3.5 transition",
                inStock ? "left-[18px] bg-chalk" : "left-0.5 bg-black/30",
              )}
            />
          </span>
        </button>
      </section>

      <p className="border-t border-black/10 pt-5 text-[10px] uppercase tracking-[.14em] text-black/35">
        {total} {total === 1 ? "piece" : "pieces"} in the edit
      </p>
    </div>
  );
}

export function ShopPage() {
  const { data = [], isLoading, refetch } = useProducts();
  const [params, setParams] = useSearchParams();
  const [sort, setSort] = useState("featured");
  const [activeSizes, setActiveSizes] = useState<string[]>([]);
  const [price, setPrice] = useState<string | null>(null);
  const [inStock, setInStock] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const requestedCategory = params.get("category") || "All";
  const searchQuery = params.get("q") || "";
  const activeCategory = CATEGORIES.some((item) => item.name === requestedCategory) ? requestedCategory : "All";
  const activeCategoryTitle =
    activeCategory === "All" ? "The collection" : CATEGORIES.find((item) => item.name === activeCategory)?.title;

  useEffect(() => {
    setFiltersOpen(false);
  }, [params]);

  useEffect(() => {
    if (!filtersOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFiltersOpen(false);
    };
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setFiltersOpen(false);
    };
    window.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onDesktop);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onDesktop);
    };
  }, [filtersOpen]);

  const sizes = useMemo(() => {
    const found = new Set<string>();
    data.forEach((product) => product.sizes.forEach((size) => found.add(size)));
    return Array.from(found).sort((a, b) => {
      const indexA = sizeOrder.indexOf(a);
      const indexB = sizeOrder.indexOf(b);
      return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
    });
  }, [data]);

  const filtered = useMemo(() => {
    const range = priceRanges.find((entry) => entry.value === price);
    const query = searchQuery.trim().toLowerCase();
    const list = data.filter((item) => {
      if (query && !`${item.name} ${item.category} ${item.description}`.toLowerCase().includes(query)) return false;
      if (activeCategory !== "All" && item.category !== activeCategory) return false;
      if (activeSizes.length && !activeSizes.some((size) => item.sizes.includes(size))) return false;
      if (range && !range.test(item.price)) return false;
      if (inStock && item.stock < 1) return false;
      return true;
    });
    if (sort === "low") return [...list].sort((a, b) => a.price - b.price);
    if (sort === "high") return [...list].sort((a, b) => b.price - a.price);
    if (sort === "name") return [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [data, searchQuery, activeCategory, activeSizes, price, inStock, sort]);

  const countFor = (category: string) =>
    category === "All" ? data.length : data.filter((item) => item.category === category).length;

  function toggleSize(size: string) {
    setActiveSizes((current) =>
      current.includes(size) ? current.filter((entry) => entry !== size) : [...current, size],
    );
  }

  function clearAll() {
    setParams({});
    setActiveSizes([]);
    setPrice(null);
    setInStock(false);
    setSort("featured");
  }

  function setCategory(category: string) {
    const next = new URLSearchParams(params);
    if (category === "All") next.delete("category");
    else next.set("category", category);
    setParams(next);
  }

  function setQuery(value: string) {
    const next = new URLSearchParams(params);
    if (value) next.set("q", value);
    else next.delete("q");
    setParams(next, { replace: true });
  }

  const panelProps: FilterPanelProps = {
    activeCategory,
    onCategory: setCategory,
    sizes,
    activeSizes,
    onSize: toggleSize,
    price,
    onPrice: setPrice,
    inStock,
    onInStock: setInStock,
    countFor,
    onClear: clearAll,
    total: filtered.length,
  };

  return (
    <div className="bg-white">
      <PageContainer className="pt-8 md:pt-12">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Shop" }]} />
      </PageContainer>

      <PageContainer className="border-b border-black/10 pb-10 pt-8 md:pb-14 md:pt-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="eyebrow text-black/40">RIVAL — {activeCategoryTitle}</p>
            <h1 className="mt-4 text-[clamp(3rem,8vw,6.8rem)] font-bold uppercase leading-[.82]">
              {activeCategory === "All" ? (
                <>
                  The edit
                </>
              ) : (
                activeCategoryTitle
              )}
            </h1>
            <p className="mt-5 max-w-xl text-[13px] leading-7 text-black/55">
              Graphic tees, fleece layers, outerwear and the small goods that finish the fit. Every piece ships from
              Damauli with cash on delivery.
            </p>
          </div>
          <div className="hidden items-center gap-4 lg:flex">
            <span className="text-[9px] uppercase tracking-[.2em] text-black/35">
              {isLoading ? "Loading" : `${filtered.length} ${filtered.length === 1 ? "piece" : "pieces"}`}
            </span>
            <span className="h-px w-14 bg-black/20" />
            <span className="text-[9px] uppercase tracking-[.2em] text-black/35">AW26</span>
          </div>
        </div>
      </PageContainer>

      <PageContainer className="py-10 md:py-14">
        <div className="grid gap-10 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-14 xl:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <FilterPanel {...panelProps} />
            </div>
          </aside>

          <div>
            <div className="relative mb-4">
              <Search
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-black/35"
                aria-hidden="true"
              />
              <input
                type="text"
                inputMode="search"
                value={searchQuery}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search the collection"
                aria-label="Search the collection"
                className="field h-11 w-full border-black/20 py-0 pl-10 pr-10 text-[12px] normal-case tracking-normal"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center text-black/40 transition hover:text-black"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="flex flex-col gap-3 border-b border-black/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                aria-expanded={filtersOpen}
                aria-controls="shop-filters"
                className="inline-flex w-fit items-center gap-2 border border-black/20 px-4 py-2.5 text-[9px] font-semibold uppercase tracking-[.18em] transition hover:border-black lg:hidden"
              >
                <SlidersHorizontal size={13} /> Filters
                {(activeSizes.length || price || inStock || activeCategory !== "All") && (
                  <span className="grid h-4 min-w-4 place-items-center bg-black px-1 text-[8px] text-chalk">
                    {activeSizes.length + (price ? 1 : 0) + (inStock ? 1 : 0) + (activeCategory !== "All" ? 1 : 0)}
                  </span>
                )}
              </button>

              <p className="hidden text-[9px] uppercase tracking-[.18em] text-black/40 sm:block">
                {isLoading ? "Loading pieces…" : `${filtered.length} ${filtered.length === 1 ? "piece" : "pieces"}`}
                {activeCategory !== "All" && <span className="text-black/70"> · {activeCategoryTitle}</span>}
              </p>

              <label className="flex items-center gap-3">
                <span className="text-[9px] font-medium uppercase tracking-[.18em] text-black/40">Sort</span>
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  className="field h-10 border-black/20 py-0 pl-3 pr-9 text-[10px] font-medium uppercase tracking-[.08em]"
                  aria-label="Sort products"
                >
                  {sorts.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {isLoading ? (
              <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-9 md:grid-cols-3 md:gap-x-5 xl:grid-cols-4 xl:gap-x-6 xl:gap-y-12">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="aspect-[3/4] bg-ash" />
                    <div className="mt-4 h-2.5 w-1/3 bg-ash" />
                    <div className="mt-2 h-3 w-2/3 bg-ash" />
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="mt-6 border border-dashed border-black/20 px-6 py-16 text-center">
                <h2 className="text-2xl font-bold uppercase">
                  {searchQuery ? "No pieces match that search." : "Nothing in this edit yet."}
                </h2>
                <p className="mx-auto mt-2 max-w-sm text-[12px] leading-6 text-black/50">
                  {searchQuery
                    ? "Try a different name or clear the search to see the full collection."
                    : "New pieces land every few weeks. Clear a filter or try another category in the meantime."}
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Button size="sm" onClick={clearAll}>
                    Clear filters
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => refetch()}>
                    <RefreshCw size={13} /> Refresh
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-5 xl:grid-cols-4 xl:gap-x-6 xl:gap-y-12">
                {filtered.map((product, index) => (
                  <ProductCard key={product.id} product={product} priority={index < 4} />
                ))}
              </div>
            )}

            {filtered.length > 0 && (
              <div className="mt-16 border-t border-black/10 pt-8 text-center">
                <p className="text-[10px] uppercase tracking-[.18em] text-black/35">End of the edit</p>
                <Link
                  to={activeCategory === "All" ? "/lookbook" : "/shop"}
                  className="link-underline mt-3 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.18em]"
                >
                  {activeCategory === "All" ? "View the lookbook" : "Shop all pieces"}
                  <ArrowUpRight size={13} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </PageContainer>

      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setFiltersOpen(false)}
            className="absolute inset-0 bg-black/50"
          />
          <div
            id="shop-filters"
            role="dialog"
            aria-modal="true"
            aria-label="Filter the edit"
            className="absolute inset-y-0 left-0 flex w-[88%] max-w-sm flex-col bg-chalk"
          >
            <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
              <p className="text-[10px] font-semibold uppercase tracking-[.2em]">Filter the edit</p>
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="grid h-9 w-9 place-items-center border border-black/15"
                aria-label="Close filters"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-6">
              <FilterPanel {...panelProps} />
            </div>
            <div className="border-t border-black/10 p-5">
              <Button className="w-full" onClick={() => setFiltersOpen(false)}>
                View {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
