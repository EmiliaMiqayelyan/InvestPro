import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/i18n/config";

interface LocaleState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: DEFAULT_LOCALE,
      setLocale: (locale) => {
        if (!isLocale(locale)) return;
        set({ locale });
        if (typeof document !== "undefined") {
          document.documentElement.lang = locale;
        }
      },
    }),
    {
      name: "locale-storage",
      partialize: (state) => ({ locale: state.locale }),
      merge: (persisted, current) => {
        const stored = persisted as Partial<LocaleState> | undefined;
        const locale = isLocale(stored?.locale) ? stored.locale : current.locale;
        return { ...current, ...stored, locale };
      },
    }
  )
);
