import { Link } from "react-router-dom";
import { ArrowRight, Minus, Plus, ShieldCheck, ShoppingBag, Trash2, Truck } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Breadcrumbs } from "@/shared/components/layout/Breadcrumbs";
import { PageContainer } from "@/shared/components/layout/PageContainer";
import { useCartStore } from "@/features/cart/store/cart-store";
import { formatNPR } from "@/shared/lib/utils";

export function CartPage() {
  const { items, removeItem, changeQuantity, clearCart } = useCartStore();
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const pieces = items.reduce((sum, item) => sum + item.quantity, 0);

  if (!items.length) {
    return (
      <PageContainer className="flex min-h-[64vh] flex-col items-center justify-center py-20 text-center">
        <span className="grid h-16 w-16 place-items-center border border-black/15">
          <ShoppingBag size={22} className="text-black/40" />
        </span>
        <p className="mt-7 eyebrow text-black/40">Your bag is empty</p>
        <h1 className="mt-4 text-[clamp(2.6rem,7vw,5rem)] font-bold uppercase leading-[.86]">
          Nothing
          <br />
          here. Yet.
        </h1>
        <p className="mt-5 max-w-sm text-[13px] leading-6 text-black/50">
          The collection is waiting. Start with a category or browse everything.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link to="/shop">
              Discover the collection <ArrowRight size={15} />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/categories">Browse categories</Link>
          </Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="py-8 md:py-14">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Shopping bag" }]} />
      <div className="mt-7 flex flex-col justify-between gap-5 border-b border-black/10 pb-7 md:flex-row md:items-end">
        <div>
          <p className="text-[9px] uppercase tracking-[.28em] text-noir/40">
            Your selection — {pieces} {pieces === 1 ? "piece" : "pieces"}
          </p>
          <h1 className="display mt-3 text-[clamp(2.4rem,6vw,4.4rem)] font-bold uppercase leading-[.86]">
            Shopping bag
          </h1>
        </div>
        <button
          type="button"
          onClick={() => {
            if (window.confirm("Remove all pieces from your bag?")) clearCart();
          }}
          className="flex w-fit items-center gap-2 text-[9px] font-medium uppercase tracking-[.2em] text-noir/40 transition hover:text-noir"
        >
          <Trash2 size={12} /> Clear bag
        </button>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_370px] lg:gap-14">
        <div className="border-t border-black/10">
          {items.map((item) => {
            const variant = item.product.variants?.find(
              (entry) => entry.color === item.color && entry.size === item.size,
            );
            const maxQuantity = Math.min(10, Math.max(1, variant?.stock ?? 10));
            return (
              <div
                key={`${item.product.id}-${item.size}-${item.color}`}
                className="flex gap-4 border-b border-black/10 py-6 sm:gap-6"
              >
                <Link
                  to={`/product/${item.product.id}`}
                  className="group block w-[88px] shrink-0 overflow-hidden bg-ash sm:w-[120px]"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-[8px] uppercase tracking-[.22em] text-noir/40">{item.product.category}</p>
                      <Link
                        to={`/product/${item.product.id}`}
                        className="mt-1 block truncate text-[13px] font-medium uppercase tracking-[.06em] hover:underline sm:text-[14px]"
                      >
                        {item.product.name}
                      </Link>
                      <p className="mt-1.5 text-[11px] uppercase tracking-[.1em] text-noir/45">
                        {item.color} / {item.size}
                      </p>
                      {variant && variant.stock < 5 && (
                        <p
                          className={`mt-1.5 text-[9px] font-medium uppercase tracking-[.16em] ${
                            variant.stock === 0 ? "text-error" : "text-warning"
                          }`}
                        >
                          {variant.stock === 0 ? "Out of stock" : `Only ${variant.stock} left`}
                        </p>
                      )}
                    </div>
                    <p className="shrink-0 text-[13px] font-semibold">
                      {formatNPR(item.product.price * item.quantity)}
                    </p>
                  </div>

                  <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                    <div className="flex h-10 items-center border border-black/20">
                      <button
                        type="button"
                        disabled={item.quantity <= 1}
                        onClick={() => changeQuantity(item.product.id, item.size, item.color, item.quantity - 1)}
                        className="grid h-full w-9 place-items-center transition hover:bg-black/5 disabled:opacity-30"
                        aria-label={`Decrease quantity of ${item.product.name}`}
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center text-[12px] font-semibold">{item.quantity}</span>
                      <button
                        type="button"
                        disabled={item.quantity >= maxQuantity}
                        onClick={() => changeQuantity(item.product.id, item.size, item.color, item.quantity + 1)}
                        className="grid h-full w-9 place-items-center transition hover:bg-black/5 disabled:opacity-30"
                        aria-label={`Increase quantity of ${item.product.name}`}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.product.id, item.size, item.color)}
                      className="flex items-center gap-1.5 text-[9px] font-medium uppercase tracking-[.2em] text-noir/40 transition hover:text-noir"
                    >
                      <Trash2 size={12} /> Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <aside className="h-fit border border-black/15 bg-white lg:sticky lg:top-24">
          <div className="border-b border-black/10 px-6 py-5">
            <h2 className="display text-xl font-bold uppercase">Order summary</h2>
          </div>

          <div className="space-y-3 px-6 py-5 text-[12px]">
            <div className="flex justify-between">
              <span className="text-noir/50">Delivery</span>
              <span className="text-noir/50">From Rs 100</span>
            </div>
            <div className="flex justify-between">
              <span className="text-noir/50">Payment</span>
              <span className="text-noir/50">Cash on delivery</span>
            </div>
          </div>

          <div className="flex items-baseline justify-between border-t border-black/10 px-6 py-5">
            <span className="text-[10px] uppercase tracking-[.2em]">Subtotal</span>
            <strong className="display text-2xl font-bold">{formatNPR(subtotal)}</strong>
          </div>
          <p className="px-6 pb-5 text-[10px] uppercase leading-5 tracking-[.12em] text-noir/40">
            Delivery is calculated at checkout by area.
          </p>

          <div className="px-6 pb-6">
            <Button asChild size="lg" className="w-full">
              <Link to="/checkout">
                Continue to checkout <ArrowRight size={15} />
              </Link>
            </Button>

            <Link
              to="/shop"
              className="link-underline mx-auto mt-4 block w-fit text-[9px] font-medium uppercase tracking-[.2em] text-noir/45 hover:text-noir"
            >
              Continue shopping
            </Link>

            <div className="mt-6 grid gap-2.5 border-t border-black/10 pt-5 text-[10px] uppercase tracking-[.12em] text-noir/45">
              <span className="flex items-center gap-2">
                <ShieldCheck size={13} /> Pay in cash when it arrives
              </span>
              <span className="flex items-center gap-2">
                <Truck size={13} /> Ships from Damauli across Nepal
              </span>
            </div>
          </div>
        </aside>
      </div>
    </PageContainer>
  );
}
