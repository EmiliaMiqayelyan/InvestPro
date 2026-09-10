import type { Locale } from "@/i18n/config";
import { translate, type TranslationKey } from "@/i18n";
import type { Project, TeamMember, ProjectUpdate, ProjectPhase } from "@/types";

type LocalizedProjectField =
  | "title"
  | "description"
  | "fullDescription"
  | "category"
  | "industry"
  | "location"
  | "timeline"
  | "revenueModel"
  | "financialProjections"
  | "investmentPlan"
  | "businessModel";

const HY_FIELD: Record<LocalizedProjectField, keyof Project> = {
  title: "titleHy",
  description: "descriptionHy",
  fullDescription: "fullDescriptionHy",
  category: "categoryHy",
  industry: "industryHy",
  location: "locationHy",
  timeline: "timelineHy",
  revenueModel: "revenueModelHy",
  financialProjections: "financialProjectionsHy",
  investmentPlan: "investmentPlanHy",
  businessModel: "businessModelHy",
};

export function projectText(
  project: Project | null | undefined,
  field: LocalizedProjectField,
  locale: Locale
): string {
  if (!project) return "";
  if (locale === "hy") {
    const hy = project[HY_FIELD[field]];
    if (typeof hy === "string" && hy.trim()) return hy;
  }
  const value = project[field];
  return typeof value === "string" ? value : "";
}

export function phaseText(
  phase: ProjectPhase,
  field: "title" | "description",
  locale: Locale
): string {
  if (locale === "hy") {
    const hy = field === "title" ? phase.titleHy : phase.descriptionHy;
    if (typeof hy === "string" && hy.trim()) return hy;
  }
  return phase[field] || "";
}

export function teamMemberText(
  member: TeamMember,
  field: "position" | "experience" | "biography",
  locale: Locale
): string {
  if (locale === "hy") {
    const key = `${field}Hy` as keyof TeamMember;
    const hy = member[key];
    if (typeof hy === "string" && hy.trim()) return hy;
  }
  return member[field] || "";
}

export function updateText(
  update: ProjectUpdate,
  field: "title" | "content",
  locale: Locale
): string {
  if (locale === "hy") {
    const key = `${field}Hy` as keyof ProjectUpdate;
    const hy = update[key];
    if (typeof hy === "string" && hy.trim()) return hy;
  }
  return update[field] || "";
}

export function categoryLabel(locale: Locale, value: string): string {
  return translate(locale, `projects.categories.${value}` as TranslationKey) || value;
}

export function industryLabel(locale: Locale, value: string): string {
  return translate(locale, `projects.industries.${value}` as TranslationKey) || value;
}

export function stageLabel(locale: Locale, value: string): string {
  return translate(locale, `projects.stages.${value}` as TranslationKey) || value;
}

export function docCategoryLabel(locale: Locale, value: string): string {
  return translate(locale, `projects.docCategories.${value}` as TranslationKey) || value;
}

export function teamRoleLabel(locale: Locale, value: string): string {
  return translate(locale, `projects.teamRoles.${value}` as TranslationKey) || value;
}
