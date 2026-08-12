/** Risk analysis & security assistant helpers */

export const DILIGENCE_DISCLAIMER_EN =
  "This report helps investors understand diligence completeness and potential warning signs. It is not financial advice and does not guarantee returns or legality.";

export const DILIGENCE_DISCLAIMER_HY =
  "Այս զեկույցը օգնում է ներդրողներին հասկանալ ստուգման լրիվությունը և հնարավոր զգուշացումները։ Այն ֆինանսական խորհուրդ չէ և չի երաշխավորում եկամուտ կամ իրավականությունը։";

/** Default diligence disclaimer (English). Prefer locale-specific constants when rendering. */
export const DILIGENCE_DISCLAIMER = DILIGENCE_DISCLAIMER_EN;

export function formatRiskLevel(level: string): string {
  return level.replace(/_/g, " ");
}

export { CONTACT_BLOCKED_PATTERNS } from "@/constants";
