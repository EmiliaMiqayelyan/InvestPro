"use client";

import { useAuthStore } from "@/store";
import { hasRole, isAdmin, type UserRole } from "@/lib/rbac";

/** Current user's role, or null when not authenticated. */
export function useRole(): UserRole | null {
  const user = useAuthStore((state) => state.user);
  return user?.role ?? null;
}

export function useIsAdmin(): boolean {
  const user = useAuthStore((state) => state.user);
  return isAdmin(user);
}

/** True when the authenticated user's role is in `allowedRoles`. */
export function useHasRole(allowedRoles: UserRole[]): boolean {
  const user = useAuthStore((state) => state.user);
  return hasRole(user, allowedRoles);
}
