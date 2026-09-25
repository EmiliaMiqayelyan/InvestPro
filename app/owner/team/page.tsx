"use client";

import { useState } from "react";
import { Trash2, Users } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { QUERY_KEYS } from "@/constants";
import { teamRoleLabel } from "@/i18n/localize";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { TeamMember } from "@/types";

type PendingRemove = { projectId: string; memberId: string; name: string };

export default function OwnerTeamPage() {
  const { t, locale } = useI18n();
  useSetPageTitle(t("nav.team"));
  const queryClient = useQueryClient();
  const { data: projects = [], isLoading } = useOwnerProjects();
  const [pendingRemove, setPendingRemove] = useState<PendingRemove | null>(null);

  const projectsWithTeam = projects
    .map((p) => ({
      id: p.id,
      title: (locale === "hy" && p.titleHy ? p.titleHy : p.title) || p.title,
      members: (Array.isArray(p.team) ? p.team : []) as TeamMember[],
    }))
    .filter((p) => p.members.length > 0);

  const removeMutation = useMutation({
    mutationFn: ({ projectId, memberId }: { projectId: string; memberId: string }) =>
      ownerApi.removeTeamMember(projectId, memberId),
    onSuccess: () => {
      toast.success(t("ownerReview.removedToast"));
      setPendingRemove(null);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.OWNER_PROJECTS] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return (
    <PanelPage>
      <PageHeader
        variant="minimal"
        title={t("nav.team")}
        description={t("owner.teamPageSub")}
      />

      {isLoading ? (
        <PanelBlockSkeleton height="h-40" />
      ) : projectsWithTeam.length === 0 ? (
        <EmptyState icon={Users} title={t("owner.noTeamYet")} />
      ) : (
        <div className="space-y-8">
          {projectsWithTeam.map((project) => (
            <section key={project.id} className="space-y-3">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-display text-lg font-semibold text-foreground">
                  {project.title}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {t("common.membersCount", { count: project.members.length })}
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {project.members.map((member) => {
                  const roleLabel = teamRoleLabel(locale, member.role);
                  return (
                    <PanelCard key={`${project.id}-${member.id}`}>
                      <div className="mb-2 flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-foreground">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.position}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Badge className="border border-primary/20 bg-primary/10 text-primary">
                            {roleLabel}
                          </Badge>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-9 w-9 text-destructive hover:bg-destructive/10 hover:text-destructive"
                            disabled={removeMutation.isPending}
                            aria-label={t("ownerReview.removeMember")}
                            onClick={() =>
                              setPendingRemove({
                                projectId: project.id,
                                memberId: member.id,
                                name: member.name,
                              })
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="line-clamp-3 text-sm text-muted-foreground">
                        {member.biography || member.experience || "—"}
                      </p>
                    </PanelCard>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(pendingRemove)}
        onOpenChange={(open) => {
          if (!open) setPendingRemove(null);
        }}
        title={t("ownerReview.removeMemberConfirm")}
        description={pendingRemove?.name}
        confirmLabel={t("ownerReview.removeMember")}
        loading={removeMutation.isPending}
        onConfirm={() => {
          if (!pendingRemove) return;
          removeMutation.mutate({
            projectId: pendingRemove.projectId,
            memberId: pendingRemove.memberId,
          });
        }}
      />
    </PanelPage>
  );
}
