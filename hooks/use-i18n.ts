"use client";

import { useCallback, useMemo } from "react";
import { useLocaleStore } from "@/store/locale-store";
import { translate, type TranslationKey } from "@/i18n";
import type { Locale } from "@/i18n/config";

export function useI18n() {
  const locale = useLocaleStore((s) => s.locale);
  const setLocale = useLocaleStore((s) => s.setLocale);

  const t = useCallback(
    (key: TranslationKey | string, params?: Record<string, string | number>) =>
      translate(locale, key, params),
    [locale]
  );

  return useMemo(
    () => ({
      locale,
      setLocale,
      t,
      isHy: locale === "hy",
      isEn: locale === "en",
    }),
    [locale, setLocale, t]
  );
}

export function useLocale(): Locale {
  return useLocaleStore((s) => s.locale);
}
