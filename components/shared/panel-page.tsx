"use client";

import { cn } from "@/lib/utils";

type PanelPageProps = {
  children: React.ReactNode;
  className?: string;
  maxWidth?: "default" | "form" | "content";
};

const maxWidthClass = {
  default: undefined,
  form: "mx-auto max-w-2xl",
  content: "mx-auto max-w-3xl",
} as const;

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
