import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { DisputeModel } from "../../shared/database/associations";
import { AppError } from "../../shared/errors/AppError";
import { writeAuditLog } from "../../shared/utils/audit";
import { dispatchNotificationEvent } from "../notifications/service";
import type { AuthedRequest } from "../../app/middleware";

export const createDisputeSchema = z.object({
  againstUserId: z.string().uuid().optional(),
  projectId: z.string().uuid().optional(),
  investmentId: z.string().uuid().optional(),
  subject: z.string().min(5),
  description: z.string().min(20),
});

export async function createDispute(
  reporterId: string,
  body: z.infer<typeof createDisputeSchema>,
  req?: AuthedRequest
) {
  const dispute = await DisputeModel.create({
    id: uuidv4(),
    reporterId,
    againstUserId: body.againstUserId ?? null,
    projectId: body.projectId ?? null,
    investmentId: body.investmentId ?? null,
    subject: body.subject,
    description: body.description,
    status: "open",
    resolution: null,
    resolvedBy: null,
    resolvedAt: null,
  });

  await writeAuditLog({
    actorId: reporterId,
    action: "dispute_created",
    entityType: "dispute",
    entityId: dispute.id,
    req,
  });

  await dispatchNotificationEvent({
    kind: "dispute_created",
    disputeId: dispute.id,
    reporterId,
    subject: body.subject,
  });

  return mapDispute(dispute);
}

export async function listDisputes(opts: { status?: string; page?: number; limit?: number }) {
  const where: Record<string, unknown> = {};
  if (opts.status) where.status = opts.status;

  const rows = await DisputeModel.findAll({
    where,
    order: [["createdAt", "DESC"]],
  });

  const page = opts.page || 1;
  const limit = Math.min(opts.limit || 20, 100);
  const start = (page - 1) * limit;
  const data = rows.slice(start, start + limit).map(mapDispute);

  return { data, total: rows.length, page, limit, totalPages: Math.ceil(rows.length / limit) };
}

export async function resolveDispute(
  disputeId: string,
  adminId: string,
  resolution: string,
  req?: AuthedRequest
) {
  const dispute = await DisputeModel.findByPk(disputeId);
  if (!dispute) throw AppError.notFound("Dispute not found");

  dispute.status = "resolved";
  dispute.resolution = resolution;
  dispute.resolvedBy = adminId;
  dispute.resolvedAt = new Date();
  await dispute.save();

  await writeAuditLog({
    actorId: adminId,
    action: "dispute_resolved",
    entityType: "dispute",
    entityId: disputeId,
    newData: { resolution },
    req,
  });

  return mapDispute(dispute);
}

function mapDispute(d: DisputeModel) {
  return {
    id: d.id,
    reporterId: d.reporterId,
    againstUserId: d.againstUserId,
    projectId: d.projectId,
    investmentId: d.investmentId,
    subject: d.subject,
    description: d.description,
    status: d.status,
    resolution: d.resolution,
    resolvedBy: d.resolvedBy,
    resolvedAt: d.resolvedAt?.toISOString(),
    createdAt: d.createdAt.toISOString(),
  };
}
