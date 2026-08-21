import type { ChatMessage, Conversation, Project, ProjectReviewEntry, User } from "@/types";
import { getStore, logActivity, SEED_USER_IDS } from "@/lib/server/store";
import { dispatchNotificationEvent } from "@/lib/server/notifications";

function reviewerDisplayName(user: User | undefined) {
  if (!user) return "Admin";
  return `${user.firstName} ${user.lastName}`.trim() || "Admin";
}

export function appendReviewEntry(
  project: Project,
  entry: Omit<ProjectReviewEntry, "id" | "projectId" | "createdAt"> & { createdAt?: string }
) {
  const record: ProjectReviewEntry = {
    id: crypto.randomUUID(),
    projectId: project.id,
    createdAt: entry.createdAt || new Date().toISOString(),
    reviewerId: entry.reviewerId,
    reviewerName: entry.reviewerName,
    decision: entry.decision,
    reason: entry.reason,
  };
  project.reviewHistory = [...(project.reviewHistory || []), record];
  return record;
}

export function ensureAdminOwnerConversation(project: Project, adminId: string): Conversation {
  const store = getStore();
  const existing = Array.from(store.conversations.values()).find(
    (c) => c.projectId === project.id && c.isAdminThread
  );
  if (existing) return existing;

  const admin = store.users.get(adminId) || store.users.get(SEED_USER_IDS.admin);
  const owner = store.users.get(project.ownerId);
  const conversation: Conversation = {
    id: crypto.randomUUID(),
    projectId: project.id,
    projectTitle: project.title,
    investorId: admin?.id || adminId,
    investorName: admin ? reviewerDisplayName(admin) : "Platform Admin",
    ownerId: project.ownerId,
    ownerName: owner
      ? `${owner.firstName} ${owner.lastName}`
      : project.ownerName || "Project Owner",
    isAdminThread: true,
    unreadCount: 0,
    createdAt: new Date().toISOString(),
  };
  store.conversations.set(conversation.id, conversation);
  store.messages.set(conversation.id, []);
  return conversation;
}

export function postSystemMessage(
  conversation: Conversation,
  sender: User,
  content: string
): ChatMessage {
  const store = getStore();
  const message: ChatMessage = {
    id: crypto.randomUUID(),
    conversationId: conversation.id,
    senderId: sender.id,
    senderName: `${sender.firstName} ${sender.lastName}`.trim() || "Admin",
    senderRole: sender.role,
    content,
    createdAt: new Date().toISOString(),
  };
  const msgs = store.messages.get(conversation.id) || [];
  msgs.push(message);
  store.messages.set(conversation.id, msgs);
  conversation.lastMessage = content.slice(0, 120);
  conversation.lastMessageAt = message.createdAt;
  conversation.unreadCount += 1;
  store.conversations.set(conversation.id, conversation);
  dispatchNotificationEvent({ kind: "message_sent", conversation, message });
  return message;
}

export function buildRejectionMessage(projectTitle: string, reason: string) {
  return `Ձեր «${projectTitle}» նախագիծը այս պահին չի հաստատվել։

Մերժման պատճառը՝

${reason}

Խնդրում ենք կատարել անհրաժեշտ փոփոխությունները և կրկին ուղարկել նախագիծը ստուգման։`;
}

export function approveProject(project: Project, admin: User) {
  const now = new Date().toISOString();
  project.status = "published";
  project.approvedAt = now;
  project.approvedBy = admin.id;
  project.rejectedAt = undefined;
  project.rejectedBy = undefined;
  project.rejectionReason = undefined;
  project.updatedAt = now;
  appendReviewEntry(project, {
    decision: "approved",
    reviewerId: admin.id,
    reviewerName: reviewerDisplayName(admin),
    createdAt: now,
  });
  getStore().projects.set(project.id, project);
  logActivity(admin.id, "project_approved", "project", project.id, { status: "published" });
  dispatchNotificationEvent({
    kind: "project_status_changed",
    project,
    status: "published",
  });
  return project;
}

export function rejectProject(project: Project, admin: User, reason: string) {
  const now = new Date().toISOString();
  project.status = "rejected";
  project.rejectedAt = now;
  project.rejectedBy = admin.id;
  project.rejectionReason = reason;
  project.updatedAt = now;
  appendReviewEntry(project, {
    decision: "rejected",
    reviewerId: admin.id,
    reviewerName: reviewerDisplayName(admin),
    reason,
    createdAt: now,
  });
  getStore().projects.set(project.id, project);
  logActivity(admin.id, "project_rejected", "project", project.id, {
    status: "rejected",
    reason,
  });

  const conversation = ensureAdminOwnerConversation(project, admin.id);
  postSystemMessage(conversation, admin, buildRejectionMessage(project.title, reason));

  dispatchNotificationEvent({
    kind: "project_status_changed",
    project,
    status: "rejected",
    rejectionReason: reason,
  });
  return project;
}

export function markSubmitted(project: Project, ownerId: string, decision: "submitted" | "resubmitted") {
  const now = new Date().toISOString();
  project.status = "pending_review";
  project.submittedAt = now;
  project.updatedAt = now;
  if (decision === "resubmitted") {
    project.rejectionReason = undefined;
    project.rejectedAt = undefined;
    project.rejectedBy = undefined;
  }
  const owner = getStore().users.get(ownerId);
  appendReviewEntry(project, {
    decision,
    reviewerId: ownerId,
    reviewerName: owner ? reviewerDisplayName(owner) : project.ownerName,
    createdAt: now,
  });
  getStore().projects.set(project.id, project);
  return project;
}
