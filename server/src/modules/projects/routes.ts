import { Router } from "express";
import {
  asyncHandler,
  ok,
  requireAuth,
  requireRole,
  param,
  type AuthedRequest,
} from "../../app/middleware";
import * as projects from "./service";

const router = Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const q = req.query;
    return ok(
      res,
      await projects.listPublicProjects({
        search: q.search as string | undefined,
        category: q.category as string | undefined,
        industry: q.industry as string | undefined,
        location: q.location as string | undefined,
        stage: q.stage as string | undefined,
        minInvestment: q.minInvestment ? Number(q.minInvestment) : undefined,
        fundingStatus: q.fundingStatus as string | undefined,
        riskLevel: q.riskLevel as string | undefined,
        sortBy: (q.sortBy as string) || "newest",
        sortOrder: (q.sortOrder as "asc" | "desc") || "desc",
        page: Number(q.page || 1),
        limit: Number(q.limit || 12),
      })
    );
  })
);

router.get(
  "/:id",
  asyncHandler(async (req: AuthedRequest, res) => {
    return ok(res, await projects.getProject(param(req, "id"), req.auth ?? null));
  })
);

router.get(
  "/:id/risk-analysis",
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireAuth(req);
    return ok(res, await projects.getRiskAnalysis(param(req, "id"), auth));
  })
);

router.post(
  "/:id/save",
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireRole(req, ["investor"]);
    return ok(res, await projects.saveProject(auth.sub, param(req, "id")));
  })
);

router.delete(
  "/:id/save",
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireRole(req, ["investor"]);
    return ok(res, await projects.unsaveProject(auth.sub, param(req, "id")));
  })
);

export default router;
