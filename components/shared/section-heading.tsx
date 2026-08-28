"use client";

import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "space-y-3",
        align === "center" && "mx-auto max-w-2xl text-center",
        className
      )}
    >
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
        {title}
      </h2>
      {description && (
        <p className="max-w-2xl text-muted-foreground leading-relaxed">{description}</p>
      )}
    </div>
  );
}
