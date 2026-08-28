"use client";

import { cn } from "@/lib/utils";

type DecorativeBackgroundProps = {
  children?: React.ReactNode;
  className?: string;
  variant?: "default" | "hero" | "auth" | "subtle";
  showOrbs?: boolean;
};

export function DecorativeBackground({
  children,
  className,
  variant = "default",
  showOrbs = true,
}: DecorativeBackgroundProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden",
        variant === "hero" && "hero-gradient text-white",
        variant === "auth" && "hero-mesh min-h-full",
        variant === "subtle" && "bg-gradient-to-br from-teal-50/50 via-background to-amber-50/30",
        variant === "default" && "bg-background",
        className
      )}
    >
      {showOrbs && variant !== "hero" && (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-teal-700/10 blur-3xl animate-float"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 top-1/3 h-48 w-48 rounded-full bg-brand-gold/10 blur-3xl animate-float"
            style={{ animationDelay: "2s" }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-0 left-1/2 h-32 w-96 -translate-x-1/2 rounded-full bg-emerald-500/5 blur-3xl"
          />
        </>
      )}
      {variant === "hero" && showOrbs && (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-white/5 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-brand-gold/10 blur-3xl animate-float"
          />
          <div
            aria-hidden
            className="absolute inset-0 dot-pattern opacity-20"
          />
        </>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
