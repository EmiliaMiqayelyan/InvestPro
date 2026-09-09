"use client";

import { useQuery } from "@tanstack/react-query";
import { PieChart } from "lucide-react";
import { portfolioApi } from "@/services/api";
import { QUERY_KEYS, STATUS_COLORS } from "@/constants";
import { formatCurrency, formatDate } from "@/utils/format";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { useSetPageTitle } from "@/components/providers/page-title-provider";
import { useI18n } from "@/hooks";
import { cn } from "@/lib/utils";

export default function InvestorPortfolioPage() {
  const { t } = useI18n();
  useSetPageTitle(t("investor.portfolioTitle"));

  const { data: portfolio, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.PORTFOLIO],
    queryFn: async () => (await portfolioApi.get()).data.data,
  });

  const { data: returns = [] } = useQuery({
    queryKey: [QUERY_KEYS.RETURNS],
    queryFn: async () => (await portfolioApi.returns()).data.data ?? [],
  });

  const metrics = [
    { label: t("investor.totalInvested"), value: portfolio?.totalInvested ?? 0 },
    { label: t("investor.currentValue"), value: portfolio?.currentValue ?? 0 },
    { label: t("investor.realizedReturns"), value: portfolio?.realizedReturns ?? 0 },
    { label: t("investor.unrealizedReturns"), value: portfolio?.unrealizedReturns ?? 0 },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        variant="minimal"
        title={t("investor.portfolioTitle")}
        description={t("investor.portfolioSub")}
      />

      {isLoading ? (
        <div className="premium-card h-32 animate-pulse bg-slate-100" />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            {metrics.map((m) => (
              <Card key={m.label} className="premium-card border-border bg-white shadow-none">
                <CardContent className="p-5">
                  <p className="text-xs text-muted-foreground">{m.label}</p>
                  <p className="mt-1 font-display text-2xl font-semibold text-slate-900">
                    {formatCurrency(m.value)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="premium-card grid gap-4 p-5 sm:grid-cols-3">
            <div>
              <p className="text-xs text-muted-foreground">{t("investor.activeInvestments")}</p>
              <p className="mt-1 font-display text-xl font-semibold">
                {portfolio?.activeInvestments ?? 0}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t("investor.completedInvestments")}</p>
              <p className="mt-1 font-display text-xl font-semibold">
                {portfolio?.completedInvestments ?? 0}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t("investor.roi")}</p>
              <p className="mt-1 font-display text-xl font-semibold text-emerald-700">
                {portfolio?.roi ?? 0}%
              </p>
            </div>
          </div>
          {(portfolio?.totalInvested ?? 0) === 0 && (
            <div className="premium-card flex flex-col items-center gap-2 p-10 text-center">
              <PieChart className="h-10 w-10 text-slate-300" />
              <p className="text-sm text-muted-foreground">{t("investor.noPortfolio")}</p>
            </div>
          )}
        </>
      )}

      <div className="space-y-3">
        <h2 className="font-display text-lg font-semibold">{t("investor.returnsHistory")}</h2>
        {returns.length === 0 ? (
          <div className="premium-card p-8 text-center text-sm text-muted-foreground">
            {t("investor.noReturns")}
          </div>
        ) : (
          returns.map((row) => (
            <div
              key={row.id}
              className="premium-card flex flex-wrap items-center justify-between gap-3 p-4"
            >
              <div>
                <p className="font-medium text-slate-900">{formatCurrency(row.netAmount)}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(row.createdAt)}
                  {row.paidAt ? ` · paid ${formatDate(row.paidAt)}` : ""}
                </p>
              </div>
              <Badge className={cn("border capitalize", STATUS_COLORS[row.status] || STATUS_COLORS.pending)}>
                {row.status}
              </Badge>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
