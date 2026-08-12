"use client";

import { cn } from "@/lib/utils";
import { useI18n } from "@/hooks/use-i18n";

export function PlatformLogo({
  className,
  showText = true,
  size = "md",
}: {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md";
}) {
  const { t } = useI18n();
  const iconSize = size === "sm" ? "h-7 w-7 text-xs" : "h-8 w-8 text-sm";
  const textSize = size === "sm" ? "text-lg" : "text-xl";

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "flex shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-teal-800 to-teal-600 font-bold text-white shadow-sm",
          iconSize
        )}
        aria-hidden
      >
        IP
      </span>
      {showText && (
        <span className={cn("font-display font-semibold tracking-tight text-slate-900", textSize)}>
          {t("common.platformName")}
        </span>
      )}
    </span>
  );
}
