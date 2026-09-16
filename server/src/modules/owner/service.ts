import { v4 as uuidv4 } from "uuid";
import {
  ProjectModel,
  OfferModel,
  ConversationModel,
  MilestonePlanModel,
  UserModel,
  MessageModel,
  SavedProjectModel,
  InvestmentModel,
} from "../../shared/database/associations";
import { AppError } from "../../shared/errors/AppError";
import { toProject, toUser, toConversation, toMessage } from "../../shared/utils/mappers";
import { logActivity } from "../../shared/utils/activity";
import { dispatchNotificationEvent } from "../notifications/service";
import type {
  Project,
  ProjectDocument,
  TeamMember,
  ProjectReviewEntry,
  User,
  Conversation,
  ChatMessage,
} from "../../shared/types";
import type { TokenPayload } from "../../shared/utils/jwt";
import type { OwnerDashboardStats } from "../../shared/types";
import { Op } from "sequelize";
import { SEED_USER_IDS } from "../../shared/database/seed-ids";

const OWNER_MUTABLE_STATUSES = new Set(["draft", "pending_review", "rejected"]);

function assertOwnerCanMutateProject(auth: TokenPayload, row: ProjectModel) {
  if (auth.role === "project_owner" && row.ownerId !== auth.sub) throw AppError.forbidden();
  if (auth.role === "project_owner" && !OWNER_MUTABLE_STATUSES.has(row.status)) {
    throw AppError.badRequest(
      "Only draft, pending review, or rejected projects can be changed"
    );
  }
}

function reviewerDisplayName(user: User | undefined) {
  if (!user) return "Admin";
  return `${user.firstName} ${user.lastName}`.trim() || "Admin";
}

function appendReviewEntry(
  project: Project,
  entry: Omit<ProjectReviewEntry, "id" | "projectId" | "createdAt"> & { createdAt?: string }
) {
  const record: ProjectReviewEntry = {
    id: uuidv4(),
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

async function persistProject(project: Project) {
  const row = await ProjectModel.findByPk(project.id);
  if (!row) throw AppError.notFound("Project not found");
  Object.assign(row, {
    status: project.status,
    submittedAt: project.submittedAt ? new Date(project.submittedAt) : null,
    approvedAt: project.approvedAt ? new Date(project.approvedAt) : null,
    approvedBy: project.approvedBy ?? null,
    rejectedAt: project.rejectedAt ? new Date(project.rejectedAt) : null,
    rejectedBy: project.rejectedBy ?? null,
    rejectionReason: project.rejectionReason ?? null,
    reviewHistory: project.reviewHistory ?? [],
    title: project.title,
    titleHy: project.titleHy ?? null,
    slug: project.slug,
    description: project.description,
    descriptionHy: project.descriptionHy ?? null,
    fullDescription: project.fullDescription,
    fullDescriptionHy: project.fullDescriptionHy ?? null,
    category: project.category,
    categoryHy: project.categoryHy ?? null,
    industry: project.industry,
    industryHy: project.industryHy ?? null,
    location: project.location,
    locationHy: project.locationHy ?? null,
    stage: project.stage,
    timeline: project.timeline,
    timelineHy: project.timelineHy ?? null,
    image: project.image,
    requiredInvestment: project.requiredInvestment,
    minInvestment: project.minInvestment,
    currentFunding: project.currentFunding,
    views: project.views,
    expectedRoi: project.expectedRoi,
    revenueModel: project.revenueModel,
    revenueModelHy: project.revenueModelHy ?? null,
    financialProjections: project.financialProjections,
    financialProjectionsHy: project.financialProjectionsHy ?? null,
    investmentPlan: project.investmentPlan,
    investmentPlanHy: project.investmentPlanHy ?? null,
    businessModel: project.businessModel,
    businessModelHy: project.businessModelHy ?? null,
    budgetBreakdown: project.budgetBreakdown ?? null,
    phases: project.phases,
    riskLevel: project.riskLevel,
    investorCount: project.investorCount,
    savedCount: project.savedCount,
    team: project.team,
    documents: project.documents,
    updates: project.updates,
    ownerName: project.ownerName ?? null,
    ownerKycStatus: project.ownerKycStatus ?? null,
  });
  await row.save();
  return toProject(row);
}

export async function ensureAdminOwnerConversation(
  project: Project,
  adminId: string
): Promise<Conversation> {
  const existing = await ConversationModel.findOne({
    where: { projectId: project.id, isAdminThread: true },
  });
  if (existing) return toConversation(existing);

  const admin =
    (await UserModel.findByPk(adminId)) || (await UserModel.findByPk(SEED_USER_IDS.admin));
  const owner = await UserModel.findByPk(project.ownerId);
  const row = await ConversationModel.create({
    id: uuidv4(),
    projectId: project.id,
    projectTitle: project.title,
    investorId: admin?.id || adminId,
    investorName: admin ? reviewerDisplayName(toUser(admin)) : "Platform Admin",
    ownerId: project.ownerId,
    ownerName: owner
      ? `${owner.firstName} ${owner.lastName}`
      : project.ownerName || "Project Owner",
    isAdminThread: true,
    lastMessage: null,
    lastMessageAt: null,
    unreadCount: 0,
  });
  return toConversation(row);
}

export async function postSystemMessage(
  conversation: Conversation,
  sender: User,
  content: string
): Promise<ChatMessage> {
  const message = await MessageModel.create({
    id: uuidv4(),
    conversationId: conversation.id,
    senderId: sender.id,
    senderName: `${sender.firstName} ${sender.lastName}`.trim() || "Admin",
    senderRole: sender.role,
    content,
    attachmentUrl: null,
    attachmentName: null,
    isFlagged: false,
  });
  const conv = await ConversationModel.findByPk(conversation.id);
  if (conv) {
    conv.lastMessage = content.slice(0, 120);
    conv.lastMessageAt = new Date();
    conv.unreadCount += 1;
    await conv.save();
  }
  const dto = toMessage(message);
  const updatedConv = conv ? toConversation(conv) : conversation;
  await dispatchNotificationEvent({
    kind: "message_sent",
    conversation: updatedConv,
    message: dto,
  });
  return dto;
}

export function buildRejectionMessage(projectTitle: string, reason: string) {
  return `Ձեր «${projectTitle}» նախագիծը այս պահին չի հաստատվել։

Մերժման պատճառը՝

${reason}

Խնդրում ենք կատարել անհրաժեշտ փոփոխությունները և կրկին ուղարկել նախագիծը ստուգման։`;
}

export async function markSubmitted(
  project: Project,
  ownerId: string,
  decision: "submitted" | "resubmitted"
) {
  const now = new Date().toISOString();
  project.status = "pending_review";
  project.submittedAt = now;
  project.updatedAt = now;
  if (decision === "resubmitted") {
    project.rejectionReason = undefined;
    project.rejectedAt = undefined;
    project.rejectedBy = undefined;
  }
  const owner = await UserModel.findByPk(ownerId);
  appendReviewEntry(project, {
    decision,
    reviewerId: ownerId,
    reviewerName: owner ? reviewerDisplayName(toUser(owner)) : project.ownerName,
    createdAt: now,
  });
  return persistProject(project);
}

export async function approveProject(project: Project, admin: User) {
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
  const updated = await persistProject(project);
  await logActivity(admin.id, "project_approved", "project", project.id, {
    status: "published",
  });
  await dispatchNotificationEvent({
    kind: "project_status_changed",
    project: updated,
    status: "published",
  });
  return updated;
}

export async function rejectProject(project: Project, admin: User, reason: string) {
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
  const updated = await persistProject(project);
  await logActivity(admin.id, "project_rejected", "project", project.id, {
    status: "rejected",
    reason,
  });
  const conversation = await ensureAdminOwnerConversation(updated, admin.id);
  await postSystemMessage(conversation, admin, buildRejectionMessage(updated.title, reason));
  await dispatchNotificationEvent({
    kind: "project_status_changed",
    project: updated,
    status: "rejected",
    rejectionReason: reason,
  });
  return updated;
}

export async function getOwnerDashboard(userId: string): Promise<OwnerDashboardStats> {
  const myProjects = (await ProjectModel.findAll({ where: { ownerId: userId } })).map(toProject);
  const offers = await OfferModel.findAll({ where: { ownerId: userId } });
  const conversations = await ConversationModel.findAll({ where: { ownerId: userId } });
  const unread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);
  const teamMembers = myProjects.reduce((s, p) => s + p.team.length, 0);
  const pendingMilestones = await MilestonePlanModel.count({
    where: {
      ownerId: userId,
      status: { [Op.in]: ["proposed", "negotiating", "draft"] },
    },
  });

  return {
    myProjects: myProjects.length,
    publishedProjects: myProjects.filter((p) => p.status === "published").length,
    investorRequests: offers.length,
    unreadMessages: unread,
    totalFundingRaised: myProjects.reduce((s, p) => s + p.currentFunding, 0),
    teamMembers,
    pendingOffers: offers.filter((o) => o.status === "pending").length,
    pendingMilestones,
  };
}

export async function listOwnerProjects(auth: TokenPayload) {
  const where =
    auth.role === "admin" ? {} : { ownerId: auth.sub };
  const projects = (await ProjectModel.findAll({ where })).map(toProject);

  const statusRank = (status: string) => {
    if (status === "pending_review") return 0;
    if (status === "published" || status === "funded") return 1;
    if (status === "draft") return 2;
    if (status === "rejected") return 3;
    return 4;
  };
  const activityTime = (p: Project) => {
    if (p.status === "pending_review") {
      return new Date(p.submittedAt || p.updatedAt || p.createdAt).getTime();
    }
    if (p.status === "published" || p.status === "funded") {
      return new Date(p.approvedAt || p.updatedAt || p.createdAt).getTime();
    }
    return new Date(p.updatedAt || p.createdAt).getTime();
  };
  projects.sort((a, b) => {
    const rank = statusRank(a.status) - statusRank(b.status);
    if (rank !== 0) return rank;
    return activityTime(b) - activityTime(a);
  });
  return projects;
}

export async function createOwnerProject(auth: TokenPayload, body: Partial<Project> & { title: string }) {
  if (!body.title) throw AppError.badRequest("Title is required");
  const owner = await UserModel.findByPk(auth.sub);
  if (!owner) throw AppError.notFound("User not found");
  const id = uuidv4();
  const now = new Date();

  const row = await ProjectModel.create({
    id,
    ownerId: auth.sub,
    ownerName: `${owner.firstName} ${owner.lastName}`,
    ownerKycStatus: owner.kycStatus,
    title: body.title,
    titleHy: body.titleHy ?? null,
    slug: body.title.toLowerCase().replace(/\s+/g, "-"),
    description: body.description || "",
    descriptionHy: body.descriptionHy ?? null,
    fullDescription: body.fullDescription || body.description || "",
    fullDescriptionHy: body.fullDescriptionHy ?? null,
    category: body.category || "Other",
    categoryHy: body.categoryHy ?? null,
    industry: body.industry || "Other",
    industryHy: body.industryHy ?? null,
    location: body.location || "",
    locationHy: body.locationHy ?? null,
    stage: body.stage || "idea",
    timeline: body.timeline || "",
    timelineHy: body.timelineHy ?? null,
    image:
      body.image ||
      "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=1200&q=80",
    requiredInvestment: Number(body.requiredInvestment) || 0,
    minInvestment: Number(body.minInvestment) || 0,
    currentFunding: 0,
    views: 0,
    expectedRoi: Number(body.expectedRoi) || 0,
    revenueModel: body.revenueModel || "",
    revenueModelHy: body.revenueModelHy ?? null,
    financialProjections: body.financialProjections || "",
    financialProjectionsHy: body.financialProjectionsHy ?? null,
    investmentPlan: body.investmentPlan || "",
    investmentPlanHy: body.investmentPlanHy ?? null,
    businessModel: body.businessModel || "",
    businessModelHy: body.businessModelHy ?? null,
    budgetBreakdown: body.budgetBreakdown ?? null,
    phases: body.phases || [],
    riskLevel: body.riskLevel || "medium",
    status: "pending_review",
    submittedAt: now,
    approvedAt: null,
    approvedBy: null,
    rejectedAt: null,
    rejectedBy: null,
    rejectionReason: null,
    reviewHistory: [],
    investorCount: 0,
    savedCount: 0,
    team: body.team || [],
    documents: body.documents || [],
    updates: [],
    startDate: null,
    endDate: null,
  });

  let project = toProject(row);
  project = await markSubmitted(project, auth.sub, "submitted");
  await logActivity(auth.sub, "project_created", "project", id);
  await dispatchNotificationEvent({ kind: "project_created", project });
  return project;
}

export async function patchOwnerProject(
  auth: TokenPayload,
  id: string,
  body: Partial<Project>
) {
  const row = await ProjectModel.findByPk(id);
  if (!row) throw AppError.notFound("Project not found");
  assertOwnerCanMutateProject(auth, row);

  const {
    status: _s,
    approvedAt: _a,
    approvedBy: _b,
    rejectedAt: _c,
    rejectedBy: _d,
    rejectionReason: _e,
    reviewHistory: _f,
    ownerId: _o,
    id: _id,
    ...safe
  } = body;

  const project = toProject(row);
  Object.assign(project, safe, {
    id: project.id,
    ownerId: project.ownerId,
    status: project.status,
    reviewHistory: project.reviewHistory,
  });
  return persistProject(project);
}

export async function deleteOwnerProject(auth: TokenPayload, id: string) {
  const row = await ProjectModel.findByPk(id);
  if (!row) throw AppError.notFound("Project not found");
  if (row.ownerId !== auth.sub) throw AppError.forbidden();

  const investments = await InvestmentModel.count({ where: { projectId: id } });
  if (investments > 0) {
    throw AppError.badRequest("Cannot delete a project with investments");
  }

  if (row.status === "funded") {
    throw AppError.badRequest("Funded projects cannot be deleted");
  }

  const conversations = await ConversationModel.findAll({ where: { projectId: id } });
  const conversationIds = conversations.map((c) => c.id);
  if (conversationIds.length) {
    await MessageModel.destroy({ where: { conversationId: { [Op.in]: conversationIds } } });
    await ConversationModel.destroy({ where: { id: { [Op.in]: conversationIds } } });
  }

  await Promise.all([
    OfferModel.destroy({ where: { projectId: id } }),
    SavedProjectModel.destroy({ where: { projectId: id } }),
    MilestonePlanModel.destroy({ where: { projectId: id } }),
  ]);

  await row.destroy();
  await logActivity(auth.sub, "project_deleted", "project", id);
  return { id };
}

export async function addDocument(
  auth: TokenPayload,
  projectId: string,
  body: { name: string; category: ProjectDocument["category"]; url?: string }
) {
  const row = await ProjectModel.findByPk(projectId);
  if (!row || row.ownerId !== auth.sub) throw AppError.notFound("Not found");
  const doc: ProjectDocument = {
    id: uuidv4(),
    name: body.name,
    category: body.category || "other",
    url: body.url || `#upload-${uuidv4()}`,
    uploadedAt: new Date().toISOString(),
  };
  const docs = [...(row.documents || []), doc];
  row.documents = docs;
  await row.save();
  return doc;
}

export async function removeDocument(
  auth: TokenPayload,
  projectId: string,
  documentId: string
) {
  const row = await ProjectModel.findByPk(projectId);
  if (!row || row.ownerId !== auth.sub) throw AppError.notFound("Not found");
  const docs = row.documents || [];
  const next = docs.filter((d, index) => (d.id || String(index)) !== documentId);
  if (next.length === docs.length) throw AppError.notFound("Document not found");
  row.documents = next;
  await row.save();
  return { id: documentId };
}

export async function addTeamMember(
  auth: TokenPayload,
  projectId: string,
  body: Omit<TeamMember, "id">
) {
  const row = await ProjectModel.findByPk(projectId);
  if (!row || row.ownerId !== auth.sub) throw AppError.notFound("Not found");
  const member: TeamMember = { ...body, id: uuidv4() };
  const existing = Array.isArray(row.team) ? row.team : [];
  row.team = [...existing, member];
  await row.save();
  return member;
}

export async function removeTeamMember(
  auth: TokenPayload,
  projectId: string,
  memberId: string
) {
  const row = await ProjectModel.findByPk(projectId);
  if (!row || row.ownerId !== auth.sub) throw AppError.notFound("Not found");
  const team = Array.isArray(row.team) ? row.team : [];
  const next = team.filter((m) => m.id !== memberId);
  if (next.length === team.length) throw AppError.notFound("Team member not found");
  row.team = next;
  await row.save();
  return { id: memberId };
}

export async function listOwnerDocuments(userId: string) {
  const projects = await ProjectModel.findAll({ where: { ownerId: userId } });
  return projects.flatMap((p) => {
    const docs = Array.isArray(p.documents) ? p.documents : [];
    return docs.map((d, index) => ({
      ...d,
      documentId: d.id || String(index),
      id: `${p.id}:${d.id || index}`,
      projectId: p.id,
      projectTitle: p.title,
    }));
  });
}

export async function resubmitProject(auth: TokenPayload, id: string) {
  const row = await ProjectModel.findByPk(id);
  if (!row) throw AppError.notFound("Project not found");
  if (row.ownerId !== auth.sub) throw AppError.forbidden();
  if (row.status !== "rejected" && row.status !== "draft") {
    throw AppError.badRequest("Only rejected or draft projects can be resubmitted");
  }
  const updated = await markSubmitted(toProject(row), auth.sub, "resubmitted");
  await logActivity(auth.sub, "project_resubmitted", "project", id);
  await dispatchNotificationEvent({
    kind: "project_status_changed",
    project: updated,
    status: "pending_review",
  });
  return updated;
}
