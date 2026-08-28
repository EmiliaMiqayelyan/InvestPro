import { Router } from "express";
import {
  asyncHandler,
  ok,
  requireAuth,
  requireRole,
  validateBody,
  param,
  type AuthedRequest,
} from "../../app/middleware";
import * as reviewService from "./service";
import { createReviewSchema } from "./service";

const router = Router();

router.post(
  "/",
  validateBody(createReviewSchema),
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireAuth(req);
    requireRole(req, ["investor"]);
    const review = await reviewService.createReview(auth.sub, req.body);
    return ok(res, review, "Review created", 201);
  })
);

router.get(
  "/project/:projectId",
  asyncHandler(async (req, res) => {
    const reviews = await reviewService.listProjectReviews(param(req, "projectId"));
    return ok(res, reviews);
  })
);

export default router;
