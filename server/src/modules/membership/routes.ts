import { Router } from "express";
import { asyncHandler, ok, requireRole, type AuthedRequest } from "../../app/middleware";
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
    const auth = requireRole(req, ["investor"]);
    const planId = req.body?.planId || "service";
    const result = await membership.subscribe(auth.sub, planId);
    return ok(res, result, "Membership activated");
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
