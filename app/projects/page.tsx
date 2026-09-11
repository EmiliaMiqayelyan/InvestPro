"use client";

import Link from "next/link";
import { PageHeroBanner } from "@/components/shared/page-hero-banner";
import { CtaBand } from "@/components/shared/cta-band";
import { MarketplaceBrowser } from "@/features/projects/marketplace-browser";
import { MarketingHeader, MarketingFooter } from "@/components/layout/marketing-shell";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/hooks";

export default function ProjectsMarketplacePage() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />
      <PageHeroBanner
        eyebrow={t("nav.marketplace")}
        title={t("projects.exploreTitle")}
        description={t("projects.exploreSub")}
        height="md"
      />
      <section id="marketplace" className="container-wide section-pad py-10">
        <MarketplaceBrowser projectBasePath="/projects" />
      </section>
      <CtaBand title={t("projects.ctaTitle")} description={t("projects.ctaBody")}>
        <Button size="lg" variant="onImage" className="shrink-0" asChild>
          <Link href="#marketplace">{t("landing.exploreProjects")}</Link>
        </Button>
      </CtaBand>
      <MarketingFooter />
    </div>
  );
}
