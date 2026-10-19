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
  const height = size === "sm" ? 40 : 48;
  const width = Math.round(height * (907 / 567));

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Image
        src={theme === "dark" ? "/brand/logo-dark.png" : "/brand/logo.png"}
        alt={t("common.platformName")}
        width={width}
        height={height}
        className="w-auto shrink-0"
        style={{ width: "auto", height }}
        priority
      />
      {showText && (
        <span className="sr-only">{t("common.platformName")}</span>
      )}
    </span>
  );
}
