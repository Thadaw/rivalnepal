import { useEffect, useState } from "react";
import { ArrowLeft, ArrowUpRight, Check, Minus, Plus, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { Breadcrumbs } from "@/shared/components/layout/Breadcrumbs";
import { PageContainer } from "@/shared/components/layout/PageContainer";
import { ProductCard } from "@/features/catalog/components/product-card";
import { useProduct, useProducts } from "@/features/catalog/hooks/use-products";
import { usePageTitle } from "@/shared/hooks/usePageTitle";
import { LOW_STOCK_THRESHOLD, stockStatus } from "@/shared/lib/inventory";
import { formatNPR } from "@/shared/lib/utils";
import { useCartStore } from "@/features/cart/store/cart-store";
import { BRAND } from "@/shared/lib/brand";

export function ProductDetailsPage() {
  const { id = "" } = useParams();
  const { data: product, isLoading } = useProduct(id);
  const { data: all = [] } = useProducts();
  const addItem = useCartStore((state) => state.addItem);

  usePageTitle(product ? `${product.name} — ${BRAND.name}${BRAND.mark}` : `Product — ${BRAND.name}${BRAND.mark}`);

  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    setSize("");
    setColor("");
    setQuantity(1);
    setActiveImage(0);
  }, [id]);

  if (isLoading) {
    return (
      <PageContainer className="py-10 md:py-14">
        <div className="grid animate-pulse gap-10 lg:grid-cols-[3fr_2fr] lg:gap-16">
          <div className="aspect-[4/5] bg-ash" />
          <div className="space-y-5 pt-4">
            <div className="h-2.5 w-24 bg-ash" />
            <div className="h-12 w-3/4 bg-ash" />
            <div className="h-4 w-28 bg-ash" />
            <div className="h-24 w-full bg-ash" />
          </div>
        </div>
      </PageContainer>
    );
  }

  if (!product) {
    return (
      <PageContainer className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <p className="eyebrow text-black/40">404 — piece not found</p>
        <h1 className="mt-4 text-[clamp(2.4rem,6vw,4.4rem)] font-bold uppercase leading-[.88]">
          This one moved on.
        </h1>
        <p className="mt-4 max-w-sm text-[13px] leading-6 text-black/50">
          It may have sold out or been retired from the collection.
        </p>
        <Button asChild className="mt-8">
          <Link to="/shop">
            <ArrowLeft size={15} /> Back to the shop
          </Link>
        </Button>
      </PageContainer>
    );
  }

  const gallery = product.images?.length ? product.images : [product.image];
  const colorHexes = product.colorHexes ?? {};
  const availableSizes = color ? product.availableSizesByColor?.[color] : undefined;
  const isSizeAvailable = (candidate: string) => !availableSizes || availableSizes.includes(candidate);
  const selectedVariant = color && size ? product.variants?.find((variant) => variant.color === color && variant.size === size) : undefined;
  const selectedStock = selectedVariant?.stock;
  const soldOut = selectedVariant ? selectedVariant.stock === 0 : product.stock === 0;
  const maxQuantity = Math.min(10, Math.max(1, selectedStock ?? product.stock));
  const activeStockStatus = stockStatus(selectedStock ?? product.stock);
  const discount =
    product.compareAt && product.compareAt > product.price
      ? Math.round((1 - product.price / product.compareAt) * 100)
      : null;
  const related = all.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4);

  function addToBag() {
    if (!color) {
      toast.error("Choose a colour first.");
      return;
    }
    if (!size) {
      toast.error("Choose a size first.");
      return;
    }
    const available = selectedStock ?? product!.stock;
    if (available < 1) {
      toast.error("This colour and size is sold out.");
      return;
    }
    addItem(product!, size, color, Math.min(quantity, available));
    toast.success(`${product!.name} added to your bag.`);
  }

  return (
    <div>
      <PageContainer className="border-b border-black/10 py-4">
        <Breadcrumbs
          items={[
            { label: "Home", to: "/" },
            { label: "Shop", to: "/shop" },
            { label: product.category, to: `/shop?category=${encodeURIComponent(product.category)}` },
            { label: product.name },
          ]}
        />
      </PageContainer>

      <PageContainer className="py-8 md:py-12">
        <div className="grid gap-10 lg:grid-cols-[3fr_2fr] lg:gap-14 xl:gap-20">
          {/* Gallery */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="relative overflow-hidden bg-ash">
              <img
                src={gallery[activeImage] ?? gallery[0]}
                alt={product.name}
                className="aspect-[4/5] w-full object-cover"
              />
              {product.badge && (
                <span className="absolute left-0 top-0 bg-noir px-3 py-2 text-[8px] font-semibold uppercase tracking-[.2em] text-chalk">
                  {product.badge}
                </span>
              )}
              <span className="absolute bottom-4 right-4 bg-chalk/85 px-2.5 py-1 text-[8px] font-medium uppercase tracking-[.18em] text-noir backdrop-blur">
                {String(activeImage + 1).padStart(2, "0")} / {String(gallery.length).padStart(2, "0")}
              </span>
            </div>

            {gallery.length > 1 && (
              <div className="no-scrollbar mt-2 flex gap-2 overflow-x-auto">
                {gallery.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    aria-label={`View image ${index + 1}`}
                    aria-pressed={index === activeImage}
                    className={`w-[68px] shrink-0 overflow-hidden border bg-ash transition sm:w-20 ${
                      index === activeImage ? "border-noir" : "border-transparent opacity-55 hover:opacity-100"
                    }`}
                  >
                    <img src={image} alt="" className="aspect-square w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="pt-1 md:pt-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-[9px] font-medium uppercase tracking-[.24em] text-noir/45">
                {product.category}
                {product.designName && ` — ${product.designName}`}
              </p>
              <span className="flex items-center gap-2 border border-black/15 px-2.5 py-1 text-[8px] font-medium uppercase tracking-[.18em] text-noir/60">
                <span
                  className={`h-1.5 w-1.5 ${
                    activeStockStatus === "out"
                      ? "bg-black/25"
                      : activeStockStatus === "limited"
                        ? "bg-warning"
                        : "bg-success"
                  }`}
                />
                {activeStockStatus === "out" ? "Sold out" : activeStockStatus === "limited" ? "Low stock" : "In stock"}
              </span>
            </div>

            <h1 className="display mt-4 text-[clamp(2.2rem,4.4vw,3.8rem)] font-bold uppercase leading-[.9]">
              {product.name}
            </h1>

            <div className="mt-4 flex flex-wrap items-baseline gap-3">
              <p className="text-[22px] font-semibold tracking-[-.01em]">{formatNPR(product.price)}</p>
              {product.compareAt && (
                <p className="text-[13px] text-noir/35 line-through">{formatNPR(product.compareAt)}</p>
              )}
              {discount !== null && (
                <span className="bg-noir px-2 py-1 text-[8px] font-semibold uppercase tracking-[.16em] text-chalk">
                  Save {discount}%
                </span>
              )}
            </div>

            <p className="mt-6 max-w-lg text-[13px] leading-7 text-noir/55">{product.description}</p>

            {/* Colour */}
            <div className="mt-8">
              <div className="flex items-baseline justify-between">
                <p className="text-[9px] font-medium uppercase tracking-[.24em] text-noir/45">
                  Colour {color && <span className="text-noir">— {color}</span>}
                </p>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.colors.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setColor(option);
                      setQuantity(1);
                      if (size && !isSizeAvailable(size)) setSize("");
                    }}
                    aria-pressed={color === option}
                    className={`flex items-center gap-2.5 border px-3 py-2.5 text-[10px] font-medium uppercase tracking-[.12em] transition ${
                      color === option
                        ? "border-noir bg-noir text-chalk"
                        : "border-black/20 bg-transparent text-noir/70 hover:border-noir hover:text-noir"
                    }`}
                  >
                    <span
                      className="h-3.5 w-3.5 border border-black/20"
                      style={{ background: colorHexes[option] ?? "#1c1c1a" }}
                    />
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="mt-7">
              <div className="flex items-baseline justify-between">
                <p className="text-[9px] font-medium uppercase tracking-[.24em] text-noir/45">
                  Size {size && <span className="text-noir">— {size}</span>}
                </p>
                <a
                  href="#size-guide"
                  className="link-underline text-[9px] font-medium uppercase tracking-[.16em] text-noir/45 hover:text-noir"
                >
                  Size guide
                </a>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
                {product.sizes.map((option) => {
                  const available = isSizeAvailable(option);
                  return (
                    <button
                      key={option}
                      type="button"
                      disabled={!available}
                      onClick={() => {
                        setSize(option);
                        setQuantity(1);
                      }}
                      aria-pressed={size === option}
                      className={`h-12 border text-[10px] font-semibold uppercase tracking-[.12em] transition ${
                        size === option
                          ? "border-noir bg-noir text-chalk"
                          : available
                            ? "border-black/20 bg-transparent hover:border-noir"
                            : "cursor-not-allowed border-black/10 text-noir/25 line-through"
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 text-[11px] leading-5 text-noir/45" aria-live="polite">
                {selectedVariant ? (
                  selectedVariant.stock === 0 ? (
                    <span className="font-semibold text-error">This colour and size is sold out.</span>
                  ) : selectedVariant.stock < LOW_STOCK_THRESHOLD ? (
                    <span className="font-semibold text-warning">
                      Only {selectedVariant.stock} left in {color} / {size}.
                    </span>
                  ) : (
                    `${selectedVariant.stock} in stock for ${color} / ${size}.`
                  )
                ) : product.stock === 0 ? (
                  "Currently sold out."
                ) : product.stock < LOW_STOCK_THRESHOLD ? (
                  <span className="font-semibold text-warning">
                    Only {product.stock} pieces left across all sizes.
                  </span>
                ) : (
                  `${product.stock} pieces available across all sizes.`
                )}
              </p>
            </div>

            {/* Quantity + add to bag */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-stretch">
              <div className="flex h-14 w-fit items-center border border-black/20">
                <button
                  type="button"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="grid h-full w-11 place-items-center transition hover:bg-black/5 disabled:opacity-30"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="w-9 text-center text-[13px] font-semibold">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                  className="grid h-full w-11 place-items-center transition hover:bg-black/5 disabled:opacity-30"
                  disabled={quantity >= maxQuantity}
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>

              <Button size="lg" className="h-14 flex-1" onClick={addToBag} disabled={soldOut}>
                <ShoppingBag size={16} /> {soldOut ? "Sold out" : "Add to bag"}
              </Button>
            </div>

            <div className="mt-4 grid gap-2 text-[10px] uppercase tracking-[.14em] text-noir/50 sm:grid-cols-2">
              <span className="flex items-center gap-2">
                <Truck size={13} /> Rs 100 local · Rs 200 outside
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck size={13} /> Cash on delivery
              </span>
            </div>

            <div className="mt-8 border-t border-black/10">
              <details className="group border-b border-black/10 py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between text-[10px] font-semibold uppercase tracking-[.2em] [&::-webkit-details-marker]:hidden">
                  Details &amp; care
                  <Plus size={15} className="transition-transform duration-300 group-open:rotate-45" />
                </summary>
                <div className="mt-3 space-y-2 text-[12px] leading-6 text-noir/55">
                  <p>
                    Heavyweight cotton with an original {BRAND.name} print. Designed for a relaxed, everyday fit.
                  </p>
                  <p>Cold machine wash inside out, dry in shade, and do not iron directly over the print.</p>
                </div>
              </details>

              <details className="group border-b border-black/10 py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between text-[10px] font-semibold uppercase tracking-[.2em] [&::-webkit-details-marker]:hidden">
                  Delivery &amp; payment
                  <Plus size={15} className="transition-transform duration-300 group-open:rotate-45" />
                </summary>
                <div className="mt-3 space-y-2 text-[12px] leading-6 text-noir/55">
                  <p>
                    Cash on delivery only. Delivery is Rs 100 inside the Damauli & Pokhara area and Rs 200 across the rest of
                    Nepal.
                  </p>
                  <p>
                    We call to confirm every order before it ships. Unworn pieces with tags can be exchanged — message
                    us first.
                  </p>
                </div>
              </details>

              <details id="size-guide" open className="group border-b border-black/10 py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between text-[10px] font-semibold uppercase tracking-[.2em] [&::-webkit-details-marker]:hidden">
                  Size &amp; fit
                  <Plus size={15} className="transition-transform duration-300 group-open:rotate-45" />
                </summary>
                <div className="mt-3 text-[12px] leading-6 text-noir/55">
                  <p>
                    Our tees and hoodies run true to size with a relaxed cut. If you are between sizes and want a
                    roomier fit, size up. Accessories are one size.
                  </p>
                  <p className="mt-2 flex items-center gap-1.5 font-medium text-noir/70">
                    <Check size={13} /> Available sizes: {product.sizes.join(", ")}
                  </p>
                </div>
              </details>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-20 border-t border-black/10 pt-12 md:mt-24 md:pt-16">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="text-[9px] uppercase tracking-[.28em] text-noir/40">Keep looking</p>
                <h2 className="display mt-3 text-[clamp(1.9rem,4vw,3rem)] font-bold uppercase leading-[.9]">
                  More in {product.category}
                </h2>
              </div>
              <Link
                to={`/shop?category=${encodeURIComponent(product.category)}`}
                className="group inline-flex w-fit items-center gap-2 border-b border-black/25 pb-1 text-[10px] font-semibold uppercase tracking-[.18em] transition hover:border-black"
              >
                See all
                <ArrowUpRight size={14} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-5 xl:grid-cols-4 xl:gap-x-6 xl:gap-y-12">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}
      </PageContainer>
    </div>
  );
}
