"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FolderKanban } from "lucide-react";
import { adminMarketplaceApi } from "@/services/api";
import { QUERY_KEYS, STATUS_COLORS } from "@/constants";
import { getErrorMessage } from "@/services/api/client";
import { formatCurrency, formatDate } from "@/utils/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminProjectsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.PROJECTS, "admin-marketplace"],
    queryFn: async () =>
      (await adminMarketplaceApi.projects({ limit: 100 })).data.data,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      adminMarketplaceApi.updateProjectStatus(id, status),
    onSuccess: () => {
      toast.success("Project status updated");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROJECTS, "admin-marketplace"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const projects = data?.data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold text-slate-900">Projects</h2>
        <p className="text-sm text-muted-foreground">Publish or reject listings under review</p>
      </div>

      {isLoading ? (
        <div className="premium-card h-40 animate-pulse bg-slate-100" />
      ) : projects.length === 0 ? (
        <div className="premium-card flex flex-col items-center gap-3 p-12 text-center">
          <FolderKanban className="h-10 w-10 text-slate-300" />
          <p className="font-medium text-slate-900">No projects</p>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="premium-card flex flex-wrap items-center justify-between gap-4 p-5"
            >
              <div>
                <p className="font-semibold text-slate-900">{project.title}</p>
                <p className="text-sm text-muted-foreground">
                  {project.ownerName || "Owner"} · {project.category} ·{" "}
                  {formatDate(project.createdAt)}
                </p>
                <p className="mt-1 text-sm text-slate-700">
                  Goal {formatCurrency(project.requiredInvestment)}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className={cn("border capitalize", STATUS_COLORS[project.status])}>
                  {project.status.replace(/_/g, " ")}
                </Badge>
                {(project.status === "pending_review" || project.status === "draft") && (
                  <>
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700"
                      disabled={statusMutation.isPending}
                      onClick={() =>
                        statusMutation.mutate({ id: project.id, status: "published" })
                      }
                    >
                      Publish
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={statusMutation.isPending}
                      onClick={() =>
                        statusMutation.mutate({ id: project.id, status: "rejected" })
                      }
                    >
                      Reject
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
