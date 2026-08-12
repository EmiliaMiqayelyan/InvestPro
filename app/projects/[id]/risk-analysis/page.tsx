"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle2,
  FileWarning,
  HelpCircle,
  ArrowLeft,
} from "lucide-react";
import { MarketingHeader, MarketingFooter } from "@/components/layout/marketing-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CardSkeleton } from "@/components/shared/loading-skeleton";
import { ServicePaywall } from "@/components/shared/service-paywall";
import { useRiskAnalysis } from "@/hooks/use-marketplace";
import { useI18n } from "@/hooks";
import { RISK_LEVELS, ROUTES } from "@/constants";
import { formatCurrency, formatDate } from "@/utils/format";
import {
  DILIGENCE_DISCLAIMER_EN,
  DILIGENCE_DISCLAIMER_HY,
  formatRiskLevel,
} from "@/features/security";
import { cn } from "@/lib/utils";

export default function RiskAnalysisPage() {
  const { id } = useParams<{ id: string }>();
  const pathname = usePathname();
  const { t, locale } = useI18n();
  const isHy = locale === "hy";
  const inInvestorPanel = pathname.startsWith("/investor");
  const projectHref = inInvestorPanel
    ? `${ROUTES.INVESTOR_PROJECTS}/${id}`
    : `${ROUTES.PROJECTS}/${id}`;
  const membershipHref = inInvestorPanel ? ROUTES.INVESTOR_MEMBERSHIP : ROUTES.MEMBERSHIP;
  const { data: report, isLoading, error } = useRiskAnalysis(id);
  const risk = RISK_LEVELS.find((r) => r.value === report?.level);
  const disclaimer = isHy ? DILIGENCE_DISCLAIMER_HY : DILIGENCE_DISCLAIMER_EN;

  const summary =
    isHy && report?.summaryHy?.trim() ? report.summaryHy : report?.summary;
  const positive = (report?.positiveIndicators ?? []).map((item) => ({
    label: isHy && item.labelHy?.trim() ? item.labelHy : item.label,
    detail: isHy && item.detailHy?.trim() ? item.detailHy : item.detail,
  }));
  const warnings = (report?.warningIndicators ?? []).map((item) => ({
    label: isHy && item.labelHy?.trim() ? item.labelHy : item.label,
    detail: isHy && item.detailHy?.trim() ? item.detailHy : item.detail,
  }));
  const missing =
    isHy && report?.missingDocumentsHy?.length
      ? report.missingDocumentsHy
      : report?.missingDocuments ?? [];
  const questions =
    isHy && report?.questionsToAskHy?.length
      ? report.questionsToAskHy
      : report?.questionsToAsk ?? [];

  return (
    <div className={inInvestorPanel ? "animate-fade-in" : "min-h-screen bg-white"}>
      {!inInvestorPanel && <MarketingHeader />}

      <div
        className={
          inInvestorPanel ? "animate-fade-in py-2" : "container-narrow section-pad py-10 animate-fade-in"
        }
      >
        <Button variant="ghost" size="sm" className="mb-6 -ml-2" asChild>
          <Link href={projectHref}>
            <ArrowLeft className="h-4 w-4" />
            {t("risk.backToProject")}
          </Link>
        </Button>

        <h1 className="font-display text-3xl font-semibold text-slate-900 md:text-4xl">
          {t("risk.title")}
        </h1>
        <p className="mt-2 text-muted-foreground">{t("risk.subtitle")}</p>

        <div className="mt-6 premium-card border-slate-200 bg-slate-50 p-5">
          <p className="font-display text-sm font-semibold text-slate-900">
            Informational risk assessment
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{disclaimer}</p>
        </div>

        {isLoading ? (
          <div className="mt-10">
            <CardSkeleton className="max-w-3xl" />
          </div>
        ) : error || !report ? (
          <div className="premium-card mt-10 p-8 text-center">
            <p className="text-sm text-muted-foreground">{t("risk.unavailable")}</p>
          </div>
        ) : report.limited ? (
          <div className="mt-10 space-y-4">
            <p className="text-sm text-muted-foreground">{t("risk.limited")}</p>
            <ServicePaywall />
            <Button variant="outline" asChild>
              <Link href={membershipHref}>{t("risk.viewMembership")}</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-10 space-y-8 animate-slide-up">
            <div className="premium-card grid gap-6 p-6 sm:grid-cols-3">
              <div>
                <p className="text-xs text-muted-foreground">{t("risk.score")}</p>
                <p className="mt-1 font-display text-4xl font-semibold text-slate-900">
                  {report.score}
                  <span className="text-lg text-muted-foreground">/100</span>
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t("risk.level")}</p>
                <Badge className={cn("mt-2 border capitalize", risk?.bg, risk?.color)}>
                  {risk?.label ?? formatRiskLevel(report.level)}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t("risk.completeness")}</p>
                <p className="mt-1 font-display text-2xl font-semibold">{report.completeness}%</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t("risk.generated", { date: formatDate(report.generatedAt) })}
                </p>
              </div>
            </div>

            {(report.phaseBudgetTotal != null || report.phaseBudgetGap != null) && (
              <div className="premium-card grid gap-4 p-5 sm:grid-cols-2">
                {report.phaseBudgetTotal != null && (
                  <div>
                    <p className="text-xs text-muted-foreground">{t("risk.phaseBudget")}</p>
                    <p className="mt-1 font-semibold text-teal-900">
                      {formatCurrency(report.phaseBudgetTotal)}
                    </p>
                  </div>
                )}
                {report.phaseBudgetGap != null && (
                  <div>
                    <p className="text-xs text-muted-foreground">{t("risk.phaseGap")}</p>
                    <p className="mt-1 font-semibold text-slate-900">
                      {formatCurrency(report.phaseBudgetGap)}
                    </p>
                  </div>
                )}
              </div>
            )}

            {summary && (
              <div className="premium-card p-6">
                <h2 className="font-display text-lg font-semibold">{t("risk.summary")}</h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-700">{summary}</p>
              </div>
            )}

            <div className="grid gap-6 lg:grid-cols-2">
              <section className="premium-card p-6">
                <div className="mb-4 flex items-center gap-2 text-emerald-700">
                  <CheckCircle2 className="h-5 w-5" />
                  <h2 className="font-display text-lg font-semibold">{t("risk.positive")}</h2>
                </div>
                <ul className="space-y-3">
                  {positive.length ? (
                    positive.map((item) => (
                      <li key={item.label} className="border-b border-border/70 pb-3 last:border-0">
                        <p className="text-sm font-medium text-slate-900">{item.label}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{item.detail}</p>
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-muted-foreground">{t("risk.noPositives")}</li>
                  )}
                </ul>
              </section>

              <section className="premium-card p-6">
                <div className="mb-4 flex items-center gap-2 text-amber-700">
                  <AlertTriangle className="h-5 w-5" />
                  <h2 className="font-display text-lg font-semibold">{t("risk.warningsShort")}</h2>
                </div>
                <ul className="space-y-3">
                  {warnings.length ? (
                    warnings.map((item) => (
                      <li key={item.label} className="border-b border-border/70 pb-3 last:border-0">
                        <p className="text-sm font-medium text-slate-900">{item.label}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{item.detail}</p>
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-muted-foreground">{t("risk.noWarnings")}</li>
                  )}
                </ul>
              </section>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <section className="premium-card p-6">
                <div className="mb-4 flex items-center gap-2 text-slate-700">
                  <FileWarning className="h-5 w-5" />
                  <h2 className="font-display text-lg font-semibold">{t("risk.missing")}</h2>
                </div>
                <ul className="space-y-2">
                  {missing.length ? (
                    missing.map((doc) => (
                      <li key={doc} className="flex gap-2 text-sm text-slate-700">
                        <span className="text-amber-600">•</span>
                        {doc}
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-muted-foreground">{t("risk.noMissing")}</li>
                  )}
                </ul>
              </section>

              <section className="premium-card p-6">
                <div className="mb-4 flex items-center gap-2 text-teal-800">
                  <HelpCircle className="h-5 w-5" />
                  <h2 className="font-display text-lg font-semibold">{t("risk.questionsShort")}</h2>
                </div>
                <ul className="space-y-2">
                  {questions.length ? (
                    questions.map((q) => (
                      <li key={q} className="flex gap-2 text-sm text-slate-700">
                        <span className="text-teal-700">•</span>
                        {q}
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-muted-foreground">{t("risk.noQuestions")}</li>
                  )}
                </ul>
              </section>
            </div>
          </div>
        )}
      </div>

      {!inInvestorPanel && <MarketingFooter />}
    </div>
  );
}
