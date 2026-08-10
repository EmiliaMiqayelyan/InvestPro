"use client";

import { useEffect } from "react";
import { useLocaleStore } from "@/store/locale-store";

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const locale = useLocaleStore((s) => s.locale);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = locale;
    root.dataset.locale = locale;
    root.classList.toggle("locale-hy", locale === "hy");
    root.classList.toggle("locale-en", locale === "en");
  }, [locale]);

  return <>{children}</>;
}
