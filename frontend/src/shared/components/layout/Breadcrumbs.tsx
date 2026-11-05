import { Link } from "react-router-dom";
import { cn } from "@/shared/lib/utils";

export type Crumb = { label: string; to?: string };

export function Breadcrumbs({
  items,
  invert = false,
  className,
}: {
  items: Crumb[];
  invert?: boolean;
  className?: string;
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "flex flex-wrap items-center gap-x-2 gap-y-1 text-[9px] font-medium uppercase tracking-[.22em]",
        invert ? "text-chalk/45" : "text-black/40",
        className,
      )}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={`${item.label}-${index}`} className="flex items-center gap-x-2">
            {item.to && !isLast ? (
              <Link to={item.to} className={cn("transition", invert ? "hover:text-chalk" : "hover:text-black")}>
                {item.label}
              </Link>
            ) : (
              <span
                aria-current={isLast ? "page" : undefined}
                className={isLast ? (invert ? "text-chalk/75" : "text-black/70") : undefined}
              >
                {item.label}
              </span>
            )}
            {!isLast && <span aria-hidden="true">/</span>}
          </span>
        );
      })}
    </nav>
  );
}
