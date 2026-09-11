import { format, formatDistanceToNow, parseISO } from "date-fns";
import { enUS, hy } from "date-fns/locale";
import type { Locale } from "@/i18n/config";

export function formatCurrency(
  amount: number,
  currency = "USD",
  locale = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatCompactCurrency(amount: number): string {
  const abs = Math.abs(amount);
  const trim = (value: number) =>
    value.toFixed(value >= 10 || Number.isInteger(value) ? 0 : 1).replace(/\.0$/, "");

  if (abs >= 1_000_000) return `$${trim(amount / 1_000_000)}M`;
  if (abs >= 1_000) return `$${trim(amount / 1_000)}K`;
  return `$${Math.round(amount)}`;
}

export function formatNumber(num: number, decimals = 2): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

export function formatPercentage(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

export function formatPercent(value: number): string {
  return `${value.toFixed(0)}%`;
}

export function formatDate(date: string | Date, pattern = "MMM dd, yyyy"): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, pattern);
}

export function formatRelativeTime(date: string | Date, locale: Locale = "en"): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return formatDistanceToNow(d, { addSuffix: true, locale: locale === "hy" ? hy : enUS });
}

export function calculateROI(amount: number, roiPercentage: number): number {
  return amount * (roiPercentage / 100);
}

export function calculateProgress(current: number, goal: number): number {
  if (goal <= 0) return 0;
  return Math.min((current / goal) * 100, 100);
}

export function truncateAddress(address: string, start = 6, end = 4): string {
  if (address.length <= start + end) return address;
  return `${address.slice(0, start)}...${address.slice(-end)}`;
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
