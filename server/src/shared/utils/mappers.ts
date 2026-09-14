import type { User, Project, MembershipSubscription, InvestmentOffer, Conversation, ChatMessage, Notification, KycSubmission, MilestonePlan, InvestorInvestment, Complaint, ActivityLog } from "../types";
import { normalizeMembershipTier } from "./rbac";
import type { UserModel, ProjectModel, SubscriptionModel, OfferModel, ConversationModel, MessageModel, NotificationModel, KycSubmissionModel, MilestonePlanModel, InvestmentModel, ComplaintModel, ActivityLogModel } from "../database/associations";

function iso(d: Date | string | null | undefined): string | undefined {
  if (!d) return undefined;
  return d instanceof Date ? d.toISOString() : String(d);
}

/** Normalize JSON columns that may arrive as arrays, objects, or double-encoded strings. */
export function asArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value) as unknown;
      return Array.isArray(parsed) ? (parsed as T[]) : [];
    } catch {
      return [];
    }
  }
  return [];
}

export function toUser(row: UserModel): User {
  return {
    id: row.id,
    email: row.email,
    firstName: row.firstName,
    lastName: row.lastName,
    avatar: row.avatar ?? undefined,
    phone: row.phone ?? undefined,
    role: row.role,
    membershipTier: normalizeMembershipTier(row.membershipTier),
    membershipExpiresAt: iso(row.membershipExpiresAt),
    isEmailVerified: row.isEmailVerified,
    is2faEnabled: row.is2faEnabled,
    kycStatus: row.kycStatus,
    companyName: row.companyName ?? undefined,
    bio: row.bio ?? undefined,
    createdAt: iso(row.createdAt)!,
    updatedAt: iso(row.updatedAt)!,
  };
}

export function toProject(row: ProjectModel): Project {
  return {
    id: row.id,
    ownerId: row.ownerId,
    ownerName: row.ownerName ?? undefined,
    ownerKycStatus: row.ownerKycStatus ?? undefined,
    title: row.title,
    titleHy: row.titleHy ?? undefined,
    slug: row.slug,
    description: row.description,
    descriptionHy: row.descriptionHy ?? undefined,
    fullDescription: row.fullDescription,
    fullDescriptionHy: row.fullDescriptionHy ?? undefined,
    category: row.category,
    categoryHy: row.categoryHy ?? undefined,
    industry: row.industry,
    industryHy: row.industryHy ?? undefined,
    location: row.location,
    locationHy: row.locationHy ?? undefined,
    stage: row.stage,
    timeline: row.timeline,
    timelineHy: row.timelineHy ?? undefined,
    image: row.image,
    requiredInvestment: row.requiredInvestment,
    minInvestment: row.minInvestment,
    currentFunding: row.currentFunding,
    views: row.views,
    expectedRoi: row.expectedRoi,
    revenueModel: row.revenueModel,
    revenueModelHy: row.revenueModelHy ?? undefined,
    financialProjections: row.financialProjections,
    financialProjectionsHy: row.financialProjectionsHy ?? undefined,
    investmentPlan: row.investmentPlan,
    investmentPlanHy: row.investmentPlanHy ?? undefined,
    businessModel: row.businessModel,
    businessModelHy: row.businessModelHy ?? undefined,
    budgetBreakdown: row.budgetBreakdown ?? undefined,
    phases: asArray(row.phases),
    riskLevel: row.riskLevel,
    status: row.status,
    investorCount: row.investorCount,
    savedCount: row.savedCount,
    team: asArray(row.team),
    documents: asArray(row.documents),
    updates: asArray(row.updates),
    startDate: row.startDate ?? undefined,
    endDate: row.endDate ?? undefined,
    submittedAt: iso(row.submittedAt),
    approvedAt: iso(row.approvedAt),
    approvedBy: row.approvedBy ?? undefined,
    rejectedAt: iso(row.rejectedAt),
    rejectedBy: row.rejectedBy ?? undefined,
    rejectionReason: row.rejectionReason ?? undefined,
    reviewHistory: row.reviewHistory ?? undefined,
    createdAt: iso(row.createdAt)!,
    updatedAt: iso(row.updatedAt)!,
  };
}

export function toSubscription(row: SubscriptionModel): MembershipSubscription {
  return {
    id: row.id,
    userId: row.userId,
    planId: row.planId as MembershipSubscription["planId"],
    status: row.status,
    startedAt: iso(row.startedAt)!,
    expiresAt: iso(row.expiresAt)!,
    amount: row.amount,
    stripeSessionId: row.stripeSessionId ?? undefined,
  };
}

export function toOffer(row: OfferModel): InvestmentOffer {
  return {
    id: row.id,
    projectId: row.projectId,
    projectTitle: row.projectTitle ?? undefined,
    investorId: row.investorId,
    investorName: row.investorName ?? undefined,
    ownerId: row.ownerId,
    amount: row.amount,
    conditions: row.conditions,
    questions: row.questions,
    notes: row.notes,
    status: row.status,
    ownerResponse: row.ownerResponse ?? undefined,
    createdAt: iso(row.createdAt)!,
    updatedAt: iso(row.updatedAt)!,
  };
}

export function toConversation(row: ConversationModel): Conversation {
  return {
    id: row.id,
    projectId: row.projectId,
    projectTitle: row.projectTitle,
    investorId: row.investorId,
    investorName: row.investorName,
    ownerId: row.ownerId,
    ownerName: row.ownerName,
    isAdminThread: row.isAdminThread || undefined,
    lastMessage: row.lastMessage ?? undefined,
    lastMessageAt: iso(row.lastMessageAt),
    unreadCount: row.unreadCount,
    createdAt: iso(row.createdAt)!,
  };
}

export function toMessage(row: MessageModel): ChatMessage {
  return {
    id: row.id,
    conversationId: row.conversationId,
    senderId: row.senderId,
    senderName: row.senderName,
    senderRole: row.senderRole,
    content: row.content,
    attachmentUrl: row.attachmentUrl ?? undefined,
    attachmentName: row.attachmentName ?? undefined,
    isFlagged: row.isFlagged || undefined,
    createdAt: iso(row.createdAt)!,
  };
}

export function toNotification(row: NotificationModel): Notification {
  return {
    id: row.id,
    userId: row.userId,
    type: row.type,
    title: row.title,
    message: row.message,
    isRead: row.isRead,
    href: row.href ?? undefined,
    priority: row.priority,
    metadata: row.metadata ?? undefined,
    createdAt: iso(row.createdAt)!,
  };
}

export function toKyc(row: KycSubmissionModel): KycSubmission {
  return {
    id: row.id,
    userId: row.userId,
    status: row.status,
    idDocumentUrl: row.idDocumentUrl,
    selfieUrl: row.selfieUrl,
    addressProofUrl: row.addressProofUrl,
    rejectionReason: row.rejectionReason ?? undefined,
    submittedAt: iso(row.submittedAt)!,
    reviewedAt: iso(row.reviewedAt),
  };
}

export function toMilestone(row: MilestonePlanModel): MilestonePlan {
  return {
    id: row.id,
    projectId: row.projectId,
    projectTitle: row.projectTitle ?? undefined,
    investorId: row.investorId,
    investorName: row.investorName ?? undefined,
    ownerId: row.ownerId,
    ownerName: row.ownerName ?? undefined,
    items: row.items || [],
    status: row.status,
    notes: row.notes ?? undefined,
    ownerResponse: row.ownerResponse ?? undefined,
    createdAt: iso(row.createdAt)!,
    updatedAt: iso(row.updatedAt)!,
  };
}

export function toInvestment(row: InvestmentModel): InvestorInvestment {
  return {
    id: row.id,
    offerId: row.offerId,
    projectId: row.projectId,
    amount: row.amount,
    status: row.status,
    expectedReturn: row.expectedReturn,
    createdAt: iso(row.createdAt)!,
  };
}

export function toComplaint(row: ComplaintModel): Complaint {
  return {
    id: row.id,
    reporterId: row.reporterId,
    againstUserId: row.againstUserId ?? undefined,
    projectId: row.projectId ?? undefined,
    subject: row.subject,
    description: row.description,
    status: row.status,
    createdAt: iso(row.createdAt)!,
  };
}

export function toActivityLog(row: ActivityLogModel): ActivityLog {
  return {
    id: row.id,
    userId: row.userId,
    action: row.action,
    entityType: row.entityType,
    entityId: row.entityId ?? undefined,
    metadata: row.metadata ?? undefined,
    createdAt: iso(row.createdAt)!,
  };
}

export function publicProjectCard(project: Project) {
  return {
    id: project.id,
    title: project.title,
    titleHy: project.titleHy,
    slug: project.slug,
    category: project.category,
    categoryHy: project.categoryHy,
    industry: project.industry,
    industryHy: project.industryHy,
    location: project.location,
    locationHy: project.locationHy,
    image: project.image,
    requiredInvestment: project.requiredInvestment,
    currentFunding: project.currentFunding,
    expectedRoi: project.expectedRoi,
    views: project.views,
    riskLevel: project.riskLevel,
    status: project.status,
    minInvestment: project.minInvestment,
    stage: project.stage,
    investorCount: project.investorCount,
    teamSize: project.team?.length ?? 0,
    description: project.description,
    descriptionHy: project.descriptionHy,
    ownerName: project.ownerName,
    ownerKycStatus: project.ownerKycStatus,
  };
}
