import { SignJWT, jwtVerify } from "jose";
import type { User, UserRole, MembershipTier, KycStatus } from "../types";
import { normalizeMembershipTier } from "./rbac";
import { env } from "../../app/config/env";

const JWT_SECRET = new TextEncoder().encode(env.JWT_SECRET);

export interface TokenPayload {
  sub: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  membershipTier: MembershipTier;
  membershipExpiresAt?: string;
  phone?: string;
  isEmailVerified: boolean;
  is2faEnabled: boolean;
  kycStatus: KycStatus;
  companyName?: string;
}

export async function signAccessToken(payload: TokenPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function signRefreshToken(payload: TokenPayload): Promise<string> {
  return new SignJWT({ ...payload, type: "refresh" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(JWT_SECRET);
}

function normalizePayload(raw: Record<string, unknown>): TokenPayload | null {
  if (!raw.sub || typeof raw.email !== "string") return null;
  return {
    sub: String(raw.sub),
    email: raw.email,
    firstName: typeof raw.firstName === "string" ? raw.firstName : "",
    lastName: typeof raw.lastName === "string" ? raw.lastName : "",
    role: raw.role as TokenPayload["role"],
    membershipTier: normalizeMembershipTier(
      typeof raw.membershipTier === "string" ? raw.membershipTier : "none"
    ),
    membershipExpiresAt:
      typeof raw.membershipExpiresAt === "string" ? raw.membershipExpiresAt : undefined,
    phone: typeof raw.phone === "string" ? raw.phone : undefined,
    isEmailVerified: Boolean(raw.isEmailVerified),
    is2faEnabled: Boolean(raw.is2faEnabled),
    kycStatus: (raw.kycStatus as TokenPayload["kycStatus"]) || "not_submitted",
    companyName: typeof raw.companyName === "string" ? raw.companyName : undefined,
  };
}

export async function verifyAccessToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return normalizePayload(payload as Record<string, unknown>);
  } catch {
    return null;
  }
}

export async function verifyRefreshToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (payload.type !== "refresh") return null;
    return normalizePayload(payload as Record<string, unknown>);
  } catch {
    return null;
  }
}

export function payloadToUser(payload: TokenPayload): User {
  const now = new Date().toISOString();
  return {
    id: payload.sub,
    email: payload.email,
    firstName: payload.firstName,
    lastName: payload.lastName,
    phone: payload.phone,
    role: payload.role,
    membershipTier: normalizeMembershipTier(payload.membershipTier),
    membershipExpiresAt: payload.membershipExpiresAt,
    isEmailVerified: payload.isEmailVerified,
    is2faEnabled: payload.is2faEnabled,
    kycStatus: payload.kycStatus,
    companyName: payload.companyName,
    createdAt: now,
    updatedAt: now,
  };
}

export function userToPayload(user: User): TokenPayload {
  return {
    sub: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    role: user.role,
    membershipTier: normalizeMembershipTier(user.membershipTier),
    membershipExpiresAt: user.membershipExpiresAt,
    isEmailVerified: user.isEmailVerified,
    is2faEnabled: user.is2faEnabled,
    kycStatus: user.kycStatus,
    companyName: user.companyName,
  };
}

export async function createTokenPair(user: User) {
  const payload = userToPayload(user);
  const [accessToken, refreshToken] = await Promise.all([
    signAccessToken(payload),
    signRefreshToken(payload),
  ]);
  return { accessToken, refreshToken };
}
