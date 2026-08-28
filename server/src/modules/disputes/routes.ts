import { Router } from "express";
import {
  asyncHandler,
  ok,
  requireAuth,
  requireRole,
  validateBody,
  type AuthedRequest,
} from "../../app/middleware";
import * as disputeService from "./service";
import { createDisputeSchema } from "./service";

const router = Router();

router.post(
  "/",
  validateBody(createDisputeSchema),
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireAuth(req);
    const dispute = await disputeService.createDispute(auth.sub, req.body, req);
    return ok(res, dispute, "Dispute filed", 201);
  })
);

router.get(
  "/",
  asyncHandler(async (req: AuthedRequest, res) => {
    requireAuth(req);
    requireRole(req, ["admin"]);
    const status = req.query.status as string | undefined;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const result = await disputeService.listDisputes({ status, page, limit });
    return ok(res, result);
  })
);

export default router;
