"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

type PageHeroBannerProps = {
  imageSrc: string;
  imageAlt: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  height?: "md" | "lg" | "full";
};

export function PageHeroBanner({
  imageSrc,
  imageAlt,
  eyebrow,
  title,
  description,
  children,
  className,
  height = "lg",
}: PageHeroBannerProps) {
  const heights = {
    md: "min-h-[200px] sm:min-h-[240px]",
    lg: "min-h-[260px] sm:min-h-[300px]",
    full: "min-h-[320px] sm:min-h-[380px]",
  };

  return (
    <section className={cn("relative overflow-hidden border-b border-border", className)}>
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        className="object-cover object-center"
        sizes="100vw"
        priority
      />
      <div className="absolute inset-0 overlay-hero" aria-hidden />
      <div
        className={cn(
          "on-image relative container-wide section-pad flex flex-col justify-end py-10 sm:py-12 text-white",
          heights[height]
        )}
      >
        {eyebrow && <p className="eyebrow text-white/70">{eyebrow}</p>}
        <h1 className="mt-2 max-w-2xl font-display text-3xl font-semibold leading-tight text-white sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-3 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
            {description}
          </p>
        )}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  );
}
