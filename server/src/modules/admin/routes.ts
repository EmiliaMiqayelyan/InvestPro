import { Router } from "express";
import {
  asyncHandler,
  ok,
  requireAuth,
  requireRole,
  param,
  type AuthedRequest,
} from "../../app/middleware";
import * as admin from "./service";
import { ProjectModel } from "../../shared/database/associations";
import { toProject } from "../../shared/utils/mappers";
import { AppError } from "../../shared/errors/AppError";

const router = Router();

router.use((req: AuthedRequest, _res, next) => {
  try {
    requireRole(req, ["admin"]);
    next();
  } catch (err) {
    next(err);
  }
});

router.get(
  "/stats",
  asyncHandler(async (_req, res) => ok(res, await admin.getAdminStats()))
);

router.get(
  "/users",
  asyncHandler(async (req, res) =>
    ok(
      res,
      await admin.listUsers({
        role: req.query.role as string | undefined,
        search: req.query.search as string | undefined,
        page: Number(req.query.page || 1),
        limit: Number(req.query.limit || 20),
      })
    )
  )
);

router.patch(
  "/users/:id/role",
  asyncHandler(async (req, res) =>
    ok(res, await admin.updateUserRole(param(req, "id"), req.body.role))
  )
);

// Thin stubs
router.get("/users/:id", asyncHandler(async (req, res) => {
  const { UserModel } = await import("../../shared/database/associations");
  const { toUser } = await import("../../shared/utils/mappers");
  const user = await UserModel.findByPk(param(req, "id"));
  if (!user) throw AppError.notFound("User not found");
  return ok(res, toUser(user));
}));

router.patch("/users/:id", (_req, res) =>
  ok(res, null, "Admin user patch is not fully implemented yet")
);
router.post("/users/:id/activate", (_req, res) =>
  ok(res, null, "User activated (stub)")
);
router.post("/users/:id/deactivate", (_req, res) =>
  ok(res, null, "User deactivated (stub)")
);

router.get(
  "/projects",
  asyncHandler(async (req, res) =>
    ok(
      res,
      await admin.listAdminProjects({
        status: req.query.status as string | undefined,
        page: Number(req.query.page || 1),
        limit: Number(req.query.limit || 20),
      })
    )
  )
);

router.get(
  "/projects/pending",
  asyncHandler(async (_req, res) => ok(res, await admin.listPendingProjects()))
);

router.get(
  "/projects/:id",
  asyncHandler(async (req, res) => ok(res, await admin.getAdminProject(param(req, "id"))))
);

router.get(
  "/projects/:id/review-history",
  asyncHandler(async (req, res) => {
    const row = await ProjectModel.findByPk(param(req, "id"));
    if (!row) throw AppError.notFound("Project not found");
    return ok(res, toProject(row).reviewHistory || []);
  })
);

router.post(
  "/projects/:id/approve",
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireAuth(req);
    return ok(res, await admin.approve(auth, param(req, "id")), "Project approved and published");
  })
);

router.post(
  "/projects/:id/reject",
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireAuth(req);
    return ok(
      res,
      await admin.reject(auth, param(req, "id"), req.body?.reason),
      "Project rejected"
    );
  })
);

router.patch(
  "/projects/:id/status",
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireAuth(req);
    return ok(res, await admin.patchProjectStatus(auth, param(req, "id"), req.body));
  })
);

router.get(
  "/payments",
  asyncHandler(async (_req, res) => ok(res, await admin.listPayments()))
);

router.get(
  "/security",
  asyncHandler(async (_req, res) => ok(res, await admin.getSecurity()))
);

router.get(
  "/complaints",
  asyncHandler(async (_req, res) => ok(res, await admin.listComplaints()))
);

router.post(
  "/complaints",
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireAuth(req);
    const complaint = await admin.createComplaint(auth.sub, req.body);
    return ok(res, complaint, undefined, 201);
  })
);

export default router;
