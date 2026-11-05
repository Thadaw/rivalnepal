import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/utils";

const alertVariants = cva("flex items-start gap-2 border px-3 py-2.5 text-[11px] leading-5", {
  variants: {
    variant: {
      default: "border-border bg-muted text-foreground",
      destructive: "border-error/30 bg-error-light text-error",
      success: "border-success/30 bg-success-light text-success",
      warning: "border-warning/30 bg-warning-light text-warning",
    },
  },
  defaultVariants: { variant: "default" },
});

export function Alert({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>) {
  return <div role="alert" className={cn(alertVariants({ variant }), className)} {...props} />;
}

export function AlertTitle({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("font-semibold", className)} {...props} />;
}
