"use client";

import Link from "next/link";
import { ArrowRight, Briefcase, FileSearch, MessageSquare, Shield } from "lucide-react";
import { MarketingHeader, MarketingFooter } from "@/components/layout/marketing-shell";
import { CtaBand } from "@/components/shared/cta-band";
import { PageHeroBanner } from "@/components/shared/page-hero-banner";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants";
import { useI18n } from "@/hooks";

export default function ForInvestorsPage() {
  const { t } = useI18n();
  const blocks = [
    { icon: Briefcase, title: t("forInvestorsPage.b1Title"), body: t("forInvestorsPage.b1Body") },
    { icon: FileSearch, title: t("forInvestorsPage.b2Title"), body: t("forInvestorsPage.b2Body") },
    { icon: Shield, title: t("forInvestorsPage.b3Title"), body: t("forInvestorsPage.b3Body") },
    { icon: MessageSquare, title: t("forInvestorsPage.b4Title"), body: t("forInvestorsPage.b4Body") },
  ];

  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />
      <PageHeroBanner
        eyebrow={t("forInvestorsPage.eyebrow")}
        title={t("forInvestorsPage.heroTitle")}
        description={t("forInvestorsPage.heroSub")}
        height="md"
      />
      <section className="container-wide section-pad py-10 lg:py-14">
        <div className="grid gap-8 sm:grid-cols-2">
          {blocks.map((b) => (
            <div key={b.title} className="min-w-0 border-t border-border pt-6">
              <b.icon className="h-5 w-5 text-primary" />
              <h2 className="mt-4 font-display text-xl font-semibold">{b.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.body}</p>
            </div>
          ))}
        </div>
      </section>
      <CtaBand title={t("landing.forInvestorsCta")} description={t("forInvestorsPage.heroSub")}>
        <Button size="lg" variant="onImage" className="shrink-0" asChild>
          <Link href={`${ROUTES.REGISTER}?role=investor`}>
            {t("forInvestorsPage.cta")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button size="lg" variant="onImageOutline" className="shrink-0" asChild>
          <Link href={ROUTES.PROJECTS}>{t("forInvestorsPage.browse")}</Link>
        </Button>
      </CtaBand>
      <MarketingFooter />
    </div>
  );
}
