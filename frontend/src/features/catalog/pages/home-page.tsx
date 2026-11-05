import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ProductCard } from "@/features/catalog/components/product-card";
import { Newsletter } from "@/features/newsletter/components/newsletter-section";
import { PageContainer } from "@/shared/components/layout/PageContainer";
import { useProducts } from "@/features/catalog/hooks/use-products";
import { useReveal } from "@/shared/hooks/useReveal";
import { CATEGORIES } from "@/features/catalog/lib/catalog";
import { BRAND } from "@/shared/lib/brand";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1600&q=88";
const LOOKBOOK_IMAGE =
  "https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=1400&q=85";

/** Wireframe sphere used as the story panel's background mark. */
function StoryGlobe() {
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      aria-hidden="true"
      className="pointer-events-none absolute -right-28 top-1/2 hidden h-[520px] w-[520px] -translate-y-1/2 text-chalk/20 sm:block lg:-right-20 lg:h-[600px] lg:w-[600px]"
    >
      <circle cx="200" cy="200" r="184" stroke="currentColor" strokeWidth="0.9" />
      {[0, 30, 60, 90, 120, 150].map((angle) => (
        <ellipse
          key={angle}
          cx="200"
          cy="200"
          rx="184"
          ry="122"
          transform={`rotate(${angle} 200 200)`}
          stroke="currentColor"
          strokeWidth="0.9"
        />
      ))}
    </svg>
  );
}

export function HomePage() {
  const { data = [], isLoading } = useProducts();
  useReveal();

  const newDrops = data.slice(0, 5);
  const categoryTiles = CATEGORIES.slice(0, 4);

  return (
    <div className="bg-white text-black">
      {/* Hero */}
      <section className="relative overflow-hidden bg-black text-chalk">
        <div className="grid lg:min-h-[620px] lg:grid-cols-[minmax(0,52%)_minmax(0,48%)]">
          <div className="flex flex-col justify-center px-5 pb-14 pt-24 sm:px-8 md:px-10 lg:pb-20 lg:pl-[max(48px,calc((100vw-1440px)/2+48px))] lg:pr-12 lg:pt-32">
            <p className="rise text-[9px] font-semibold uppercase tracking-[.42em] text-chalk/55">
              Premium streetwear
            </p>

            <h1 className="rise rise-1 mt-5 text-[clamp(3rem,6.6vw,5.8rem)] font-bold uppercase leading-[.84] tracking-[-.045em]">
              Wear{" "}
              <br />
              <span className="text-chalk/85">The</span>{" "}
              <span className="relative inline-block text-chalk/45">
                Vision
                <svg
                  viewBox="0 0 220 18"
                  fill="none"
                  aria-hidden="true"
                  className="absolute -bottom-3 left-0 w-[88%] text-chalk"
                >
                  <path
                    d="M3 11c38-7 88-10 150-8"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M42 16c44-5 90-6 148-4"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                    opacity=".65"
                  />
                </svg>
              </span>
            </h1>

            <p className="rise rise-2 mt-8 max-w-[24rem] text-[13.5px] leading-7 text-chalk/55">
              More than clothing — it&rsquo;s a lifestyle. Step into streetwear redefined with heavyweight
              staples cut for the city after dark.
            </p>

            <div className="rise rise-3 mt-8">
              <Link
                to="/shop"
                className="group inline-flex h-12 items-center gap-3 bg-chalk px-7 text-[10px] font-semibold uppercase tracking-[.2em] text-black transition hover:bg-white"
              >
                Shop the collection
                <ArrowRight size={14} className="transition group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="mt-12 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[.22em] text-chalk/40">
              <span className="text-chalk">AW26</span>
              <span className="h-px w-14 bg-chalk/30" aria-hidden="true" />
              <span>Damauli</span>
            </div>
          </div>

          <div className="relative min-h-[420px] overflow-hidden sm:min-h-[520px] lg:min-h-full">
            <img
              src={HERO_IMAGE}
              alt="Model in a streetwear jacket against a wall of wheat-pasted posters"
              className="mono absolute inset-0 h-full w-full object-cover object-[center_30%]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/60 to-transparent lg:hidden" />

            <span className="absolute bottom-8 right-6 hidden -rotate-6 text-right font-display text-[22px] italic leading-[1.05] tracking-[-.02em] text-chalk/75 md:block">
              Rival
              <br />
              Streetwear
            </span>
          </div>
        </div>
      </section>

      {/* Shop by category */}
      <section id="categories" className="bg-white pb-12 pt-11 md:pb-16 md:pt-14">
        <PageContainer>
          <div className="flex items-center gap-5" data-reveal>
            <h2 className="text-[15px] font-bold uppercase tracking-[.06em] md:text-[18px]">
              Shop by category
            </h2>
            <span className="hidden h-px flex-1 bg-black/15 md:block" aria-hidden="true" />
            <Link
              to="/categories"
              className="group ml-auto flex shrink-0 items-center gap-2 text-[11px] font-medium transition hover:opacity-60"
            >
              Explore all
              <ArrowRight size={13} className="transition group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2.5 md:mt-6 md:grid-cols-4 md:gap-3">
            {categoryTiles.map((category) => (
              <Link
                key={category.name}
                to={`/shop?category=${encodeURIComponent(category.name)}`}
                data-reveal
                className="group relative aspect-[4/5] overflow-hidden bg-charcoal"
              >
                <img
                  src={category.image}
                  alt={category.title}
                  loading="lazy"
                  className="mono-hover absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 flex items-center gap-2 p-3 text-[10.5px] font-bold uppercase leading-none tracking-[.08em] text-chalk md:p-3.5 md:text-[11px]">
                  {category.name}
                  <ArrowRight size={13} strokeWidth={2.4} className="transition group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </PageContainer>
      </section>

      {/* New drops */}
      <section className="bg-white pb-14 md:pb-20">
        <PageContainer>
          <div className="flex items-end justify-between gap-6" data-reveal>
            <div>
              <h2 className="text-[15px] font-bold uppercase tracking-[.06em] md:text-[18px]">New drops</h2>
              <p className="mt-1.5 text-[11.5px] text-black/50">Fresh styles. Limited time.</p>
            </div>
            <Link
              to="/shop"
              className="group flex shrink-0 items-center gap-2 text-[11px] font-medium transition hover:opacity-60"
            >
              View all products
              <ArrowRight size={13} className="transition group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 md:mt-7 lg:grid-cols-5 lg:gap-x-4">
            {isLoading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="aspect-[4/5] bg-ash" />
                    <div className="mt-3 h-2.5 w-2/3 bg-ash" />
                    <div className="mt-2 h-2.5 w-1/3 bg-ash" />
                  </div>
                ))
              : newDrops.map((product, index) => (
                  <ProductCard key={product.id} product={product} priority={index < 3} />
                ))}
          </div>
        </PageContainer>
      </section>

      {/* Lookbook + story */}
      <section className="grid lg:grid-cols-2">
        <div className="relative min-h-[420px] overflow-hidden bg-charcoal lg:min-h-[540px]">
          <img
            src={LOOKBOOK_IMAGE}
            alt="Lookbook — model seated in a circular concrete courtyard"
            loading="lazy"
            className="mono-hover absolute inset-0 h-full w-full object-cover object-[center_35%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 text-chalk md:p-8 lg:p-10">
            <h2 className="text-[18px] font-bold uppercase tracking-[.06em]">Lookbook</h2>
            <p className="mt-2 max-w-[16rem] text-[12.5px] leading-6 text-chalk/65">
              Get an exclusive look at the latest looks and style inspiration.
            </p>
            <Link
              to="/lookbook"
              className="group mt-4 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.18em]"
            >
              View gallery
              <ArrowUpRight size={13} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>

        <div className="relative overflow-hidden bg-black px-6 py-16 text-chalk sm:px-10 md:py-20 lg:px-14 xl:px-20">
          <StoryGlobe />
          <div className="relative max-w-md">
            <p className="text-[9px] font-semibold uppercase tracking-[.32em] text-chalk/45">Our story</p>
            <h2 className="mt-4 text-[clamp(2.2rem,4.4vw,3.4rem)] font-bold leading-[.9] tracking-[-.035em]">
              Built for
              <br />
              the Bold.
            </h2>
            <p className="mt-5 text-[13px] leading-7 text-chalk/55">
              {BRAND.name} is a modern streetwear brand for dreamers, creators and rebels. We create timeless
              pieces that speak louder than trends.
            </p>
            <Link
              to="/story"
              className="group mt-8 inline-flex h-12 items-center gap-3 bg-chalk px-6 text-[10px] font-semibold uppercase tracking-[.18em] text-black transition hover:bg-white"
            >
              Learn more
              <ArrowRight size={14} className="transition group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      <Newsletter />
    </div>
  );
}
