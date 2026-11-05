import { ArrowUpRight, Mail } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Breadcrumbs } from "@/shared/components/layout/Breadcrumbs";
import { PageContainer } from "@/shared/components/layout/PageContainer";
import { Button } from "@/shared/components/ui/button";
import { usePageTitle } from "@/shared/hooks/usePageTitle";
import { BRAND } from "@/shared/lib/brand";
import { cn } from "@/shared/lib/utils";

type PolicySection = { heading: string; body: string[] };
type PolicyContent = {
  title: string;
  kicker: string;
  intro: string;
  sections: PolicySection[];
  table?: { columns: string[]; rows: string[][] };
};

const POLICIES: Record<string, PolicyContent> = {
  "shipping-returns": {
    title: "Shipping & returns",
    kicker: "Client care",
    intro:
      "Cash on delivery, nationwide dispatch and a clear returns window. Everything you need to know before and after your order ships.",
    sections: [
      {
        heading: "Dispatch",
        body: [
          "Orders are packed within 1–2 working days. We ship from Damauli to all 77 districts in Nepal.",
          "You'll receive a call to confirm your order before it leaves the studio. If we can't reach you within 48 hours, the order is held.",
        ],
      },
      {
        heading: "Delivery times",
        body: [
          "Damauli & Pokhara area: 1–2 working days after dispatch.",
          "Major cities: 2–4 working days after dispatch.",
          "Other districts: 3–6 working days after dispatch.",
          "Delivery is Rs 100 inside the Damauli & Pokhara area and Rs 200 across the rest of Nepal. It is added at checkout before you place the order.",
        ],
      },
      {
        heading: "Cash on delivery",
        body: [
          "Payment is collected by the courier when your order arrives. Please keep the exact total ready.",
        ],
      },
      {
        heading: "Returns & exchanges",
        body: [
          "You have 7 days from delivery to request a return or exchange. Pieces must be unworn, unwashed and in their original packaging with tags attached.",
          "Sale pieces, accessories and made-to-order items are final sale unless faulty.",
          "To start a return, email us with your order number and a photo of the piece. We'll confirm the next step and arrange pickup where available.",
        ],
      },
      {
        heading: "Faulty pieces",
        body: [
          "If something arrives damaged or incorrect, contact us within 48 hours of delivery. We'll cover return shipping and make it right with a replacement or refund.",
        ],
      },
    ],
  },
  "size-guide": {
    title: "Size guide",
    kicker: "Fit & measurements",
    intro:
      "Our silhouettes are relaxed by design. Measurements are taken flat, in centimetres. If you're between sizes, take the larger one for the intended fit.",
    sections: [
      {
        heading: "How to measure",
        body: [
          "Chest: measure around the fullest part of your chest, keeping the tape level.",
          "Length: measure from the highest point of the shoulder to the hem.",
          "Shoulder: measure across the back from seam to seam.",
          "If you're unsure, email us your height, weight and usual size and we'll advise.",
        ],
      },
      {
        heading: "Fit notes",
        body: [
          "Tees and hoodies are cut oversized. Size down for a closer fit.",
          "Outerwear is true to size with room for a hoodie underneath.",
          "Accessories are one size unless stated on the product page.",
        ],
      },
    ],
    table: {
      columns: ["Size", "Chest (cm)", "Length (cm)", "Shoulder (cm)"],
      rows: [
        ["S", "104", "68", "48"],
        ["M", "110", "71", "50"],
        ["L", "116", "74", "52"],
        ["XL", "122", "77", "54"],
        ["XXL", "128", "80", "56"],
      ],
    },
  },
  privacy: {
    title: "Privacy policy",
    kicker: "Your data",
    intro:
      "We collect only what we need to fulfil your order and keep you informed. We never sell your data.",
    sections: [
      {
        heading: "What we collect",
        body: [
          "Contact details (name, email, phone) and delivery address when you place an order or create an account.",
          "Order history and preferences so we can help with returns, tracking and support.",
          "Basic site analytics to understand what's working. We don't build advertising profiles.",
        ],
      },
      {
        heading: "How we use it",
        body: [
          "To confirm, pack and deliver your order, and to contact you about its status.",
          "To provide support and handle returns or exchanges.",
          "To send drop alerts and updates only if you've opted in. Unsubscribe any time.",
        ],
      },
      {
        heading: "Who we share it with",
        body: [
          "Courier partners, limited to the details needed to deliver your order.",
          "Payment and infrastructure providers that help us run the store securely.",
          "We do not sell or rent your personal data to third parties.",
        ],
      },
      {
        heading: "Your rights",
        body: [
          "You can request a copy of the data we hold, ask for corrections, or request deletion by emailing us.",
          "We keep order records for as long as required for accounting and legal purposes.",
        ],
      },
    ],
  },
  terms: {
    title: "Terms of service",
    kicker: "The agreement",
    intro:
      "By shopping with RIVAL you agree to the terms below. They're written to be read, not skipped.",
    sections: [
      {
        heading: "Orders",
        body: [
          "All orders are subject to availability and confirmation. We may cancel an order if a piece sells out or if we can't verify the details.",
          "Prices are listed in Nepalese Rupees and include applicable taxes. Delivery fees are shown at checkout.",
        ],
      },
      {
        heading: "Product information",
        body: [
          "We photograph pieces as accurately as we can. Screens vary, so slight colour differences may occur.",
          "Measurements are approximate. Natural variation in fabric and finish is part of the product, not a fault.",
        ],
      },
      {
        heading: "Returns",
        body: [
          "Returns and exchanges are governed by our shipping & returns policy. Pieces must be unworn and in original condition.",
          "Final sale items are not eligible unless faulty.",
        ],
      },
      {
        heading: "Intellectual property",
        body: [
          "All RIVAL designs, photography, graphics and copy are our property. They may not be reproduced or used commercially without permission.",
        ],
      },
      {
        heading: "Contact",
        body: [
          "Questions about these terms? Email us and we'll respond within two working days.",
        ],
      },
    ],
  },
};

const navOrder = [
  { slug: "shipping-returns", label: "Shipping & returns" },
  { slug: "size-guide", label: "Size guide" },
  { slug: "privacy", label: "Privacy policy" },
  { slug: "terms", label: "Terms of service" },
];

export function PolicyPage() {
  const { slug = "" } = useParams();
  const policy = POLICIES[slug];

  usePageTitle(`${policy?.title ?? "Page not found"} — ${BRAND.name}${BRAND.mark}`);

  if (!policy) {
    return (
      <PageContainer className="flex min-h-[64vh] flex-col items-center justify-center py-20 text-center">
        <p className="eyebrow text-black/40">Client care</p>
        <h1 className="mt-4 text-[clamp(2.4rem,6vw,4.4rem)] font-bold uppercase leading-[.86]">
          Page not found.
        </h1>
        <p className="mt-5 max-w-sm text-[13px] leading-6 text-black/50">
          That policy doesn't exist. Try one of the links below or head back to the store.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {navOrder.map((item) => (
            <Link
              key={item.slug}
              to={`/policies/${item.slug}`}
              className="border border-black/20 px-4 py-2.5 text-[9px] font-semibold uppercase tracking-[.16em] transition hover:border-black hover:bg-black hover:text-chalk"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <Button asChild variant="outline" size="sm" className="mt-6">
          <Link to="/shop">Back to the shop</Link>
        </Button>
      </PageContainer>
    );
  }

  return (
    <div className="bg-chalk">
      <PageContainer className="border-b border-black/10 pb-10 pt-8 md:pb-14 md:pt-12">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: policy.title }]} />
        <div className="mt-8 max-w-3xl">
          <p className="eyebrow text-black/40">{policy.kicker}</p>
          <h1 className="mt-4 text-[clamp(2.8rem,7vw,6rem)] font-bold uppercase leading-[.84]">{policy.title}</h1>
          <p className="mt-5 text-[13px] leading-7 text-black/55">{policy.intro}</p>
        </div>
      </PageContainer>

      <PageContainer className="py-10 md:py-14">
        <div className="grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-16">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow text-black/35">Policies</p>
            <nav className="mt-4 grid gap-1" aria-label="Policies">
              {navOrder.map((item) => (
                <Link
                  key={item.slug}
                  to={`/policies/${item.slug}`}
                  className={cn(
                    "flex items-center justify-between border-l-2 px-3 py-2.5 text-[10px] font-medium uppercase tracking-[.14em] transition",
                    item.slug === slug
                      ? "border-black text-black"
                      : "border-transparent text-black/45 hover:border-black/20 hover:text-black",
                  )}
                >
                  {item.label}
                  <ArrowUpRight size={12} className="opacity-40" />
                </Link>
              ))}
            </nav>
            <div className="mt-8 border-t border-black/10 pt-6">
              <p className="eyebrow text-black/35">Still need help?</p>
              <a
                href={`mailto:${BRAND.email}`}
                className="mt-3 inline-flex items-center gap-2 text-[11px] text-black/60 underline underline-offset-4 hover:text-black"
              >
                <Mail size={13} /> {BRAND.email}
              </a>
            </div>
          </aside>

          <article className="min-w-0">
            <div className="divide-y divide-black/10 border-t border-black/10">
              {policy.sections.map((section, index) => (
                <section key={section.heading} className="grid gap-4 py-8 md:grid-cols-[48px_1fr]">
                  <span className="text-[9px] font-semibold uppercase tracking-[.2em] text-black/30">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h2 className="text-lg font-bold uppercase">{section.heading}</h2>
                    <div className="mt-3 space-y-3">
                      {section.body.map((paragraph) => (
                        <p key={paragraph} className="max-w-2xl text-[13px] leading-7 text-black/60">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                </section>
              ))}
            </div>

            {policy.table && (
              <div className="mt-8 overflow-x-auto border border-black/10 bg-white">
                <table className="w-full min-w-[520px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-black/15">
                      {policy.table.columns.map((column) => (
                        <th
                          key={column}
                          className="px-4 py-3 text-[8px] font-semibold uppercase tracking-[.18em] text-black/40"
                        >
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {policy.table.rows.map((row) => (
                      <tr key={row[0]} className="border-b border-black/10 last:border-0">
                        {row.map((cell, index) => (
                          <td
                            key={`${row[0]}-${index}`}
                            className={cn(
                              "px-4 py-3 text-[12px]",
                              index === 0 ? "font-semibold uppercase tracking-[.08em]" : "text-black/55",
                            )}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-10 flex flex-col items-start justify-between gap-5 border-t border-black/10 pt-8 sm:flex-row sm:items-center">
              <div>
                <p className="eyebrow text-black/35">Need a hand?</p>
                <p className="mt-2 text-[12px] text-black/55">
                  Quote your order number and we'll sort it out within two working days.
                </p>
              </div>
              <Button asChild size="sm">
                <a href={`mailto:${BRAND.email}`}>
                  Email the studio <ArrowUpRight size={14} />
                </a>
              </Button>
            </div>
          </article>
        </div>
      </PageContainer>
    </div>
  );
}
