"use client";

import { PageHeroBanner } from "@/components/shared/page-hero-banner";
import { MarketplaceBrowser } from "@/features/projects/marketplace-browser";
import { MarketingHeader, MarketingFooter } from "@/components/layout/marketing-shell";
import { THEMATIC_IMAGES } from "@/constants/thematic-images";
import { useI18n } from "@/hooks";

export default function ProjectsMarketplacePage() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />
      <PageHeroBanner
        imageSrc={THEMATIC_IMAGES.sections.marketplace}
        imageAlt="Investment marketplace overview"
        eyebrow={t("nav.marketplace")}
        title={t("projects.exploreTitle")}
        description={t("projects.exploreSub")}
        height="md"
      />
      <section className="container-wide section-pad py-10">
        <MarketplaceBrowser projectBasePath="/projects" />
      </section>
      <MarketingFooter />
    </div>
  );
}
