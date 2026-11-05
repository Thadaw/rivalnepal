import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/utils";

const buttonVariants = cva(
  "group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none text-[11px] font-semibold uppercase tracking-[.16em] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-current focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        default: "bg-noir text-chalk hover:bg-graphite",
        dark: "bg-noir text-chalk hover:bg-graphite",
        outline: "border border-ink/25 bg-transparent text-ink hover:border-ink hover:bg-ink hover:text-chalk",
        ghost: "text-ink hover:bg-ink/5",
        light: "bg-chalk text-noir hover:bg-white",
      },
      size: {
        default: "h-11 px-6",
        sm: "h-9 px-4 text-[10px]",
        lg: "h-14 px-8 text-[11px]",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />;
  }
);
Button.displayName = "Button";
