"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type QuickActionCardProps = {
  href: string;
  label: string;
  icon: LucideIcon;
  description?: string;
  className?: string;
  linkLabel?: string;
};

export function QuickActionCard({
  href,
  label,
  icon: Icon,
  description,
  className,
  linkLabel = "Open",
}: QuickActionCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "surface-card-hover group flex flex-col p-5 transition duration-200",
        className
      )}
    >
      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </div>
      <p className="font-medium text-foreground">{label}</p>
      {description && (
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
      )}
      <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary">
        {linkLabel}
        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
