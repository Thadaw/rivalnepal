import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronRight, Clock, Home, Loader2, Mail, Package, Printer, Search, Truck } from "lucide-react";
import { useOrderLookup } from "@/features/orders/hooks/use-order-lookup";
import { trackOrderSchema, type TrackOrderValues } from "@/features/orders/schemas/track-order-schema";
import { ORDER_FLOW, ORDER_STATUS_LABEL, type OrderStatus, type PlacedOrder } from "@/features/orders/types";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Breadcrumbs } from "@/shared/components/layout/Breadcrumbs";
import { PageContainer } from "@/shared/components/layout/PageContainer";
import { formatNPR } from "@/shared/lib/utils";
import { BRAND } from "@/shared/lib/brand";

const steps: { status: OrderStatus; label: string; note: string; icon: typeof Check }[] = [
  { status: "pending", label: "Order placed", note: "We have your details", icon: Check },
  { status: "confirmed", label: "Confirmed", note: "We call to confirm", icon: Clock },
  { status: "printing", label: "Printing", note: "Your piece is made", icon: Printer },
  { status: "shipped", label: "Shipped", note: "On the way", icon: Truck },
  { status: "delivered", label: "Delivered", note: "Wear it out", icon: Home },
];

const fieldClass =
  "mt-2 h-auto w-full rounded-none border-0 border-b border-chalk/25 bg-transparent px-0 py-3 text-[13px] text-chalk placeholder:text-chalk/25 focus:border-chalk focus:ring-0";
const labelClass = "text-[9px] font-medium uppercase tracking-[.24em] text-chalk/40";
const errorClass = "mt-1.5 text-[10px] text-red-300";

export function TrackOrderPage() {
  const lookup = useOrderLookup();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TrackOrderValues>({
    resolver: zodResolver(trackOrderSchema),
    defaultValues: { orderId: "", phone: "" },
  });

  const order: PlacedOrder | undefined = lookup.data;
  const currentIndex = order ? ORDER_FLOW.indexOf(order.status) : -1;

  function resetForm() {
    lookup.reset();
    reset({ orderId: "", phone: "" });
  }

  return (
    <div>
      <section className="bg-black py-10 text-chalk md:py-14">
        <PageContainer>
          <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Track order" }]} invert />
          <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <div>
            <p className="eyebrow text-chalk/40">Order tracking</p>
            <h1 className="mt-4 text-[clamp(2.6rem,7vw,5.4rem)] font-bold uppercase leading-[.84]">
              Where's my
              <br />
              order?
            </h1>
            <p className="mt-6 max-w-md text-[13px] leading-7 text-chalk/55">
              Enter the order number from your confirmation screen and the phone number you checked out with.
            </p>
          </div>

          <form
            onSubmit={handleSubmit((values) => lookup.mutate({ id: values.orderId, phone: values.phone }))}
            noValidate
            className="grid w-full gap-5 border-t border-chalk/15 pt-6 sm:grid-cols-[1fr_1fr_auto] sm:items-end lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0"
          >
            <div>
              <Label htmlFor="track-order" className={labelClass}>
                Order number
              </Label>
              <Input
                id="track-order"
                autoComplete="off"
                placeholder="RV-123456"
                aria-invalid={Boolean(errors.orderId)}
                className={fieldClass}
                {...register("orderId")}
              />
              {errors.orderId && <p className={errorClass}>{errors.orderId.message}</p>}
            </div>
            <div>
              <Label htmlFor="track-phone" className={labelClass}>
                Phone number
              </Label>
              <Input
                id="track-phone"
                type="tel"
                inputMode="numeric"
                placeholder="98XXXXXXXX"
                aria-invalid={Boolean(errors.phone)}
                className={fieldClass}
                {...register("phone")}
              />
              {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
            </div>
            <button
              type="submit"
              disabled={lookup.isPending}
              className="flex h-12 items-center justify-center gap-2 bg-chalk px-6 text-[10px] font-semibold uppercase tracking-[.18em] text-noir transition hover:bg-white disabled:opacity-50"
            >
              {lookup.isPending ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
              {lookup.isPending ? "Looking" : "Track"}
            </button>
          </form>
          </div>
        </PageContainer>
      </section>

      <PageContainer className="py-12 md:py-16">
        <div className="mx-auto max-w-4xl">
          {lookup.isError && (
            <div role="alert" className="border border-error/30 bg-error-light px-6 py-10 text-center">
              <h2 className="text-xl font-bold uppercase">We couldn't find that order.</h2>
              <p className="mt-2 text-[12px] leading-6 text-noir/55">
                {lookup.error instanceof Error ? lookup.error.message : "Check the order number and phone, then try again."}
              </p>
            </div>
          )}

          {!order && !lookup.isError && !lookup.isPending && (
            <div className="border border-dashed border-black/25 px-6 py-16 text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center border border-black/15">
                <Package size={20} className="text-noir/35" />
              </span>
              <h2 className="mt-6 text-xl font-bold uppercase">Nothing to show yet.</h2>
              <p className="mx-auto mt-3 max-w-sm text-[12px] leading-6 text-noir/50">
                Your order number is on the confirmation screen right after checkout. Still stuck? Email us and
                we'll dig it out.
              </p>
              <a
                href={`mailto:${BRAND.email}`}
                className="link-underline mt-6 inline-flex items-center gap-2 text-[9px] font-medium uppercase tracking-[.2em] hover:text-noir"
              >
                <Mail size={13} /> {BRAND.email}
              </a>
            </div>
          )}

          {order && (
            <div className="space-y-6">
              <div className="border border-black/15 bg-white p-6 md:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-[9px] uppercase tracking-[.24em] text-noir/40">Order {order.id}</p>
                    <h2 className="mt-3 text-[clamp(1.8rem,4vw,2.8rem)] font-bold uppercase leading-[.92]">
                      {order.status === "cancelled" ? "This order was cancelled." : `${ORDER_STATUS_LABEL[order.status]}.`}
                    </h2>
                    <p className="mt-2 text-[12px] leading-6 text-noir/50">
                      {order.status === "delivered"
                        ? "Delivered. Enjoy the piece."
                        : order.status === "cancelled"
                          ? "Nothing is on the way. Contact us if this looks wrong."
                          : "We'll keep this page up to date as your order moves."}
                    </p>
                  </div>
                  <span
                    className={`border px-3 py-1.5 text-[8px] font-medium uppercase tracking-[.2em] ${
                      order.status === "cancelled"
                        ? "border-error/30 text-error"
                        : "border-black/20 text-black/60"
                    }`}
                  >
                    {ORDER_STATUS_LABEL[order.status]}
                  </span>
                </div>

                {order.status !== "cancelled" && (
                  <ol className="mt-9 grid gap-6 sm:grid-cols-5">
                    {steps.map((step, index) => {
                      const Icon = step.icon;
                      const done = index <= currentIndex;
                      return (
                        <li key={step.status} className="flex items-start gap-3 sm:flex-col sm:gap-3">
                          <span
                            className={`grid h-9 w-9 shrink-0 place-items-center border ${
                              done ? "border-noir bg-noir text-chalk" : "border-black/15 text-noir/30"
                            }`}
                          >
                            <Icon size={14} strokeWidth={done ? 2.5 : 1.75} />
                          </span>
                          <div>
                            <p
                              className={`text-[9px] font-semibold uppercase tracking-[.18em] ${
                                done ? "text-noir" : "text-noir/40"
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
                )}
              </div>

              <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:gap-8">
                <div className="border border-black/15 bg-white p-6">
                  <h3 className="text-lg font-bold uppercase">Items</h3>
                  <div className="mt-3 divide-y divide-black/10 border-y border-black/10">
                    {order.items.map((item, index) => (
                      <div key={`${item.name}-${index}`} className="flex justify-between gap-3 py-3.5">
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
                  <div className="mt-4 space-y-2 text-[12px]">
                    <div className="flex justify-between text-noir/55">
                      <span>Subtotal</span>
                      <span>{formatNPR(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-noir/55">
                      <span>Delivery</span>
                      <span>{formatNPR(order.shipping)}</span>
                    </div>
                    <div className="flex justify-between border-t border-black/10 pt-2.5">
                      <span className="text-[9px] uppercase tracking-[.2em] text-noir/60">Cash on delivery</span>
                      <span className="font-semibold">{formatNPR(order.total)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="border border-black/15 bg-white p-6">
                    <h3 className="text-[9px] uppercase tracking-[.24em] text-noir/40">Delivering to</h3>
                    <p className="mt-3 text-[12px] font-semibold uppercase tracking-[.06em]">{order.customer.fullName}</p>
                    <p className="mt-2 text-[11px] leading-6 text-noir/50">
                      {order.customer.address}
                      <br />
                      {order.customer.city}, {order.customer.district}
                      <br />
                      {order.customer.phone}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex w-full items-center justify-center gap-2 border border-black/25 px-5 py-3.5 text-[9px] font-medium uppercase tracking-[.2em] transition hover:border-noir hover:bg-noir hover:text-chalk"
                  >
                    Track another order <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </PageContainer>
    </div>
  );
}
