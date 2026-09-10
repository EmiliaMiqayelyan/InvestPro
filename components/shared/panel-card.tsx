"use client";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

type PanelCardProps = React.HTMLAttributes<HTMLDivElement> & {
  padding?: "none" | "sm" | "md" | "lg";
};

const paddingClass = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
} as const;

/**
 * Standard surface for list rows, form sections, and detail blocks in panels.
 * Prefer this over raw `premium-card` / `bg-white` overrides.
 */
export function PanelCard({
  className,
  padding = "md",
  children,
  ...props
}: PanelCardProps) {
  return (
    <Card className={cn(paddingClass[padding], className)} {...props}>
      {children}
    </Card>
  );
}
