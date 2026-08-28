import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import {
  KybSubmissionModel,
  CompanyProfileModel,
  UserModel,
} from "../../shared/database/associations";
import { AppError } from "../../shared/errors/AppError";
import { writeAuditLog } from "../../shared/utils/audit";
import { dispatchNotificationEvent } from "../notifications/service";
import type { AuthedRequest } from "../../app/middleware";

export const kybSubmitSchema = z.object({
  registrationDocumentUrl: z.string().url(),
  taxDocumentUrl: z.string().url().optional(),
  bankStatementUrl: z.string().url().optional(),
});

export async function getKybStatus(userId: string) {
  const latest = await KybSubmissionModel.findOne({
    where: { userId },
    order: [["createdAt", "DESC"]],
  });
  if (!latest) return null;
  return {
    id: latest.id,
    status: latest.status,
    rejectionReason: latest.rejectionReason,
    submittedAt: latest.submittedAt.toISOString(),
    reviewedAt: latest.reviewedAt?.toISOString(),
  };
}

export async function submitKyb(
  userId: string,
  body: z.infer<typeof kybSubmitSchema>,
  req?: AuthedRequest
) {
  const user = await UserModel.findByPk(userId);
  if (!user || user.role !== "project_owner") {
    throw AppError.forbidden("KYB is only for company accounts");
  }

  const companyProfile = await CompanyProfileModel.findOne({ where: { userId } });

  const submission = await KybSubmissionModel.create({
    id: uuidv4(),
    userId,
    companyProfileId: companyProfile?.id ?? null,
    status: "pending",
    registrationDocumentUrl: body.registrationDocumentUrl,
    taxDocumentUrl: body.taxDocumentUrl ?? null,
    bankStatementUrl: body.bankStatementUrl ?? null,
    rejectionReason: null,
    submittedAt: new Date(),
    reviewedAt: null,
  });

  await writeAuditLog({
    actorId: userId,
    action: "kyb_submitted",
    entityType: "kyb",
    entityId: submission.id,
    req,
  });

  await dispatchNotificationEvent({
    kind: "kyb_submitted",
    userId,
    name: user.companyName || `${user.firstName} ${user.lastName}`,
  });

  return {
    id: submission.id,
    status: submission.status,
    submittedAt: submission.submittedAt.toISOString(),
  };
}

export async function reviewKyb(
  submissionId: string,
  adminId: string,
  approved: boolean,
  rejectionReason?: string,
  req?: AuthedRequest
) {
  const submission = await KybSubmissionModel.findByPk(submissionId);
  if (!submission) throw AppError.notFound("KYB submission not found");

  submission.status = approved ? "approved" : "rejected";
  submission.rejectionReason = approved ? null : rejectionReason ?? "Rejected";
  submission.reviewedAt = new Date();
  await submission.save();

  if (submission.companyProfileId) {
    const profile = await CompanyProfileModel.findByPk(submission.companyProfileId);
    if (profile) {
      profile.verificationStatus = approved ? "approved" : "rejected";
      await profile.save();
    }
  }

  await writeAuditLog({
    actorId: adminId,
    action: approved ? "kyb_approved" : "kyb_rejected",
    entityType: "kyb",
    entityId: submissionId,
    req,
  });

  await dispatchNotificationEvent({
    kind: approved ? "kyb_approved" : "kyb_rejected",
    userId: submission.userId,
    rejectionReason,
  });

  return {
    id: submission.id,
    status: submission.status,
    reviewedAt: submission.reviewedAt?.toISOString(),
  };
}
