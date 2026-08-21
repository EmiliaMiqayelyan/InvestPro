"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { WorkspaceShell } from "@/components/layout/workspace-shell";
import { useI18n } from "@/hooks";

export default function InvestorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useI18n();
  return (
    <ProtectedRoute allowedRoles={["investor", "admin"]}>
      <WorkspaceShell title={t("roles.investor")}>{children}</WorkspaceShell>
    </ProtectedRoute>
  );
}
