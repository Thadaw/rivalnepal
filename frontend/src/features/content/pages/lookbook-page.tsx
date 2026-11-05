import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Breadcrumbs } from "@/shared/components/layout/Breadcrumbs";
import { PageContainer } from "@/shared/components/layout/PageContainer";
import { useReveal } from "@/shared/hooks/useReveal";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1800&q=88";

const looks = [
  {
    number: "01",
    title: "Concrete hours",
    copy: "Oversized shell, heavyweight tee, wide trouser. Built for the walk between wherever you were and wherever you're going.",
    image: "https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=1200&q=85",
    alt: "Look 01 — model seated in a concrete courtyard",
    category: "Jackets",
    span: "lg:col-span-7",
    ratio: "aspect-[4/5]",
  },
  {
    number: "02",
    title: "Off duty",
    copy: "Brushed fleece, deep hood, no logos doing the talking. The uniform for a slow morning that turns into a long night.",
    image: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=1000&q=85",
    alt: "Look 02 — model in a black tee and wide brim hat",
    category: "Hoodies",
    span: "lg:col-span-5 lg:mt-24",
    ratio: "aspect-[4/5]",
  },
  {
    number: "03",
    title: "After dark",
    copy: "A single heavy layer, clean lines, nothing extra. The night is the accessory.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1000&q=85",
    alt: "Look 03 — portrait in a heavy gauge knit",
    category: "T-Shirts",
    span: "lg:col-span-4 lg:mt-10",
    ratio: "aspect-square",
  },
  {
    number: "04",
    title: "Small goods",
    copy: "Cap, tote, utility strap. The details that finish the fit without raising their voice.",
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1000&q=85",
    alt: "Look 04 — accessories study",
    category: "Accessories",
    span: "lg:col-span-8",
    ratio: "aspect-[16/10]",
  },
];

const credits = [
  ["Photography", "RIVAL studio"],
  ["Direction", "The inner circle"],
  ["Location", "Damauli, near Pokhara, Nepal"],
  ["Season", "AW26 — after dark"],
];

export function LookbookPage() {
  useReveal();

  return (
    <div className="bg-chalk text-black">
      <PageContainer className="pb-10 pt-8 md:pb-14 md:pt-12">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Lookbook" }]} />
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="eyebrow text-black/40">Campaign — after dark</p>
            <h1 className="mt-4 text-[clamp(3rem,8.5vw,8rem)] font-bold uppercase leading-[.82]">
              Lookbook
              <br />
              AW26.
            </h1>
          </div>
          <div className="max-w-sm lg:text-right">
            <p className="text-[13px] leading-7 text-black/55">
              Shot across the city after the streets emptied. Four looks, one point of view: no permission
              required.
            </p>
            <Link
              to="/shop"
              className="group mt-5 inline-flex items-center gap-2 border-b border-black/25 pb-1 text-[9px] font-semibold uppercase tracking-[.18em] transition hover:border-black"
            >
              Shop the looks
              <ArrowUpRight size={13} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </PageContainer>

      <section className="relative min-h-[78svh] overflow-hidden bg-black text-chalk">
        <img
          src={HERO_IMAGE}
          alt="RIVAL AW26 campaign hero"
          className="absolute inset-0 h-full w-full object-cover object-[center_35%] mono"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/20" />
        <PageContainer className="relative flex min-h-[78svh] flex-col justify-end pb-10 md:pb-14">
          <div className="flex flex-col justify-between gap-5 border-t border-chalk/15 pt-6 sm:flex-row sm:items-end">
            <p className="max-w-xl text-[clamp(1.4rem,3vw,2.4rem)] font-bold uppercase leading-[.94]">
              The city is quieter after midnight. The clothes should say more.
            </p>
            <div className="flex shrink-0 gap-8 text-[8px] uppercase tracking-[.2em] text-chalk/45">
              <span>Damauli</span>
              <span>AW26</span>
              <span>01 — 04</span>
            </div>
          </div>
        </PageContainer>
      </section>

      <PageContainer className="section-pad">
        <div className="grid gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-20">
          {looks.map((look) => (
            <Link
              key={look.number}
              to={`/shop?category=${encodeURIComponent(look.category)}`}
              data-reveal
              className={`group block ${look.span}`}
            >
              <div className={`relative overflow-hidden bg-ash ${look.ratio}`}>
                <img
                  src={look.image}
                  alt={look.alt}
                  loading="lazy"
                  className="h-full w-full object-cover mono-hover group-hover:scale-[1.02]"
                />
                <span className="absolute left-0 top-0 bg-black px-3 py-2 text-[8px] uppercase tracking-[.2em] text-chalk">
                  Look {look.number}
                </span>
                <span className="absolute bottom-0 right-0 grid h-11 w-11 place-items-center bg-chalk text-black transition group-hover:bg-black group-hover:text-chalk">
                  <ArrowUpRight size={16} />
                </span>
              </div>
              <div className="mt-4 flex items-start justify-between gap-5 border-t border-black/15 pt-4">
                <div>
                  <h2 className="text-lg font-bold uppercase">{look.title}</h2>
                  <p className="mt-2 max-w-md text-[12px] leading-6 text-black/55">{look.copy}</p>
                </div>
                <span className="shrink-0 text-[8px] uppercase tracking-[.2em] text-black/35">{look.category}</span>
              </div>
            </Link>
          ))}
        </div>
      </PageContainer>

      <section className="bg-black text-chalk">
        <PageContainer className="py-16 md:py-24">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-end">
            <div>
              <p className="eyebrow text-chalk/35">Field notes</p>
              <h2 className="mt-4 max-w-3xl text-[clamp(2rem,5vw,4.4rem)] font-bold uppercase leading-[.88]">
                No permission required.
              </h2>
              <p className="mt-5 max-w-md text-[13px] leading-7 text-chalk/50">
                Every look in this campaign is built from the current collection. Limited runs, no restocks, made
                for the ones who move different.
              </p>
            </div>
            <div className="flex flex-col items-start gap-4 sm:flex-row lg:flex-col lg:items-end">
              <Link
                to="/shop"
                className="group inline-flex items-center gap-2 bg-chalk px-6 py-3.5 text-[9px] font-semibold uppercase tracking-[.18em] text-black transition hover:bg-white"
              >
                Shop the edit
                <ArrowRight size={14} className="transition group-hover:translate-x-1" />
              </Link>
              <Link
                to="/story"
                className="link-underline text-[9px] font-semibold uppercase tracking-[.18em] text-chalk/60 hover:text-chalk"
              >
                Read our story
              </Link>
            </div>
          </div>

          <dl className="mt-12 grid gap-5 border-t border-chalk/15 pt-8 sm:grid-cols-2 lg:grid-cols-4">
            {credits.map(([term, value]) => (
              <div key={term}>
                <dt className="text-[8px] uppercase tracking-[.22em] text-chalk/35">{term}</dt>
                <dd className="mt-1.5 text-[11px] uppercase tracking-[.12em] text-chalk/70">{value}</dd>
              </div>
            ))}
          </dl>
        </PageContainer>
      </section>
    </div>
  );
}
