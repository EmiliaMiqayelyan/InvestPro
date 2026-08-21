"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { WorkspaceShell } from "@/components/layout/workspace-shell";
import { useI18n } from "@/hooks";

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useI18n();
  return (
    <ProtectedRoute allowedRoles={["project_owner", "admin"]}>
      <WorkspaceShell title={t("roles.project_owner")}>{children}</WorkspaceShell>
    </ProtectedRoute>
  );
}
