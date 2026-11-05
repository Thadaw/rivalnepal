import * as React from "react";
import { cn } from "@/shared/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-none border border-border bg-background px-3 py-2 text-sm text-foreground transition-colors",
        "placeholder:text-muted-foreground/60 focus-visible:border-foreground focus-visible:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-error",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
