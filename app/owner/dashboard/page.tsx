"use client";

import Link from "next/link";
import {
  FolderKanban,
  Handshake,
  MessageSquare,
  BarChart3,
  Plus,
  ArrowRight,
} from "lucide-react";
import { useOwnerDashboard } from "@/hooks/use-marketplace";
import { useSetPageTitle } from "@/components/providers/page-title-provider";
import { useAuth } from "@/hooks";
import { useI18n } from "@/hooks";
import { ROUTES } from "@/constants";
import { formatCurrency } from "@/utils/format";
import { Button } from "@/components/ui/button";
import { PanelPage } from "@/components/shared/panel-page";

export default function OwnerDashboardPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const { data: stats, isLoading } = useOwnerDashboard();
  useSetPageTitle(t("owner.dashboard"));

  return (
    <PanelPage>
      <div className="surface-card flex flex-wrap items-center justify-between gap-4 p-6 lg:p-8">
        <div>
          <p className="text-sm text-muted-foreground">
            {user?.firstName ? `${t("owner.dashboard")}, ${user.firstName}` : t("owner.dashboard")}
          </p>
          <h2 className="mt-1 font-display text-2xl font-semibold text-foreground">
            {t("owner.overview")}
          </h2>
        </div>
        <Button asChild>
          <Link href={ROUTES.OWNER_PROJECT_CREATE}>
            <Plus className="h-4 w-4" /> {t("owner.createProjectShort")}
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
        <div className="surface-card flex flex-col justify-between p-6 sm:col-span-2 lg:row-span-2">
          <div>
            <BarChart3 className="h-5 w-5 text-primary" />
            <p className="mt-4 text-sm text-muted-foreground">{t("owner.fundingRaised")}</p>
            <p className="mt-1 font-display text-4xl font-semibold text-foreground">
              {isLoading ? "—" : formatCurrency(stats?.totalFundingRaised ?? 0)}
            </p>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-6">
            <div>
              <p className="text-xs text-muted-foreground">{t("owner.published")}</p>
              <p className="mt-1 text-xl font-semibold text-foreground">
                {isLoading ? "—" : stats?.publishedProjects ?? 0}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t("owner.pendingOffers")}</p>
              <p className="mt-1 text-xl font-semibold text-foreground">
                {isLoading ? "—" : stats?.pendingOffers ?? 0}
              </p>
            </div>
          </div>
        </div>

        {[
          { label: t("owner.myProjects"), value: stats?.myProjects ?? 0, icon: FolderKanban, href: ROUTES.OWNER_PROJECTS },
          { label: t("owner.investorRequests"), value: stats?.investorRequests ?? 0, icon: Handshake, href: ROUTES.OWNER_OFFERS },
          { label: t("owner.unreadMessages"), value: stats?.unreadMessages ?? 0, icon: MessageSquare, href: ROUTES.OWNER_MESSAGES },
          { label: t("owner.teamMembers"), value: stats?.teamMembers ?? 0, icon: BarChart3, href: ROUTES.OWNER_TEAM },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.label} href={item.href} className="surface-card-hover flex flex-col justify-between p-5">
              <Icon className="h-5 w-5 text-muted-foreground" />
              <div className="mt-4">
                <p className="text-2xl font-semibold text-foreground">
                  {isLoading ? "—" : item.value}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{item.label}</p>
              </div>
            </Link>
          );
        })}
      </div>

      <Button variant="outline" asChild>
        <Link href={ROUTES.OWNER_ANALYTICS}>
          {t("nav.analytics")} <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </PanelPage>
  );
}
