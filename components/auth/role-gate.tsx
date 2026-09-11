"use client";

import { useAuthStore } from "@/store";
import { hasRole, type UserRole } from "@/lib/rbac";

interface RoleGateProps {
  allowedRoles: UserRole[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function RoleGate({ allowedRoles, fallback = null, children }: RoleGateProps) {
  const user = useAuthStore((state) => state.user);

  if (!hasRole(user, allowedRoles)) return <>{fallback}</>;
  return <>{children}</>;
}
