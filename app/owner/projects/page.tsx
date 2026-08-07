"use client";

import Link from "next/link";
import { FolderKanban, Plus } from "lucide-react";
import { useOwnerProjects } from "@/hooks/use-marketplace";
import { ROUTES, STATUS_COLORS } from "@/constants";
import { formatCurrency, formatDate } from "@/utils/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export default function OwnerProjectsPage() {
  const { data: projects = [], isLoading } = useOwnerProjects();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-semibold text-slate-900">My projects</h2>
          <p className="text-sm text-muted-foreground">Manage listings and funding progress</p>
        </div>
        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <Link href={ROUTES.OWNER_PROJECT_CREATE}>
            <Plus className="h-4 w-4" /> New project
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="premium-card h-40 animate-pulse bg-slate-100" />
      ) : projects.length === 0 ? (
        <div className="premium-card flex flex-col items-center gap-3 p-12 text-center">
          <FolderKanban className="h-10 w-10 text-slate-300" />
          <p className="font-medium text-slate-900">No projects yet</p>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href={ROUTES.OWNER_PROJECT_CREATE}>Create your first project</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => {
            const progress = Math.min(
              100,
              Math.round(
                (project.currentFunding / Math.max(project.requiredInvestment, 1)) * 100
              )
            );
            return (
              <div key={project.id} className="premium-card space-y-4 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">{project.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {project.category} · Updated {formatDate(project.updatedAt)}
                    </p>
                  </div>
                  <Badge className={cn("border capitalize", STATUS_COLORS[project.status])}>
                    {project.status.replace(/_/g, " ")}
                  </Badge>
                </div>
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
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
