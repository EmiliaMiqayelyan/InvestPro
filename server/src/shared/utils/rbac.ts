import type { User, UserRole, MembershipPlanId, MembershipTier } from "../types";

export type { UserRole };

export const MEMBERSHIP_RANK: Record<MembershipTier, number> = {
  none: 0,
  service: 1,
};

const LEGACY_ROLE_MAP: Record<string, UserRole> = {
  user: "investor",
  projectowner: "project_owner",
  "project-owner": "project_owner",
};

export function normalizeRole(role: string | undefined | null): UserRole | undefined {
  if (!role) return undefined;
  if (role === "investor" || role === "project_owner" || role === "admin") return role;
  return LEGACY_ROLE_MAP[role.toLowerCase()];
}

export function normalizeMembershipTier(
  tier: string | undefined | null
): MembershipTier {
  if (!tier || tier === "none") return "none";
  if (
    tier === "service" ||
    tier === "basic" ||
    tier === "premium" ||
    tier === "enterprise"
  ) {
    return "service";
  }
  return "none";
}

export function hasActiveServiceAccess(
  user:
    | Pick<User, "membershipTier" | "membershipExpiresAt" | "role">
    | null
    | undefined
): boolean {
  if (!user) return false;
  if (user.role === "admin" || user.role === "project_owner") return true;
  const tier = normalizeMembershipTier(user.membershipTier);
  if (tier !== "service") return false;
  if (!user.membershipExpiresAt) return true;
  return new Date(user.membershipExpiresAt).getTime() > Date.now();
}

export function hasMembershipAccess(
  tier: MembershipTier | undefined,
  required: MembershipPlanId = "service"
): boolean {
  const normalized = normalizeMembershipTier(tier);
  return MEMBERSHIP_RANK[normalized] >= MEMBERSHIP_RANK[required];
}

export function canAccessFullProject(
  user:
    | Pick<User, "membershipTier" | "membershipExpiresAt" | "role">
    | null
    | undefined
): boolean {
  if (user?.role === "admin") return true;
  return hasActiveServiceAccess(user);
}

export function canSendOffers(
  user:
    | Pick<User, "membershipTier" | "membershipExpiresAt" | "role">
    | null
    | undefined
): boolean {
  return (
    hasActiveServiceAccess(user) &&
    (!user || user.role === "investor" || user.role === "admin")
  );
}

export function canMessage(
  user:
    | Pick<User, "membershipTier" | "membershipExpiresAt" | "role">
    | null
    | undefined
): boolean {
  if (!user) return false;
  if (user.role === "project_owner" || user.role === "admin") return true;
  return hasActiveServiceAccess(user);
}

export function isAdmin(user: Pick<User, "role"> | null | undefined): boolean {
  return user?.role === "admin";
}
