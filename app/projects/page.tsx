"use client";

import { useMemo, useState } from "react";
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
import { PROJECT_CATEGORIES } from "@/constants";
import { useProjects } from "@/hooks/use-marketplace";
import { CardSkeleton } from "@/components/shared/loading-skeleton";

export default function ProjectsMarketplacePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");

  const params = useMemo(
    () => ({
      search: search.trim() || undefined,
      category: category === "all" ? undefined : category,
      status: "published",
      limit: 24,
    }),
    [search, category]
  );

  const { data, isLoading } = useProjects(params);
  const projects = data?.data ?? [];

  return (
    <div className="min-h-screen bg-white">
      <MarketingHeader />

      <section className="hero-mesh border-b border-border/60">
        <div className="container-narrow section-pad py-14 md:py-16 animate-fade-in">
          <p className="text-sm font-medium uppercase tracking-wide text-blue-600">Marketplace</p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-slate-900">
            Explore verified projects
          </h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Search and filter opportunities. Membership unlocks documents, team details, and offers.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9 bg-white"
                placeholder="Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full bg-white sm:w-56">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {PROJECT_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
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
            No projects match your filters. Try another search or category.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-slide-up">
            {projects.map((project) => (
              <MarketplaceProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </section>

      <MarketingFooter />
    </div>
  );
}
