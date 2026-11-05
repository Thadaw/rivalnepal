import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

export function PageContainer({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <div id={id} className={cn("page-container", className)}>
      {children}
    </div>
  );
}
