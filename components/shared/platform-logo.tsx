"use client";

import Image from "next/image";
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
  const iconSize = size === "sm" ? 32 : 36;
  const textSize = size === "sm" ? "text-base" : "text-lg";

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Image
        src="/brand/logo.png"
        alt=""
        width={iconSize}
        height={iconSize}
        className="shrink-0 rounded-lg shadow-sm"
        aria-hidden
        priority
      />
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
