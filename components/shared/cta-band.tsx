"use client";

import { cn } from "@/lib/utils";

type CtaBandProps = {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  align?: "center" | "start";
};

export function CtaBand({
  title,
  description,
  children,
  className,
  align = "center",
}: CtaBandProps) {
  return (
    <section
      className={cn(
        "relative flex min-h-[260px] items-center overflow-hidden cta-gradient sm:min-h-[300px]",
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
        className="pointer-events-none absolute left-6 top-6 h-16 w-16 border-l border-t border-white/20 sm:left-10 sm:top-10 sm:h-20 sm:w-20"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-6 right-6 h-16 w-16 border-b border-r border-white/20 sm:bottom-10 sm:right-10 sm:h-20 sm:w-20"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-px w-24 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/35 to-transparent sm:w-32"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 h-px w-40 -translate-x-1/2 bg-gradient-to-r from-transparent via-emerald-300/40 to-transparent sm:w-56"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-[12%] top-1/2 hidden h-28 w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-white/15 to-transparent lg:block"
        aria-hidden
      />

      <div
        className={cn(
          "on-image relative container-wide section-pad py-14 sm:py-16",
          align === "center" && "text-center"
        )}
      >
        <h2
          className={cn(
            "copy-wide font-display text-2xl font-semibold text-white sm:text-3xl",
            align === "center" && "mx-auto"
          )}
        >
          {title}
        </h2>
        {description && (
          <p
            className={cn(
              "copy-measure mt-3 text-white/80",
              align === "center" && "mx-auto"
            )}
          >
            {description}
          </p>
        )}
        {children && (
          <div
            className={cn(
              "mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap",
              align === "center" && "items-stretch justify-center sm:items-center"
            )}
          >
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
