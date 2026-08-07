"use client";

import { Users } from "lucide-react";
import { useOwnerProjects } from "@/hooks/use-marketplace";
import { TEAM_ROLES } from "@/constants";
import { Badge } from "@/components/ui/badge";
import type { TeamMember } from "@/types";

type TeamRow = TeamMember & { projectTitle: string; projectId: string };

export default function OwnerTeamPage() {
  const { data: projects = [], isLoading } = useOwnerProjects();

  const team: TeamRow[] = projects.flatMap((p) =>
    (p.team || []).map((member) => ({
      ...member,
      projectTitle: p.title,
      projectId: p.id,
    }))
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold text-slate-900">Team</h2>
        <p className="text-sm text-muted-foreground">
          Members aggregated from all your projects
        </p>
      </div>

      {isLoading ? (
        <div className="premium-card h-40 animate-pulse bg-slate-100" />
      ) : team.length === 0 ? (
        <div className="premium-card flex flex-col items-center gap-3 p-12 text-center">
          <Users className="h-10 w-10 text-slate-300" />
          <p className="font-medium text-slate-900">No team members yet</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {team.map((member) => {
            const roleLabel =
              TEAM_ROLES.find((r) => r.value === member.role)?.label || member.role;
            return (
              <div key={`${member.projectId}-${member.id}`} className="premium-card p-5">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-slate-900">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.position}</p>
                  </div>
                  <Badge className="border border-blue-200 bg-blue-50 text-blue-700">
                    {roleLabel}
                  </Badge>
                </div>
                <p className="mb-2 text-xs text-muted-foreground">{member.projectTitle}</p>
                <p className="text-sm text-slate-600 line-clamp-3">
                  {member.biography || member.experience || "—"}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
