import { Link, useLocation, useParams } from "react-router-dom";
import { ArrowRight, Check, Clock, Home, Mail, Package, Printer, Truck } from "lucide-react";
import { Breadcrumbs } from "@/shared/components/layout/Breadcrumbs";
import { PageContainer } from "@/shared/components/layout/PageContainer";
import { Button } from "@/shared/components/ui/button";
import { recallOrder } from "@/features/checkout/lib/last-order";
import type { PlacedOrder } from "@/features/orders/types";
import { formatNPR } from "@/shared/lib/utils";
import { BRAND } from "@/shared/lib/brand";

const steps = [
  { label: "Order placed", note: "We have it", icon: Check },
  { label: "Confirmed", note: "We call you", icon: Clock },
  { label: "Printing", note: "Made for you", icon: Printer },
  { label: "Shipped", note: "On the way", icon: Truck },
  { label: "Delivered", note: "Wear it out", icon: Home },
];

export function OrderConfirmationPage() {
  const { id = "" } = useParams();
  const location = useLocation();
  const fromState = (location.state as { order?: PlacedOrder } | null)?.order;
  const stored = recallOrder();
  const order = fromState ?? (stored && stored.id === id ? stored : null);

  if (!order) {
    return (
      <PageContainer className="flex min-h-[64vh] flex-col items-center justify-center py-20 text-center">
        <span className="grid h-16 w-16 place-items-center border border-black/15">
          <Package size={22} className="text-black/40" />
        </span>
        <p className="mt-7 eyebrow text-black/40">Order {id}</p>
        <h1 className="mt-4 text-[clamp(2.2rem,5.5vw,4rem)] font-bold uppercase leading-[.88]">
          We can't find those details.
        </h1>
        <p className="mt-5 max-w-md text-[13px] leading-6 text-black/50">
          Order details are only available right after checkout in this browser. If you need a copy, email us with
          your order number.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link to="/shop">Back to the shop</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href={`mailto:${BRAND.email}?subject=Order%20${encodeURIComponent(id)}`}>
              <Mail size={14} /> Email us
            </a>
          </Button>
        </div>
      </PageContainer>
    );
  }

  const firstName = order.customer.fullName.split(" ")[0];
  const placedOn = new Date(order.createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div>
      <section className="bg-black text-chalk">
        <PageContainer className="py-10 md:py-14">
          <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Order confirmation" }]} invert />
          <div className="mt-8 flex flex-col justify-between gap-10 md:flex-row md:items-end">
            <div>
              <span className="inline-flex items-center gap-2 border border-chalk/25 px-3 py-1.5 text-[8px] font-medium uppercase tracking-[.24em] text-chalk/70">
                <span className="h-1.5 w-1.5 bg-chalk" /> Order placed
              </span>
              <h1 className="display mt-6 text-[clamp(2.6rem,7vw,5.4rem)] font-bold uppercase leading-[.84]">
                Thank you,
                <br />
                {firstName}.
              </h1>
              <p className="mt-6 max-w-md text-[13px] leading-7 text-chalk/55">
                Your order is in. We'll call <strong className="font-semibold text-chalk">{order.customer.phone}</strong>{" "}
                to confirm before it ships from Damauli.
              </p>
            </div>

            <dl className="grid min-w-[260px] grid-cols-2 gap-x-8 gap-y-5 border-t border-chalk/15 pt-6 md:border-l md:border-t-0 md:pl-10 md:pt-0">
              <div>
                <dt className="text-[8px] uppercase tracking-[.24em] text-chalk/35">Order number</dt>
                <dd className="mt-1.5 text-[13px] font-semibold tracking-[.04em]">{order.id}</dd>
              </div>
              <div>
                <dt className="text-[8px] uppercase tracking-[.24em] text-chalk/35">Placed</dt>
                <dd className="mt-1.5 text-[13px] text-chalk/75">{placedOn}</dd>
              </div>
              <div>
                <dt className="text-[8px] uppercase tracking-[.24em] text-chalk/35">Payment</dt>
                <dd className="mt-1.5 text-[13px] text-chalk/75">Cash on delivery</dd>
              </div>
              <div>
                <dt className="text-[8px] uppercase tracking-[.24em] text-chalk/35">Total</dt>
                <dd className="mt-1.5 text-[13px] font-semibold">{formatNPR(order.total)}</dd>
              </div>
            </dl>
          </div>
        </PageContainer>
      </section>

      <PageContainer className="py-12 md:py-16">
        <div className="mx-auto max-w-5xl">
          <section className="border-t border-black/15 pt-6">
            <h2 className="display text-lg font-bold uppercase">What happens next</h2>
            <ol className="mt-7 grid gap-6 sm:grid-cols-5">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const done = index === 0;
                return (
                  <li key={step.label} className="flex items-start gap-3 sm:flex-col sm:gap-3">
                    <span
                      className={`grid h-9 w-9 shrink-0 place-items-center border ${
                        done ? "border-noir bg-noir text-chalk" : "border-black/15 text-noir/35"
                      }`}
                    >
                      <Icon size={14} strokeWidth={done ? 2.5 : 1.75} />
                    </span>
                    <div>
                      <p
                        className={`text-[9px] font-semibold uppercase tracking-[.18em] ${
                          done ? "text-noir" : "text-noir/45"
                        }`}
                      >
                        {step.label}
                      </p>
                      <p className="mt-1 text-[10px] text-noir/40">{step.note}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>

          <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_340px] lg:gap-10">
            <section className="border-t border-black/15 pt-6">
              <div className="flex items-baseline justify-between">
                <h2 className="display text-lg font-bold uppercase">Your pieces</h2>
                <Link
                  to="/shop"
                  className="link-underline text-[9px] uppercase tracking-[.18em] text-noir/45 hover:text-noir"
                >
                  Keep shopping
                </Link>
              </div>

              <div className="mt-4 divide-y divide-black/10 border-y border-black/10">
                {order.items.map((item, index) => (
                  <div
                    key={`${item.name}-${item.color}-${item.size}-${index}`}
                    className="flex items-start justify-between gap-4 py-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[12px] font-medium uppercase tracking-[.06em]">{item.name}</p>
                      <p className="mt-1.5 text-[10px] uppercase tracking-[.12em] text-noir/45">
                        {item.color} / {item.size} / Qty {item.qty}
                      </p>
                    </div>
                    <p className="shrink-0 text-[12px] font-semibold">{formatNPR(item.price * item.qty)}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 space-y-2.5 text-[12px]">
                <div className="flex justify-between">
                  <span className="text-noir/50">Subtotal</span>
                  <span>{formatNPR(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-noir/50">Delivery</span>
                  <span>{formatNPR(order.shipping)}</span>
                </div>
                <div className="flex items-baseline justify-between border-t border-black/10 pt-3">
                  <span className="text-[9px] uppercase tracking-[.22em] text-noir/60">Cash on delivery</span>
                  <strong className="display text-2xl font-bold">{formatNPR(order.total)}</strong>
                </div>
              </div>

              <p className="mt-4 border border-black/15 px-4 py-3 text-[10px] uppercase leading-5 tracking-[.12em] text-noir/50">
                Keep {formatNPR(order.total)} ready in cash for the rider. No online payment was taken.
              </p>
            </section>

            <div className="space-y-6">
              <div className="border border-black/15 bg-white p-5">
                <h2 className="text-[9px] uppercase tracking-[.24em] text-noir/40">Delivering to</h2>
                <p className="mt-3 text-[12px] font-semibold uppercase tracking-[.06em]">{order.customer.fullName}</p>
                <p className="mt-2 text-[11px] leading-6 text-noir/50">
                  {order.customer.address}
                  <br />
                  {order.customer.city}, {order.customer.district}
                  <br />
                  {order.customer.phone}
                </p>
              </div>

              <div className="bg-noir p-5 text-chalk">
                <h2 className="text-[9px] uppercase tracking-[.24em] text-chalk/40">Need a hand?</h2>
                <p className="mt-3 text-[11px] leading-6 text-chalk/55">
                  Quote order {order.id} and we'll sort it out.
                </p>
                <a
                  href={`mailto:${BRAND.email}?subject=Order%20${encodeURIComponent(order.id)}`}
                  className="mt-4 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[.14em] text-chalk hover:underline"
                >
                  <Mail size={13} /> {BRAND.email}
                </a>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-black/10 pt-8">
            <Button asChild size="lg">
              <Link to="/shop">
                Continue shopping <ArrowRight size={15} />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/track">Track this order</Link>
            </Button>
            <Link
              to="/"
              className="link-underline ml-auto text-[9px] font-medium uppercase tracking-[.2em] text-noir/45 hover:text-noir"
            >
              Back to home
            </Link>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
