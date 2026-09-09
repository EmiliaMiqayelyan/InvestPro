"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle } from "lucide-react";
import { adminMarketplaceApi, adminFinanceApi } from "@/services/api";
import { QUERY_KEYS, STATUS_COLORS } from "@/constants";
import { getErrorMessage } from "@/services/api/client";
import { formatDate } from "@/utils/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useI18n } from "@/hooks";
import { useSetPageTitle } from "@/components/providers/page-title-provider";
import { PageHeader } from "@/components/shared/page-header";
import type { Complaint } from "@/types";
import { toast } from "sonner";

export default function AdminComplaintsPage() {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  useSetPageTitle(t("admin.complaintsTitle"));
  const { data: complaints = [], isLoading } = useQuery({
    queryKey: [QUERY_KEYS.ADMIN_COMPLAINTS],
    queryFn: async () => {
      const res = await adminMarketplaceApi.complaints();
      return (res.data.data ?? res.data) as Complaint[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Complaint["status"] }) =>
      adminFinanceApi.updateComplaint(id, status),
    onSuccess: () => {
      toast.success(t("admin.complaintUpdated"));
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_COMPLAINTS] });
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        variant="minimal"
        title={t("admin.complaintsTitle")}
        description={t("admin.complaintsSub")}
      />

      {isLoading ? (
        <div className="premium-card h-40 animate-pulse bg-slate-100" />
      ) : complaints.length === 0 ? (
        <div className="premium-card flex flex-col items-center gap-3 p-12 text-center">
          <AlertTriangle className="h-10 w-10 text-slate-300" />
          <p className="font-medium text-slate-900">{t("admin.noComplaints")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {complaints.map((c) => (
            <div key={c.id} className="premium-card space-y-3 p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-slate-900">{c.subject}</p>
                  <p className="text-xs text-muted-foreground">
                    {c.reporterId}
                    {c.againstUserId ? ` · ${c.againstUserId}` : ""}
                    {c.projectId ? ` · ${c.projectId}` : ""}
                    {" · "}
                    {formatDate(c.createdAt)}
                  </p>
                </div>
                <Badge className={cn("border capitalize", STATUS_COLORS[c.status])}>
                  {c.status}
                </Badge>
              </div>
              <p className="text-sm text-slate-700">{c.description}</p>
              {(c.status === "open" || c.status === "reviewing") && (
                <div className="flex flex-wrap gap-2">
                  {c.status === "open" && (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={updateMutation.isPending}
                      onClick={() =>
                        updateMutation.mutate({ id: c.id, status: "reviewing" })
                      }
                    >
                      {t("admin.markReviewing")}
                    </Button>
                  )}
                  <Button
                    size="sm"
                    disabled={updateMutation.isPending}
                    onClick={() =>
                      updateMutation.mutate({ id: c.id, status: "resolved" })
                    }
                  >
                    {t("admin.resolveComplaint")}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={updateMutation.isPending}
                    onClick={() =>
                      updateMutation.mutate({ id: c.id, status: "dismissed" })
                    }
                  >
                    {t("admin.dismissComplaint")}
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
