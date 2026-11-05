import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@/shared/lib/utils";

export const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      "text-[9px] font-semibold uppercase leading-none tracking-[.22em] text-black/50 peer-disabled:opacity-60",
      className,
    )}
    {...props}
  />
));
Label.displayName = "Label";
