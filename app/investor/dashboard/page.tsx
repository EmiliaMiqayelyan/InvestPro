"use client";

import Link from "next/link";
import {
  Briefcase,
  Handshake,
  MessageSquare,
  Bookmark,
  Shield,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { useInvestorDashboard } from "@/hooks/use-marketplace";
import { useSetPageTitle } from "@/components/providers/page-title-provider";
import { useAuth } from "@/hooks";
import { useI18n } from "@/hooks";
import { ROUTES } from "@/constants";
import { formatCurrency } from "@/utils/format";
import { Button } from "@/components/ui/button";
import { PanelPage } from "@/components/shared/panel-page";
import { hasActiveServiceAccess } from "@/lib/rbac";

export default function InvestorDashboardPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const { data: stats, isLoading } = useInvestorDashboard();
  useSetPageTitle(t("investor.dashboard"));

  const hasAccess = hasActiveServiceAccess(user);
  const firstName = user?.firstName;

  return (
    <PanelPage className="space-y-8">
      {/* Welcome strip */}
      <div className="surface-card flex flex-wrap items-center justify-between gap-4 p-6 lg:p-8">
        <div>
          <p className="text-sm text-muted-foreground">
            {firstName ? `${t("common.dashboard")}, ${firstName}` : t("investor.dashboard")}
          </p>
          <h2 className="mt-1 font-display text-2xl font-semibold">{t("investor.overview")}</h2>
          {!hasAccess && (
            <p className="mt-2 text-sm text-amber-700">
              {t("membership.paywallTitle")} —{" "}
              <Link href={ROUTES.INVESTOR_MEMBERSHIP} className="font-medium underline">
                {t("membership.paywallCta")}
              </Link>
            </p>
          )}
        </div>
        <Button asChild>
          <Link href={ROUTES.INVESTOR_PROJECTS}>
            {t("investor.browseProjects")} <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Bento grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
        {/* Portfolio — large card */}
        <div className="surface-card flex flex-col justify-between p-6 sm:col-span-2 lg:row-span-2">
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">{t("investor.portfolioValue")}</p>
            <p className="mt-1 font-display text-4xl font-semibold tabular-nums">
              {isLoading ? "—" : formatCurrency(stats?.portfolioValue ?? 0)}
            </p>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-6">
            <div>
              <p className="text-xs text-muted-foreground">{t("investor.myInvestments")}</p>
              <p className="mt-1 text-xl font-semibold">{isLoading ? "—" : stats?.myInvestments ?? 0}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t("investor.activeOffers")}</p>
              <p className="mt-1 text-xl font-semibold">{isLoading ? "—" : stats?.activeOffers ?? 0}</p>
            </div>
          </div>
        </div>

        {[
          { label: t("investor.availableProjects"), value: stats?.availableProjects ?? 0, icon: Briefcase, href: ROUTES.INVESTOR_PROJECTS },
          { label: t("investor.savedProjects"), value: stats?.savedProjects ?? 0, icon: Bookmark, href: ROUTES.INVESTOR_SAVED },
          { label: t("investor.unreadMessages"), value: stats?.unreadMessages ?? 0, icon: MessageSquare, href: ROUTES.INVESTOR_MESSAGES },
          { label: t("investor.myInvestments"), value: stats?.myInvestments ?? 0, icon: Handshake, href: ROUTES.INVESTOR_INVESTMENTS },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.label} href={item.href} className="surface-card-hover flex flex-col justify-between p-5">
              <Icon className="h-5 w-5 text-muted-foreground" />
              <div className="mt-4">
                <p className="text-2xl font-semibold tabular-nums">{isLoading ? "—" : item.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{item.label}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" asChild>
          <Link href={ROUTES.INVESTOR_KYC}><Shield className="h-4 w-4" /> {t("investor.completeVerification")}</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href={ROUTES.INVESTOR_MILESTONES}>{t("nav.milestones")}</Link>
        </Button>
      </div>
    </PanelPage>
  );
}
