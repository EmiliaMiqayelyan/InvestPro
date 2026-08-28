"use client";

import Link from "next/link";
import {
  Users,
  FolderKanban,
  CreditCard,
  Shield,
  AlertTriangle,
} from "lucide-react";
import { useAdminStats } from "@/hooks/use-marketplace";
import { useSetPageTitle } from "@/components/providers/page-title-provider";
import { useI18n } from "@/hooks";
import { ROUTES } from "@/constants";
import { formatCurrency } from "@/utils/format";
import type { TranslationKey } from "@/i18n";

export default function AdminDashboardPage() {
  const { t } = useI18n();
  const { data: stats, isLoading } = useAdminStats();
  useSetPageTitle(t("admin.dashboardTitle"));

  const metrics: { key: TranslationKey; value: string | number; href: string; icon: typeof Users }[] = [
    { key: "admin.totalInvestors", value: stats?.totalInvestors ?? 0, href: ROUTES.ADMIN_USERS, icon: Users },
    { key: "admin.totalProjects", value: stats?.totalProjects ?? 0, href: ROUTES.ADMIN_PROJECTS, icon: FolderKanban },
    { key: "admin.pendingProjects", value: stats?.pendingProjects ?? 0, href: ROUTES.ADMIN_PROJECTS, icon: FolderKanban },
    { key: "admin.pendingKyc", value: stats?.pendingKyc ?? 0, href: ROUTES.ADMIN_SECURITY, icon: Shield },
    { key: "admin.openComplaints", value: stats?.openComplaints ?? 0, href: ROUTES.ADMIN_COMPLAINTS, icon: AlertTriangle },
    { key: "admin.activeMemberships", value: stats?.activeMemberships ?? 0, href: ROUTES.ADMIN_PAYMENTS, icon: CreditCard },
  ];

  return (
    <div className="space-y-8">
      <div className="surface-card p-6 lg:p-8">
        <h2 className="font-display text-2xl font-semibold">{t("admin.dashboardTitle")}</h2>
        <p className="mt-1 text-muted-foreground">{t("admin.dashboardSub")}</p>
        <div className="mt-6 flex items-baseline gap-2">
          <span className="font-display text-3xl font-semibold">
            {isLoading ? "—" : formatCurrency(stats?.totalFunding ?? 0)}
          </span>
          <span className="text-sm text-muted-foreground">{t("admin.totalFunding")}</span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <Link key={m.key} href={m.href} className="surface-card-hover flex items-center gap-4 p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary">
                <Icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-semibold tabular-nums">{isLoading ? "—" : m.value}</p>
                <p className="text-sm text-muted-foreground">{t(m.key)}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
