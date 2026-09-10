"use client";

import { cn } from "@/lib/utils";
import { Breadcrumbs, type BreadcrumbItem } from "./breadcrumbs";

type PageHeaderProps = {
  /** Kept for a11y / marketing variants. In panel `minimal`, shell header owns the H1. */
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  variant?: "default" | "gradient" | "minimal";
  className?: string;
};

export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  variant = "default",
  className,
}: PageHeaderProps) {
  // Panel pages: WorkspaceShell already renders the page title — avoid duplicate H1.
  if (variant === "minimal") {
    const hasBreadcrumbs = Boolean(breadcrumbs && breadcrumbs.length > 0);
    if (!description && !actions && !hasBreadcrumbs) {
      return null;
    }

    return (
      <div className={cn("space-y-1", className)}>
        {hasBreadcrumbs && (
          <Breadcrumbs items={breadcrumbs!} className="mb-2" />
        )}
        <div className="flex flex-wrap items-end justify-between gap-4">
          {description ? (
            <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          ) : (
            <span className="sr-only">{title}</span>
          )}
          {actions && (
            <div className="flex flex-wrap items-center gap-2">{actions}</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-border/80",
        variant === "gradient"
          ? "hero-gradient text-white shadow-glow"
          : "surface-card",
        className
      )}
    >
      {variant === "gradient" && (
        <div aria-hidden className="absolute inset-0 dot-pattern opacity-10" />
      )}
      <div className="relative p-5 sm:p-6">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumbs
            items={breadcrumbs}
            className={cn(
              "mb-3",
              variant === "gradient" &&
                "[&_a]:text-white/70 [&_a:hover]:text-white [&_span]:text-white/90 [&_svg]:text-white/50"
            )}
          />
        )}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1
              className={cn(
                "font-display text-2xl font-semibold sm:text-3xl",
                variant === "gradient" ? "text-white" : "text-foreground"
              )}
            >
              {title}
            </h1>
            {description && (
              <p
                className={cn(
                  "mt-2 max-w-3xl text-sm leading-relaxed",
                  variant === "gradient" ? "text-white/80" : "text-muted-foreground"
                )}
              >
                {description}
              </p>
            )}
          </div>
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </div>
      </div>
    </div>
  );
}
