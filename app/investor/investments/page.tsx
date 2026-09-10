"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Handshake } from "lucide-react";
import { investorApi } from "@/services/api";
import { QUERY_KEYS, ROUTES, STATUS_COLORS } from "@/constants";
import { useI18n } from "@/hooks";
import { useSetPageTitle } from "@/components/providers/page-title-provider";
import { PageHeader } from "@/components/shared/page-header";
import { PanelPage } from "@/components/shared/panel-page";
import { PanelCard } from "@/components/shared/panel-card";
import { EmptyState } from "@/components/shared/empty-state";
import { PanelListSkeleton } from "@/components/shared/loading-skeleton";
import { formatCurrency, formatDate } from "@/utils/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function InvestorInvestmentsPage() {
  const { t } = useI18n();
  useSetPageTitle(t("investor.myInvestments"));

  const { data: investments = [], isLoading } = useQuery({
    queryKey: [QUERY_KEYS.INVESTMENTS],
    queryFn: async () => (await investorApi.investments()).data.data,
  });

  return (
    <PanelPage>
      <PageHeader
        variant="minimal"
        title={t("investor.myInvestments")}
        actions={
          <Button asChild variant="outline">
            <Link href={ROUTES.INVESTOR_PROJECTS}>{t("nav.browseMarketplace")}</Link>
          </Button>
        }
      />

      {isLoading ? (
        <PanelListSkeleton rows={1} />
      ) : investments.length === 0 ? (
        <EmptyState
          icon={Handshake}
          title={t("common.noResults")}
          description={t("investor.browseProjects")}
        />
      ) : (
        <div className="space-y-3">
          {investments.map((inv) => (
            <PanelCard
              key={inv.id}
              className="flex flex-wrap items-center justify-between gap-4"
            >
              <div>
                <p className="font-semibold text-foreground">
                  {inv.project?.title || t("common.projectFallback")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(inv.createdAt)}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{t("offers.amount")}</p>
                  <p className="font-semibold text-foreground">{formatCurrency(inv.amount)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{t("projects.expectedRoi")}</p>
                  <p className="font-semibold text-emerald-600">
                    {formatCurrency(inv.expectedReturn)}
                  </p>
                </div>
                <Badge className={cn("border capitalize", STATUS_COLORS[inv.status])}>
                  {inv.status}
                </Badge>
                {inv.projectId && (
                  <Button asChild size="sm" variant="outline">
                    <Link href={`${ROUTES.INVESTOR_PROJECTS}/${inv.projectId}`}>
                      {t("common.view")}
                    </Link>
                  </Button>
                )}
              </div>
            </PanelCard>
          ))}
        </div>
      )}
    </PanelPage>
  );
}
