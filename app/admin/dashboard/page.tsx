"use client";

import Link from "next/link";
import {
  Users,
  FolderKanban,
  CreditCard,
  Shield,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { useAdminStats } from "@/hooks/use-marketplace";
import { useI18n } from "@/hooks";
import { ROUTES } from "@/constants";
import { formatCurrency } from "@/utils/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TranslationKey } from "@/i18n";

export default function AdminDashboardPage() {
  const { t } = useI18n();
  const { data: stats, isLoading } = useAdminStats();

  const cards: { labelKey: TranslationKey; value: string | number }[] = [
    { labelKey: "admin.totalInvestors", value: stats?.totalInvestors ?? 0 },
    { labelKey: "admin.totalOwners", value: stats?.totalOwners ?? 0 },
    { labelKey: "admin.totalProjects", value: stats?.totalProjects ?? 0 },
    { labelKey: "admin.publishedProjects", value: stats?.publishedProjects ?? 0 },
    { labelKey: "admin.pendingProjects", value: stats?.pendingProjects ?? 0 },
    { labelKey: "admin.activeMemberships", value: stats?.activeMemberships ?? 0 },
    { labelKey: "admin.pendingKyc", value: stats?.pendingKyc ?? 0 },
    { labelKey: "admin.openComplaints", value: stats?.openComplaints ?? 0 },
    { labelKey: "admin.totalOffers", value: stats?.totalOffers ?? 0 },
    {
      labelKey: "admin.totalFunding",
      value: formatCurrency(stats?.totalFunding ?? 0),
    },
  ];

  const links: { href: string; labelKey: TranslationKey; icon: typeof Users }[] = [
    { href: ROUTES.ADMIN_USERS, labelKey: "nav.users", icon: Users },
    { href: ROUTES.ADMIN_PROJECTS, labelKey: "nav.projects", icon: FolderKanban },
    { href: ROUTES.ADMIN_PAYMENTS, labelKey: "nav.payments", icon: CreditCard },
    { href: ROUTES.ADMIN_SECURITY, labelKey: "nav.security", icon: Shield },
    { href: ROUTES.ADMIN_COMPLAINTS, labelKey: "nav.complaints", icon: AlertTriangle },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl font-semibold text-slate-900">
          {t("admin.dashboardTitle")}
        </h2>
        <p className="text-sm text-muted-foreground">{t("admin.dashboardSub")}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Card
            key={card.labelKey}
            className="premium-card border-border bg-white shadow-none backdrop-blur-none"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t(card.labelKey)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-display text-2xl font-semibold text-slate-900">
                {isLoading ? "…" : card.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="premium-card group p-5 transition hover:-translate-y-0.5"
            >
              <Icon className="mb-3 h-5 w-5 text-teal-800" />
              <p className="font-medium text-slate-900">{t(link.labelKey)}</p>
              <span className="mt-2 inline-flex items-center gap-1 text-xs text-teal-800">
                {t("admin.openLink")}{" "}
                <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
