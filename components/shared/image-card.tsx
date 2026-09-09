"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ImageCardProps = {
  imageSrc: string;
  imageAlt: string;
  title: string;
  description?: string;
  href?: string;
  ctaLabel?: string;
  className?: string;
  variant?: "default" | "overlay";
};

export function ImageCard({
  imageSrc,
  imageAlt,
  title,
  description,
  href,
  ctaLabel,
  className,
  variant = "default",
}: ImageCardProps) {
  if (variant === "overlay") {
    const content = (
      <article
        className={cn(
          "group relative overflow-hidden rounded-xl border border-border/60 bg-card",
          href && "cursor-pointer",
          className
        )}
      >
        <div className="relative aspect-[16/10] min-h-[220px] sm:min-h-[240px]">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.02]"
            sizes="(max-width:768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 overlay-card" aria-hidden />
          <div className="on-image absolute inset-x-0 bottom-0 flex flex-col gap-3 p-5 text-white sm:p-6">
            <div>
              <h3 className="font-display text-xl font-semibold text-white">{title}</h3>
              {description && (
                <p className="mt-1.5 text-sm leading-relaxed text-white/85 line-clamp-2">
                  {description}
                </p>
              )}
            </div>
            {href && ctaLabel && (
              <span className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-white/90 transition group-hover:text-white">
                {ctaLabel}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            )}
          </div>
        </div>
      </article>
    );

    if (href) {
      return <Link href={href}>{content}</Link>;
    }
    return content;
  }

  return (
    <article className={cn("surface-card-hover overflow-hidden", className)}>
      <div className="relative aspect-[16/10]">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="(max-width:768px) 100vw, 50vw"
        />
      </div>
      <div className="p-5 sm:p-6">
        <h3 className="font-display text-lg font-semibold">{title}</h3>
        {description && (
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
        )}
        {href && ctaLabel && (
          <Button variant="link" className="mt-3 h-auto p-0" asChild>
            <Link href={href}>
              {ctaLabel} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        )}
      </div>
    </article>
  );
}
