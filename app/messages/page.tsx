"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store";
import { ROUTES } from "@/constants";
import { getRoleHome } from "@/lib/rbac";

export default function MessagesRedirectPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated || !user) {
      router.replace(ROUTES.LOGIN);
      return;
    }

    if (user.role === "investor") {
      router.replace(ROUTES.INVESTOR_MESSAGES);
      return;
    }
    if (user.role === "project_owner") {
      router.replace(ROUTES.OWNER_MESSAGES);
      return;
    }
    if (user.role === "admin") {
      router.replace(ROUTES.ADMIN_DASHBOARD);
      return;
    }

    router.replace(getRoleHome(user.role));
  }, [isAuthenticated, isLoading, router, user]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <p className="text-sm text-muted-foreground">Redirecting to messages...</p>
    </div>
  );
}
