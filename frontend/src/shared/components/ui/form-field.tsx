import * as React from "react";
import { Label } from "@/shared/components/ui/label";
import { cn } from "@/shared/lib/utils";

type FormFieldProps = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  className?: string;
  children: React.ReactNode;
};

/** Label + control + hint/error, shared by each react-hook-form field. */
export function FormField({ id, label, error, hint, optional, className, children }: FormFieldProps) {
  return (
    <div className={cn("min-w-0", className)}>
      <div className="flex items-baseline justify-between gap-2">
        <Label htmlFor={id}>{label}</Label>
        {optional && <span className="text-[9px] uppercase tracking-[.14em] text-black/30">Optional</span>}
      </div>
      <div className="mt-2">{children}</div>
      {error ? (
        <p className="mt-1.5 text-[11px] text-error">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-[10px] leading-4 text-black/35">{hint}</p>
      ) : null}
    </div>
  );
}
