import { AdminLayout } from "@/components/layout/admin-layout";
import { ProtectedRoute } from "@/components/auth/protected-route";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requireAdmin>
      <AdminLayout>{children}</AdminLayout>
    </ProtectedRoute>
  );
}
