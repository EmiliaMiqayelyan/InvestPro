import { Router } from "express";
import {
  asyncHandler,
  ok,
  requireAuth,
  requireRole,
  param,
  type AuthedRequest,
} from "../../app/middleware";
import * as offers from "./service";

const router = Router();

router.post(
  "/",
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireRole(req, ["investor"]);
    const offer = await offers.createOffer(auth, req.body);
    return ok(res, offer, "Offer submitted", 201);
  })
);

router.get(
  "/",
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireAuth(req);
    return ok(
      res,
      await offers.listOffers(auth, {
        status: req.query.status as string | undefined,
        page: Number(req.query.page || 1),
        limit: Number(req.query.limit || 20),
      })
    );
  })
);

router.patch(
  "/:id",
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireRole(req, ["project_owner", "admin"]);
    return ok(res, await offers.patchOffer(auth, param(req, "id"), req.body));
  })
);

export default router;
