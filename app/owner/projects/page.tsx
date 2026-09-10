"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FolderKanban, Plus } from "lucide-react";
import { toast } from "sonner";
import { useOwnerProjects } from "@/hooks/use-marketplace";
import { useI18n } from "@/hooks";
import { useSetPageTitle } from "@/components/providers/page-title-provider";
import { PageHeader } from "@/components/shared/page-header";
import { PanelPage } from "@/components/shared/panel-page";
import { PanelCard } from "@/components/shared/panel-card";
import { EmptyState } from "@/components/shared/empty-state";
import { PanelBlockSkeleton } from "@/components/shared/loading-skeleton";
import { ownerApi } from "@/services/api";
import { getErrorMessage } from "@/services/api/client";
import {
  ROUTES,
  STATUS_COLORS,
  QUERY_KEYS,
  isOwnerMutableProjectStatus,
} from "@/constants";
import { formatCurrency, formatDate } from "@/utils/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";

function ownerProjectRank(status: Project["status"]) {
  if (status === "pending_review") return 0;
  if (status === "published" || status === "funded") return 1;
  if (status === "draft") return 2;
  if (status === "rejected") return 3;
  return 4;
}

function ownerProjectActivityTime(project: Project) {
  if (project.status === "pending_review") {
    return new Date(project.submittedAt || project.updatedAt || project.createdAt).getTime();
  }
  if (project.status === "published" || project.status === "funded") {
    return new Date(project.approvedAt || project.updatedAt || project.createdAt).getTime();
  }
  return new Date(project.updatedAt || project.createdAt).getTime();
}

export default function OwnerProjectsPage() {
  const { t } = useI18n();
  useSetPageTitle(t("owner.myProjects"));
  const queryClient = useQueryClient();
  const { data: projects = [], isLoading } = useOwnerProjects();

  const sortedProjects = useMemo(
    () =>
      [...projects].sort((a, b) => {
        const rank = ownerProjectRank(a.status) - ownerProjectRank(b.status);
        if (rank !== 0) return rank;
        return ownerProjectActivityTime(b) - ownerProjectActivityTime(a);
      }),
    [projects]
  );

  const resubmitMutation = useMutation({
    mutationFn: (id: string) => ownerApi.resubmitProject(id),
    onSuccess: () => {
      toast.success(t("ownerReview.resubmitToast"));
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.OWNER_PROJECTS] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => ownerApi.deleteProject(id),
    onSuccess: () => {
      toast.success(t("ownerReview.deletedToast"));
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.OWNER_PROJECTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.OWNER_DOCUMENTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.OWNER_DASHBOARD] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return (
    <PanelPage>
      <PageHeader
        variant="minimal"
        title={t("owner.myProjects")}
        description={t("owner.projectsSub")}
        actions={
          <Button asChild>
            <Link href={ROUTES.OWNER_PROJECT_CREATE}>
              <Plus className="h-4 w-4" /> {t("owner.newProject")}
            </Link>
          </Button>
        }
      />

      {isLoading ? (
        <PanelBlockSkeleton height="h-40" />
      ) : sortedProjects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title={t("owner.noProjects")}
          action={
            <Button asChild>
              <Link href={ROUTES.OWNER_PROJECT_CREATE}>{t("owner.createFirst")}</Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {sortedProjects.map((project) => {
            const progress = Math.min(
              100,
              Math.round(
                (project.currentFunding / Math.max(project.requiredInvestment, 1)) * 100
              )
            );
            const isRejected = project.status === "rejected";
            const canMutate = isOwnerMutableProjectStatus(project.status);
            const canResubmit =
              project.status === "rejected" || project.status === "draft";
            return (
              <PanelCard
                key={project.id}
                className={cn("space-y-4", isRejected && "border-red-200 bg-red-50/30")}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-foreground">{project.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {project.category} · {formatDate(project.updatedAt)}
                    </p>
                  </div>
                  <Badge
                    className={cn(
                      "border capitalize",
                      isRejected
                        ? "border-red-200 bg-red-50 text-red-800"
                        : STATUS_COLORS[project.status]
                    )}
                  >
                    {isRejected
                      ? t("ownerReview.rejected")
                      : project.status === "pending_review"
                        ? t("ownerReview.pendingReview")
                        : project.status === "published"
                          ? t("admin.filterApproved")
                          : project.status.replace(/_/g, " ")}
                  </Badge>
                </div>

                {isRejected && project.rejectionReason ? (
                  <div className="rounded-xl border border-red-200 bg-card px-4 py-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-red-800">
                      {t("ownerReview.rejectionReason")}
                    </p>
                    <p className="mt-1 whitespace-pre-wrap text-sm text-foreground">
                      {project.rejectionReason}
                    </p>
                  </div>
                ) : null}

                <div>
                  <div className="mb-2 flex justify-between text-xs text-muted-foreground">
                    <span>
                      {formatCurrency(project.currentFunding)} /{" "}
                      {formatCurrency(project.requiredInvestment)}
                    </span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} />
                </div>

                {canMutate ? (
                  <div className="flex flex-wrap gap-2 border-t border-border/60 pt-4">
                    <Button asChild variant="outline">
                      <Link href={`${ROUTES.OWNER_PROJECTS}/${project.id}/edit`}>
                        {t("ownerReview.editProject")}
                      </Link>
                    </Button>
                    {canResubmit ? (
                      <Button
                        disabled={resubmitMutation.isPending}
                        onClick={() => resubmitMutation.mutate(project.id)}
                      >
                        {t("ownerReview.resubmit")}
                      </Button>
                    ) : null}
                    <Button
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      disabled={deleteMutation.isPending}
                      onClick={() => {
                        if (!window.confirm(t("ownerReview.deleteConfirm"))) return;
                        deleteMutation.mutate(project.id);
                      }}
                    >
                      {t("ownerReview.deleteProject")}
                    </Button>
                  </div>
                ) : null}
              </PanelCard>
            );
          })}
        </div>
      )}
    </PanelPage>
  );
}
