"use client";

import Link from "next/link";
import { ArrowRight, Building2, FileCheck, FileText, Handshake } from "lucide-react";
import { MarketingHeader, MarketingFooter } from "@/components/layout/marketing-shell";
import { CtaBand } from "@/components/shared/cta-band";
import { PageHeroBanner } from "@/components/shared/page-hero-banner";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants";
import { useI18n } from "@/hooks";

export default function ForOwnersPage() {
  const { t } = useI18n();
  const blocks = [
    { icon: Building2, title: t("forOwnersPage.b1Title"), body: t("forOwnersPage.b1Body") },
    { icon: FileText, title: t("forOwnersPage.b2Title"), body: t("forOwnersPage.b2Body") },
    { icon: FileCheck, title: t("forOwnersPage.b3Title"), body: t("forOwnersPage.b3Body") },
    { icon: Handshake, title: t("forOwnersPage.b4Title"), body: t("forOwnersPage.b4Body") },
  ];

  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />
      <PageHeroBanner
        eyebrow={t("forOwnersPage.eyebrow")}
        title={t("forOwnersPage.heroTitle")}
        description={t("forOwnersPage.heroSub")}
        height="md"
      >
        <Button size="lg" variant="onImage" className="shrink-0" asChild>
          <Link href={`${ROUTES.REGISTER}?role=project_owner`}>
            {t("forOwnersPage.cta")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button size="lg" variant="onImageOutline" className="shrink-0" asChild>
          <Link href={ROUTES.LOGIN}>{t("forOwnersPage.logIn")}</Link>
        </Button>
      </PageHeroBanner>
      <section className="container-wide section-pad py-10 lg:py-14">
        <div className="mx-auto copy-measure text-center">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">
            {t("forOwnersPage.sectionTitle")}
          </h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            {t("forOwnersPage.sectionSub")}
          </p>
        </div>
        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          {blocks.map((b) => (
            <div key={b.title} className="min-w-0 border-t border-border pt-6">
              <b.icon className="h-5 w-5 text-primary" />
              <h3 className="mt-4 font-display text-xl font-semibold">{b.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.body}</p>
            </div>
          ))}
        </div>
      </section>
      <CtaBand title={t("forOwnersPage.ctaTitle")} description={t("forOwnersPage.ctaBody")}>
        <Button size="lg" variant="onImage" className="shrink-0" asChild>
          <Link href={`${ROUTES.REGISTER}?role=project_owner`}>
            {t("forOwnersPage.create")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button size="lg" variant="onImageOutline" className="shrink-0" asChild>
          <Link href={ROUTES.LOGIN}>{t("forOwnersPage.logIn")}</Link>
        </Button>
      </CtaBand>
      <MarketingFooter />
    </div>
  );
}
