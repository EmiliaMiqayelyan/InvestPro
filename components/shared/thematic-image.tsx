"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

type ThematicImageProps = {
  src: string;
  alt: string;
  className?: string;
  /** dark gradient overlay for text-on-image */
  overlay?: "none" | "light" | "dark" | "bottom";
  priority?: boolean;
  sizes?: string;
  aspect?: "video" | "square" | "wide" | "portrait" | "auto";
  fill?: boolean;
};

const aspectClasses = {
  video: "aspect-video",
  square: "aspect-square",
  wide: "aspect-[21/9]",
  portrait: "aspect-[4/5]",
  auto: "",
};

const overlayClasses = {
  none: "",
  light: "bg-white/20",
  dark: "overlay-hero",
  bottom: "overlay-card",
};

export function ThematicImage({
  src,
  alt,
  className,
  overlay = "bottom",
  priority = false,
  sizes = "(max-width:1024px) 100vw, 50vw",
  aspect = "video",
  fill = false,
}: ThematicImageProps) {
  if (fill) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        <Image src={src} alt={alt} fill className="object-cover" sizes={sizes} priority={priority} />
        {overlay !== "none" && (
          <div className={cn("absolute inset-0", overlayClasses[overlay])} aria-hidden />
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl",
        aspect !== "auto" && aspectClasses[aspect],
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes={sizes}
        priority={priority}
      />
      {overlay !== "none" && (
        <div className={cn("absolute inset-0", overlayClasses[overlay])} aria-hidden />
      )}
    </div>
  );
}
