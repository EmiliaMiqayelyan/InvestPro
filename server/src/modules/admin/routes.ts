import { Router } from "express";
import {
  asyncHandler,
  ok,
  requireAuth,
  requireRole,
  param,
  type AuthedRequest,
} from "../../app/middleware";
import { requireIdempotencyKey } from "../../shared/utils/idempotency";
import * as admin from "./service";
import * as authService from "../auth/service";
import * as walletService from "../wallet/service";
import * as returnsService from "../returns/service";
import * as disputeService from "../disputes/service";
import * as kybService from "../kyb/service";
import { ProjectModel, AuditLogModel } from "../../shared/database/associations";
import { toProject, toUser } from "../../shared/utils/mappers";
import { AppError } from "../../shared/errors/AppError";

const router = Router();

router.use((req: AuthedRequest, _res, next) => {
  try {
    requireRole(req, ["admin"]);
    next();
  } catch (err) {
    next(err);
  }
});

router.get("/stats", asyncHandler(async (_req, res) => ok(res, await admin.getAdminStats())));

router.get(
  "/users",
  asyncHandler(async (req, res) =>
    ok(
      res,
      await admin.listUsers({
        role: req.query.role as string | undefined,
        search: req.query.search as string | undefined,
        page: Number(req.query.page || 1),
        limit: Number(req.query.limit || 20),
      })
    )
  )
);

router.get("/investors", asyncHandler(async (req, res) =>
  ok(res, await admin.listUsers({ role: "investor", search: req.query.search as string, page: Number(req.query.page || 1), limit: Number(req.query.limit || 20) }))
));

router.get("/companies", asyncHandler(async (req, res) =>
  ok(res, await admin.listUsers({ role: "project_owner", search: req.query.search as string, page: Number(req.query.page || 1), limit: Number(req.query.limit || 20) }))
));

router.patch("/users/:id/role", asyncHandler(async (req, res) =>
  ok(res, await admin.updateUserRole(param(req, "id"), req.body.role))
));

router.get("/users/:id", asyncHandler(async (req, res) => {
  const { UserModel } = await import("../../shared/database/associations");
  const user = await UserModel.findByPk(param(req, "id"));
  if (!user) throw AppError.notFound("User not found");
  return ok(res, toUser(user));
}));

router.post("/users/:id/suspend", asyncHandler(async (req: AuthedRequest, res) => {
  const auth = requireAuth(req);
  return ok(res, await authService.suspendUser(auth.sub, param(req, "id"), req));
}));

router.post("/users/:id/activate", asyncHandler(async (req: AuthedRequest, res) => {
  const auth = requireAuth(req);
  return ok(res, await authService.activateUser(auth.sub, param(req, "id"), req));
}));

router.get("/projects", asyncHandler(async (req, res) =>
  ok(res, await admin.listAdminProjects({ status: req.query.status as string, page: Number(req.query.page || 1), limit: Number(req.query.limit || 20) }))
));

router.get("/projects/pending", asyncHandler(async (_req, res) => ok(res, await admin.listPendingProjects())));

router.get("/projects/:id", asyncHandler(async (req, res) => ok(res, await admin.getAdminProject(param(req, "id")))));

router.get("/projects/:id/review-history", asyncHandler(async (req, res) => {
  const row = await ProjectModel.findByPk(param(req, "id"));
  if (!row) throw AppError.notFound("Project not found");
  return ok(res, toProject(row).reviewHistory || []);
}));

router.post("/projects/:id/approve", asyncHandler(async (req: AuthedRequest, res) => {
  const auth = requireAuth(req);
  return ok(res, await admin.approve(auth, param(req, "id")), "Project approved and published");
}));

router.post("/projects/:id/reject", asyncHandler(async (req: AuthedRequest, res) => {
  const auth = requireAuth(req);
  return ok(res, await admin.reject(auth, param(req, "id"), req.body?.reason), "Project rejected");
}));

router.patch("/projects/:id/status", asyncHandler(async (req: AuthedRequest, res) => {
  const auth = requireAuth(req);
  return ok(res, await admin.patchProjectStatus(auth, param(req, "id"), req.body));
}));

router.get("/investments", asyncHandler(async (req, res) => {
  const { InvestmentModel } = await import("../../shared/database/associations");
  const rows = await InvestmentModel.findAll({ order: [["createdAt", "DESC"]] });
  return ok(res, rows);
}));

router.get("/payments", asyncHandler(async (_req, res) => ok(res, await admin.listPayments())));

router.get("/withdrawals", asyncHandler(async (_req, res) => {
  const { WithdrawalModel } = await import("../../shared/database/associations");
  const rows = await WithdrawalModel.findAll({ order: [["createdAt", "DESC"]] });
  return ok(res, rows);
}));

router.post(
  "/withdrawals/:id/approve",
  requireIdempotencyKey("withdrawal_approve"),
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireAuth(req);
    const { WithdrawalModel } = await import("../../shared/database/associations");
    const withdrawal = await WithdrawalModel.findByPk(param(req, "id"));
    if (!withdrawal) throw AppError.notFound("Withdrawal not found");
    withdrawal.status = "approved";
    withdrawal.approvedBy = auth.sub;
    withdrawal.processedAt = new Date();
    await withdrawal.save();
    return ok(res, withdrawal);
  })
);

router.get("/returns", asyncHandler(async (_req, res) => {
  const { ReturnModel } = await import("../../shared/database/associations");
  const rows = await ReturnModel.findAll({ order: [["createdAt", "DESC"]] });
  return ok(res, rows);
}));

router.get("/disputes", asyncHandler(async (req, res) => {
  const result = await disputeService.listDisputes({
    status: req.query.status as string,
    page: Number(req.query.page || 1),
    limit: Number(req.query.limit || 20),
  });
  return ok(res, result);
}));

router.post("/disputes/:id/resolve", asyncHandler(async (req: AuthedRequest, res) => {
  const auth = requireAuth(req);
  const dispute = await disputeService.resolveDispute(
    param(req, "id"),
    auth.sub,
    req.body.resolution,
    req
  );
  return ok(res, dispute);
}));

router.get("/kyc", asyncHandler(async (_req, res) => ok(res, await admin.getSecurity())));

router.post("/kyc/:id/approve", asyncHandler(async (req: AuthedRequest, res) => {
  const auth = requireAuth(req);
  const { KycSubmissionModel, UserModel } = await import("../../shared/database/associations");
  const submission = await KycSubmissionModel.findByPk(param(req, "id"));
  if (!submission) throw AppError.notFound("KYC submission not found");
  submission.status = "approved";
  submission.reviewedAt = new Date();
  await submission.save();
  const user = await UserModel.findByPk(submission.userId);
  if (user) {
    user.kycStatus = "approved";
    if (user.status === "kyc_pending") user.status = "kyc_approved";
    await user.save();
  }
  return ok(res, submission);
}));

router.post("/kyc/:id/reject", asyncHandler(async (req: AuthedRequest, res) => {
  const { KycSubmissionModel, UserModel } = await import("../../shared/database/associations");
  const submission = await KycSubmissionModel.findByPk(param(req, "id"));
  if (!submission) throw AppError.notFound("KYC submission not found");
  submission.status = "rejected";
  submission.rejectionReason = req.body.reason || "Rejected";
  submission.reviewedAt = new Date();
  await submission.save();
  const user = await UserModel.findByPk(submission.userId);
  if (user) {
    user.kycStatus = "rejected";
    user.status = "kyc_rejected";
    await user.save();
  }
  return ok(res, submission);
}));

router.post("/kyb/:id/approve", asyncHandler(async (req: AuthedRequest, res) => {
  const auth = requireAuth(req);
  return ok(res, await kybService.reviewKyb(param(req, "id"), auth.sub, true, undefined, req));
}));

router.post("/kyb/:id/reject", asyncHandler(async (req: AuthedRequest, res) => {
  const auth = requireAuth(req);
  return ok(res, await kybService.reviewKyb(param(req, "id"), auth.sub, false, req.body.reason, req));
}));

router.get("/audit", asyncHandler(async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Math.min(Number(req.query.limit || 50), 100);
  const offset = (page - 1) * limit;
  const { count, rows } = await AuditLogModel.findAndCountAll({
    order: [["createdAt", "DESC"]],
    limit,
    offset,
  });
  return ok(res, { data: rows, total: count, page, limit });
}));

router.get("/reports", asyncHandler(async (_req, res) => {
  const stats = await admin.getAdminStats();
  return ok(res, { generatedAt: new Date().toISOString(), stats });
}));

router.get("/security", asyncHandler(async (_req, res) => ok(res, await admin.getSecurity())));

router.get("/complaints", asyncHandler(async (_req, res) => ok(res, await admin.listComplaints())));

router.post("/complaints", asyncHandler(async (req: AuthedRequest, res) => {
  const auth = requireAuth(req);
  const complaint = await admin.createComplaint(auth.sub, req.body);
  return ok(res, complaint, undefined, 201);
}));

router.patch("/complaints/:id", asyncHandler(async (req, res) => {
  const status = req.body?.status as "open" | "reviewing" | "resolved" | "dismissed";
  if (!status || !["open", "reviewing", "resolved", "dismissed"].includes(status)) {
    throw AppError.badRequest("Invalid complaint status");
  }
  return ok(res, await admin.updateComplaintStatus(param(req, "id"), status));
}));

router.get("/settings", asyncHandler(async (_req, res) => ok(res, await admin.getSystemSettings())));

router.put("/settings", asyncHandler(async (req: AuthedRequest, res) => {
  const auth = requireAuth(req);
  return ok(res, await admin.saveSystemSettings(auth.sub, req.body));
}));

export default router;
