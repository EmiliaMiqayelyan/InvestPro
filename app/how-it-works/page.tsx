"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MarketingHeader, MarketingFooter } from "@/components/layout/marketing-shell";
import { CtaBand } from "@/components/shared/cta-band";
import { PageHeroBanner } from "@/components/shared/page-hero-banner";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants";
import { useI18n } from "@/hooks";

export default function HowItWorksPage() {
  const { t } = useI18n();

  const ownerSteps = [
    { title: t("howItWorksPage.ownersS1Title"), body: t("howItWorksPage.ownersS1Body") },
    { title: t("howItWorksPage.ownersS2Title"), body: t("howItWorksPage.ownersS2Body") },
    { title: t("howItWorksPage.ownersS3Title"), body: t("howItWorksPage.ownersS3Body") },
  ];
  const investorSteps = [
    { title: t("howItWorksPage.investorsS1Title"), body: t("howItWorksPage.investorsS1Body") },
    { title: t("howItWorksPage.investorsS2Title"), body: t("howItWorksPage.investorsS2Body") },
    { title: t("howItWorksPage.investorsS3Title"), body: t("howItWorksPage.investorsS3Body") },
  ];

  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />
      <PageHeroBanner
        eyebrow={t("howItWorksPage.eyebrow")}
        title={t("howItWorksPage.heroTitle")}
        description={t("howItWorksPage.heroSub")}
        height="md"
      />
      <section className="container-wide section-pad py-14 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="min-w-0">
            <h2 className="font-display text-2xl font-semibold">
              {t("howItWorksPage.ownersTitle")}
            </h2>
            <ol className="mt-6 space-y-6">
              {ownerSteps.map((step, i) => (
                <li key={step.title} className="flex items-center gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {i + 1}
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <h3 className="font-semibold">{step.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="min-w-0 border-t border-border pt-12 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-16">
            <h2 className="font-display text-2xl font-semibold">
              {t("howItWorksPage.investorsTitle")}
            </h2>
            <ol className="mt-6 space-y-6">
              {investorSteps.map((step, i) => (
                <li key={step.title} className="flex items-center gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {i + 1}
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <h3 className="font-semibold">{step.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
      <CtaBand title={t("howItWorksPage.ctaTitle")} description={t("howItWorksPage.ctaBody")}>
        <Button size="lg" variant="onImage" className="shrink-0" asChild>
          <Link href={`${ROUTES.REGISTER}?role=project_owner`}>
            {t("howItWorksPage.ctaOwners")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button size="lg" variant="onImageOutline" className="shrink-0" asChild>
          <Link href={ROUTES.PROJECTS}>
            {t("howItWorksPage.ctaInvestors")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CtaBand>
      <MarketingFooter />
    </div>
  );
}
