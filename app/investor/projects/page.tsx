"use client";

import { MarketplaceBrowser } from "@/features/projects/marketplace-browser";
import { ROUTES } from "@/constants";
import { useI18n } from "@/hooks";
import { useSetPageTitle } from "@/components/providers/page-title-provider";
import { PageHeader } from "@/components/shared/page-header";

export default function InvestorProjectsPage() {
  const { t } = useI18n();
  useSetPageTitle(t("projects.exploreTitle"));

  return (
    <div className="space-y-6">
      <PageHeader
        variant="minimal"
        title={t("projects.exploreTitle")}
        description={t("projects.exploreSub")}
      />
      <MarketplaceBrowser projectBasePath={ROUTES.INVESTOR_PROJECTS} compact />
    </div>
  );
}
