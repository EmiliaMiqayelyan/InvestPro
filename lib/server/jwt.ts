import { SignJWT, jwtVerify } from "jose";
import type { User, UserRole, MembershipPlanId, KycStatus } from "@/types";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "investpro-dev-secret-change-in-production"
);

export interface TokenPayload {
  sub: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  membershipTier: MembershipPlanId | "none";
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

export async function verifyAccessToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (!payload.sub || typeof payload.email !== "string") return null;
    return payload as unknown as TokenPayload;
  } catch {
    return null;
  }
}

export async function verifyRefreshToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (payload.type !== "refresh" || typeof payload.sub !== "string") return null;
    return payload as unknown as TokenPayload;
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
    membershipTier: payload.membershipTier || "none",
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
    membershipTier: user.membershipTier,
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
