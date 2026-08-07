"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { WorkspaceShell } from "@/components/layout/workspace-shell";

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["project_owner", "admin"]}>
      <WorkspaceShell title="Project owner">{children}</WorkspaceShell>
    </ProtectedRoute>
  );
}
