import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Breadcrumbs } from "@/shared/components/layout/Breadcrumbs";
import { PageContainer } from "@/shared/components/layout/PageContainer";
import { Newsletter } from "@/features/newsletter/components/newsletter-section";
import { useReveal } from "@/shared/hooks/useReveal";
import { BRAND } from "@/shared/lib/brand";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1800&q=88";
const DETAIL_IMAGE =
  "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1400&q=85";
const CITY_IMAGE =
  "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1400&q=85";

const principles = [
  {
    number: "01",
    title: "Weight over noise",
    copy: "Heavyweight cottons, dense fleece and seams that hold their shape. We spend where it lasts, not where it shows.",
  },
  {
    number: "02",
    title: "Cut for movement",
    copy: "Boxed shoulders, dropped armholes and considered drape. Silhouettes built to move through the city, not pose in it.",
  },
  {
    number: "03",
    title: "Small batch, on purpose",
    copy: "Short runs and no reprints. When a piece is gone, it stays gone — the wardrobe stays yours, not everyone's.",
  },
];

const chapters = [
  {
    year: "2019",
    title: "A rail in a rented room",
    copy: "RIVAL started with twelve tees, a screen printer and a refusal to make another logo for the sake of it.",
  },
  {
    year: "2022",
    title: "The first full collection",
    copy: "Outerwear joined the line. The language settled: black, off-white, charcoal and nothing that needed explaining.",
  },
  {
    year: "Now",
    title: "Built beyond trends",
    copy: "Small-batch drops, made in Nepal, shipped nationwide. Still designed for the ones who move different.",
  },
];

export function BrandStoryPage() {
  useReveal();

  return (
    <div className="bg-chalk text-black">
      <section className="relative min-h-[72svh] overflow-hidden bg-black text-chalk">
        <img
          src={HERO_IMAGE}
          alt="RIVAL portrait in a heavy gauge knit"
          className="absolute inset-0 h-full w-full object-cover object-[center_28%] mono"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/30" />
        <div className="relative flex min-h-[72svh] flex-col justify-between">
          <PageContainer className="pt-8 md:pt-10">
            <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Our story" }]} invert />
          </PageContainer>
          <PageContainer className="pb-10 md:pb-14">
            <p className="eyebrow text-chalk/45">{BRAND.descriptor} — {BRAND.city}</p>
            <h1 className="mt-5 max-w-5xl text-[clamp(3rem,8.5vw,8rem)] font-bold uppercase leading-[.82]">
              Made for the ones who move different.
            </h1>
            <div className="mt-8 flex flex-col items-start gap-5 border-t border-chalk/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-lg text-[13px] leading-7 text-chalk/55">
                RIVAL is a Damauli-born label, just outside Pokhara, building modern armour for the city after dark.
                No permission required.
              </p>
              <Link
                to="/shop"
                className="group inline-flex shrink-0 items-center gap-2 bg-chalk px-6 py-3.5 text-[9px] font-semibold uppercase tracking-[.18em] text-black transition hover:bg-white"
              >
                Shop the collection
                <ArrowRight size={14} className="transition group-hover:translate-x-1" />
              </Link>
            </div>
          </PageContainer>
        </div>
      </section>

      <PageContainer className="section-pad">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div data-reveal>
            <p className="eyebrow text-black/40">The manifesto</p>
            <h2 className="mt-4 text-[clamp(2rem,4.2vw,3.6rem)] font-bold uppercase leading-[.9]">
              Cut for movement. Built to outlast the trend cycle.
            </h2>
          </div>
          <div data-reveal className="space-y-5 text-[13px] leading-7 text-black/60">
            <p>
              We design for the hours when the city changes. After the last meeting, before the first train home.
              Clothes that carry a point of view without asking for attention.
            </p>
            <p>
              Every piece starts with the hand: the weight of a cotton, the fall of a hood, the way a shoulder
              sits when you're walking. If it doesn't hold up in the street, it doesn't make the line.
            </p>
            <p>
              The palette is deliberately narrow — black, off-white, charcoal, dark gray. It means everything
              works together, season after season, and nothing dates the moment it leaves the rail.
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3 md:mt-16" data-reveal>
          {principles.map((principle) => (
            <div key={principle.number} className="border-t border-black/15 pt-5">
              <p className="text-[9px] font-semibold uppercase tracking-[.24em] text-black/35">{principle.number}</p>
              <h3 className="mt-4 text-lg font-bold uppercase">{principle.title}</h3>
              <p className="mt-3 text-[12px] leading-6 text-black/55">{principle.copy}</p>
            </div>
          ))}
        </div>
      </PageContainer>

      <section className="bg-white">
        <div className="grid lg:grid-cols-2">
          <div className="relative min-h-[420px] overflow-hidden bg-ash lg:min-h-[720px]">
            <img
              src={DETAIL_IMAGE}
              alt="Heavyweight garments on a rail"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover mono-hover"
            />
          </div>
          <div className="flex items-center px-5 py-16 sm:px-10 md:px-14 lg:px-20">
            <div className="max-w-md">
              <p className="eyebrow text-black/40">The process</p>
              <h2 className="mt-4 text-[clamp(2rem,4vw,3.4rem)] font-bold uppercase leading-[.9]">
                Nothing that needs explaining.
              </h2>
              <p className="mt-5 text-[13px] leading-7 text-black/60">
                We keep the line small so we can stay close to it. Each drop is sampled, worn and re-cut before it
                goes live. If a detail doesn't earn its place, it's removed.
              </p>
              <dl className="mt-8 divide-y divide-black/10 border-t border-black/10">
                {[
                  ["Fabric", "280–420gsm cotton, brushed fleece, coated shells."],
                  ["Fit", "Relaxed through the body, structured at the shoulder."],
                  ["Production", "Small runs, made in Nepal, no seasonal reprints."],
                ].map(([term, description]) => (
                  <div key={term} className="grid grid-cols-[90px_1fr] gap-4 py-4">
                    <dt className="text-[9px] font-semibold uppercase tracking-[.18em] text-black/40">{term}</dt>
                    <dd className="text-[12px] leading-6 text-black/60">{description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      <PageContainer className="section-pad">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="relative min-h-[360px] overflow-hidden bg-ash md:min-h-[520px]" data-reveal>
            <img
              src={CITY_IMAGE}
              alt="Concrete city geometry"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover mono"
            />
            <span className="absolute bottom-5 left-5 border border-chalk/30 bg-black/40 px-3 py-1.5 text-[8px] uppercase tracking-[.2em] text-chalk backdrop-blur">
              {BRAND.city}
            </span>
          </div>
          <div data-reveal>
            <p className="eyebrow text-black/40">The chapters</p>
            <h2 className="mt-4 text-[clamp(2rem,4vw,3.4rem)] font-bold uppercase leading-[.9]">Still becoming.</h2>
            <div className="mt-8 divide-y divide-black/10 border-t border-black/10">
              {chapters.map((chapter) => (
                <div key={chapter.year} className="grid grid-cols-[72px_1fr] gap-4 py-6">
                  <p className="text-[9px] font-semibold uppercase tracking-[.2em] text-black/35">{chapter.year}</p>
                  <div>
                    <h3 className="text-[13px] font-semibold uppercase tracking-[.06em]">{chapter.title}</h3>
                    <p className="mt-2 text-[12px] leading-6 text-black/55">{chapter.copy}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/lookbook"
                className="group inline-flex items-center gap-2 border-b border-black/25 pb-1 text-[9px] font-semibold uppercase tracking-[.18em] transition hover:border-black"
              >
                View the lookbook
                <ArrowUpRight size={13} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                to="/categories"
                className="group inline-flex items-center gap-2 border-b border-black/25 pb-1 text-[9px] font-semibold uppercase tracking-[.18em] transition hover:border-black"
              >
                Explore collections
                <ArrowUpRight size={13} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </PageContainer>

      <section className="border-y border-black/10 bg-white">
        <PageContainer className="py-16 text-center md:py-24">
          <p className="eyebrow text-black/35">The line</p>
          <blockquote className="mx-auto mt-5 max-w-4xl text-[clamp(1.8rem,4.6vw,4rem)] font-bold uppercase leading-[.9]">
            “No permission required.”
          </blockquote>
          <p className="mx-auto mt-5 max-w-md text-[12px] leading-6 text-black/50">
            The campaign line that started it all — and the brief for everything we make.
          </p>
        </PageContainer>
      </section>

      <Newsletter />
    </div>
  );
}
