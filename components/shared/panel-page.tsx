"use client";

import { cn } from "@/lib/utils";

type PanelPageProps = {
  children: React.ReactNode;
  className?: string;
  /** Narrow form layouts (settings, KYC, profile). */
  maxWidth?: "default" | "form" | "content";
};

const maxWidthClass = {
  default: undefined,
  form: "mx-auto max-w-2xl",
  content: "mx-auto max-w-3xl",
} as const;

/**
 * Standard panel page chrome. Shell already provides sidebar/header/padding —
 * pages only control vertical rhythm and optional content width.
 */
export function PanelPage({
  children,
  className,
  maxWidth = "default",
}: PanelPageProps) {
  return (
    <div className={cn("space-y-6", maxWidthClass[maxWidth], className)}>
      {children}
    </div>
  );
}
