import { Router } from "express";
import {
  asyncHandler,
  ok,
  requireAuth,
  validateBody,
  type AuthedRequest,
} from "../../app/middleware";
import * as authService from "./service";
import { loginSchema, registerSchema } from "./service";
import { payloadToUser } from "../../shared/utils/jwt";
import { UserModel } from "../../shared/database/associations";
import { toUser } from "../../shared/utils/mappers";
import { z } from "zod";

const router = Router();

router.post(
  "/login",
  validateBody(loginSchema),
  asyncHandler(async (req, res) => {
    const result = await authService.login(req.body.email, req.body.password);
    return ok(res, result);
  })
);

router.post(
  "/register",
  validateBody(registerSchema),
  asyncHandler(async (req, res) => {
    const result = await authService.register(req.body);
    return ok(res, result, "Account created", 201);
  })
);

router.post("/logout", (_req, res) => ok(res, null, "Logged out"));

router.post("/forgot-password", (_req, res) =>
  ok(res, null, "If the email exists, a reset link was sent")
);

router.post("/verify-email", (_req, res) => ok(res, null, "Email verified"));

router.post(
  "/refresh",
  validateBody(z.object({ refreshToken: z.string().min(1) })),
  asyncHandler(async (req, res) => {
    const tokens = await authService.refresh(req.body.refreshToken);
    return ok(res, tokens);
  })
);

router.get(
  "/me",
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireAuth(req);
    const stored = await UserModel.findByPk(auth.sub);
    if (stored) return ok(res, toUser(stored));
    return ok(res, payloadToUser(auth));
  })
);

// Thin stubs for client-declared routes
router.post("/reset-password", (_req, res) =>
  ok(res, null, "Password reset is not fully implemented yet")
);
router.post("/resend-verification", (_req, res) =>
  ok(res, null, "Verification email resent (stub)")
);
router.post("/verify-2fa", (_req, res) =>
  ok(res, null, "2FA verification is not implemented", 501)
);
router.post("/2fa/enable", (_req, res) =>
  ok(res, { secret: "stub-secret", qrCode: "data:image/png;base64," }, "2FA setup stub")
);
router.post("/2fa/confirm", (_req, res) => ok(res, null, "2FA confirm stub"));
router.post("/2fa/disable", (_req, res) => ok(res, null, "2FA disable stub"));
router.post("/change-password", (_req, res) =>
  ok(res, null, "Change password is not fully implemented yet")
);

export default router;
