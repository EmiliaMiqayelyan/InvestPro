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
import * as investmentService from "./service";

const router = Router();

router.get(
  "/:investmentId",
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireAuth(req);
    const result = await investmentService.getInvestment(
      param(req, "investmentId"),
      auth.sub,
      auth.role
    );
    return ok(res, result);
  })
);

router.post(
  "/:investmentId/confirm",
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireAuth(req);
    requireRole(req, ["investor"]);
    const result = await investmentService.confirmInvestment(
      param(req, "investmentId"),
      auth.sub,
      req
    );
    return ok(res, result, "Investment confirmed");
  })
);

router.post(
  "/:investmentId/fund",
  requireIdempotencyKey("fund"),
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireAuth(req);
    requireRole(req, ["investor"]);
    const key = req.headers["idempotency-key"] as string;
    const result = await investmentService.fundInvestmentById(
      param(req, "investmentId"),
      auth.sub,
      key,
      req
    );
    return ok(res, result, "Investment funded");
  })
);

export default router;
