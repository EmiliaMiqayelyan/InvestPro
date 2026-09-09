import { v4 as uuidv4 } from "uuid";
import { Op } from "sequelize";
import { z } from "zod";
import speakeasy from "speakeasy";
import { UserModel } from "../../shared/database/associations";
import { AppError } from "../../shared/errors/AppError";
import { toUser } from "../../shared/utils/mappers";
import {
  createTokenPair,
  payloadToUser,
  verifyRefreshToken,
} from "../../shared/utils/jwt";
import {
  hashPassword,
  verifyPassword,
  needsRehash,
} from "../../shared/utils/password";
import {
  createAuthToken,
  consumeAuthToken,
  storeRefreshToken,
  revokeRefreshToken,
  isRefreshTokenValid,
  revokeAllRefreshTokens,
} from "../../shared/utils/auth-tokens";
import { logActivity } from "../../shared/utils/activity";
import { writeAuditLog } from "../../shared/utils/audit";
import { enqueueJob } from "../../shared/jobs/queue";
import { dispatchNotificationEvent } from "../notifications/service";
import type { UserRole } from "../../shared/types";
import type { AuthedRequest } from "../../app/middleware";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  totpCode: z.string().optional(),
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
  role: z.enum(["investor", "project_owner", "admin"]).optional(),
  companyName: z.string().optional(),
});

export async function issueTokens(user: ReturnType<typeof toUser>) {
  const tokens = await createTokenPair(user);
  await storeRefreshToken(user.id, tokens.refreshToken);
  return tokens;
}

export async function login(email: string, password: string, totpCode?: string) {
  const normalized = email.trim().toLowerCase();
  const matched = await UserModel.findOne({ where: { email: normalized } });

  if (!matched || !(await verifyPassword(password, matched.passwordHash))) {
    throw AppError.unauthorized("Invalid email or password");
  }
  if (!matched.isActive) throw AppError.forbidden("Account is deactivated");
  if (matched.status === "suspended" || matched.status === "blocked") {
    throw AppError.forbidden("Account is suspended");
  }

  if (matched.is2faEnabled) {
    if (!totpCode) {
      const safe = toUser(matched);
      return { user: safe, tokens: null, requires2fa: true as const };
    }
    if (!matched.totpSecret || !speakeasy.totp.verify({ secret: matched.totpSecret, encoding: "base32", token: totpCode, window: 1 })) {
      throw AppError.unauthorized("Invalid 2FA code");
    }
  }

  if (needsRehash(matched.passwordHash)) {
    matched.passwordHash = await hashPassword(password);
    await matched.save();
  }

  matched.lastLoginAt = new Date();
  await matched.save();

  const safe = toUser(matched);
  const tokens = await issueTokens(safe);
  await logActivity(matched.id, "login", "auth");
  return { user: safe, tokens, requires2fa: false as const };
}

export async function register(body: z.infer<typeof registerSchema>) {
  const existing = await UserModel.findOne({ where: { email: body.email.toLowerCase() } });
  if (existing) throw AppError.conflict("Email already registered");
  if (body.role === "admin") throw AppError.forbidden("Cannot self-register as admin");

  const role: UserRole = body.role === "project_owner" ? "project_owner" : "investor";
  const passwordHash = await hashPassword(body.password);
  const id = uuidv4();

  const row = await UserModel.create({
    id,
    email: body.email.toLowerCase(),
    passwordHash,
    firstName: body.firstName,
    lastName: body.lastName,
    phone: body.phone ?? null,
    role,
    companyName: body.companyName ?? null,
    membershipTier: "none",
    membershipExpiresAt: null,
    isEmailVerified: false,
    is2faEnabled: false,
    kycStatus: "not_submitted",
    avatar: null,
    bio: null,
    isActive: true,
    status: "registered",
    emailVerifiedAt: null,
    lastLoginAt: null,
    isSuperAdmin: false,
    totpSecret: null,
  });

  const verifyToken = await createAuthToken(id, "email_verify", 48);
  await enqueueJob("email", {
    to: row.email,
    subject: "Verify your email",
    text: `Your verification token: ${verifyToken}`,
  });

  await logActivity(id, "register", "auth", undefined, { role });
  await dispatchNotificationEvent({
    kind: "user_registered",
    userId: id,
    role,
    name: `${row.firstName} ${row.lastName}`,
    email: row.email,
  });

  const safe = toUser(row);
  const tokens = await issueTokens(safe);
  return { user: safe, tokens };
}

export async function refresh(refreshToken: string) {
  const payload = await verifyRefreshToken(refreshToken);
  if (!payload) throw AppError.unauthorized("Invalid refresh token");
  if (!(await isRefreshTokenValid(refreshToken))) {
    throw AppError.unauthorized("Refresh token revoked or expired");
  }

  await revokeRefreshToken(refreshToken);

  const stored = await UserModel.findByPk(payload.sub);
  if (!stored || !stored.isActive) throw AppError.unauthorized("User not found");
  const user = toUser(stored);
  return issueTokens(user);
}

export async function logout(refreshToken?: string, userId?: string) {
  if (refreshToken) await revokeRefreshToken(refreshToken);
  if (userId) await revokeAllRefreshTokens(userId);
}

export async function verifyEmail(token: string) {
  const userId = await consumeAuthToken(token, "email_verify");
  if (!userId) throw AppError.badRequest("Invalid or expired verification token");

  const user = await UserModel.findByPk(userId);
  if (!user) throw AppError.notFound("User not found");

  user.isEmailVerified = true;
  user.emailVerifiedAt = new Date();
  if (user.status === "registered") user.status = "email_verified";
  await user.save();

  await dispatchNotificationEvent({ kind: "email_verified", userId });
  return toUser(user);
}

export async function forgotPassword(email: string) {
  const user = await UserModel.findOne({ where: { email: email.toLowerCase() } });
  if (!user) return;

  const token = await createAuthToken(user.id, "password_reset", 1);
  await enqueueJob("email", {
    to: user.email,
    subject: "Password reset",
    text: `Your password reset token: ${token}`,
  });
}

export async function resetPassword(token: string, newPassword: string) {
  const userId = await consumeAuthToken(token, "password_reset");
  if (!userId) throw AppError.badRequest("Invalid or expired reset token");

  const user = await UserModel.findByPk(userId);
  if (!user) throw AppError.notFound("User not found");

  user.passwordHash = await hashPassword(newPassword);
  await user.save();
  await revokeAllRefreshTokens(userId);
}

export async function changePassword(userId: string, currentPassword: string, newPassword: string) {
  const user = await UserModel.findByPk(userId);
  if (!user) throw AppError.notFound("User not found");
  if (!(await verifyPassword(currentPassword, user.passwordHash))) {
    throw AppError.unauthorized("Current password is incorrect");
  }

  user.passwordHash = await hashPassword(newPassword);
  await user.save();
  await revokeAllRefreshTokens(userId);
}

export async function enable2fa(userId: string) {
  const user = await UserModel.findByPk(userId);
  if (!user) throw AppError.notFound("User not found");

  const secret = speakeasy.generateSecret({ name: "InvestIN", length: 20 });
  user.totpSecret = secret.base32;
  await user.save();

  return { secret: secret.base32, otpauth: secret.otpauth_url };
}

export async function confirm2fa(userId: string, code: string) {
  const user = await UserModel.findByPk(userId);
  if (!user || !user.totpSecret) throw AppError.badRequest("2FA setup not started");
  if (!speakeasy.totp.verify({ secret: user.totpSecret, encoding: "base32", token: code, window: 1 })) {
    throw AppError.badRequest("Invalid 2FA code");
  }
  user.is2faEnabled = true;
  await user.save();
}

export async function disable2fa(userId: string, code: string) {
  const user = await UserModel.findByPk(userId);
  if (!user || !user.totpSecret) throw AppError.badRequest("2FA not enabled");
  if (!speakeasy.totp.verify({ secret: user.totpSecret, encoding: "base32", token: code, window: 1 })) {
    throw AppError.badRequest("Invalid 2FA code");
  }
  user.is2faEnabled = false;
  user.totpSecret = null;
  await user.save();
}

export async function getMe(userId: string) {
  const stored = await UserModel.findByPk(userId);
  if (stored) return toUser(stored);
  throw AppError.notFound("User not found");
}

export async function suspendUser(adminId: string, userId: string, req?: AuthedRequest) {
  const user = await UserModel.findByPk(userId);
  if (!user) throw AppError.notFound("User not found");
  user.status = "suspended";
  user.isActive = false;
  await user.save();
  await revokeAllRefreshTokens(userId);
  await writeAuditLog({
    actorId: adminId,
    action: "user_suspended",
    entityType: "user",
    entityId: userId,
    req,
  });
  return toUser(user);
}

export async function activateUser(adminId: string, userId: string, req?: AuthedRequest) {
  const user = await UserModel.findByPk(userId);
  if (!user) throw AppError.notFound("User not found");
  user.status = "active";
  user.isActive = true;
  await user.save();
  await writeAuditLog({
    actorId: adminId,
    action: "user_activated",
    entityType: "user",
    entityId: userId,
    req,
  });
  return toUser(user);
}
