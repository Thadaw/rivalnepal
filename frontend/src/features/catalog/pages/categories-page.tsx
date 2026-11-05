import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Breadcrumbs } from "@/shared/components/layout/Breadcrumbs";
import { PageContainer } from "@/shared/components/layout/PageContainer";
import { useProducts } from "@/features/catalog/hooks/use-products";
import { CATEGORIES } from "@/features/catalog/lib/catalog";
import { useReveal } from "@/shared/hooks/useReveal";

export function CategoriesPage() {
  const { data = [] } = useProducts();
  useReveal();

  return (
    <div className="bg-chalk">
      <PageContainer className="border-b border-black/10 pb-10 pt-8 md:pb-14 md:pt-12">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Collections" }]} />
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="eyebrow text-black/40">Four chapters — one point of view</p>
            <h1 className="mt-4 text-[clamp(3rem,8vw,7rem)] font-bold uppercase leading-[.82]">Collections</h1>
            <p className="mt-5 max-w-lg text-[13px] leading-7 text-black/55">
              Four ways into the RIVAL wardrobe. Start with a category, then dial in the size and colour on the
              product page.
            </p>
          </div>
          <Link
            to="/lookbook"
            className="group inline-flex w-fit items-center gap-2 border-b border-black/25 pb-1 text-[9px] font-semibold uppercase tracking-[.18em] transition hover:border-black"
          >
            View the lookbook
            <ArrowUpRight size={14} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </PageContainer>

      <PageContainer className="section-pad">
        <div className="grid gap-4 md:grid-cols-2">
          {CATEGORIES.map((category, index) => {
            const count = data.filter((product) => product.category === category.name).length;
            return (
              <Link
                key={category.name}
                to={`/shop?category=${encodeURIComponent(category.name)}`}
                data-reveal
                className={`group relative overflow-hidden bg-charcoal ${
                  index === 0 || index === 3 ? "md:min-h-[560px]" : "md:min-h-[460px]"
                }`}
              >
                <img
                  src={category.image}
                  alt={category.title}
                  loading={index < 2 ? "eager" : "lazy"}
                  className="absolute inset-0 h-full w-full object-cover opacity-90 mono-hover group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />
                <div className="relative flex h-full min-h-[340px] flex-col justify-between p-6 text-chalk md:min-h-0 md:p-8">
                  <div className="flex items-start justify-between">
                    <span className="border border-chalk/25 px-3 py-1.5 text-[8px] font-medium uppercase tracking-[.18em] text-chalk/70">
                      {count > 0 ? `${count} ${count === 1 ? "piece" : "pieces"}` : "Coming soon"}
                    </span>
                    <span className="grid h-11 w-11 place-items-center border border-chalk/30 transition group-hover:border-chalk group-hover:bg-chalk group-hover:text-black">
                      <ArrowUpRight size={18} />
                    </span>
                  </div>
                  <div className="mt-auto pt-16">
                    <p className="eyebrow text-chalk/50">{category.kicker}</p>
                    <h2 className="mt-2 text-[clamp(2rem,4vw,3.4rem)] font-bold uppercase leading-[.92]">
                      {category.title}
                    </h2>
                    <p className="mt-3 max-w-sm text-[12px] leading-6 text-chalk/60">{category.blurb}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-4 flex flex-col items-start justify-between gap-6 bg-black p-7 text-chalk sm:flex-row sm:items-center md:p-10">
          <div>
            <p className="eyebrow text-chalk/40">Can't pick one?</p>
            <h2 className="mt-2 text-2xl font-bold uppercase md:text-3xl">See the whole collection.</h2>
            <p className="mt-2 max-w-md text-[12px] leading-6 text-chalk/50">
              Every piece in the current edit, from heavyweight basics to the outerwear layers built for the night.
            </p>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-chalk px-6 py-3.5 text-[9px] font-semibold uppercase tracking-[.18em] text-black transition hover:bg-white"
          >
            Shop all <ArrowUpRight size={15} />
          </Link>
        </div>
      </PageContainer>
    </div>
  );
}
