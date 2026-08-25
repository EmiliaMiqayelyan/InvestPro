import { Router } from "express";
import {
  asyncHandler,
  ok,
  requireAuth,
  requireRole,
  param,
  type AuthedRequest,
} from "../../app/middleware";
import * as milestones from "./service";

const router = Router();

router.get(
  "/",
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireAuth(req);
    return ok(
      res,
      await milestones.listMilestones(auth, {
        projectId: req.query.projectId as string | undefined,
        status: req.query.status as string | undefined,
      })
    );
  })
);

router.get(
  "/:id",
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireAuth(req);
    return ok(res, await milestones.getMilestone(auth, param(req, "id")));
  })
);

router.post(
  "/",
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireRole(req, ["investor"]);
    const plan = await milestones.createMilestone(auth, req.body);
    return ok(res, plan, "Milestone plan created", 201);
  })
);

router.patch(
  "/:id",
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireRole(req, ["investor", "project_owner", "admin"]);
    return ok(res, await milestones.patchMilestone(auth, param(req, "id"), req.body));
  })
);

export default router;
