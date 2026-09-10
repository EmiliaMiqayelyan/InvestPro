"use client";

import { Users } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useOwnerProjects } from "@/hooks/use-marketplace";
import { useI18n } from "@/hooks";
import { useSetPageTitle } from "@/components/providers/page-title-provider";
import { PanelPage } from "@/components/shared/panel-page";
import { PanelCard } from "@/components/shared/panel-card";
import { EmptyState } from "@/components/shared/empty-state";
import { PanelBlockSkeleton } from "@/components/shared/loading-skeleton";
import { ownerApi } from "@/services/api";
import { getErrorMessage } from "@/services/api/client";
import { QUERY_KEYS } from "@/constants";
import { teamRoleLabel } from "@/i18n/localize";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { TeamMember } from "@/types";

type TeamRow = TeamMember & { projectTitle: string; projectId: string };

export default function OwnerTeamPage() {
  const { t, locale } = useI18n();
  useSetPageTitle(t("nav.team"));
  const queryClient = useQueryClient();
  const { data: projects = [], isLoading } = useOwnerProjects();

  const team: TeamRow[] = projects.flatMap((p) =>
    (p.team || []).map((member) => ({
      ...member,
      projectTitle: p.title,
      projectId: p.id,
    }))
  );

  const removeMutation = useMutation({
    mutationFn: ({ projectId, memberId }: { projectId: string; memberId: string }) =>
      ownerApi.removeTeamMember(projectId, memberId),
    onSuccess: () => {
      toast.success(t("ownerReview.removedToast"));
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.OWNER_PROJECTS] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return (
    <PanelPage>
      {isLoading ? (
        <PanelBlockSkeleton height="h-40" />
      ) : team.length === 0 ? (
        <EmptyState icon={Users} title={t("owner.noTeamYet")} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {team.map((member) => {
            const roleLabel = teamRoleLabel(locale, member.role);
            return (
              <PanelCard key={`${member.projectId}-${member.id}`}>
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-foreground">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.position}</p>
                  </div>
                  <Badge className="border border-primary/20 bg-primary/10 text-primary">
                    {roleLabel}
                  </Badge>
                </div>
                <p className="mb-2 text-xs text-muted-foreground">{member.projectTitle}</p>
                <p className="mb-3 line-clamp-3 text-sm text-muted-foreground">
                  {member.biography || member.experience || "—"}
                </p>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                  disabled={removeMutation.isPending}
                  onClick={() => {
                    if (!window.confirm(t("ownerReview.removeMemberConfirm"))) return;
                    removeMutation.mutate({
                      projectId: member.projectId,
                      memberId: member.id,
                    });
                  }}
                >
                  {t("ownerReview.removeMember")}
                </Button>
              </PanelCard>
            );
          })}
        </div>
      )}
    </PanelPage>
  );
}
