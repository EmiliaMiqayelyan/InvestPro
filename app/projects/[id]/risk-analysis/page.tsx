"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
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
import { useRiskAnalysis } from "@/hooks/use-marketplace";
import { RISK_LEVELS, ROUTES } from "@/constants";
import { formatDate } from "@/utils/format";
import { cn } from "@/lib/utils";

export default function RiskAnalysisPage() {
  const { id } = useParams<{ id: string }>();
  const { data: report, isLoading, error } = useRiskAnalysis(id);
  const risk = RISK_LEVELS.find((r) => r.value === report?.level);

  return (
    <div className="min-h-screen bg-white">
      <MarketingHeader />

      <div className="container-narrow section-pad py-10 animate-fade-in">
        <Button variant="ghost" size="sm" className="mb-6 -ml-2" asChild>
          <Link href={`/projects/${id}`}>
            <ArrowLeft className="h-4 w-4" />
            Back to project
          </Link>
        </Button>

        <h1 className="font-display text-3xl font-semibold text-slate-900 md:text-4xl">
          Investment Risk Report
        </h1>
        <p className="mt-2 text-muted-foreground">
          Automated diligence signals for this listing. Always do your own research.
        </p>

        {isLoading ? (
          <div className="mt-10">
            <CardSkeleton className="max-w-3xl" />
          </div>
        ) : error || !report ? (
          <div className="premium-card mt-10 p-8 text-center">
            <p className="text-sm text-muted-foreground">
              Risk analysis is unavailable. You may need a membership or the project may not be
              published.
            </p>
            <Button className="mt-4" asChild>
              <Link href={ROUTES.MEMBERSHIP}>View membership</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-10 space-y-8 animate-slide-up">
            <div className="premium-card grid gap-6 p-6 sm:grid-cols-3">
              <div>
                <p className="text-xs text-muted-foreground">Risk score</p>
                <p className="mt-1 font-display text-4xl font-semibold text-slate-900">
                  {report.score}
                  <span className="text-lg text-muted-foreground">/100</span>
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Level</p>
                <Badge className={cn("mt-2 border capitalize", risk?.bg, risk?.color)}>
                  {risk?.label ?? report.level}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Completeness</p>
                <p className="mt-1 font-display text-2xl font-semibold">{report.completeness}%</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Generated {formatDate(report.generatedAt)}
                </p>
              </div>
            </div>

            {report.summary && (
              <div className="premium-card p-6">
                <h2 className="font-display text-lg font-semibold">Summary</h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-700">{report.summary}</p>
              </div>
            )}

            <div className="grid gap-6 lg:grid-cols-2">
              <section className="premium-card p-6">
                <div className="mb-4 flex items-center gap-2 text-emerald-700">
                  <CheckCircle2 className="h-5 w-5" />
                  <h2 className="font-display text-lg font-semibold">Positive indicators</h2>
                </div>
                <ul className="space-y-3">
                  {(report.positiveIndicators ?? []).length ? (
                    report.positiveIndicators.map((item) => (
                      <li key={item.label} className="border-b border-border/70 pb-3 last:border-0">
                        <p className="text-sm font-medium text-slate-900">{item.label}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{item.detail}</p>
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-muted-foreground">No positives flagged.</li>
                  )}
                </ul>
              </section>

              <section className="premium-card p-6">
                <div className="mb-4 flex items-center gap-2 text-amber-700">
                  <AlertTriangle className="h-5 w-5" />
                  <h2 className="font-display text-lg font-semibold">Warnings</h2>
                </div>
                <ul className="space-y-3">
                  {(report.warningIndicators ?? []).length ? (
                    report.warningIndicators.map((item) => (
                      <li key={item.label} className="border-b border-border/70 pb-3 last:border-0">
                        <p className="text-sm font-medium text-slate-900">{item.label}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{item.detail}</p>
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-muted-foreground">No warnings flagged.</li>
                  )}
                </ul>
              </section>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <section className="premium-card p-6">
                <div className="mb-4 flex items-center gap-2 text-slate-700">
                  <FileWarning className="h-5 w-5" />
                  <h2 className="font-display text-lg font-semibold">Missing documents</h2>
                </div>
                <ul className="space-y-2">
                  {(report.missingDocuments ?? []).length ? (
                    report.missingDocuments.map((doc) => (
                      <li key={doc} className="flex gap-2 text-sm text-slate-700">
                        <span className="text-amber-600">•</span>
                        {doc}
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-muted-foreground">No missing documents listed.</li>
                  )}
                </ul>
              </section>

              <section className="premium-card p-6">
                <div className="mb-4 flex items-center gap-2 text-blue-700">
                  <HelpCircle className="h-5 w-5" />
                  <h2 className="font-display text-lg font-semibold">Questions to ask</h2>
                </div>
                <ul className="space-y-2">
                  {(report.questionsToAsk ?? []).length ? (
                    report.questionsToAsk.map((q) => (
                      <li key={q} className="flex gap-2 text-sm text-slate-700">
                        <span className="text-blue-600">•</span>
                        {q}
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-muted-foreground">No suggested questions.</li>
                  )}
                </ul>
              </section>
            </div>
          </div>
        )}
      </div>

      <MarketingFooter />
    </div>
  );
}
