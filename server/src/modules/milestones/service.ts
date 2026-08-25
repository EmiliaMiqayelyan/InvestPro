import { v4 as uuidv4 } from "uuid";
import {
  MilestonePlanModel,
  ProjectModel,
  UserModel,
} from "../../shared/database/associations";
import { AppError } from "../../shared/errors/AppError";
import { toMilestone } from "../../shared/utils/mappers";
import { hasActiveServiceAccess } from "../../shared/utils/rbac";
import { logActivity } from "../../shared/utils/activity";
import { dispatchNotificationEvent } from "../notifications/service";
import type { TokenPayload } from "../../shared/utils/jwt";
import type { MilestoneItem, MilestonePlanStatus } from "../../shared/types";

function authUserObj(auth: TokenPayload) {
  return {
    role: auth.role,
    membershipTier: auth.membershipTier,
    membershipExpiresAt: auth.membershipExpiresAt,
  };
}

export async function listMilestones(
  auth: TokenPayload,
  opts: { projectId?: string; status?: string }
) {
  const where: Record<string, unknown> = {};
  if (auth.role === "investor") where.investorId = auth.sub;
  else if (auth.role === "project_owner") where.ownerId = auth.sub;
  if (opts.projectId) where.projectId = opts.projectId;
  if (opts.status) where.status = opts.status;

  const rows = await MilestonePlanModel.findAll({ where });
  const list = rows.map(toMilestone);
  list.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return list;
}

export async function getMilestone(auth: TokenPayload, id: string) {
  const plan = await MilestonePlanModel.findByPk(id);
  if (!plan) throw AppError.notFound("Milestone plan not found");
  const allowed =
    auth.role === "admin" || auth.sub === plan.investorId || auth.sub === plan.ownerId;
  if (!allowed) throw AppError.forbidden();
  return toMilestone(plan);
}

export async function createMilestone(
  auth: TokenPayload,
  body: {
    projectId: string;
    items: Array<{
      title: string;
      titleHy?: string;
      description?: string;
      descriptionHy?: string;
      amount: number;
      dueDate?: string;
    }>;
    notes?: string;
  }
) {
  if (!hasActiveServiceAccess(authUserObj(auth))) {
    throw AppError.forbidden("Platform service access required");
  }
  const project = await ProjectModel.findByPk(body.projectId);
  if (!project || (project.status !== "published" && project.status !== "funded")) {
    throw AppError.notFound("Project not available");
  }
  const investor = await UserModel.findByPk(auth.sub);
  if (!investor) throw AppError.notFound("User not found");
  const owner = await UserModel.findByPk(project.ownerId);

  const items: MilestoneItem[] = (body.items || []).map((item, idx) => ({
    id: uuidv4(),
    title: item.title,
    titleHy: item.titleHy,
    description: item.description,
    descriptionHy: item.descriptionHy,
    amount: Number(item.amount) || 0,
    dueDate: item.dueDate,
    status: "proposed",
    sortOrder: idx,
  }));
  if (items.length === 0) throw AppError.badRequest("At least one milestone item is required");

  const plan = await MilestonePlanModel.create({
    id: uuidv4(),
    projectId: project.id,
    projectTitle: project.title,
    investorId: auth.sub,
    investorName: `${investor.firstName} ${investor.lastName}`,
    ownerId: project.ownerId,
    ownerName: owner ? `${owner.firstName} ${owner.lastName}` : project.ownerName || "",
    items,
    status: "proposed",
    notes: body.notes ?? null,
    ownerResponse: null,
  });

  const dto = toMilestone(plan);
  await logActivity(auth.sub, "milestone_created", "milestone", plan.id);
  await dispatchNotificationEvent({ kind: "milestone_created", plan: dto });
  return dto;
}

export async function patchMilestone(
  auth: TokenPayload,
  id: string,
  body: {
    status?: MilestonePlanStatus;
    items?: MilestoneItem[];
    ownerResponse?: string;
    notes?: string;
  }
) {
  const plan = await MilestonePlanModel.findByPk(id);
  if (!plan) throw AppError.notFound("Milestone plan not found");
  const isOwner = auth.sub === plan.ownerId;
  const isInvestor = auth.sub === plan.investorId;
  if (auth.role !== "admin" && !isOwner && !isInvestor) throw AppError.forbidden();

  if (body.status) plan.status = body.status;
  if (body.items) plan.items = body.items;
  if (typeof body.notes === "string") plan.notes = body.notes;
  if (typeof body.ownerResponse === "string" && (isOwner || auth.role === "admin")) {
    plan.ownerResponse = body.ownerResponse;
  }
  await plan.save();

  const dto = toMilestone(plan);
  await logActivity(auth.sub, "milestone_updated", "milestone", plan.id, {
    status: plan.status,
  });
  await dispatchNotificationEvent({
    kind: "milestone_updated",
    plan: dto,
    actorId: auth.sub,
  });
  return dto;
}
