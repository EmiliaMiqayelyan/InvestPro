import { Router } from "express";
import {
  asyncHandler,
  ok,
  requireAuth,
  requireRole,
  validateBody,
  type AuthedRequest,
} from "../../app/middleware";
import * as kybService from "./service";
import { kybSubmitSchema } from "./service";

const router = Router();

router.get(
  "/",
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireAuth(req);
    const status = await kybService.getKybStatus(auth.sub);
    return ok(res, status);
  })
);

router.post(
  "/",
  validateBody(kybSubmitSchema),
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireAuth(req);
    requireRole(req, ["project_owner"]);
    const result = await kybService.submitKyb(auth.sub, req.body, req);
    return ok(res, result, "KYB submitted", 201);
  })
);

export default router;
