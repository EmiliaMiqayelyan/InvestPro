import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { asyncHandler, ok, requireAuth, type AuthedRequest } from "../../app/middleware";
import { KycSubmissionModel, UserModel } from "../../shared/database/associations";
import { toKyc } from "../../shared/utils/mappers";
import { logActivity } from "../../shared/utils/activity";
import { dispatchNotificationEvent } from "../notifications/service";

const router = Router();

router.get(
  "/",
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireAuth(req);
    const row = await KycSubmissionModel.findOne({
      where: { userId: auth.sub },
      order: [["submittedAt", "DESC"]],
    });
    return ok(res, row ? toKyc(row) : null);
  })
);

router.post(
  "/",
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireAuth(req);
    const body = req.body || {};
    const submission = await KycSubmissionModel.create({
      id: uuidv4(),
      userId: auth.sub,
      status: "pending",
      idDocumentUrl: body.idDocumentUrl || "#id",
      selfieUrl: body.selfieUrl || "#selfie",
      addressProofUrl: body.addressProofUrl || "#address",
      rejectionReason: null,
      submittedAt: new Date(),
      reviewedAt: null,
    });
    const user = await UserModel.findByPk(auth.sub);
    if (user) {
      user.kycStatus = "pending";
      await user.save();
    }
    await logActivity(auth.sub, "kyc_submitted", "kyc", submission.id);
    await dispatchNotificationEvent({
      kind: "kyc_submitted",
      userId: auth.sub,
      name: user ? `${user.firstName} ${user.lastName}` : "A user",
    });
    return ok(res, toKyc(submission), "KYC submitted", 201);
  })
);

export default router;
