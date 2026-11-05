import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { CATEGORIES } from "@/features/catalog/lib/catalog";
import { BRAND } from "@/shared/lib/brand";
import { PageContainer } from "./PageContainer";

const worldLinks = [
  { label: "Our story", to: "/story" },
  { label: "Lookbook", to: "/lookbook" },
  { label: "Collections", to: "/categories" },
];

const careLinks = [
  { label: "Track your order", to: "/track" },
  { label: "Shipping & returns", to: "/policies/shipping-returns" },
  { label: "Size guide", to: "/policies/size-guide" },
  { label: "Privacy policy", to: "/policies/privacy" },
  { label: "Terms of service", to: "/policies/terms" },
];

const socials = [
  { label: "Instagram", href: BRAND.instagram },
  { label: "TikTok", href: BRAND.tiktok },
  { label: "Pinterest", href: BRAND.pinterest },
  { label: "YouTube", href: BRAND.youtube },
];

export function Footer() {
  return (
    <footer className="bg-black text-chalk">
      <PageContainer>
        <div className="grid gap-10 py-14 md:grid-cols-[1.5fr_1fr_1fr_1fr] md:gap-8 md:py-20">
          <div>
            <p className="display text-[30px] font-bold uppercase leading-none">
              {BRAND.name}
              <span className="ml-1 align-super text-[10px] font-medium text-chalk/50">{BRAND.mark}</span>
            </p>
            <p className="mt-3 text-[9px] uppercase tracking-[.26em] text-chalk/50">{BRAND.descriptor}</p>
            <p className="mt-5 max-w-[19rem] text-[13px] leading-6 text-chalk/50">{BRAND.tagline}</p>
            <p className="mt-6 text-[9px] uppercase tracking-[.26em] text-chalk/50">{BRAND.city}</p>
            <a
              href={`mailto:${BRAND.email}`}
              className="link-underline mt-4 inline-block text-[13px] text-chalk/70 hover:text-chalk"
            >
              {BRAND.email}
            </a>
          </div>

          <div>
            <p className="mb-5 eyebrow-sm text-chalk/50">Shop</p>
            <div className="grid gap-2.5 text-[13px] text-chalk/70">
              <Link to="/shop" className="link-underline w-fit hover:text-chalk">
                All pieces
              </Link>
              {CATEGORIES.map((category) => (
                <Link
                  key={category.name}
                  to={`/shop?category=${encodeURIComponent(category.name)}`}
                  className="link-underline w-fit hover:text-chalk"
                >
                  {category.title}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-5 eyebrow-sm text-chalk/50">World of RIVAL</p>
            <div className="grid gap-2.5 text-[13px] text-chalk/70">
              {worldLinks.map((link) => (
                <Link key={link.label} to={link.to} className="link-underline w-fit hover:text-chalk">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-5 eyebrow-sm text-chalk/50">Client care</p>
            <div className="grid gap-2.5 text-[13px] text-chalk/70">
              {careLinks.map((link) => (
                <Link key={link.label} to={link.to} className="link-underline w-fit hover:text-chalk">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-5 border-t border-chalk/10 py-6">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-1.5 text-[9px] font-medium uppercase tracking-[.2em] text-chalk/50 transition hover:text-chalk"
              >
                {social.label}
                <ArrowUpRight size={11} className="text-chalk/25 transition group-hover:text-chalk" />
              </a>
            ))}
          </div>
          <p className="text-[9px] uppercase tracking-[.2em] text-chalk/50">
            Cash on delivery · Shipped from {BRAND.city.split(" · ")[0]}
          </p>
        </div>

        <div className="overflow-hidden border-t border-chalk/10 pt-8">
          <p
            aria-hidden="true"
            className="display select-none text-[clamp(3.5rem,15.5vw,13rem)] font-bold uppercase leading-[.76] tracking-[-.055em] text-chalk"
          >
            {BRAND.name}
          </p>
        </div>

        <div className="flex flex-col justify-between gap-3 border-t border-chalk/10 py-6 text-[9px] uppercase tracking-[.22em] text-chalk/50 sm:flex-row sm:items-center">
          <span>
            © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
          </span>
          <span className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span>Designed in Nepal</span>
            <span className="hidden h-1 w-1 bg-chalk/25 sm:block" />
            <span>Built beyond trends</span>
          </span>
        </div>
      </PageContainer>
    </footer>
  );
}
