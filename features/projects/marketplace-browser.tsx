"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { MarketplaceProjectCard } from "@/features/projects";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PROJECT_CATEGORIES, PROJECT_INDUSTRIES, PROJECT_STAGES, RISK_LEVELS, QUERY_KEYS } from "@/constants";
import { useProjects } from "@/hooks/use-marketplace";
import { useI18n } from "@/hooks";
import { CardSkeleton } from "@/components/shared/loading-skeleton";
import { investorApi } from "@/services/api";
import { useAuthStore } from "@/store";

export function MarketplaceBrowser({
  projectBasePath = "/projects",
  compact = false,
}: {
  projectBasePath?: string;
  compact?: boolean;
}) {
  const { t } = useI18n();
  const { user, isAuthenticated } = useAuthStore();
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [industry, setIndustry] = useState<string>("all");
  const [stage, setStage] = useState<string>("all");
  const [location, setLocation] = useState<string>("");
  const [riskLevel, setRiskLevel] = useState<string>("all");
  const [fundingStatus, setFundingStatus] = useState<string>("all");
  const [investmentBudget, setInvestmentBudget] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("newest");

  useEffect(() => {
    const id = window.setTimeout(() => setSearch(searchInput.trim()), 250);
    return () => window.clearTimeout(id);
  }, [searchInput]);

  const params = useMemo(
    () => ({
      search: search || undefined,
      category: category === "all" ? undefined : category,
      industry: industry === "all" ? undefined : industry,
      stage: stage === "all" ? undefined : stage,
      location: location.trim() || undefined,
      riskLevel: riskLevel === "all" ? undefined : riskLevel,
      fundingStatus: fundingStatus === "all" ? undefined : fundingStatus,
      minInvestment:
        investmentBudget.trim() === "" ? undefined : Number(investmentBudget.trim()),
      sortBy,
      sortOrder: "desc",
      limit: 24,
    }),
    [search, category, industry, stage, location, riskLevel, fundingStatus, investmentBudget, sortBy]
  );

  const { data, isLoading } = useProjects(params);
  const projects = data?.data ?? [];

  const { data: savedProjects } = useQuery({
    queryKey: [QUERY_KEYS.SAVED, "marketplace"],
    queryFn: async () => (await investorApi.saved()).data.data,
    enabled: isAuthenticated && user?.role === "investor",
  });

  const savedIdSet = new Set((savedProjects ?? []).map((p) => p.id));

  return (
    <div className="space-y-8">
      <div>
        {!compact && (
          <p className="text-sm font-medium uppercase tracking-wide text-teal-800">
            {t("nav.marketplace")}
          </p>
        )}
        <h2 className="mt-1 font-display text-2xl font-semibold text-slate-900 md:text-3xl">
          {t("projects.exploreTitle")}
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{t("projects.exploreSub")}</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="bg-white pl-9"
              placeholder={t("projects.searchPlaceholder")}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder={t("projects.category")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("projects.allCategories")}</SelectItem>
              {PROJECT_CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={industry} onValueChange={setIndustry}>
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder={t("projects.industry")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("projects.allIndustries")}</SelectItem>
              {PROJECT_INDUSTRIES.map((ind) => (
                <SelectItem key={ind} value={ind}>
                  {ind}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={stage} onValueChange={setStage}>
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder={t("projects.stage")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("projects.allStages")}</SelectItem>
              {PROJECT_STAGES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {t(`projects.stages.${s.value}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={riskLevel} onValueChange={setRiskLevel}>
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder={t("projects.risk")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("projects.allRisks")}</SelectItem>
              {RISK_LEVELS.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.value === "low"
                    ? t("projects.lowRisk")
                    : r.value === "high"
                      ? t("projects.highRisk")
                      : t("projects.mediumRisk")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            className="bg-white"
            placeholder={t("projects.locationPlaceholder")}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <Input
            className="bg-white"
            type="number"
            inputMode="numeric"
            placeholder={t("projects.investmentBudget")}
            value={investmentBudget}
            onChange={(e) => setInvestmentBudget(e.target.value)}
          />

          <Select value={fundingStatus} onValueChange={setFundingStatus}>
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder={t("projects.funding")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("projects.allFunding")}</SelectItem>
              <SelectItem value="open">{t("projects.openFunding")}</SelectItem>
              <SelectItem value="funded">{t("projects.fundedStatus")}</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder={t("projects.sortLabel")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">{t("projects.sortNewest")}</SelectItem>
              <SelectItem value="most_viewed">{t("projects.sortMostViewed")}</SelectItem>
              <SelectItem value="funding_progress">{t("projects.sortFunding")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : projects.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">{t("projects.noMatch")}</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <MarketplaceProjectCard
              key={project.id}
              project={project}
              savedByMe={savedIdSet.has(project.id)}
              basePath={projectBasePath}
            />
          ))}
        </div>
      )}
    </div>
  );
}
