"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Archive, FolderKanban, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useOwnerProjects } from "@/hooks/use-marketplace";
import { useI18n } from "@/hooks";
import { useSetPageTitle } from "@/components/providers/page-title-provider";
import { PageHeader } from "@/components/shared/page-header";
import { PanelPage } from "@/components/shared/panel-page";
import { PanelCard } from "@/components/shared/panel-card";
import { EmptyState } from "@/components/shared/empty-state";
import { PanelBlockSkeleton } from "@/components/shared/loading-skeleton";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
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
  if (status === "removal_requested") return 1;
  if (status === "published" || status === "funded" || status === "funding") return 2;
  if (status === "draft") return 3;
  if (status === "rejected") return 4;
  if (status === "archived") return 5;
  return 6;
}

function ownerProjectActivityTime(project: Project) {
  if (project.status === "pending_review") {
    return new Date(project.submittedAt || project.updatedAt || project.createdAt).getTime();
  }
  if (project.status === "published" || project.status === "funded" || project.status === "funding") {
    return new Date(project.approvedAt || project.updatedAt || project.createdAt).getTime();
  }
  return new Date(project.updatedAt || project.createdAt).getTime();
}

function statusLabel(t: (key: string) => string, status: Project["status"]) {
  switch (status) {
    case "rejected":
      return t("ownerReview.rejected");
    case "pending_review":
      return t("ownerReview.pendingReview");
    case "published":
      return t("admin.filterApproved");
    case "archived":
      return t("ownerReview.archived");
    case "removal_requested":
      return t("ownerReview.removalRequested");
    case "funded":
      return t("admin.statusFunded");
    case "funding":
      return t("admin.statusFunding");
    case "closed":
      return t("admin.statusClosed");
    case "draft":
      return t("admin.statusDraft");
    default: {
      const fallback: string = status;
      return fallback.replace(/_/g, " ");
    }
  }
}

type PendingAction =
  | { type: "delete"; id: string; title: string }
  | { type: "archive"; id: string; title: string }
  | { type: "request-removal"; id: string; title: string };

const ARCHIVABLE = new Set(["published", "funding", "funded", "closed"]);

export default function OwnerProjectsPage() {
  const { t } = useI18n();
  useSetPageTitle(t("owner.myProjects"));
  const queryClient = useQueryClient();
  const { data: projects = [], isLoading } = useOwnerProjects();
  const [pending, setPending] = useState<PendingAction | null>(null);

  const sortedProjects = useMemo(
    () =>
      [...projects].sort((a, b) => {
        const rank = ownerProjectRank(a.status) - ownerProjectRank(b.status);
        if (rank !== 0) return rank;
        return ownerProjectActivityTime(b) - ownerProjectActivityTime(a);
      }),
    [projects]
  );

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.OWNER_PROJECTS] });
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.OWNER_DOCUMENTS] });
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.OWNER_DASHBOARD] });
  };

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
      setPending(null);
      invalidate();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const archiveMutation = useMutation({
    mutationFn: (id: string) => ownerApi.archiveProject(id),
    onSuccess: () => {
      toast.success(t("ownerReview.archivedToast"));
      setPending(null);
      invalidate();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const requestRemovalMutation = useMutation({
    mutationFn: (id: string) => ownerApi.requestRemoval(id),
    onSuccess: () => {
      toast.success(t("ownerReview.requestRemovalToast"));
      setPending(null);
      invalidate();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const busy =
    deleteMutation.isPending ||
    archiveMutation.isPending ||
    requestRemovalMutation.isPending;

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
            const canDelete =
              (project.status === "draft" ||
                project.status === "pending_review" ||
                project.status === "rejected") &&
              (project.investorCount ?? 0) === 0 &&
              project.currentFunding === 0;
            const canArchive = ARCHIVABLE.has(project.status);
            const canRequestRemoval = project.status === "archived";
            const showActions =
              canMutate || canDelete || canArchive || canRequestRemoval || canResubmit;

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
                    {statusLabel(t, project.status)}
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

                {showActions ? (
                  <div className="flex flex-wrap gap-2 border-t border-border/60 pt-4">
                    {canMutate ? (
                      <Button asChild variant="outline">
                        <Link href={`${ROUTES.OWNER_PROJECTS}/${project.id}/edit`}>
                          {t("ownerReview.editProject")}
                        </Link>
                      </Button>
                    ) : null}
                    {canResubmit ? (
                      <Button
                        disabled={resubmitMutation.isPending}
                        onClick={() => resubmitMutation.mutate(project.id)}
                      >
                        {t("ownerReview.resubmit")}
                      </Button>
                    ) : null}
                    {canArchive ? (
                      <Button
                        variant="outline"
                        disabled={busy}
                        onClick={() =>
                          setPending({
                            type: "archive",
                            id: project.id,
                            title: project.title,
                          })
                        }
                      >
                        <Archive className="h-4 w-4" />
                        {t("ownerReview.archiveProject")}
                      </Button>
                    ) : null}
                    {canRequestRemoval ? (
                      <Button
                        variant="outline"
                        disabled={busy}
                        onClick={() =>
                          setPending({
                            type: "request-removal",
                            id: project.id,
                            title: project.title,
                          })
                        }
                      >
                        {t("ownerReview.requestRemoval")}
                      </Button>
                    ) : null}
                    {canDelete ? (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-9 w-9 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        disabled={busy}
                        aria-label={t("ownerReview.deleteProject")}
                        onClick={() =>
                          setPending({
                            type: "delete",
                            id: project.id,
                            title: project.title,
                          })
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    ) : null}
                  </div>
                ) : null}
              </PanelCard>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(pending)}
        onOpenChange={(open) => {
          if (!open) setPending(null);
        }}
        title={
          pending?.type === "archive"
            ? t("ownerReview.archiveConfirm")
            : pending?.type === "request-removal"
              ? t("ownerReview.requestRemovalConfirm")
              : t("ownerReview.deleteConfirm")
        }
        description={pending?.title}
        confirmLabel={
          pending?.type === "archive"
            ? t("ownerReview.archiveProject")
            : pending?.type === "request-removal"
              ? t("ownerReview.requestRemoval")
              : t("ownerReview.deleteProject")
        }
        loading={busy}
        onConfirm={() => {
          if (!pending) return;
          if (pending.type === "archive") archiveMutation.mutate(pending.id);
          else if (pending.type === "request-removal")
            requestRemovalMutation.mutate(pending.id);
          else deleteMutation.mutate(pending.id);
        }}
      />
    </PanelPage>
  );
}
