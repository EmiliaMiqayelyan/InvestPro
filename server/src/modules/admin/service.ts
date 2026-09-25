import { Op } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import {
  UserModel,
  ProjectModel,
  SubscriptionModel,
  OfferModel,
  KycSubmissionModel,
  ComplaintModel,
  ActivityLogModel,
  MessageModel,
  InvestmentModel,
  ConversationModel,
  SavedProjectModel,
  MilestonePlanModel,
} from "../../shared/database/associations";
import { AppError } from "../../shared/errors/AppError";
import {
  toUser,
  toProject,
  toSubscription,
  toComplaint,
  toActivityLog,
  toMessage,
  toKyc,
} from "../../shared/utils/mappers";
import { paginate } from "../../shared/utils/paginate";
import { analyzeProjectRisk } from "../../shared/utils/risk-analysis";
import { logActivity } from "../../shared/utils/activity";
import { dispatchNotificationEvent } from "../notifications/service";
import {
  approveProject,
  rejectProject,
} from "../owner/service";
import type { TokenPayload } from "../../shared/utils/jwt";
import type { AdminStats, Project, UserRole } from "../../shared/types";

export async function getAdminStats(): Promise<AdminStats> {
  const users = await UserModel.findAll();
  const projects = await ProjectModel.findAll();
  const subscriptions = await SubscriptionModel.findAll({ where: { status: "active" } });
  const pendingKyc = await KycSubmissionModel.count({ where: { status: "pending" } });
  const openComplaints = await ComplaintModel.count({
    where: { status: { [Op.in]: ["open", "reviewing"] } },
  });
  const totalOffers = await OfferModel.count();

  return {
    totalInvestors: users.filter((u) => u.role === "investor").length,
    totalOwners: users.filter((u) => u.role === "project_owner").length,
    totalProjects: projects.length,
    publishedProjects: projects.filter((p) => p.status === "published").length,
    pendingProjects: projects.filter((p) => p.status === "pending_review").length,
    activeMemberships: subscriptions.length,
    pendingKyc,
    openComplaints,
    totalOffers,
    totalFunding: projects.reduce((s, p) => s + p.currentFunding, 0),
  };
}

export async function listUsers(opts: {
  role?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  let users = (await UserModel.findAll()).map(toUser);
  if (opts.role) users = users.filter((u) => u.role === opts.role);
  if (opts.search) {
    const search = opts.search.toLowerCase();
    users = users.filter(
      (u) =>
        u.email.includes(search) ||
        u.firstName.toLowerCase().includes(search) ||
        u.lastName.toLowerCase().includes(search)
    );
  }
  return paginate(users, opts.page || 1, opts.limit || 20);
}

export async function updateUserRole(userId: string, role: UserRole) {
  if (!["investor", "project_owner", "admin"].includes(role)) {
    throw AppError.badRequest("Invalid role");
  }
  const user = await UserModel.findByPk(userId);
  if (!user) throw AppError.notFound("User not found");
  user.role = role;
  await user.save();
  await dispatchNotificationEvent({ kind: "role_changed", userId: user.id, role });
  return toUser(user);
}

export async function listAdminProjects(opts: { status?: string; page?: number; limit?: number }) {
  let projects = (await ProjectModel.findAll()).map(toProject);
  if (opts.status) projects = projects.filter((p) => p.status === opts.status);
  projects.sort((a, b) => {
    const pendingRank = (s: string) => (s === "pending_review" ? 0 : 1);
    const rank = pendingRank(a.status) - pendingRank(b.status);
    if (rank !== 0) return rank;
    const aTime = new Date(a.submittedAt || a.createdAt).getTime();
    const bTime = new Date(b.submittedAt || b.createdAt).getTime();
    return bTime - aTime;
  });
  return paginate(projects, opts.page || 1, opts.limit || 20);
}

export async function listPendingProjects() {
  const projects = (await ProjectModel.findAll({ where: { status: "pending_review" } }))
    .map(toProject)
    .sort(
      (a, b) =>
        new Date(b.submittedAt || b.createdAt).getTime() -
        new Date(a.submittedAt || a.createdAt).getTime()
    );
  return projects;
}

export async function getAdminProject(id: string) {
  const row = await ProjectModel.findByPk(id);
  if (!row) throw AppError.notFound("Project not found");
  const project = toProject(row);
  const owner = await UserModel.findByPk(project.ownerId);
  const ownerProjects = await ProjectModel.count({ where: { ownerId: project.ownerId } });
  return {
    project,
    owner: owner
      ? {
          id: owner.id,
          email: owner.email,
          firstName: owner.firstName,
          lastName: owner.lastName,
          companyName: owner.companyName,
          bio: owner.bio,
          kycStatus: owner.kycStatus,
          createdAt: owner.createdAt.toISOString(),
          previousProjects: ownerProjects,
        }
      : null,
    riskAnalysis: analyzeProjectRisk(project),
    reviewHistory: project.reviewHistory || [],
  };
}

export async function approve(auth: TokenPayload, id: string) {
  const row = await ProjectModel.findByPk(id);
  if (!row) throw AppError.notFound("Project not found");
  if (row.status !== "pending_review" && row.status !== "draft") {
    throw AppError.badRequest("Only projects awaiting review can be approved");
  }
  const admin = await UserModel.findByPk(auth.sub);
  if (!admin) throw AppError.notFound("Admin not found");
  return approveProject(toProject(row), toUser(admin));
}

export async function reject(auth: TokenPayload, id: string, reason?: string) {
  const row = await ProjectModel.findByPk(id);
  if (!row) throw AppError.notFound("Project not found");
  if (row.status !== "pending_review" && row.status !== "draft") {
    throw AppError.badRequest("Only projects awaiting review can be rejected");
  }
  const trimmed = (reason || "").trim();
  if (trimmed.length < 20) {
    throw AppError.badRequest("Rejection reason must be at least 20 characters");
  }
  const admin = await UserModel.findByPk(auth.sub);
  if (!admin) throw AppError.notFound("Admin not found");
  return rejectProject(toProject(row), toUser(admin), trimmed);
}

export async function patchProjectStatus(
  auth: TokenPayload,
  id: string,
  body: { status: Project["status"]; reason?: string }
) {
  const row = await ProjectModel.findByPk(id);
  if (!row) throw AppError.notFound("Project not found");
  const admin = await UserModel.findByPk(auth.sub);
  if (!admin) throw AppError.notFound("Admin not found");
  const project = toProject(row);

  if (body.status === "published") {
    return approveProject(project, toUser(admin));
  }
  if (body.status === "rejected") {
    const trimmed = (body.reason || "").trim();
    if (trimmed.length < 20) {
      throw AppError.badRequest("Rejection reason must be at least 20 characters");
    }
    return rejectProject(project, toUser(admin), trimmed);
  }

  row.status = body.status;
  await row.save();
  const updated = toProject(row);
  await logActivity(auth.sub, "project_status_updated", "project", id, {
    status: body.status,
  });
  await dispatchNotificationEvent({
    kind: "project_status_changed",
    project: updated,
    status: body.status,
  });
  return updated;
}

export async function archiveAdminProject(auth: TokenPayload, id: string) {
  return patchProjectStatus(auth, id, { status: "archived" });
}

export async function deleteAdminProject(auth: TokenPayload, id: string) {
  const row = await ProjectModel.findByPk(id);
  if (!row) throw AppError.notFound("Project not found");
  const project = toProject(row);

  const investments = await InvestmentModel.count({ where: { projectId: id } });
  if (investments > 0) {
    await dispatchNotificationEvent({
      kind: "project_remove_blocked",
      adminId: auth.sub,
      project,
      investmentCount: investments,
    });
    throw AppError.badRequest(
      `Cannot remove a project with ${investments} investor record(s). Manage investments first.`
    );
  }

  if (row.status === "funded") {
    throw AppError.badRequest("Funded projects cannot be removed until investments are cleared");
  }

  await dispatchNotificationEvent({
    kind: "project_removed",
    ownerId: project.ownerId,
    projectId: project.id,
    projectTitle: project.title,
    byAdmin: true,
  });

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
  await logActivity(auth.sub, "project_deleted_by_admin", "project", id);
  return { id };
}

export async function listPayments() {
  const rows = await SubscriptionModel.findAll({ order: [["createdAt", "DESC"]] });
  return rows.map(toSubscription);
}

export async function getSecurity() {
  const activityLogs = (
    await ActivityLogModel.findAll({ order: [["createdAt", "DESC"]], limit: 100 })
  ).map(toActivityLog);
  const flaggedMessages = (
    await MessageModel.findAll({
      where: { isFlagged: true },
      order: [["createdAt", "DESC"]],
      limit: 50,
    })
  ).map(toMessage);
  const pendingKyc = (
    await KycSubmissionModel.findAll({ where: { status: "pending" } })
  ).map(toKyc);
  return { activityLogs, flaggedMessages, pendingKyc };
}

export async function listComplaints() {
  return (await ComplaintModel.findAll({ order: [["createdAt", "DESC"]] })).map(toComplaint);
}

export async function createComplaint(
  reporterId: string,
  body: {
    subject: string;
    description: string;
    projectId?: string;
    againstUserId?: string;
  }
) {
  const row = await ComplaintModel.create({
    id: uuidv4(),
    reporterId,
    againstUserId: body.againstUserId ?? null,
    projectId: body.projectId ?? null,
    subject: body.subject,
    description: body.description,
    status: "open",
  });
  const complaint = toComplaint(row);
  await dispatchNotificationEvent({ kind: "complaint_filed", complaint });
  return complaint;
}

export async function updateComplaintStatus(
  id: string,
  status: "open" | "reviewing" | "resolved" | "dismissed"
) {
  const row = await ComplaintModel.findByPk(id);
  if (!row) throw AppError.notFound("Complaint not found");
  row.status = status;
  await row.save();
  return toComplaint(row);
}

const SETTINGS_KEY = "platform";

const DEFAULT_SETTINGS = {
  platformName: "InvestIN",
  supportEmail: "hello@investin.am",
  maintenanceMode: false,
  kycRequired: true,
  contactBlocking: true,
  announcement: "",
};

export async function getSystemSettings() {
  const { SystemSettingModel } = await import("../../shared/database/associations");
  const row = await SystemSettingModel.findOne({ where: { key: SETTINGS_KEY } });
  if (!row) return { ...DEFAULT_SETTINGS };
  return { ...DEFAULT_SETTINGS, ...(row.value as Record<string, unknown>) };
}

export async function saveSystemSettings(
  adminId: string,
  body: Partial<typeof DEFAULT_SETTINGS>
) {
  const { SystemSettingModel } = await import("../../shared/database/associations");
  const value = {
    ...DEFAULT_SETTINGS,
    ...body,
    platformName: String(body.platformName ?? DEFAULT_SETTINGS.platformName),
    supportEmail: String(body.supportEmail ?? DEFAULT_SETTINGS.supportEmail),
    announcement: String(body.announcement ?? ""),
    maintenanceMode: Boolean(body.maintenanceMode),
    kycRequired: Boolean(body.kycRequired),
    contactBlocking: Boolean(body.contactBlocking),
  };

  let row = await SystemSettingModel.findOne({ where: { key: SETTINGS_KEY } });
  if (!row) {
    row = await SystemSettingModel.create({
      id: uuidv4(),
      key: SETTINGS_KEY,
      value,
      updatedBy: adminId,
    });
  } else {
    row.value = value;
    row.updatedBy = adminId;
    await row.save();
  }
  return value;
}
