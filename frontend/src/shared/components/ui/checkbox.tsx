import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer grid h-4 w-4 shrink-0 place-items-center border border-black/30 bg-background transition",
      "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground",
      "data-[state=checked]:border-foreground data-[state=checked]:bg-foreground data-[state=checked]:text-background",
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator asChild>
      <Check size={11} strokeWidth={3} />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = "Checkbox";
