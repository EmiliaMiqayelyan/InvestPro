import { v4 as uuidv4 } from "uuid";
import type {
  ChatMessage,
  Complaint,
  Conversation,
  InvestmentOffer,
  MilestonePlan,
  Notification,
  NotificationPriority,
  NotificationType,
  Project,
  ProjectStatus,
  UserRole,
} from "../../shared/types";
import { NotificationModel, UserModel } from "../../shared/database/associations";
import { toNotification } from "../../shared/utils/mappers";
import { sendEmail } from "../../shared/integrations/email";
import { publishNotification } from "./hub";
import { ROUTES } from "../../shared/utils/routes";

export type NotificationDraft = {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  href?: string;
  priority?: NotificationPriority;
  email?: boolean;
  metadata?: Record<string, unknown>;
};

export type NotificationEvent =
  | {
      kind: "user_registered";
      userId: string;
      role: UserRole;
      name: string;
      email: string;
    }
  | { kind: "offer_created"; offer: InvestmentOffer }
  | { kind: "offer_updated"; offer: InvestmentOffer }
  | { kind: "message_sent"; conversation: Conversation; message: ChatMessage }
  | { kind: "membership_activated"; userId: string; amount: number }
  | { kind: "kyc_submitted"; userId: string; name: string }
  | { kind: "project_created"; project: Project }
  | {
      kind: "project_status_changed";
      project: Project;
      status: ProjectStatus;
      rejectionReason?: string;
    }
  | { kind: "milestone_created"; plan: MilestonePlan }
  | { kind: "milestone_updated"; plan: MilestonePlan; actorId: string }
  | {
      kind: "contact_blocked";
      conversation: Conversation;
      senderId: string;
      senderName: string;
    }
  | { kind: "complaint_filed"; complaint: Complaint }
  | { kind: "contact_form"; name: string; email: string }
  | { kind: "role_changed"; userId: string; role: UserRole }
  | { kind: "email_verified"; userId: string }
  | { kind: "wallet_deposit"; userId: string; amount: number }
  | { kind: "withdrawal_created"; userId: string; amount: number; withdrawalId: string }
  | { kind: "investment_funded"; userId: string; investmentId: string; amount: number; projectId: string }
  | { kind: "return_available"; userId: string; amount: number; investmentId: string }
  | { kind: "dispute_created"; disputeId: string; reporterId: string; subject: string }
  | { kind: "kyb_submitted"; userId: string; name: string }
  | { kind: "kyb_approved"; userId: string }
  | { kind: "kyb_rejected"; userId: string; rejectionReason?: string };

const MAX_NOTIFICATIONS_PER_USER = 100;
const MAX_EMAIL_BODY = 280;

function money(amount: number) {
  return `$${amount.toLocaleString()}`;
}

export async function listUserIdsByRole(role: UserRole): Promise<string[]> {
  const users = await UserModel.findAll({ where: { role }, attributes: ["id"] });
  return users.map((u) => u.id);
}

export async function listNotifications(userId: string): Promise<Notification[]> {
  const rows = await NotificationModel.findAll({
    where: { userId },
    order: [["createdAt", "DESC"]],
    limit: MAX_NOTIFICATIONS_PER_USER,
  });
  return rows.map(toNotification);
}

export async function getUnreadNotificationCount(userId: string): Promise<number> {
  return NotificationModel.count({ where: { userId, isRead: false } });
}

export async function appendNotification(draft: NotificationDraft): Promise<Notification> {
  const row = await NotificationModel.create({
    id: uuidv4(),
    userId: draft.userId,
    type: draft.type,
    title: draft.title,
    message: draft.message,
    isRead: false,
    href: draft.href ?? null,
    priority: draft.priority ?? "normal",
    metadata: draft.metadata ?? null,
  });

  // Trim old notifications
  const extras = await NotificationModel.findAll({
    where: { userId: draft.userId },
    order: [["createdAt", "DESC"]],
    offset: MAX_NOTIFICATIONS_PER_USER,
  });
  if (extras.length) {
    await NotificationModel.destroy({ where: { id: extras.map((e) => e.id) } });
  }

  const notification = toNotification(row);
  const unreadCount = await getUnreadNotificationCount(draft.userId);
  publishNotification(draft.userId, "notification", { notification, unreadCount });

  if (draft.email) {
    void sendInAppEmail(draft);
  }
  return notification;
}

async function sendInAppEmail(draft: NotificationDraft) {
  const user = await UserModel.findByPk(draft.userId);
  if (!user?.email) return;
  await sendEmail({
    to: user.email,
    subject: `InvestPro — ${draft.title}`,
    text: draft.message.slice(0, MAX_EMAIL_BODY),
  });
}

export function hrefForRole(
  role: UserRole,
  type: NotificationType,
  meta?: Record<string, unknown>
): string {
  const projectId = typeof meta?.projectId === "string" ? meta.projectId : undefined;

  if (role === "investor") {
    switch (type) {
      case "offer_received":
      case "offer_updated":
        return ROUTES.INVESTOR_INVESTMENTS;
      case "message":
        return ROUTES.INVESTOR_MESSAGES;
      case "membership":
        return ROUTES.INVESTOR_MEMBERSHIP;
      case "kyc_update":
        return ROUTES.INVESTOR_KYC;
      case "milestone_update":
        return ROUTES.INVESTOR_MILESTONES;
      case "project_update":
        return projectId ? `${ROUTES.INVESTOR_PROJECTS}/${projectId}` : ROUTES.INVESTOR_PROJECTS;
      case "security_alert":
        return ROUTES.INVESTOR_SECURITY;
      default:
        return ROUTES.INVESTOR_DASHBOARD;
    }
  }

  if (role === "project_owner") {
    switch (type) {
      case "offer_received":
      case "offer_updated":
        return ROUTES.OWNER_OFFERS;
      case "message":
        return ROUTES.OWNER_MESSAGES;
      case "milestone_update":
        return ROUTES.OWNER_MILESTONES;
      case "project_update":
        return ROUTES.OWNER_PROJECTS;
      case "security_alert":
        return ROUTES.OWNER_MESSAGES;
      default:
        return ROUTES.OWNER_DASHBOARD;
    }
  }

  switch (type) {
    case "project_update":
      return projectId ? `${ROUTES.ADMIN_PROJECTS}/${projectId}/review` : ROUTES.ADMIN_PROJECTS;
    case "kyc_update":
    case "security_alert":
      return ROUTES.ADMIN_SECURITY;
    case "membership":
      return ROUTES.ADMIN_PAYMENTS;
    case "complaint":
      return ROUTES.ADMIN_COMPLAINTS;
    case "user_update":
      return ROUTES.ADMIN_USERS;
    default:
      return ROUTES.ADMIN_DASHBOARD;
  }
}

async function draftsForEvent(event: NotificationEvent): Promise<NotificationDraft[]> {
  switch (event.kind) {
    case "user_registered": {
      const home =
        event.role === "project_owner" ? ROUTES.OWNER_DASHBOARD : ROUTES.INVESTOR_DASHBOARD;
      const welcome: NotificationDraft = {
        userId: event.userId,
        type: "general",
        title: event.role === "project_owner" ? "Welcome, project owner" : "Welcome, investor",
        message:
          event.role === "project_owner"
            ? "Create your first project and submit it for review. Investors will see it once it is published."
            : "Browse the marketplace, unlock full diligence with the service fee, then message owners and send offers.",
        href: home,
        metadata: { role: event.role },
      };
      const admins = await listUserIdsByRole("admin");
      return [
        welcome,
        ...admins.map((userId) => ({
          userId,
          type: "user_update" as const,
          title: "New account registered",
          message: `${event.name} joined as ${event.role.replace("_", " ")} (${event.email}).`,
          href: hrefForRole("admin", "user_update"),
          metadata: { userId: event.userId, role: event.role },
        })),
      ];
    }
    case "offer_created": {
      const { offer } = event;
      return [
        {
          userId: offer.ownerId,
          type: "offer_received",
          title: "New investment offer",
          message: `${offer.investorName} offered ${money(offer.amount)} on ${offer.projectTitle}.`,
          href: hrefForRole("project_owner", "offer_received", { projectId: offer.projectId }),
          priority: "high",
          email: true,
          metadata: { offerId: offer.id, projectId: offer.projectId, investorId: offer.investorId },
        },
      ];
    }
    case "offer_updated": {
      const { offer } = event;
      const verb =
        offer.status === "accepted"
          ? "accepted"
          : offer.status === "rejected"
            ? "declined"
            : "opened negotiation on";
      const followUp =
        offer.status === "accepted"
          ? "The amount is now tracked in your investments."
          : offer.status === "rejected"
            ? "You can browse other projects or send a revised offer."
            : "Reply on-platform to agree terms.";
      return [
        {
          userId: offer.investorId,
          type: "offer_updated",
          title: `Offer ${offer.status}`,
          message: `The owner ${verb} your ${money(offer.amount)} offer for ${offer.projectTitle}. ${followUp}`,
          href: hrefForRole("investor", "offer_updated", { projectId: offer.projectId }),
          priority: "high",
          email: true,
          metadata: { offerId: offer.id, projectId: offer.projectId, status: offer.status },
        },
      ];
    }
    case "message_sent": {
      const recipientId =
        event.message.senderId === event.conversation.investorId
          ? event.conversation.ownerId
          : event.conversation.investorId;
      const recipientRole: UserRole =
        recipientId === event.conversation.ownerId ? "project_owner" : "investor";
      const preview = event.message.content.slice(0, 90) || "Sent an attachment";
      return [
        {
          userId: recipientId,
          type: "message",
          title: `New message · ${event.conversation.projectTitle}`,
          message: `${event.message.senderName}: ${preview}`,
          href: hrefForRole(recipientRole, "message", {
            conversationId: event.conversation.id,
            projectId: event.conversation.projectId,
          }),
          metadata: {
            conversationId: event.conversation.id,
            projectId: event.conversation.projectId,
            senderId: event.message.senderId,
          },
        },
      ];
    }
    case "membership_activated": {
      const admins = await listUserIdsByRole("admin");
      return [
        {
          userId: event.userId,
          type: "membership",
          title: "Platform access is active",
          message:
            "Full data rooms, messaging, offers, and milestone planning are unlocked. This is a platform fee, not investment capital.",
          href: hrefForRole("investor", "membership"),
          priority: "high",
          metadata: { amount: event.amount },
        },
        ...admins.map((userId) => ({
          userId,
          type: "membership" as const,
          title: "Service fee paid",
          message: `An investor activated platform access (${money(event.amount)}).`,
          href: hrefForRole("admin", "membership"),
          metadata: { payerId: event.userId, amount: event.amount },
        })),
      ];
    }
    case "kyc_submitted": {
      const admins = await listUserIdsByRole("admin");
      return [
        {
          userId: event.userId,
          type: "kyc_update",
          title: "Verification submitted",
          message: "Your KYC documents are in review. We will notify you when the status changes.",
          href: hrefForRole("investor", "kyc_update"),
          metadata: { status: "pending" },
        },
        ...admins.map((userId) => ({
          userId,
          type: "kyc_update" as const,
          title: "KYC awaiting review",
          message: `${event.name} submitted identity documents.`,
          href: hrefForRole("admin", "kyc_update"),
          priority: "high" as const,
          metadata: { userId: event.userId },
        })),
      ];
    }
    case "project_created": {
      const { project } = event;
      const admins = await listUserIdsByRole("admin");
      return [
        {
          userId: project.ownerId,
          type: "project_update",
          title: "Project submitted for review",
          message: `“${project.title}” is in the review queue. Investors will see it after it is published.`,
          href: hrefForRole("project_owner", "project_update", { projectId: project.id }),
          metadata: { projectId: project.id, status: project.status },
        },
        ...admins.map((userId) => ({
          userId,
          type: "project_update" as const,
          title: "Նոր նախագիծ է սպասում ստուգման",
          message: `«${project.title}» նախագիծը ուղարկվել է հաստատման։`,
          href: hrefForRole("admin", "project_update", { projectId: project.id }),
          priority: "high" as const,
          metadata: { projectId: project.id },
        })),
      ];
    }
    case "project_status_changed": {
      const { project, status, rejectionReason } = event;
      const drafts: NotificationDraft[] = [];
      if (status === "published") {
        drafts.push({
          userId: project.ownerId,
          type: "project_update",
          title: "Ձեր նախագիծը հաստատվել է",
          message: `Ձեր «${project.title}» նախագիծը հաջողությամբ անցել է ստուգումը և այժմ հասանելի է հարթակում։`,
          href: hrefForRole("project_owner", "project_update", { projectId: project.id }),
          priority: "high",
          email: true,
          metadata: { projectId: project.id, status },
        });
        const investors = await listUserIdsByRole("investor");
        for (const investorId of investors) {
          drafts.push({
            userId: investorId,
            type: "project_update",
            title: "New project on the marketplace",
            message: `“${project.title}” was just published. Open it to review the opportunity.`,
            href: hrefForRole("investor", "project_update", { projectId: project.id }),
            metadata: { projectId: project.id, status },
          });
        }
      } else if (status === "rejected") {
        const reasonText = rejectionReason || project.rejectionReason || "";
        drafts.push({
          userId: project.ownerId,
          type: "project_update",
          title: "Նախագիծը մերժվել է",
          message: reasonText
            ? `«${project.title}» նախագիծը մերժվել է։ Պատճառ՝ ${reasonText.slice(0, 160)}`
            : `«${project.title}» նախագիծը այս պահին չի հաստատվել։ Ստուգեք հաղորդագրությունները և կրկին ուղարկեք։`,
          href: ROUTES.OWNER_MESSAGES,
          priority: "high",
          email: true,
          metadata: { projectId: project.id, status, rejectionReason: reasonText },
        });
      } else if (status === "funded") {
        drafts.push({
          userId: project.ownerId,
          type: "project_update",
          title: "Project funded",
          message: `“${project.title}” reached its funding goal.`,
          href: hrefForRole("project_owner", "project_update", { projectId: project.id }),
          priority: "high",
          email: true,
          metadata: { projectId: project.id, status },
        });
      } else if (status === "closed") {
        drafts.push({
          userId: project.ownerId,
          type: "project_update",
          title: "Project closed",
          message: `“${project.title}” is no longer open for new offers.`,
          href: hrefForRole("project_owner", "project_update", { projectId: project.id }),
          metadata: { projectId: project.id, status },
        });
      } else if (status === "pending_review") {
        const admins = await listUserIdsByRole("admin");
        drafts.push(
          ...admins.map((userId) => ({
            userId,
            type: "project_update" as const,
            title: "Նոր նախագիծ է սպասում ստուգման",
            message: `«${project.title}» նախագիծը ուղարկվել է հաստատման։`,
            href: hrefForRole("admin", "project_update", { projectId: project.id }),
            priority: "high" as const,
            metadata: { projectId: project.id },
          }))
        );
      }
      return drafts;
    }
    case "milestone_created": {
      const { plan } = event;
      return [
        {
          userId: plan.ownerId,
          type: "milestone_update",
          title: "New milestone plan",
          message: `${plan.investorName} proposed milestones for ${plan.projectTitle}.`,
          href: hrefForRole("project_owner", "milestone_update", { projectId: plan.projectId }),
          priority: "high",
          metadata: { planId: plan.id, projectId: plan.projectId },
        },
      ];
    }
    case "milestone_updated": {
      const { plan, actorId } = event;
      const recipientId = actorId === plan.ownerId ? plan.investorId : plan.ownerId;
      const recipientRole: UserRole = recipientId === plan.ownerId ? "project_owner" : "investor";
      return [
        {
          userId: recipientId,
          type: "milestone_update",
          title: "Milestone plan updated",
          message: `The milestone plan for ${plan.projectTitle} is now ${plan.status.replace("_", " ")}.`,
          href: hrefForRole(recipientRole, "milestone_update", { projectId: plan.projectId }),
          metadata: { planId: plan.id, projectId: plan.projectId, status: plan.status },
        },
      ];
    }
    case "contact_blocked": {
      const recipientId =
        event.senderId === event.conversation.investorId
          ? event.conversation.ownerId
          : event.conversation.investorId;
      const senderRole: UserRole =
        event.senderId === event.conversation.investorId ? "investor" : "project_owner";
      const admins = await listUserIdsByRole("admin");
      return [
        {
          userId: event.senderId,
          type: "security_alert",
          title: "Contact details removed",
          message:
            "External contact info was stripped from your message. Keep conversations on-platform.",
          href: hrefForRole(senderRole, "security_alert"),
          metadata: { conversationId: event.conversation.id },
        },
        ...admins.map((userId) => ({
          userId,
          type: "security_alert" as const,
          title: "Flagged chat message",
          message: `${event.senderName} tried to share off-platform contact details on “${event.conversation.projectTitle}”.`,
          href: hrefForRole("admin", "security_alert"),
          priority: "high" as const,
          metadata: {
            conversationId: event.conversation.id,
            senderId: event.senderId,
            recipientId,
          },
        })),
      ];
    }
    case "complaint_filed": {
      const admins = await listUserIdsByRole("admin");
      return admins.map((userId) => ({
        userId,
        type: "complaint" as const,
        title: "New complaint",
        message: event.complaint.subject,
        href: hrefForRole("admin", "complaint"),
        priority: "high" as const,
        metadata: { complaintId: event.complaint.id },
      }));
    }
    case "contact_form": {
      const admins = await listUserIdsByRole("admin");
      return admins.map((userId) => ({
        userId,
        type: "general" as const,
        title: "Contact form message",
        message: `${event.name} (${event.email}) sent a public contact request.`,
        href: hrefForRole("admin", "general"),
        metadata: { email: event.email },
      }));
    }
    case "role_changed": {
      const href =
        event.role === "admin"
          ? ROUTES.ADMIN_DASHBOARD
          : event.role === "project_owner"
            ? ROUTES.OWNER_DASHBOARD
            : ROUTES.INVESTOR_DASHBOARD;
      return [
        {
          userId: event.userId,
          type: "user_update",
          title: "Account role updated",
          message: `Your account role is now ${event.role.replace("_", " ")}. Sign in again if workspace links look stale.`,
          href,
          priority: "high",
          metadata: { role: event.role },
        },
      ];
    }
    case "email_verified":
      return [{
        userId: event.userId,
        type: "general",
        title: "Email verified",
        message: "Your email address has been verified successfully.",
        href: ROUTES.INVESTOR_DASHBOARD,
      }];
    case "wallet_deposit":
      return [{
        userId: event.userId,
        type: "general",
        title: "Deposit received",
        message: `Your wallet was credited with ${money(event.amount)}.`,
        href: ROUTES.INVESTOR_DASHBOARD,
        email: true,
      }];
    case "withdrawal_created":
      return [{
        userId: event.userId,
        type: "general",
        title: "Withdrawal requested",
        message: `Your withdrawal of ${money(event.amount)} is pending approval.`,
        href: ROUTES.INVESTOR_DASHBOARD,
      }];
    case "investment_funded":
      return [{
        userId: event.userId,
        type: "offer_updated",
        title: "Investment funded",
        message: `Your investment of ${money(event.amount)} has been funded successfully.`,
        href: ROUTES.INVESTOR_INVESTMENTS,
        priority: "high",
        email: true,
        metadata: { investmentId: event.investmentId, projectId: event.projectId },
      }];
    case "return_available":
      return [{
        userId: event.userId,
        type: "general",
        title: "Return available",
        message: `A return of ${money(event.amount)} is available for your investment.`,
        href: ROUTES.INVESTOR_INVESTMENTS,
        email: true,
      }];
    case "dispute_created": {
      const admins = await listUserIdsByRole("admin");
      return admins.map((userId) => ({
        userId,
        type: "complaint" as const,
        title: "New dispute filed",
        message: event.subject,
        href: ROUTES.ADMIN_COMPLAINTS,
        priority: "high" as const,
        metadata: { disputeId: event.disputeId },
      }));
    }
    case "kyb_submitted": {
      const admins = await listUserIdsByRole("admin");
      return admins.map((userId) => ({
        userId,
        type: "kyc_update" as const,
        title: "KYB submission pending",
        message: `${event.name} submitted KYB documents for review.`,
        href: ROUTES.ADMIN_SECURITY,
        metadata: { userId: event.userId },
      }));
    }
    case "kyb_approved":
      return [{
        userId: event.userId,
        type: "kyc_update",
        title: "KYB approved",
        message: "Your company verification (KYB) has been approved.",
        href: ROUTES.OWNER_DASHBOARD,
        email: true,
      }];
    case "kyb_rejected":
      return [{
        userId: event.userId,
        type: "kyc_update",
        title: "KYB rejected",
        message: event.rejectionReason || "Your KYB submission was rejected. Please resubmit.",
        href: ROUTES.OWNER_DASHBOARD,
        priority: "high",
      }];
  }
}

export async function dispatchNotificationEvent(event: NotificationEvent): Promise<Notification[]> {
  const drafts = await draftsForEvent(event);
  const results: Notification[] = [];
  for (const draft of drafts) {
    results.push(await appendNotification(draft));
  }
  return results;
}

export async function markNotificationRead(userId: string, id: string): Promise<Notification | null> {
  const row = await NotificationModel.findOne({ where: { id, userId } });
  if (!row) return null;
  row.isRead = true;
  await row.save();
  return toNotification(row);
}

export async function markAllNotificationsRead(userId: string): Promise<number> {
  const [updated] = await NotificationModel.update(
    { isRead: true },
    { where: { userId, isRead: false } }
  );
  return updated;
}
