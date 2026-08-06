"use client";

import { useAuthStore } from "@/store";
import { hasRole, type UserRole } from "@/lib/rbac";

interface RoleGateProps {
  /** Roles allowed to see the children. */
  allowedRoles: UserRole[];
  /** Rendered when the user's role is not allowed (defaults to nothing). */
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Conditionally renders children based on the current user's role.
 * Purely a visibility gate — server-side checks still enforce access.
 *
 * Usage:
 *   <RoleGate allowedRoles={["admin"]}>
 *     <AdminOnlyButton />
 *   </RoleGate>
 */
export function RoleGate({ allowedRoles, fallback = null, children }: RoleGateProps) {
  const user = useAuthStore((state) => state.user);

  if (!hasRole(user, allowedRoles)) return <>{fallback}</>;
  return <>{children}</>;
}
