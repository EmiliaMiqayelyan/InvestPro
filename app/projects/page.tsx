"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { MarketingHeader, MarketingFooter } from "@/components/layout/marketing-shell";
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

export default function ProjectsMarketplacePage() {
  const { t } = useI18n();
  const { user, isAuthenticated } = useAuthStore();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [industry, setIndustry] = useState<string>("all");
  const [stage, setStage] = useState<string>("all");
  const [location, setLocation] = useState<string>("");
  const [riskLevel, setRiskLevel] = useState<string>("all");
  const [fundingStatus, setFundingStatus] = useState<string>("all");
  const [investmentBudget, setInvestmentBudget] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("newest");

  const params = useMemo(
    () => ({
      search: search.trim() || undefined,
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
    <div className="min-h-screen bg-white">
      <MarketingHeader />

      <section className="hero-mesh border-b border-border/60">
        <div className="container-narrow section-pad py-14 md:py-16 animate-fade-in">
          <p className="text-sm font-medium uppercase tracking-wide text-blue-600">
            {t("nav.marketplace")}
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-slate-900">
            {t("projects.exploreTitle")}
          </h1>
          <p className="mt-3 max-w-xl text-muted-foreground">{t("projects.exploreSub")}</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9 bg-white"
                placeholder={t("projects.searchPlaceholder")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
                <SelectItem value="all">All industries</SelectItem>
                {PROJECT_INDUSTRIES.map((ind) => (
                  <SelectItem key={ind} value={ind}>
                    {ind}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={stage} onValueChange={setStage}>
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All stages</SelectItem>
                {PROJECT_STAGES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={riskLevel} onValueChange={setRiskLevel}>
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Risk level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All risk</SelectItem>
                {RISK_LEVELS.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              className="bg-white"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />

            <Input
              className="bg-white"
              type="number"
              inputMode="numeric"
              placeholder="Investment budget (USD)"
              value={investmentBudget}
              onChange={(e) => setInvestmentBudget(e.target.value)}
            />

            <Select value={fundingStatus} onValueChange={setFundingStatus}>
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Funding status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All funding</SelectItem>
                <SelectItem value="open">Open funding</SelectItem>
                <SelectItem value="funded">Funded</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="most_viewed">Most viewed</SelectItem>
                <SelectItem value="funding_progress">Funding progress</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <section className="container-narrow section-pad py-12">
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : projects.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">
            {t("projects.noMatch")}
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-slide-up">
            {projects.map((project) => (
              <MarketplaceProjectCard
                key={project.id}
                project={project}
                savedByMe={savedIdSet.has(project.id)}
              />
            ))}
          </div>
        )}
      </section>

      <MarketingFooter />
    </div>
  );
}
