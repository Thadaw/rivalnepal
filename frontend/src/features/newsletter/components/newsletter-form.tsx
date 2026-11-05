import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2 } from "lucide-react";
import { useSubscribeToNewsletter } from "@/features/newsletter/hooks/use-subscribe";
import { newsletterSchema, type NewsletterValues } from "@/features/newsletter/schemas/newsletter-schema";
import { Label } from "@/shared/components/ui/label";
import { cn } from "@/shared/lib/utils";

export function NewsletterForm({ dark = true }: { dark?: boolean }) {
  const subscribe = useSubscribeToNewsletter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewsletterValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: "" },
  });

  const submit = handleSubmit((values) =>
    subscribe.mutate(values.email, { onSuccess: () => reset({ email: "" }) }),
  );

  const serverError = subscribe.error instanceof Error ? subscribe.error.message : null;

  return (
    <form onSubmit={submit} className="w-full" noValidate>
      <Label htmlFor="newsletter-email" className={dark ? "text-chalk/40" : "text-black/45"}>
        Email address
      </Label>
      <div
        className={cn(
          "mt-2 flex items-center border-b",
          dark ? "border-chalk/30 focus-within:border-chalk" : "border-black/30 focus-within:border-black",
        )}
      >
        <input
          id="newsletter-email"
          type="email"
          placeholder="you@email.com"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby="newsletter-status"
          className={cn(
            "h-14 w-full border-0 bg-transparent px-0 text-[14px] focus:ring-0",
            dark ? "text-chalk placeholder:text-chalk/25" : "text-black placeholder:text-black/30",
          )}
          {...register("email")}
        />
        <button
          type="submit"
          disabled={subscribe.isPending}
          className={cn(
            "group flex h-11 shrink-0 items-center gap-2 px-5 text-[10px] font-semibold uppercase tracking-[.18em] transition disabled:opacity-60",
            dark ? "bg-chalk text-black hover:bg-white" : "bg-black text-chalk hover:bg-graphite",
          )}
        >
          {subscribe.isPending ? <Loader2 size={13} className="animate-spin" /> : null}
          Join
          {!subscribe.isPending && (
            <ArrowRight size={13} className="transition group-hover:translate-x-1" />
          )}
        </button>
      </div>
      <p
        id="newsletter-status"
        aria-live="polite"
        className={cn(
          "mt-3 text-[10px] uppercase tracking-[.14em]",
          errors.email || serverError
            ? dark
              ? "text-red-300"
              : "text-error"
            : subscribe.isSuccess
              ? dark
                ? "text-chalk"
                : "text-black"
              : dark
                ? "text-chalk/35"
                : "text-black/40",
        )}
      >
        {errors.email?.message ??
          serverError ??
          (subscribe.isSuccess
            ? "You're in. Watch your inbox for the next drop."
            : "Drop alerts only. Unsubscribe whenever.")}
      </p>
    </form>
  );
}
