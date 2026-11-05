import * as React from "react";
import { cn } from "@/shared/lib/utils";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-20 w-full rounded-none border border-border bg-background px-3 py-2.5 text-sm text-foreground",
        "placeholder:text-muted-foreground/60 focus-visible:border-foreground focus-visible:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-error",
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";
