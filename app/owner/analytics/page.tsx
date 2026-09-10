"use client";

import { BarChart3 } from "lucide-react";
import { useOwnerProjects } from "@/hooks/use-marketplace";
import { useI18n } from "@/hooks";
import { useSetPageTitle } from "@/components/providers/page-title-provider";
import { PageHeader } from "@/components/shared/page-header";
import { PanelPage } from "@/components/shared/panel-page";
import { EmptyState } from "@/components/shared/empty-state";
import { PanelBlockSkeleton } from "@/components/shared/loading-skeleton";
import { formatCurrency } from "@/utils/format";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function OwnerAnalyticsPage() {
  const { t } = useI18n();
  useSetPageTitle(t("nav.analytics"));
  const { data: projects = [], isLoading } = useOwnerProjects();

  const totals = projects.reduce(
    (acc, p) => {
      const progress = Math.min(
        100,
        Math.round((p.currentFunding / Math.max(p.requiredInvestment, 1)) * 100)
      );
      acc.raised += p.currentFunding;
      acc.investors += p.investorCount ?? 0;
      acc.saved += p.savedCount ?? 0;
      acc.progressSum += progress;
      if (p.status === "published" || p.status === "funded") acc.active += 1;
      return acc;
    },
    { raised: 0, investors: 0, saved: 0, progressSum: 0, active: 0 }
  );
  const avgProgress =
    projects.length > 0 ? Math.round(totals.progressSum / projects.length) : 0;

  return (
    <PanelPage>
      <PageHeader
        variant="minimal"
        title={t("nav.analytics")}
        description={t("owner.analyticsSub")}
      />

      {isLoading ? (
        <PanelBlockSkeleton height="h-40" />
      ) : projects.length === 0 ? (
        <EmptyState icon={BarChart3} title={t("owner.analyticsEmpty")} />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-5">
                <p className="text-xs text-muted-foreground">{t("owner.analyticsTotalRaised")}</p>
                <p className="mt-1 font-display text-2xl font-semibold text-foreground">
                  {formatCurrency(totals.raised)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <p className="text-xs text-muted-foreground">{t("owner.analyticsAvgProgress")}</p>
                <p className="mt-1 font-display text-2xl font-semibold text-foreground">
                  {avgProgress}%
                </p>
                <Progress value={avgProgress} className="mt-3" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <p className="text-xs text-muted-foreground">{t("owner.analyticsActiveListings")}</p>
                <p className="mt-1 font-display text-2xl font-semibold text-foreground">
                  {totals.active}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <p className="text-xs text-muted-foreground">{t("owner.analyticsInvestors")}</p>
                <p className="mt-1 font-display text-2xl font-semibold text-foreground">
                  {totals.investors}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {projects.map((project) => {
              const progress = Math.min(
                100,
                Math.round(
                  (project.currentFunding / Math.max(project.requiredInvestment, 1)) * 100
                )
              );
              return (
                <Card key={project.id}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base text-foreground">{project.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap justify-between gap-2 text-sm">
                      <span className="text-muted-foreground">
                        {t("owner.analyticsRaised")}: {formatCurrency(project.currentFunding)}
                      </span>
                      <span className="font-medium text-foreground">
                        {t("owner.analyticsGoal")} {formatCurrency(project.requiredInvestment)} ·{" "}
                        {progress}%
                      </span>
                    </div>
                    <Progress value={progress} />
                    <div className="relative h-3 overflow-hidden rounded-full bg-muted">
                      <div
                        className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary to-primary/60 transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          {t("owner.analyticsInvestors")}
                        </p>
                        <p className="font-semibold text-foreground">{project.investorCount}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{t("owner.analyticsSaved")}</p>
                        <p className="font-semibold text-foreground">{project.savedCount}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{t("owner.analyticsRoi")}</p>
                        <p className="font-semibold text-emerald-600">{project.expectedRoi}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </PanelPage>
  );
}
