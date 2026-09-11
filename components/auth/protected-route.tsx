"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants";
import { useAuthStore } from "@/store";
import { getRoleHome, hasRole, type UserRole } from "@/lib/rbac";
import { Skeleton } from "@/components/ui/skeleton";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({
  children,
  requireAdmin = false,
  allowedRoles,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuthStore();

  const roles = allowedRoles ?? (requireAdmin ? (["admin"] as UserRole[]) : undefined);
  const roleAllowed = !roles || hasRole(user, roles);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace(ROUTES.LOGIN);
      return;
    }
    if (!roleAllowed) {
      router.replace(getRoleHome(user?.role));
    }
  }, [isAuthenticated, isLoading, roleAllowed, user, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="space-y-4 w-64">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;
  if (!roleAllowed) return null;

  return <>{children}</>;
}
