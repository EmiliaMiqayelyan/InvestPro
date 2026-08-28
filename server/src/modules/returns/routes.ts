import { Router } from "express";
import {
  asyncHandler,
  ok,
  requireAuth,
  type AuthedRequest,
} from "../../app/middleware";
import * as returnsService from "./service";
import { param } from "../../app/middleware";

const router = Router();

router.get(
  "/",
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireAuth(req);
    const returns = await returnsService.listMyReturns(auth.sub);
    return ok(res, returns);
  })
);

router.get(
  "/:investmentId/returns",
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireAuth(req);
    const returns = await returnsService.listInvestmentReturns(
      param(req, "investmentId"),
      auth.sub
    );
    return ok(res, returns);
  })
);

export default router;
