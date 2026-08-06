import type { User, UserRole } from "@/types";
import { ROUTES } from "@/constants";

export type { UserRole };

export const ROLES = {
  ADMIN: "admin",
  USER: "user",
} as const satisfies Record<string, UserRole>;

/** Landing page for each role after login / when blocked from a route. */
export const ROLE_HOME: Record<UserRole, string> = {
  admin: ROUTES.ADMIN,
  user: ROUTES.DASHBOARD,
};

/** Route prefixes that require authentication, with optional role restriction. */
export interface RouteAccessRule {
  prefix: string;
  /** If omitted, any authenticated user may access. */
  roles?: UserRole[];
}

export const ROUTE_ACCESS_RULES: RouteAccessRule[] = [
  { prefix: "/admin", roles: ["admin"] },
  { prefix: "/dashboard" },
  { prefix: "/wallet" },
  { prefix: "/deposit" },
  { prefix: "/withdraw" },
  { prefix: "/projects" },
  { prefix: "/investments" },
  { prefix: "/transactions" },
  { prefix: "/notifications" },
  { prefix: "/profile" },
  { prefix: "/security" },
  { prefix: "/kyc" },
];

/** Pages that authenticated users should be redirected away from. */
export const GUEST_ONLY_ROUTES = [
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.FORGOT_PASSWORD,
] as string[];

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

export function hasRole(
  user: Pick<User, "role"> | null | undefined,
  allowedRoles: UserRole[] | undefined
): boolean {
  if (!allowedRoles || allowedRoles.length === 0) return !!user;
  return !!user && allowedRoles.includes(user.role);
}

export function getRoleHome(role: UserRole | undefined): string {
  return role ? ROLE_HOME[role] : ROUTES.DASHBOARD;
}
