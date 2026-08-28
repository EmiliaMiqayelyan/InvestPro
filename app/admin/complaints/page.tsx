"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertTriangle } from "lucide-react";
import { adminMarketplaceApi } from "@/services/api";
import { QUERY_KEYS, STATUS_COLORS } from "@/constants";
import { formatDate } from "@/utils/format";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useI18n } from "@/hooks";
import { useSetPageTitle } from "@/components/providers/page-title-provider";
import { PageHeader } from "@/components/shared/page-header";
import type { Complaint } from "@/types";

export default function AdminComplaintsPage() {
  const { t } = useI18n();
  useSetPageTitle(t("admin.complaintsTitle"));
  const { data: complaints = [], isLoading } = useQuery({
    queryKey: [QUERY_KEYS.ADMIN_COMPLAINTS],
    queryFn: async () => {
      const res = await adminMarketplaceApi.complaints();
      return (res.data.data ?? res.data) as Complaint[];
    },
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
            <div key={c.id} className="premium-card space-y-2 p-5">
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
