"use client";

import { useQuery } from "@tanstack/react-query";
import { Bookmark } from "lucide-react";
import { investorApi } from "@/services/api";
import { QUERY_KEYS, ROUTES } from "@/constants";
import { useI18n } from "@/hooks";
import { useSetPageTitle } from "@/components/providers/page-title-provider";
import { PanelPage } from "@/components/shared/panel-page";
import { EmptyState } from "@/components/shared/empty-state";
import { CardSkeleton } from "@/components/shared/loading-skeleton";
import { MarketplaceProjectCard } from "@/features/projects/project-card";

export default function InvestorSavedPage() {
  const { t } = useI18n();
  useSetPageTitle(t("investor.savedProjects"));

  const { data: projects = [], isLoading } = useQuery({
    queryKey: [QUERY_KEYS.SAVED],
    queryFn: async () => (await investorApi.saved()).data.data,
  });

  return (
    <PanelPage>
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title={t("common.noResults")}
          description={t("investor.browseProjects")}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <MarketplaceProjectCard
              key={project.id}
              project={project}
              savedByMe
              basePath={ROUTES.INVESTOR_PROJECTS}
            />
          ))}
        </div>
      )}
    </PanelPage>
  );
}
