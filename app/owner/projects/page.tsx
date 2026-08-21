"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FolderKanban, Plus } from "lucide-react";
import { toast } from "sonner";
import { useOwnerProjects } from "@/hooks/use-marketplace";
import { useI18n } from "@/hooks";
import { ownerApi } from "@/services/api";
import { getErrorMessage } from "@/services/api/client";
import { ROUTES, STATUS_COLORS, QUERY_KEYS } from "@/constants";
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

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-semibold text-slate-900">
            {t("owner.myProjects")}
          </h2>
          <p className="text-sm text-muted-foreground">{t("owner.projectsSub")}</p>
        </div>
        <Button asChild>
          <Link href={ROUTES.OWNER_PROJECT_CREATE}>
            <Plus className="h-4 w-4" /> {t("owner.newProject")}
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="premium-card h-40 animate-pulse bg-slate-100" />
      ) : sortedProjects.length === 0 ? (
        <div className="premium-card flex flex-col items-center gap-3 p-12 text-center">
          <FolderKanban className="h-10 w-10 text-slate-300" />
          <p className="font-medium text-slate-900">{t("owner.noProjects")}</p>
          <Button asChild>
            <Link href={ROUTES.OWNER_PROJECT_CREATE}>{t("owner.createFirst")}</Link>
          </Button>
        </div>
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
            return (
              <div
                key={project.id}
                className={cn(
                  "premium-card space-y-4 p-5",
                  isRejected && "border-red-200 bg-red-50/30"
                )}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">{project.title}</p>
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
                  <div className="rounded-xl border border-red-200 bg-white px-4 py-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-red-800">
                      {t("ownerReview.rejectionReason")}
                    </p>
                    <p className="mt-1 whitespace-pre-wrap text-sm text-slate-800">
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

                {isRejected || project.status === "draft" ? (
                  <div className="flex flex-wrap gap-2 border-t border-border/60 pt-4">
                    <Button asChild variant="outline">
                      <Link href={`${ROUTES.OWNER_PROJECTS}/${project.id}/edit`}>
                        {t("ownerReview.editProject")}
                      </Link>
                    </Button>
                    <Button
                      disabled={resubmitMutation.isPending}
                      onClick={() => resubmitMutation.mutate(project.id)}
                    >
                      {t("ownerReview.resubmit")}
                    </Button>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
