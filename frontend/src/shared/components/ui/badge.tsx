import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-none border px-2 py-1 text-[9px] font-semibold uppercase leading-none tracking-[.12em]",
  {
    variants: {
      variant: {
        default: "border-transparent bg-noir text-chalk",
        outline: "border-black/20 text-black/60",
        muted: "border-transparent bg-ash text-black/60",
        success: "border-transparent bg-success-light text-success",
        warning: "border-transparent bg-warning-light text-warning",
        destructive: "border-transparent bg-error-light text-error",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { badgeVariants };
