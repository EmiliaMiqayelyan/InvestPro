"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { MarketplaceProjectCard } from "@/features/projects";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { categoryLabel, industryLabel } from "@/i18n/localize";
import { CardSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { SearchInput } from "@/components/shared/search-input";
import { investorApi } from "@/services/api";
import { useAuthStore } from "@/store";
import { Label } from "@/components/ui/label";

function FilterField({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor} className="text-xs font-medium text-muted-foreground">
        {label}
      </Label>
      {children}
    </div>
  );
}

export function MarketplaceBrowser({
  projectBasePath = "/projects",
  compact = false,
}: {
  projectBasePath?: string;
  compact?: boolean;
}) {
  const { t, locale } = useI18n();
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
  const total = data?.total ?? projects.length;

  const { data: savedProjects } = useQuery({
    queryKey: [QUERY_KEYS.SAVED, "marketplace"],
    queryFn: async () => (await investorApi.saved()).data.data,
    enabled: isAuthenticated && user?.role === "investor",
  });

  const savedIdSet = new Set((savedProjects ?? []).map((p) => p.id));
  const hasFilters =
    category !== "all" ||
    industry !== "all" ||
    stage !== "all" ||
    riskLevel !== "all" ||
    fundingStatus !== "all" ||
    location.trim() !== "" ||
    investmentBudget.trim() !== "";

  const clearFilters = () => {
    setCategory("all");
    setIndustry("all");
    setStage("all");
    setLocation("");
    setRiskLevel("all");
    setFundingStatus("all");
    setInvestmentBudget("");
  };

  const filters = (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
      <FilterField label={t("projects.category")}>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t("projects.allCategories")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("projects.allCategories")}</SelectItem>
            {PROJECT_CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {categoryLabel(locale, cat)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterField>

      <FilterField label={t("projects.industry")}>
        <Select value={industry} onValueChange={setIndustry}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t("projects.allIndustries")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("projects.allIndustries")}</SelectItem>
            {PROJECT_INDUSTRIES.map((ind) => (
              <SelectItem key={ind} value={ind}>
                {industryLabel(locale, ind)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterField>

      <FilterField label={t("projects.stage")}>
        <Select value={stage} onValueChange={setStage}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t("projects.allStages")} />
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
      </FilterField>

      <FilterField label={t("projects.risk")}>
        <Select value={riskLevel} onValueChange={setRiskLevel}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t("projects.allRisks")} />
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
      </FilterField>

      <FilterField label={t("projects.location")} htmlFor="filter-location">
        <Input
          id="filter-location"
          placeholder={t("projects.locationPlaceholder")}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </FilterField>

      <FilterField label={t("projects.investmentBudget")} htmlFor="filter-budget">
        <Input
          id="filter-budget"
          type="number"
          inputMode="numeric"
          placeholder="50,000"
          value={investmentBudget}
          onChange={(e) => setInvestmentBudget(e.target.value)}
        />
      </FilterField>

      <FilterField label={t("projects.funding")}>
        <Select value={fundingStatus} onValueChange={setFundingStatus}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t("projects.allFunding")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("projects.allFunding")}</SelectItem>
            <SelectItem value="open">{t("projects.openFunding")}</SelectItem>
            <SelectItem value="funded">{t("projects.fundedStatus")}</SelectItem>
          </SelectContent>
        </Select>
      </FilterField>
    </div>
  );

  return (
    <div className="space-y-6">
      <SearchInput
        className="max-w-xl"
        value={searchInput}
        onChange={setSearchInput}
        placeholder={t("projects.searchPlaceholder")}
      />

      <div className="surface-card p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <SlidersHorizontal className="h-4 w-4 text-primary" />
            {t("projects.filters")}
            {hasFilters ? (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {t("projects.filtersActive")}
              </span>
            ) : null}
          </div>
          {hasFilters ? (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
            >
              <X className="h-3.5 w-3.5" />
              {t("projects.clearFilters")}
            </button>
          ) : null}
        </div>
        {filters}
      </div>

      <div>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {isLoading ? t("common.loading") : t("projects.resultsCount", { count: total })}
          </p>
          <div className="flex items-center gap-2">
            <span className="hidden text-xs text-muted-foreground sm:inline">{t("projects.sortLabel")}</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
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
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : projects.length === 0 ? (
          <EmptyState
            icon={Search}
            variant="dashed"
            title={t("projects.noMatch")}
            action={
              hasFilters ? (
                <Button variant="outline" onClick={clearFilters}>
                  {t("projects.clearFilters")}
                </Button>
              ) : undefined
            }
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
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
    </div>
  );
}
