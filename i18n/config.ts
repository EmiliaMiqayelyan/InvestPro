export type Locale = "en" | "hy";

export const LOCALES: { code: Locale; label: string; nativeLabel: string }[] = [
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "hy", label: "Armenian", nativeLabel: "Հայերեն" },
];

export const DEFAULT_LOCALE: Locale = "hy";

export type Messages = typeof import("./locales/en").en;

export function isLocale(value: unknown): value is Locale {
  return value === "en" || value === "hy";
}
