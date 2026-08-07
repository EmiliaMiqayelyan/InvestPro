"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { WorkspaceShell } from "@/components/layout/workspace-shell";

export default function InvestorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["investor", "admin"]}>
      <WorkspaceShell title="Investor">{children}</WorkspaceShell>
    </ProtectedRoute>
  );
}
