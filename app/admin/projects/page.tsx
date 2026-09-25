"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ClipboardCheck, FolderKanban } from "lucide-react";
import { adminMarketplaceApi } from "@/services/api";
import { QUERY_KEYS, ROUTES, STATUS_COLORS } from "@/constants";
import { formatCurrency, formatDate } from "@/utils/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useI18n } from "@/hooks";
import { useSetPageTitle } from "@/components/providers/page-title-provider";
import { PageHeader } from "@/components/shared/page-header";
import { PanelPage } from "@/components/shared/panel-page";
import { PanelCard } from "@/components/shared/panel-card";
import { EmptyState } from "@/components/shared/empty-state";
import { PanelListSkeleton, PanelBlockSkeleton } from "@/components/shared/loading-skeleton";
import type { Project, ProjectStatus } from "@/types";

type FilterId = "all" | ProjectStatus | "approved";

const FILTERS: { id: FilterId; status?: ProjectStatus | "approved" }[] = [
  { id: "all" },
  { id: "pending_review", status: "pending_review" },
  { id: "removal_requested", status: "removal_requested" },
  { id: "published", status: "published" },
  { id: "approved", status: "approved" },
  { id: "archived", status: "archived" },
  { id: "rejected", status: "rejected" },
  { id: "draft", status: "draft" },
];

function matchesFilter(project: Project, filter: FilterId) {
  if (filter === "all") return true;
  if (filter === "approved") return project.status === "published" || !!project.approvedAt;
  return project.status === filter;
}

function filterLabel(t: (key: string) => string, id: FilterId) {
  switch (id) {
    case "all":
      return t("admin.filterAll");
    case "pending_review":
      return t("admin.filterPending");
    case "published":
      return t("admin.filterPublished");
    case "approved":
      return t("admin.filterApproved");
    case "rejected":
      return t("admin.filterRejected");
    case "draft":
      return t("admin.filterDraft");
    case "archived":
      return t("admin.filterArchived");
    case "removal_requested":
      return t("admin.filterRemovalRequested");
    default:
      return id;
  }
}

function projectStatusLabel(t: (key: string) => string, status: Project["status"]) {
  switch (status) {
    case "pending_review":
      return t("admin.statusPending");
    case "published":
      return t("admin.statusPublished");
    case "rejected":
      return t("admin.statusRejected");
    case "draft":
      return t("admin.statusDraft");
    case "funded":
      return t("admin.statusFunded");
    case "funding":
      return t("admin.statusFunding");
    case "archived":
      return t("admin.statusArchived");
    case "removal_requested":
      return t("admin.statusRemovalRequested");
    default:
      return t("admin.statusClosed");
  }
}

export default function AdminProjectsPage() {
  const { t } = useI18n();
  useSetPageTitle(t("admin.projectsTitle"));
  const [filter, setFilter] = useState<FilterId>("all");

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.PROJECTS, "admin-marketplace"],
    queryFn: async () =>
      (await adminMarketplaceApi.projects({ limit: 100 })).data.data,
  });

  const projects = data?.data ?? [];
  const pending = useMemo(
    () =>
      projects
        .filter((p) => p.status === "pending_review" || p.status === "removal_requested")
        .sort(
          (a, b) =>
            new Date(b.submittedAt || b.updatedAt || b.createdAt).getTime() -
            new Date(a.submittedAt || a.updatedAt || a.createdAt).getTime()
        ),
    [projects]
  );

  const filtered = useMemo(
    () => projects.filter((p) => matchesFilter(p, filter)),
    [projects, filter]
  );

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: projects.length };
    for (const p of projects) {
      map[p.status] = (map[p.status] || 0) + 1;
    }
    map.approved = projects.filter((p) => p.status === "published" || p.approvedAt).length;
    return map;
  }, [projects]);

  return (
    <PanelPage>
      <PageHeader
        variant="minimal"
        title={t("admin.projectsTitle")}
        description={t("admin.projectsSub")}
      />

      <section className="rounded-2xl border border-amber-200/80 bg-amber-50/70 p-5 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="mb-1 flex items-center gap-2 text-amber-900">
              <ClipboardCheck className="h-5 w-5" />
              <h3 className="font-display text-lg font-semibold">
                {t("admin.pendingQueueTitle")}
              </h3>
            </div>
            <p className="text-sm text-amber-900/80">
              {pending.length === 1
                ? t("admin.pendingQueueCount", { count: pending.length })
                : t("admin.pendingQueueCountPlural", { count: pending.length })}
            </p>
          </div>
          <Badge className="border-amber-300 bg-background text-amber-900">
            {t("admin.pendingBadge")}
          </Badge>
        </div>

        {isLoading ? (
          <PanelBlockSkeleton className="mt-4" height="h-24" />
        ) : pending.length === 0 ? (
          <p className="mt-4 text-sm text-amber-900/70">{t("admin.pendingEmpty")}</p>
        ) : (
          <div className="mt-4 space-y-3">
            {pending.map((project) => (
              <div
                key={project.id}
                className="rounded-xl border border-amber-200/60 bg-background p-4 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground">{project.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {project.ownerName || "—"} · {project.category} ·{" "}
                      {t("admin.stage")}: {t(`projects.stages.${project.stage ?? "idea"}`)}
                    </p>
                    <p className="mt-1 text-sm text-foreground">
                      {formatCurrency(project.requiredInvestment)} ·{" "}
                      {t("admin.submissionDate")}:{" "}
                      {formatDate(project.submittedAt || project.createdAt)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      className={
                        project.status === "removal_requested"
                          ? "border-orange-200 bg-orange-50 text-orange-900"
                          : "border-amber-200 bg-amber-50 text-amber-900"
                      }
                    >
                      {project.status === "removal_requested"
                        ? t("admin.statusRemovalRequested")
                        : t("admin.awaitingReview")}
                    </Badge>
                    <Button asChild size="sm">
                      <Link href={`${ROUTES.ADMIN_PROJECTS}/${project.id}/review`}>
                        {t("admin.viewProject")}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((item) => {
          const count =
            item.id === "all"
              ? counts.all
              : item.id === "approved"
                ? counts.approved
                : counts[item.id] || 0;
          const active = filter === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm transition",
                active
                  ? item.id === "pending_review"
                    ? "border-amber-400 bg-amber-100 font-medium text-amber-950"
                    : "border-primary bg-primary font-medium text-primary-foreground"
                  : "border-border bg-background text-foreground hover:bg-muted",
                item.id === "pending_review" && !active && "border-amber-200 text-amber-900"
              )}
            >
              {filterLabel(t, item.id)}
              <span className={cn("ml-1.5 tabular-nums", active ? "opacity-90" : "text-muted-foreground")}>
                ({count})
              </span>
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <PanelListSkeleton />
      ) : filtered.length === 0 ? (
        <EmptyState icon={FolderKanban} title={t("common.noResults")} />
      ) : (
        <div className="space-y-3">
          {filtered.map((project) => (
            <PanelCard
              key={project.id}
              className="flex flex-wrap items-center justify-between gap-4"
            >
              <div>
                <p className="font-semibold text-foreground">{project.title}</p>
                <p className="text-sm text-muted-foreground">
                  {project.ownerName || "—"} · {project.category} ·{" "}
                  {formatDate(project.createdAt)}
                </p>
                <p className="mt-1 text-sm text-foreground">
                  {formatCurrency(project.requiredInvestment)}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className={cn("border capitalize", STATUS_COLORS[project.status])}>
                  {projectStatusLabel(t, project.status)}
                </Badge>
                <Button asChild size="sm" variant="outline">
                  <Link href={`${ROUTES.ADMIN_PROJECTS}/${project.id}/review`}>
                    {t("admin.viewProject")}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </PanelCard>
          ))}
        </div>
      )}
    </PanelPage>
  );
}
