import { Router } from "express";
import { asyncHandler, ok, requireRole, param,
  type AuthedRequest,
} from "../../app/middleware";
import * as owner from "./service";

const router = Router();

router.get(
  "/dashboard",
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireRole(req, ["project_owner", "admin"]);
    return ok(res, await owner.getOwnerDashboard(auth.sub));
  })
);

router.get(
  "/projects",
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireRole(req, ["project_owner", "admin"]);
    return ok(res, await owner.listOwnerProjects(auth));
  })
);

router.post(
  "/projects",
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireRole(req, ["project_owner"]);
    const project = await owner.createOwnerProject(auth, req.body);
    return ok(res, project, "Project submitted for review", 201);
  })
);

router.patch(
  "/projects/:id",
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireRole(req, ["project_owner", "admin"]);
    return ok(res, await owner.patchOwnerProject(auth, param(req, "id"), req.body));
  })
);

router.delete(
  "/projects/:id",
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireRole(req, ["project_owner"]);
    return ok(res, await owner.deleteOwnerProject(auth, param(req, "id")), "Project deleted");
  })
);

router.post(
  "/projects/:id/documents",
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireRole(req, ["project_owner"]);
    const doc = await owner.addDocument(auth, param(req, "id"), req.body);
    return ok(res, doc, "Document uploaded", 201);
  })
);

router.delete(
  "/projects/:id/documents/:docId",
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireRole(req, ["project_owner"]);
    return ok(
      res,
      await owner.removeDocument(auth, param(req, "id"), param(req, "docId")),
      "Document removed"
    );
  })
);

router.post(
  "/projects/:id/team",
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireRole(req, ["project_owner"]);
    const member = await owner.addTeamMember(auth, param(req, "id"), req.body);
    return ok(res, member, "Team member added", 201);
  })
);

router.delete(
  "/projects/:id/team/:memberId",
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireRole(req, ["project_owner"]);
    return ok(
      res,
      await owner.removeTeamMember(auth, param(req, "id"), param(req, "memberId")),
      "Team member removed"
    );
  })
);

router.get(
  "/documents",
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireRole(req, ["project_owner"]);
    return ok(res, await owner.listOwnerDocuments(auth.sub));
  })
);

router.post(
  "/projects/:id/resubmit",
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireRole(req, ["project_owner"]);
    const updated = await owner.resubmitProject(auth, param(req, "id"));
    return ok(res, updated, "Project resubmitted for review");
  })
);

export default router;
