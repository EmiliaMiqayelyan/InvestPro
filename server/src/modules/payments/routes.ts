import { Router } from "express";
import { asyncHandler, ok, requireAuth, type AuthedRequest } from "../../app/middleware";
import { AppError } from "../../shared/errors/AppError";
import * as payments from "./service";
import { createTokenPair } from "../../shared/utils/jwt";
import { toUser } from "../../shared/utils/mappers";
import { UserModel } from "../../shared/database/associations";

const router = Router();

router.post(
  "/binance/webhook",
  asyncHandler(async (req: AuthedRequest, res) => {
    const raw = req.rawBody || JSON.stringify(req.body ?? {});
    try {
      await payments.handleBinanceWebhook(raw, req.headers);
    } catch (err) {
      if (err instanceof AppError && err.statusCode === 401) throw err;
      throw err;
    }
    return res.json({ returnCode: "SUCCESS", returnMessage: null });
  })
);

router.get(
  "/report",
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireAuth(req);
    return ok(res, await payments.listPaymentReport({ userId: auth.sub }));
  })
);

router.get(
  "/:id",
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireAuth(req);
    const paymentId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const payment = await payments.getPaymentForUser(auth.sub, paymentId);
    if (payment.status === "completed" && payment.type === "service_fee") {
      const user = await UserModel.findByPk(auth.sub);
      if (user) {
        const safe = toUser(user);
        return ok(res, { payment, user: safe, tokens: await createTokenPair(safe) });
      }
    }
    return ok(res, { payment });
  })
);

export default router;
