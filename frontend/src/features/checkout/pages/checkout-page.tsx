import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Loader2, Lock, ShieldCheck, ShoppingBag } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Breadcrumbs } from "@/shared/components/layout/Breadcrumbs";
import { PageContainer } from "@/shared/components/layout/PageContainer";
import { checkoutSchema, type CheckoutValues } from "@/features/checkout/schemas/checkout-schema";
import { usePlaceOrder } from "@/features/checkout/hooks/use-place-order";
import { useCartStore } from "@/features/cart/store/cart-store";
import { formatNPR } from "@/shared/lib/utils";

const SHIPPING = { valley: 100, outside: 200 } as const;

const DISTRICTS = [
  "Tanahun", "Kaski", "Kathmandu", "Lalitpur", "Bhaktapur", "Chitwan", "Biratnagar",
  "Birgunj", "Butwal", "Dharan", "Hetauda", "Nepalgunj", "Dhangadhi",
];

const labelClass = "text-noir/50";
const errorClass = "mt-1.5 text-[11px] text-error";
const fieldClass = "mt-1.5";
const sectionTitle = "display text-lg font-bold uppercase";

export function CheckoutPage() {
  const items = useCartStore((state) => state.items);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { email: "", landmark: "", note: "", deliveryArea: "valley" },
  });

  const area = watch("deliveryArea");
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = SHIPPING[area];
  const total = subtotal + shipping;
  const pieces = items.reduce((sum, item) => sum + item.quantity, 0);

  const mutation = usePlaceOrder();

  const submit = handleSubmit((values) =>
    mutation.mutate({
      fullName: values.fullName,
      phone: values.phone,
      email: values.email || undefined,
      district: values.district,
      city: values.city,
      address: values.address,
      landmark: values.landmark || undefined,
      note: values.note || undefined,
      deliveryArea: values.deliveryArea,
      payment: "cod",
      items: items.map((item) => ({
        slug: item.product.id,
        color: item.color,
        size: item.size,
        qty: item.quantity,
      })),
    }),
  );

  const errorMessage = mutation.error instanceof Error ? mutation.error.message : null;

  if (!items.length) {
    return (
      <PageContainer className="flex min-h-[64vh] flex-col items-center justify-center py-20 text-center">
        <span className="grid h-16 w-16 place-items-center border border-black/15">
          <ShoppingBag size={22} className="text-black/40" />
        </span>
        <p className="mt-7 eyebrow text-black/40">Checkout</p>
        <h1 className="mt-4 text-[clamp(2.4rem,6vw,4.4rem)] font-bold uppercase leading-[.86]">
          Your bag is empty.
        </h1>
        <p className="mt-5 max-w-sm text-[13px] leading-6 text-black/50">
          Add a piece to the bag before heading to checkout.
        </p>
        <Button asChild size="lg" className="mt-9">
          <Link to="/shop">
            Shop the collection <ArrowRight size={15} />
          </Link>
        </Button>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="py-8 md:py-14">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Bag", to: "/cart" }, { label: "Checkout" }]} />
      <Link
        to="/cart"
        className="mt-6 inline-flex items-center gap-2 text-[9px] font-medium uppercase tracking-[.22em] text-black/45 transition hover:text-black"
      >
        <ArrowLeft size={13} /> Back to bag
      </Link>

      <div className="mt-5 flex flex-col justify-between gap-4 border-b border-black/10 pb-7 md:flex-row md:items-end">
        <div>
          <p className="text-[9px] uppercase tracking-[.28em] text-noir/40">Secure checkout — cash on delivery</p>
          <h1 className="display mt-3 text-[clamp(2.4rem,6vw,4.4rem)] font-bold uppercase leading-[.86]">Checkout</h1>
        </div>
        <p className="flex items-center gap-2 text-[10px] uppercase tracking-[.14em] text-noir/40">
          <Lock size={13} /> Details used for delivery only
        </p>
      </div>

      <form
        onSubmit={submit}
        className="mt-8 grid gap-10 lg:grid-cols-[1fr_390px] lg:gap-14"
        noValidate
      >
        <div className="space-y-10">
          <section className="border-t border-black/15 pt-6">
            <div className="flex items-baseline justify-between">
              <h2 className={sectionTitle}>01 — Contact</h2>
              <span className="text-[9px] uppercase tracking-[.18em] text-noir/35">Required</span>
            </div>
            <p className="mt-2 text-[11px] leading-5 text-noir/45">
              We use your phone number to confirm the order before it ships.
            </p>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="fullName" className={labelClass}>
                  Full name *
                </Label>
                <Input
                  id="fullName"
                  autoComplete="name"
                  placeholder="Aarav Sharma"
                  aria-invalid={Boolean(errors.fullName)}
                  className={fieldClass}
                  {...register("fullName")}
                />
                {errors.fullName && <p className={errorClass}>{errors.fullName.message}</p>}
              </div>
              <div>
                <Label htmlFor="phone" className={labelClass}>
                  Mobile number *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder="98XXXXXXXX"
                  aria-invalid={Boolean(errors.phone)}
                  className={fieldClass}
                  {...register("phone")}
                />
                {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="email" className={labelClass}>
                  Email <span className="normal-case tracking-normal text-noir/30">(optional)</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@email.com"
                  aria-invalid={Boolean(errors.email)}
                  className={fieldClass}
                  {...register("email")}
                />
                {errors.email && <p className={errorClass}>{errors.email.message}</p>}
              </div>
            </div>
          </section>

          <section className="border-t border-black/15 pt-6">
            <div className="flex items-baseline justify-between">
              <h2 className={sectionTitle}>02 — Delivery</h2>
              <span className="text-[9px] uppercase tracking-[.18em] text-noir/35">Nationwide</span>
            </div>
            <p className="mt-2 text-[11px] leading-5 text-noir/45">
              Street address, ward and a landmark help the rider find you.
            </p>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="district" className={labelClass}>
                  District *
                </Label>
                <Input
                  id="district"
                  list="districts"
                  autoComplete="address-level1"
                  placeholder="Tanahun"
                  aria-invalid={Boolean(errors.district)}
                  className={fieldClass}
                  {...register("district")}
                />
                <datalist id="districts">
                  {DISTRICTS.map((district) => (
                    <option key={district} value={district} />
                  ))}
                </datalist>
                {errors.district && <p className={errorClass}>{errors.district.message}</p>}
              </div>
              <div>
                <Label htmlFor="city" className={labelClass}>
                  City / area *
                </Label>
                <Input
                  id="city"
                  autoComplete="address-level2"
                  placeholder="Damauli"
                  aria-invalid={Boolean(errors.city)}
                  className={fieldClass}
                  {...register("city")}
                />
                {errors.city && <p className={errorClass}>{errors.city.message}</p>}
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="address" className={labelClass}>
                  Street address *
                </Label>
                <Input
                  id="address"
                  autoComplete="street-address"
                  placeholder="House number, street, ward"
                  aria-invalid={Boolean(errors.address)}
                  className={fieldClass}
                  {...register("address")}
                />
                {errors.address && <p className={errorClass}>{errors.address.message}</p>}
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="landmark" className={labelClass}>
                  Landmark <span className="normal-case tracking-normal text-noir/30">(optional)</span>
                </Label>
                <Input
                  id="landmark"
                  placeholder="Near the old bookstore"
                  aria-invalid={Boolean(errors.landmark)}
                  className={fieldClass}
                  {...register("landmark")}
                />
                {errors.landmark && <p className={errorClass}>{errors.landmark.message}</p>}
              </div>
            </div>

            <fieldset className="mt-6">
              <legend className={labelClass}>Delivery area</legend>
              <div className="mt-2 grid gap-3 sm:grid-cols-2">
                {(
                  [
                    { value: "valley", label: "Damauli & Pokhara area", note: "Damauli, Pokhara, Tanahun, Kaski", price: SHIPPING.valley },
                    { value: "outside", label: "Outside the area", note: "Everywhere else in Nepal", price: SHIPPING.outside },
                  ] as const
                ).map((option) => (
                  <label
                    key={option.value}
                    className={`flex cursor-pointer items-start gap-3 border p-4 transition ${
                      area === option.value ? "border-noir bg-white" : "border-black/15 hover:border-noir/50"
                    }`}
                  >
                    <input
                      type="radio"
                      value={option.value}
                      {...register("deliveryArea")}
                      className="mt-0.5 accent-black"
                    />
                    <span className="min-w-0">
                      <span className="block text-[12px] font-medium uppercase tracking-[.08em]">{option.label}</span>
                      <span className="mt-1 block text-[10px] text-noir/45">{option.note}</span>
                      <span className="mt-1.5 block text-[11px] font-semibold">{formatNPR(option.price)} delivery</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="mt-6">
              <Label htmlFor="note" className={labelClass}>
                Order note <span className="normal-case tracking-normal text-noir/30">(optional)</span>
              </Label>
              <Textarea
                id="note"
                rows={3}
                placeholder="Delivery instructions, preferred time, or a gift note…"
                className={`${fieldClass} min-h-24 resize-none`}
                {...register("note")}
              />
              {errors.note && <p className={errorClass}>{errors.note.message}</p>}
            </div>
          </section>

          <section className="border-t border-black/15 pt-6">
            <div className="flex items-baseline justify-between">
              <h2 className={sectionTitle}>03 — Payment</h2>
              <span className="text-[9px] uppercase tracking-[.18em] text-noir/35">No advance payment</span>
            </div>
            <div className="mt-5 flex items-start gap-3 border border-noir p-4">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-noir">
                <span className="h-2 w-2 rounded-full bg-noir" />
              </span>
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[.08em]">Cash on delivery</p>
                <p className="mt-1 text-[11px] leading-5 text-noir/50">
                  Pay the rider in cash when your order arrives. No card, no advance payment.
                </p>
              </div>
              <Lock size={14} className="ml-auto shrink-0 text-noir/30" />
            </div>
          </section>

          {errorMessage && (
            <div role="alert" className="border border-error/30 bg-error-light px-4 py-3 text-[11px] leading-5 text-error">
              {errorMessage}
            </div>
          )}
        </div>

        <aside className="h-fit bg-noir text-chalk lg:sticky lg:top-24">
          <div className="flex items-center justify-between border-b border-chalk/10 px-6 py-5">
            <h2 className="display text-lg font-bold uppercase">Your order</h2>
            <span className="text-[9px] uppercase tracking-[.2em] text-chalk/45">
              {pieces} {pieces === 1 ? "piece" : "pieces"}
            </span>
          </div>

          <div className="max-h-[320px] space-y-4 overflow-y-auto px-6 py-5">
            {items.map((item) => (
              <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex gap-3">
                <div className="relative shrink-0">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="aspect-[4/5] w-14 object-cover"
                  />
                  <span className="absolute -right-1.5 -top-1.5 grid h-4 min-w-[16px] place-items-center bg-chalk px-1 text-[8px] font-bold text-noir">
                    {item.quantity}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11px] font-medium uppercase tracking-[.06em]">{item.product.name}</p>
                  <p className="mt-1 text-[9px] uppercase tracking-[.14em] text-chalk/40">
                    {item.color} / {item.size}
                  </p>
                  <p className="mt-1.5 text-[11px] text-chalk/80">{formatNPR(item.product.price * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2.5 border-t border-chalk/10 px-6 py-4 text-[11px]">
            <div className="flex justify-between">
              <span className="text-chalk/50">Subtotal</span>
              <span>{formatNPR(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-chalk/50">Delivery</span>
              <span>{formatNPR(shipping)}</span>
            </div>
          </div>

          <div className="flex items-baseline justify-between border-t border-chalk/10 px-6 py-4">
            <span className="text-[9px] uppercase tracking-[.22em] text-chalk/60">Total</span>
            <strong className="display text-2xl font-bold">{formatNPR(total)}</strong>
          </div>

          <div className="px-6 pb-6">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="flex h-14 w-full items-center justify-center gap-2 bg-chalk text-[10px] font-semibold uppercase tracking-[.18em] text-noir transition hover:bg-white disabled:opacity-50"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 size={15} className="animate-spin" /> Placing order…
                </>
              ) : (
                <>
                  Place order <ArrowRight size={15} />
                </>
              )}
            </button>

            <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[9px] uppercase tracking-[.14em] text-chalk/40">
              <Check size={11} /> Confirm with the rider — no advance payment
            </p>

            <div className="mt-5 grid gap-2.5 border-t border-chalk/10 pt-5 text-[9px] uppercase tracking-[.14em] text-chalk/40">
              <span className="flex items-center gap-2">
                <ShieldCheck size={12} /> Your details are only used for delivery
              </span>
              <span className="flex items-center gap-2">
                <ShoppingBag size={12} /> Packed and shipped from Damauli
              </span>
            </div>
          </div>
        </aside>
      </form>
    </PageContainer>
  );
}
