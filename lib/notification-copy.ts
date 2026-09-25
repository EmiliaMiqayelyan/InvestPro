import type { TranslationKey } from "@/i18n";
import type { Locale } from "@/i18n/config";
import type { Notification } from "@/types";
import { formatCurrency } from "@/utils/format";

type Translate = (key: TranslationKey | string, params?: Record<string, string | number>) => string;

const TITLE_ALIASES: Record<string, string> = {
  "Platform access is active": "membershipActive",
  "Service fee paid": "membershipPaidAdmin",
  "Welcome, investor": "welcomeInvestor",
  "Welcome, project owner": "welcomeOwner",
  "New account registered": "newAccountAdmin",
  "Project submitted for review": "projectSubmittedOwner",
  "Նոր նախագիծ է սպասում ստուգման": "projectPendingAdmin",
  "A new project is awaiting review": "projectPendingAdmin",
  "Ձեր նախագիծը հաստատվել է": "projectPublishedOwner",
  "Your project was approved": "projectPublishedOwner",
  "New project on the marketplace": "projectPublishedInvestor",
  "Նախագիծը մերժվել է": "projectRejected",
  "Project rejected": "projectRejected",
  "Project funded": "projectFunded",
  "Project closed": "projectClosed",
  "Project archived": "projectArchived",
  "Project removal requested": "projectRemovalRequested",
  "Project removed": "projectRemoved",
  "Cannot remove project": "projectRemoveBlocked",
  "New investment offer": "offerReceived",
  "Offer accepted": "offerAccepted",
  "Offer rejected": "offerRejected",
  "Offer negotiating": "offerNegotiating",
  "Offer pending": "offerNegotiating",
  "Offer cancelled": "offerCancelled",
  "Verification submitted": "kycSubmitted",
  "KYC awaiting review": "kycAwaitingAdmin",
  "New milestone plan": "milestoneCreated",
  "Milestone plan updated": "milestoneUpdated",
  "Contact details removed": "contactBlocked",
  "Flagged chat message": "flaggedChat",
  "New complaint": "newComplaint",
  "Contact form message": "contactForm",
  "Account role updated": "roleChanged",
  "Email verified": "emailVerified",
  "Deposit received": "walletDeposit",
  "Withdrawal requested": "withdrawalCreated",
  "Investment funded": "investmentFunded",
  "Return available": "returnAvailable",
  "New dispute filed": "disputeCreated",
  "KYB submission pending": "kybSubmitted",
  "KYB approved": "kybApproved",
  "KYB rejected": "kybRejected",
  "Your listings are live": "listingsLive",
  "Moderation inbox is live": "moderationInboxLive",
};

function metaString(metadata: Record<string, unknown> | undefined, key: string): string {
  const value = metadata?.[key];
  return typeof value === "string" || typeof value === "number" ? String(value) : "";
}

function offerTemplateFromStatus(status: string): string {
  if (status === "accepted") return "offerAccepted";
  if (status === "rejected") return "offerRejected";
  return "offerNegotiating";
}

function resolveTemplate(item: Notification): string | undefined {
  const metadata = item.metadata || {};
  if (typeof metadata.template === "string" && metadata.template) {
    return metadata.template;
  }
  if (TITLE_ALIASES[item.title]) return TITLE_ALIASES[item.title];
  if (item.title.startsWith("New message")) return "newMessage";
  if (item.title.startsWith("Offer ")) {
    const status = metaString(metadata, "status") || item.title.slice("Offer ".length).trim();
    return offerTemplateFromStatus(status);
  }
  return undefined;
}

function templateParams(
  item: Notification,
  t: Translate,
  locale: Locale
): Record<string, string | number> {
  const metadata = item.metadata || {};
  const amountRaw = metadata.amount;
  const amount =
    typeof amountRaw === "number"
      ? formatCurrency(amountRaw, "USD", locale === "hy" ? "hy-AM" : "en-US")
      : metaString(metadata, "amount");
  const roleRaw = metaString(metadata, "role");
  const roleKey =
    roleRaw === "investor" || roleRaw === "project_owner" || roleRaw === "admin"
      ? `roles.${roleRaw}`
      : "";
  const reasonText = metaString(metadata, "rejectionReason") || metaString(metadata, "reason");
  const statusRaw = metaString(metadata, "status");
  const milestoneKey = statusRaw ? `notifications.milestoneStatus.${statusRaw}` : "";
  const statusLabel = milestoneKey ? t(milestoneKey) : "";
  const status =
    milestoneKey && statusLabel !== milestoneKey ? statusLabel : statusRaw.replace(/_/g, " ");

  let projectTitle = metaString(metadata, "projectTitle");
  if (!projectTitle && item.title.startsWith("New message")) {
    projectTitle = item.title.replace(/^New message\s*[·•\-]\s*/, "").trim();
  }

  let senderName = metaString(metadata, "senderName");
  let preview = metaString(metadata, "preview");
  if ((!senderName || !preview) && item.message.includes(": ")) {
    const colon = item.message.indexOf(": ");
    if (!senderName) senderName = item.message.slice(0, colon);
    if (!preview) preview = item.message.slice(colon + 2);
  }
  if (!preview) preview = t("notifications.templates.newMessage.attachment");

  return {
    amount,
    name: metaString(metadata, "name"),
    email: metaString(metadata, "email"),
    projectTitle,
    investorName: metaString(metadata, "investorName"),
    senderName,
    preview,
    reason: reasonText,
    subject: metaString(metadata, "subject") || item.message,
    role: roleKey ? t(roleKey) : roleRaw.replace(/_/g, " "),
    status,
    investmentCount: metaString(metadata, "investmentCount") || "0",
  };
}

export function getNotificationCopy(
  item: Notification,
  t: Translate,
  locale: Locale
): { title: string; message: string } {
  const template = resolveTemplate(item);

  if (template) {
    const params = templateParams(item, t, locale);
    const titleKey = `notifications.templates.${template}.title`;
    const bodyKey = `notifications.templates.${template}.body`;
    const withReasonKey = `notifications.templates.${template}.bodyWithReason`;
    const title = t(titleKey, params);
    const reason = String(params.reason || "");
    const withReason = reason ? t(withReasonKey, params) : "";
    const message =
      reason && withReason && withReason !== withReasonKey ? withReason : t(bodyKey, params);
    if (title !== titleKey) {
      return { title, message };
    }
  }

  return { title: item.title, message: item.message };
}
