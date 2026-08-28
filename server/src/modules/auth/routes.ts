import { Router } from "express";
import { z } from "zod";
import {
  asyncHandler,
  ok,
  requireAuth,
  validateBody,
  type AuthedRequest,
} from "../../app/middleware";
import * as authService from "./service";
import { loginSchema, registerSchema } from "./service";

const router = Router();

router.post(
  "/login",
  validateBody(loginSchema),
  asyncHandler(async (req, res) => {
    const result = await authService.login(req.body.email, req.body.password, req.body.totpCode);
    if (result.requires2fa) {
      return ok(res, { requires2fa: true }, "2FA required");
    }
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

router.post(
  "/logout",
  asyncHandler(async (req: AuthedRequest, res) => {
    const refreshToken = req.body?.refreshToken as string | undefined;
    const auth = req.auth;
    await authService.logout(refreshToken, auth?.sub);
    return ok(res, null, "Logged out");
  })
);

router.post(
  "/forgot-password",
  validateBody(z.object({ email: z.string().email() })),
  asyncHandler(async (req, res) => {
    await authService.forgotPassword(req.body.email);
    return ok(res, null, "If the email exists, a reset link was sent");
  })
);

router.post(
  "/verify-email",
  validateBody(z.object({ token: z.string().min(1) })),
  asyncHandler(async (req, res) => {
    const user = await authService.verifyEmail(req.body.token);
    return ok(res, user, "Email verified");
  })
);

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
    return ok(res, await authService.getMe(auth.sub));
  })
);

router.post(
  "/reset-password",
  validateBody(z.object({ token: z.string(), password: z.string().min(8) })),
  asyncHandler(async (req, res) => {
    await authService.resetPassword(req.body.token, req.body.password);
    return ok(res, null, "Password reset successful");
  })
);

router.post(
  "/resend-verification",
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireAuth(req);
    const { createAuthToken } = await import("../../shared/utils/auth-tokens");
    const { UserModel } = await import("../../shared/database/associations");
    const user = await UserModel.findByPk(auth.sub);
    if (!user) return ok(res, null, "User not found");
    if (user.isEmailVerified) return ok(res, null, "Email already verified");
    const token = await createAuthToken(user.id, "email_verify", 48);
    const { enqueueJob } = await import("../../shared/jobs/queue");
    await enqueueJob("email", {
      to: user.email,
      subject: "Verify your email",
      text: `Your verification token: ${token}`,
    });
    return ok(res, null, "Verification email sent");
  })
);

router.post(
  "/verify-2fa",
  validateBody(z.object({ email: z.string().email(), password: z.string(), totpCode: z.string() })),
  asyncHandler(async (req, res) => {
    const result = await authService.login(req.body.email, req.body.password, req.body.totpCode);
    return ok(res, result);
  })
);

router.post(
  "/2fa/enable",
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireAuth(req);
    const setup = await authService.enable2fa(auth.sub);
    return ok(res, setup);
  })
);

router.post(
  "/2fa/confirm",
  validateBody(z.object({ code: z.string().length(6) })),
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireAuth(req);
    await authService.confirm2fa(auth.sub, req.body.code);
    return ok(res, null, "2FA enabled");
  })
);

router.post(
  "/2fa/disable",
  validateBody(z.object({ code: z.string().length(6) })),
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireAuth(req);
    await authService.disable2fa(auth.sub, req.body.code);
    return ok(res, null, "2FA disabled");
  })
);

router.post(
  "/change-password",
  validateBody(
    z.object({ currentPassword: z.string(), newPassword: z.string().min(8) })
  ),
  asyncHandler(async (req: AuthedRequest, res) => {
    const auth = requireAuth(req);
    await authService.changePassword(auth.sub, req.body.currentPassword, req.body.newPassword);
    return ok(res, null, "Password changed");
  })
);

export default router;
