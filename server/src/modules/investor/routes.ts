import { Router } from "express";
import { asyncHandler, ok, requireRole, type AuthedRequest } from "../../app/middleware";
import * as investor from "./service";

const router = Router();

router.get(
  "/dashboard",
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireRole(req, ["investor", "admin"]);
    return ok(res, await investor.getInvestorDashboard(auth.sub));
  })
);

router.get(
  "/saved",
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireRole(req, ["investor"]);
    return ok(res, await investor.getSavedProjects(auth.sub));
  })
);

router.get(
  "/investments",
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireRole(req, ["investor"]);
    return ok(res, await investor.getInvestments(auth.sub));
  })
);

export default router;
