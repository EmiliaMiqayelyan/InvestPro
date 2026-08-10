import { DEFAULT_LOCALE, type Locale } from "./config";
import { en } from "./locales/en";
import { hy } from "./locales/hy";

const dictionaries = { en, hy } as const;

type Dict = typeof en;

type Join<K, P> = K extends string | number
  ? P extends string | number
    ? `${K}${"" extends P ? "" : "."}${P}`
    : never
  : never;

type Leaves<T, D extends number = 5> = [D] extends [never]
  ? never
  : T extends object
    ? {
        [K in keyof T]-?: Join<K & string, Leaves<T[K], Prev[D]>>;
      }[keyof T]
    : "";

type Prev = [never, 0, 1, 2, 3, 4, 5];

export type TranslationKey = Leaves<Dict>;

function getByPath(obj: Record<string, unknown>, path: string): string | undefined {
  const parts = path.split(".");
  let cur: unknown = obj;
  for (const part of parts) {
    if (cur == null || typeof cur !== "object") return undefined;
    cur = (cur as Record<string, unknown>)[part];
  }
  return typeof cur === "string" ? cur : undefined;
}

export function translate(
  locale: Locale,
  key: TranslationKey | string,
  params?: Record<string, string | number>
): string {
  const dict = dictionaries[locale] || dictionaries[DEFAULT_LOCALE];
  let text =
    getByPath(dict as unknown as Record<string, unknown>, key) ??
    getByPath(dictionaries.en as unknown as Record<string, unknown>, key) ??
    key;

  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
    }
  }
  return text;
}

export function getDictionary(locale: Locale) {
  return dictionaries[locale] || dictionaries.en;
}

export { en, hy };
