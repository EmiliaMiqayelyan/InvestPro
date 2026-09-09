"use client";

import { ThematicImage } from "./thematic-image";
import { cn } from "@/lib/utils";

type ImageSplitSectionProps = {
  imageSrc: string;
  imageAlt: string;
  imagePosition?: "left" | "right";
  children: React.ReactNode;
  className?: string;
  imageAspect?: "video" | "square" | "portrait" | "compact";
  bordered?: boolean;
  compact?: boolean;
};

export function ImageSplitSection({
  imageSrc,
  imageAlt,
  imagePosition = "right",
  children,
  className,
  imageAspect = "compact",
  bordered = false,
  compact = false,
}: ImageSplitSectionProps) {
  const aspectMap = {
    video: "aspect-video min-h-[200px]",
    square: "aspect-square min-h-[240px] max-h-[360px]",
    portrait: "aspect-[4/5] min-h-[300px] max-h-[440px] lg:min-h-[360px]",
    compact: "aspect-[4/3] min-h-[260px] sm:min-h-[300px]",
  };

  const image = (
    <ThematicImage
      src={imageSrc}
      alt={imageAlt}
      aspect="auto"
      overlay="none"
      className={cn("w-full shadow-soft", aspectMap[imageAspect])}
      sizes="(max-width:1024px) 100vw, 40vw"
    />
  );

  return (
    <section className={cn(bordered && "border-y border-border", className)}>
      <div
        className={cn(
          "container-wide section-pad",
          compact ? "py-12 lg:py-16" : "py-14 lg:py-20"
        )}
      >
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          {imagePosition === "left" ? (
            <>
              <div className="order-1">{image}</div>
              <div className="order-2">{children}</div>
            </>
          ) : (
            <>
              <div className="order-2 lg:order-1">{children}</div>
              <div className="order-1 lg:order-2">{image}</div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
