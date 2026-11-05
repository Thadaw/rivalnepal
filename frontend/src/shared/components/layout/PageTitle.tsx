import { useLocation } from "react-router-dom";
import { usePageTitle } from "@/shared/hooks/usePageTitle";
import { BRAND } from "@/shared/lib/brand";

const brand = `${BRAND.name}${BRAND.mark}`;

const TITLES: Record<string, string> = {
  "/": `${brand} — Luxury Men's Streetwear`,
  "/shop": `Shop — ${brand}`,
  "/categories": `Categories — ${brand}`,
  "/cart": `Cart — ${brand}`,
  "/checkout": `Checkout — ${brand}`,
  "/login": `Sign in — ${brand}`,
  "/signup": `Create account — ${brand}`,
  "/account": `Account — ${brand}`,
  "/track": `Track order — ${brand}`,
  "/story": `Our story — ${brand}`,
  "/lookbook": `Lookbook — ${brand}`,
};

const POLICY_TITLES: Record<string, string> = {
  "shipping-returns": "Shipping & returns",
  "size-guide": "Size guide",
  privacy: "Privacy",
  terms: "Terms",
};

export function PageTitle() {
  const { pathname } = useLocation();
  const policySlug = pathname.startsWith("/policies/") ? pathname.split("/")[2] : "";
  const title =
    TITLES[pathname] ??
    (pathname.startsWith("/product/") ? `Product — ${brand}` : undefined) ??
    (policySlug ? `${POLICY_TITLES[policySlug] ?? "Policies"} — ${brand}` : undefined) ??
    `${brand} — Luxury Men's Streetwear`;

  usePageTitle(title);
  return null;
}
