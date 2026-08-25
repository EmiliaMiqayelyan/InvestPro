import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { Op } from "sequelize";
import { z } from "zod";
import { UserModel } from "../../shared/database/associations";
import { AppError } from "../../shared/errors/AppError";
import { toUser } from "../../shared/utils/mappers";
import {
  createTokenPair,
  payloadToUser,
  verifyRefreshToken,
} from "../../shared/utils/jwt";
import { logActivity } from "../../shared/utils/activity";
import { dispatchNotificationEvent } from "../notifications/service";
import type { UserRole } from "../../shared/types";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
  role: z.enum(["investor", "project_owner", "admin"]).optional(),
  companyName: z.string().optional(),
});

export async function login(email: string, password: string) {
  const normalized = email.trim().toLowerCase();
  const users = await UserModel.findAll({
    where: { email: { [Op.like]: normalized } },
  });
  // Prefer exact case-insensitive match across dialects
  const matched =
    users.find((u) => u.email.toLowerCase() === normalized) ||
    (await UserModel.findAll()).find((u) => u.email.toLowerCase() === normalized);

  if (!matched || !(await bcrypt.compare(password, matched.passwordHash))) {
    throw AppError.unauthorized("Invalid email or password");
  }
  if (!matched.isActive) throw AppError.forbidden("Account is deactivated");

  const safe = toUser(matched);
  const tokens = await createTokenPair(safe);
  await logActivity(matched.id, "login", "auth");
  return { user: safe, tokens };
}

export async function register(body: z.infer<typeof registerSchema>) {
  const existing = await UserModel.findOne({ where: { email: body.email } });
  if (existing) throw AppError.conflict("Email already registered");
  if (body.role === "admin") throw AppError.forbidden("Cannot self-register as admin");

  const role: UserRole = body.role === "project_owner" ? "project_owner" : "investor";
  const passwordHash = await bcrypt.hash(body.password, 10);
  const id = uuidv4();

  const row = await UserModel.create({
    id,
    email: body.email,
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
  const tokens = await createTokenPair(safe);
  return { user: safe, tokens };
}

export async function refresh(refreshToken: string) {
  const payload = await verifyRefreshToken(refreshToken);
  if (!payload) throw AppError.unauthorized("Invalid refresh token");
  const stored = await UserModel.findByPk(payload.sub);
  const user = stored ? toUser(stored) : payloadToUser(payload);
  return createTokenPair(user);
}

export async function getMe(userId: string) {
  const stored = await UserModel.findByPk(userId);
  if (stored) return toUser(stored);
  throw AppError.notFound("User not found");
}
