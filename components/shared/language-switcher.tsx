"use client";

import { LOCALES, type Locale } from "@/i18n/config";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  className?: string;
  compact?: boolean;
}

export function LanguageSwitcher({ className, compact }: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useI18n();

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-white p-0.5 shadow-sm",
        className
      )}
      role="group"
      aria-label={t("common.language")}
    >
      {LOCALES.map((item) => (
        <button
          key={item.code}
          type="button"
          onClick={() => setLocale(item.code as Locale)}
          className={cn(
            "rounded-full px-2.5 py-1 text-xs font-semibold transition",
            locale === item.code
              ? "bg-teal-800 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          )}
        >
          {compact ? (item.code === "en" ? "EN" : "ՀԱՅ") : item.nativeLabel}
        </button>
      ))}
    </div>
  );
}
