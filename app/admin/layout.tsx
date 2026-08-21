"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { WorkspaceShell } from "@/components/layout/workspace-shell";
import { useI18n } from "@/hooks";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useI18n();
  return (
    <ProtectedRoute requireAdmin>
      <WorkspaceShell title={t("admin.shellTitle")}>{children}</WorkspaceShell>
    </ProtectedRoute>
  );
}
