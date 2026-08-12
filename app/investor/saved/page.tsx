"use client";

import { useQuery } from "@tanstack/react-query";
import { Bookmark } from "lucide-react";
import { investorApi } from "@/services/api";
import { QUERY_KEYS, ROUTES } from "@/constants";
import { MarketplaceProjectCard } from "@/features/projects/project-card";

export default function InvestorSavedPage() {
  const { data: projects = [], isLoading } = useQuery({
    queryKey: [QUERY_KEYS.SAVED],
    queryFn: async () => (await investorApi.saved()).data.data,
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold text-slate-900">Saved projects</h2>
        <p className="text-sm text-muted-foreground">Projects you bookmarked for later</p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="premium-card h-64 animate-pulse bg-slate-100" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="premium-card flex flex-col items-center gap-3 p-12 text-center">
          <Bookmark className="h-10 w-10 text-slate-300" />
          <p className="font-medium text-slate-900">No saved projects</p>
          <p className="text-sm text-muted-foreground">
            Save projects from the marketplace to review them here.
          </p>
        </div>
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
    </div>
  );
}
