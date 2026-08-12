"use client";

import { MarketingHeader, MarketingFooter } from "@/components/layout/marketing-shell";
import { MarketplaceBrowser } from "@/features/projects/marketplace-browser";

export default function ProjectsMarketplacePage() {
  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <MarketingHeader />
      <section className="container-narrow section-pad py-12 md:py-14">
        <MarketplaceBrowser projectBasePath="/projects" />
      </section>
      <MarketingFooter />
    </div>
  );
}
