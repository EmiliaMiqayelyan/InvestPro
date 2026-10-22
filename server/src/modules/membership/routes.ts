import { Router } from "express";
import { asyncHandler, ok, requireRole, type AuthedRequest } from "../../app/middleware";
import { AppError } from "../../shared/errors/AppError";
import * as membership from "./service";

const router = Router();

router.get("/plans", (_req, res) => ok(res, membership.MEMBERSHIP_PLANS));

router.get(
  "/me",
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireRole(req, ["investor", "admin", "project_owner"]);
    return ok(res, await membership.getMyMembership(auth.sub));
  })
);

router.post(
  "/subscribe",
  asyncHandler(async (req: AuthedRequest, res) => {
    requireRole(req, ["investor"]);
    throw AppError.badRequest("Pay with Binance Pay. Access starts after the payment is confirmed.");
  })
);

router.post(
  "/checkout",
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireRole(req, ["investor"]);
    const planId = req.body?.planId || "service";
    return ok(res, await membership.checkout(auth.sub, planId));
  })
);

export default router;
