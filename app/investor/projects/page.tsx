"use client";

import { MarketplaceBrowser } from "@/features/projects/marketplace-browser";
import { ROUTES } from "@/constants";
import { useI18n } from "@/hooks";
import { useSetPageTitle } from "@/components/providers/page-title-provider";
import { PageHeader } from "@/components/shared/page-header";
import { PanelPage } from "@/components/shared/panel-page";

export default function InvestorProjectsPage() {
  const { t } = useI18n();
  useSetPageTitle(t("projects.exploreTitle"));

  return (
    <PanelPage>
      <PageHeader
        variant="minimal"
        title={t("projects.exploreTitle")}
        description={t("projects.exploreSub")}
      />
      <MarketplaceBrowser projectBasePath={ROUTES.INVESTOR_PROJECTS} compact />
    </PanelPage>
  );
}
