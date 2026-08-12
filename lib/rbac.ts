import type { User, UserRole, MembershipPlanId } from "@/types";
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

/** Legacy compatibility: membership tiers still exist in the data model,
 * but the marketplace UI/product no longer uses them for gating. */
export const MEMBERSHIP_RANK: Record<MembershipPlanId | "none", number> = {
  none: 0,
  basic: 1,
  premium: 2,
  enterprise: 3,
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

export function hasMembershipAccess(
  tier: MembershipPlanId | "none" | undefined,
  required: MembershipPlanId
): boolean {
  return MEMBERSHIP_RANK[tier ?? "none"] >= MEMBERSHIP_RANK[required];
}

/** Premium+ can access documents, team, messaging, offers */
export function canAccessFullProject(tier: MembershipPlanId | "none" | undefined): boolean {
  // Marketplace content is open to investors (no Premium/Enterprise gating).
  return true;
}

export function canSendOffers(tier: MembershipPlanId | "none" | undefined): boolean {
  // Investors can submit proposals without subscription tiers.
  return true;
}

export function canMessage(tier: MembershipPlanId | "none" | undefined, role?: UserRole): boolean {
  // Communication stays within the platform and is not subscription gated.
  if (role === "project_owner" || role === "admin") return true;
  return true;
}
