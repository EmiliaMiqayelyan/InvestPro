import type { User, UserRole, MembershipPlanId, MembershipTier } from "@/types";
import { ROUTES } from "@/constants";

export type { UserRole };

export const ROLES = {
  INVESTOR: "investor",
  PROJECT_OWNER: "project_owner",
  ADMIN: "admin",
} as const satisfies Record<string, UserRole>;

export const ROLE_HOME: Record<UserRole, string> = {
  admin: ROUTES.ADMIN_DASHBOARD,
  investor: ROUTES.INVESTOR_DASHBOARD,
  project_owner: ROUTES.OWNER_DASHBOARD,
};

export interface RouteAccessRule {
  prefix: string;
  roles?: UserRole[];
}

export const ROUTE_ACCESS_RULES: RouteAccessRule[] = [
  { prefix: "/admin", roles: ["admin"] },
  { prefix: "/owner", roles: ["project_owner", "admin"] },
  { prefix: "/investor", roles: ["investor", "admin"] },
  { prefix: "/messages", roles: ["investor", "project_owner", "admin"] },
];

export const GUEST_ONLY_ROUTES = [
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.FORGOT_PASSWORD,
] as string[];

export const MEMBERSHIP_RANK: Record<MembershipTier, number> = {
  none: 0,
  service: 1,
};

export function findRouteRule(pathname: string): RouteAccessRule | null {
  return (
    ROUTE_ACCESS_RULES.find(
      (rule) =>
        pathname === rule.prefix || pathname.startsWith(`${rule.prefix}/`)
    ) ?? null
  );
}

export function isAdmin(user: Pick<User, "role"> | null | undefined): boolean {
  return user?.role === "admin";
}

export function isInvestor(user: Pick<User, "role"> | null | undefined): boolean {
  return user?.role === "investor";
}

export function isProjectOwner(user: Pick<User, "role"> | null | undefined): boolean {
  return user?.role === "project_owner";
}

export function hasRole(
  user: Pick<User, "role"> | null | undefined,
  allowedRoles: UserRole[] | undefined
): boolean {
  if (!allowedRoles || allowedRoles.length === 0) return !!user;
  return !!user && allowedRoles.includes(user.role);
}

const LEGACY_ROLE_MAP: Record<string, UserRole> = {
  user: "investor",
  projectowner: "project_owner",
  "project-owner": "project_owner",
};

/** Normalize persisted/legacy role strings to the current UserRole union. */
export function normalizeRole(role: string | undefined | null): UserRole | undefined {
  if (!role) return undefined;
  if (role === "investor" || role === "project_owner" || role === "admin") return role;
  return LEGACY_ROLE_MAP[role.toLowerCase()];
}

export function getRoleHome(role: string | undefined | null): string {
  const normalized = normalizeRole(role);
  if (normalized && ROLE_HOME[normalized]) return ROLE_HOME[normalized];
  return ROUTES.LOGIN || "/login";
}

/** Normalize legacy tier strings (basic/premium/enterprise) to service access. */
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

/** Full project materials require platform service fee (investors). */
export function canAccessFullProject(
  user:
    | Pick<User, "membershipTier" | "membershipExpiresAt" | "role">
    | null
    | undefined
): boolean {
  return hasActiveServiceAccess(user);
}

export function canSendOffers(
  user:
    | Pick<User, "membershipTier" | "membershipExpiresAt" | "role">
    | null
    | undefined
): boolean {
  return hasActiveServiceAccess(user) && (!user || user.role === "investor" || user.role === "admin");
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

/** @deprecated use canMessage(user) */
export function canMessageLegacy(
  tier: MembershipTier | undefined,
  role?: UserRole
): boolean {
  if (role === "project_owner" || role === "admin") return true;
  return hasMembershipAccess(tier, "service");
}
