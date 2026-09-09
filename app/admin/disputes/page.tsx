"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle } from "lucide-react";
import { adminFinanceApi } from "@/services/api";
import { QUERY_KEYS, STATUS_COLORS } from "@/constants";
import { getErrorMessage } from "@/services/api/client";
import { formatDate } from "@/utils/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useI18n } from "@/hooks";
import { useSetPageTitle } from "@/components/providers/page-title-provider";
import { PageHeader } from "@/components/shared/page-header";
import type { Dispute } from "@/types";
import { toast } from "sonner";

export default function AdminDisputesPage() {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  useSetPageTitle(t("admin.disputesTitle"));
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [resolution, setResolution] = useState("");

  const { data: page, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.ADMIN_DISPUTES],
    queryFn: async () => (await adminFinanceApi.disputes({ limit: 50 })).data.data,
  });

  const disputes = (page?.data ?? []) as Dispute[];

  const resolveMutation = useMutation({
    mutationFn: ({ id, note }: { id: string; note: string }) =>
      adminFinanceApi.resolveDispute(id, note),
    onSuccess: () => {
      toast.success(t("admin.disputeResolved"));
      setResolvingId(null);
      setResolution("");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_DISPUTES] });
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        variant="minimal"
        title={t("admin.disputesTitle")}
        description={t("admin.disputesSub")}
      />

      {isLoading ? (
        <div className="premium-card h-40 animate-pulse bg-slate-100" />
      ) : disputes.length === 0 ? (
        <div className="premium-card flex flex-col items-center gap-3 p-12 text-center">
          <AlertTriangle className="h-10 w-10 text-slate-300" />
          <p className="font-medium text-slate-900">{t("admin.noDisputes")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {disputes.map((d) => (
            <div key={d.id} className="premium-card space-y-3 p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-slate-900">{d.subject}</p>
                  <p className="text-xs text-muted-foreground">
                    {d.reporterId}
                    {d.againstUserId ? ` · ${d.againstUserId}` : ""}
                    {" · "}
                    {formatDate(d.createdAt)}
                  </p>
                </div>
                <Badge className={cn("border capitalize", STATUS_COLORS[d.status] || STATUS_COLORS.open)}>
                  {d.status}
                </Badge>
              </div>
              <p className="text-sm text-slate-700">{d.description}</p>
              {d.resolution && (
                <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
                  {d.resolution}
                </p>
              )}
              {d.status === "open" && (
                <div className="space-y-3 border-t border-border pt-3">
                  {resolvingId === d.id ? (
                    <>
                      <div className="space-y-2">
                        <Label>{t("admin.resolutionLabel")}</Label>
                        <Textarea
                          value={resolution}
                          onChange={(e) => setResolution(e.target.value)}
                          placeholder={t("admin.resolutionPlaceholder")}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          disabled={resolveMutation.isPending || resolution.trim().length < 5}
                          onClick={() =>
                            resolveMutation.mutate({ id: d.id, note: resolution.trim() })
                          }
                        >
                          {t("admin.resolveDispute")}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setResolvingId(null);
                            setResolution("");
                          }}
                        >
                          {t("common.cancel")}
                        </Button>
                      </div>
                    </>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => setResolvingId(d.id)}>
                      {t("admin.resolveDispute")}
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
