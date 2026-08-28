import { Router } from "express";
import { z } from "zod";
import {
  asyncHandler,
  ok,
  requireAuth,
  requireRole,
  validateBody,
  param,
  type AuthedRequest,
} from "../../app/middleware";
import * as projects from "./service";
import * as ownerService from "../owner/service";
import * as investmentService from "../investments/service";

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
        location: (q.location || q.country) as string | undefined,
        stage: q.stage as string | undefined,
        minInvestment: q.minInvestment || q.min_investment ? Number(q.minInvestment || q.min_investment) : undefined,
        fundingStatus: q.fundingStatus as string | undefined,
        riskLevel: (q.riskLevel || q.risk_level) as string | undefined,
        sortBy: (q.sortBy || q.sort) as string || "newest",
        sortOrder: (q.sortOrder as "asc" | "desc") || "desc",
        page: Number(q.page || 1),
        limit: Number(q.limit || 12),
      })
    );
  })
);

router.post(
  "/",
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireRole(req, ["project_owner", "admin"]);
    const project = await ownerService.createOwnerProject(auth, req.body);
    return ok(res, project, "Project created", 201);
  })
);

router.get(
  "/:id",
  asyncHandler(async (req: AuthedRequest, res) => {
    return ok(res, await projects.getProject(param(req, "id"), req.auth ?? null));
  })
);

router.patch(
  "/:id",
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireRole(req, ["project_owner", "admin"]);
    const project = await ownerService.patchOwnerProject(auth, param(req, "id"), req.body);
    return ok(res, project);
  })
);

router.post(
  "/:id/submit",
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireRole(req, ["project_owner"]);
    const project = await projects.submitProject(param(req, "id"), auth.sub);
    return ok(res, project, "Project submitted for review");
  })
);

router.post(
  "/:id/publish",
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireRole(req, ["project_owner", "admin"]);
    const project = await projects.publishProject(param(req, "id"), auth.sub);
    return ok(res, project, "Project published");
  })
);

router.post(
  "/:id/offers",
  validateBody(
    z.object({
      amount: z.number().positive(),
      proposedTerms: z.record(z.unknown()).optional(),
      conditions: z.string().optional(),
    })
  ),
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireRole(req, ["investor"]);
    const offer = await investmentService.createOfferOnProject(
      auth.sub,
      param(req, "id"),
      req.body
    );
    return ok(res, offer, "Offer created", 201);
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
