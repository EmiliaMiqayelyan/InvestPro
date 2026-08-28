import { Router } from "express";
import {
  asyncHandler,
  ok,
  requireAuth,
  validateBody,
  type AuthedRequest,
} from "../../app/middleware";
import { requireIdempotencyKey } from "../../shared/utils/idempotency";
import * as walletService from "./service";
import { depositSchema, withdrawSchema } from "./service";

const router = Router();

router.get(
  "/",
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireAuth(req);
    const wallet = await walletService.getWallet(auth.sub);
    return ok(res, wallet);
  })
);

router.get(
  "/transactions",
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireAuth(req);
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const result = await walletService.getTransactions(auth.sub, { page, limit });
    return ok(res, result);
  })
);

router.post(
  "/deposit",
  requireIdempotencyKey("deposit"),
  validateBody(depositSchema),
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireAuth(req);
    const key = req.headers["idempotency-key"] as string;
    const result = await walletService.createDeposit(auth.sub, req.body, key, req);
    return ok(res, result, "Deposit successful", 201);
  })
);

router.post(
  "/withdraw",
  requireIdempotencyKey("withdraw"),
  validateBody(withdrawSchema),
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireAuth(req);
    const key = req.headers["idempotency-key"] as string;
    const result = await walletService.createWithdrawal(auth.sub, req.body, key, req);
    return ok(res, result, "Withdrawal request created", 201);
  })
);

router.get(
  "/withdrawals",
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireAuth(req);
    const withdrawals = await walletService.listWithdrawals(auth.sub);
    return ok(res, withdrawals);
  })
);

export default router;
