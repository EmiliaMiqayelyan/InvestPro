"use client";

import { cn } from "@/lib/utils";

type PageHeroBannerProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  height?: "md" | "lg" | "full";
};

/**
 * Marketing page hero — color gradient only (no background photography).
 * Prefer putting CTAs in the page body (not as children) when they need
 * default button contrast outside the dark band.
 */
export function PageHeroBanner({
  eyebrow,
  title,
  description,
  children,
  className,
  height = "lg",
}: PageHeroBannerProps) {
  const heights = {
    md: "min-h-[200px] sm:min-h-[240px]",
    lg: "min-h-[240px] sm:min-h-[280px]",
    full: "min-h-[300px] sm:min-h-[360px]",
  };

  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-border cta-gradient",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 dot-pattern opacity-[0.18]" aria-hidden />
      <div
        className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/[0.06] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-28 -left-16 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl"
        aria-hidden
      />
      <div
        className={cn(
          "on-image relative container-wide section-pad flex flex-col justify-end py-10 sm:py-12",
          heights[height]
        )}
      >
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
            {eyebrow}
          </p>
        )}
        <h1 className="copy-wide mt-2 font-display text-3xl font-semibold leading-tight text-white sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="copy-measure mt-3 text-base leading-relaxed text-white/80">{description}</p>
        )}
        {children && (
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">{children}</div>
        )}
      </div>
    </section>
  );
}
