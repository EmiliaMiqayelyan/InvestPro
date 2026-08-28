"use client";

import { cn } from "@/lib/utils";
import { useI18n } from "@/hooks/use-i18n";

export function PlatformLogo({
  className,
  showText = true,
  size = "md",
  theme = "light",
}: {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md";
  theme?: "light" | "dark";
}) {
  const { t } = useI18n();
  const iconSize = size === "sm" ? "h-8 w-8 text-xs" : "h-9 w-9 text-sm";
  const textSize = size === "sm" ? "text-base" : "text-lg";

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "flex shrink-0 items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground shadow-sm",
          iconSize
        )}
        aria-hidden
      >
        IP
      </span>
      {showText && (
        <span
          className={cn(
            "font-display font-semibold tracking-tight",
            textSize,
            theme === "dark" ? "text-white" : "text-foreground"
          )}
        >
          {t("common.platformName")}
        </span>
      )}
    </span>
  );
}
