import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { Product } from "@/features/catalog/types";
import { formatNPR } from "@/shared/lib/utils";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const gallery = product.images?.length ? product.images : [product.image];
  const hoverImage = gallery[1] ?? gallery[0];
  const discount =
    product.compareAt && product.compareAt > product.price
      ? Math.round((1 - product.price / product.compareAt) * 100)
      : null;
  const swatches = product.colors.slice(0, 4).map((color) => ({
    name: color,
    hex: product.colorHexes?.[color] ?? "#1c1c1a",
  }));

  return (
    <article className="group">
      <Link
        to={`/product/${product.id}`}
        className="relative block overflow-hidden bg-ash"
        aria-label={`View ${product.name}`}
      >
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={gallery[0]}
            alt={product.name}
            loading={priority ? "eager" : "lazy"}
            className="absolute inset-0 h-full w-full object-cover transition-all duration-[1100ms] ease-out group-hover:scale-[1.04] group-hover:opacity-0"
          />
          <img
            src={hoverImage}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-all duration-[1100ms] ease-out group-hover:scale-[1.02] group-hover:opacity-100"
          />
        </div>

        {(product.badge || discount !== null) && (
          <div className="absolute left-0 top-0 flex flex-col items-start">
            {product.badge && (
              <span className="bg-noir px-2.5 py-1.5 text-[8px] font-semibold uppercase tracking-[.18em] text-chalk">
                {product.badge}
              </span>
            )}
            {discount !== null && (
              <span className="bg-chalk px-2.5 py-1.5 text-[8px] font-semibold uppercase tracking-[.18em] text-noir">
                −{discount}%
              </span>
            )}
          </div>
        )}

        <span className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-between bg-noir px-4 py-3 text-[9px] font-semibold uppercase tracking-[.2em] text-chalk transition-transform duration-300 group-hover:translate-y-0">
          View piece
          <ArrowUpRight size={13} />
        </span>
      </Link>

      <div className="mt-3.5 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[8px] uppercase tracking-[.22em] text-noir/40">{product.category}</p>
          <Link
            to={`/product/${product.id}`}
            className="mt-1 block truncate text-[13px] font-medium leading-5 hover:underline"
          >
            {product.name}
          </Link>
          {swatches.length > 0 && (
            <div className="mt-2 flex items-center gap-1.5">
              {swatches.map((swatch) => (
                <span
                  key={swatch.name}
                  title={swatch.name}
                  className="h-2.5 w-2.5 border border-black/20"
                  style={{ background: swatch.hex }}
                />
              ))}
              {product.colors.length > swatches.length && (
                <span className="text-[9px] text-noir/40">+{product.colors.length - swatches.length}</span>
              )}
            </div>
          )}
        </div>
        <div className="shrink-0 text-right">
          <p className="text-[12px] font-semibold">{formatNPR(product.price)}</p>
          {product.compareAt && (
            <p className="mt-0.5 text-[10px] text-noir/35 line-through">{formatNPR(product.compareAt)}</p>
          )}
        </div>
      </div>
    </article>
  );
}
