import { NewsletterForm } from "@/features/newsletter/components/newsletter-form";
import { PageContainer } from "@/shared/components/layout/PageContainer";
import { BRAND } from "@/shared/lib/brand";
import { cn } from "@/shared/lib/utils";

export function Newsletter({
  variant = "dark",
  className,
}: {
  variant?: "dark" | "light";
  className?: string;
}) {
  const dark = variant === "dark";

  return (
    <section
      id="newsletter"
      className={cn(dark ? "bg-black text-chalk" : "bg-white text-black", className)}
    >
      <PageContainer>
        <div
          className={cn(
            "grid gap-10 border-y py-14 md:py-20 lg:grid-cols-[1.1fr_1fr] lg:items-end",
            dark ? "border-chalk/10" : "border-black/10",
          )}
        >
          <div data-reveal>
            <p className={cn("eyebrow", dark ? "text-chalk/40" : "text-black/40")}>The inner circle</p>
            <h2 className="mt-4 text-[clamp(2.4rem,5.4vw,4.6rem)] font-bold uppercase leading-[.86]">
              {BRAND.newsletter}
            </h2>
            <p className={cn("mt-5 max-w-md text-[13px] leading-7", dark ? "text-chalk/50" : "text-black/55")}>
              Early access to limited drops, private fittings and the RIVAL field notes. No noise — just the
              pieces that matter.
            </p>
          </div>

          <NewsletterForm dark={dark} />
        </div>
      </PageContainer>
    </section>
  );
}
