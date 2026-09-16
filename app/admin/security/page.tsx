"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Flag, ScrollText, Shield } from "lucide-react";
import { adminMarketplaceApi } from "@/services/api";
import { QUERY_KEYS } from "@/constants";
import { getErrorMessage } from "@/services/api/client";
import { formatDate, formatRelativeTime } from "@/utils/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18n } from "@/hooks";
import { useSetPageTitle } from "@/components/providers/page-title-provider";
import { PageHeader } from "@/components/shared/page-header";
import { PanelPage } from "@/components/shared/panel-page";
import { PanelCard } from "@/components/shared/panel-card";
import { EmptyState } from "@/components/shared/empty-state";
import { PanelListSkeleton } from "@/components/shared/loading-skeleton";
import { toast } from "sonner";

export default function AdminSecurityPage() {
  const { t } = useI18n();
  useSetPageTitle(t("admin.securityTitle"));
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.ADMIN_SECURITY],
    queryFn: async () => (await adminMarketplaceApi.security()).data.data,
  });

  const reviewMutation = useMutation({
    mutationFn: ({ id, approve }: { id: string; approve: boolean }) =>
      approve
        ? adminMarketplaceApi.approveKyc(id)
        : adminMarketplaceApi.rejectKyc(id, t("admin.kycRejectedDefault")),
    onSuccess: (_res, vars) => {
      toast.success(vars.approve ? t("admin.kycApprovedToast") : t("admin.kycRejectedToast"));
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_SECURITY] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const logs = data?.activityLogs ?? [];
  const flagged = data?.flaggedMessages ?? [];
  const pendingKyc = data?.pendingKyc ?? [];

  return (
    <PanelPage>
      <PageHeader
        variant="minimal"
        title={t("admin.securityTitle")}
        description={t("admin.securitySub")}
      />

      {isLoading ? (
        <PanelListSkeleton />
      ) : (
        <Tabs defaultValue="logs">
          <TabsList className="bg-muted">
            <TabsTrigger value="logs">
              {t("admin.activityLogs", { count: logs.length })}
            </TabsTrigger>
            <TabsTrigger value="flagged">
              {t("admin.flaggedMessages", { count: flagged.length })}
            </TabsTrigger>
            <TabsTrigger value="kyc">
              {t("admin.pendingKycTab", { count: pendingKyc.length })}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="logs" className="mt-4 space-y-3">
            {logs.length === 0 ? (
              <EmptyState icon={ScrollText} title={t("admin.noActivityLogs")} />
            ) : (
              logs.map((log) => (
                <PanelCard key={log.id} padding="sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium text-foreground">{log.action}</p>
                    <span className="text-xs text-muted-foreground">
                      {formatRelativeTime(log.createdAt)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {log.entityType}
                    {log.entityId ? ` · ${log.entityId}` : ""} · {log.userId}
                  </p>
                </PanelCard>
              ))
            )}
          </TabsContent>

          <TabsContent value="flagged" className="mt-4 space-y-3">
            {flagged.length === 0 ? (
              <EmptyState icon={Flag} title={t("admin.noFlaggedMessages")} />
            ) : (
              flagged.map((msg) => (
                <PanelCard key={msg.id} padding="sm">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <Badge className="border border-red-200 bg-red-50 text-red-700">
                      {t("admin.flagged")}
                    </Badge>
                    <span className="text-sm font-medium text-foreground">{msg.senderName}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(msg.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-foreground">{msg.content}</p>
                </PanelCard>
              ))
            )}
          </TabsContent>

          <TabsContent value="kyc" className="mt-4 space-y-3">
            {pendingKyc.length === 0 ? (
              <EmptyState icon={Shield} title={t("admin.noPendingKyc")} />
            ) : (
              pendingKyc.map((kyc) => (
                <PanelCard key={kyc.id} padding="sm" className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium text-foreground">
                      {t("admin.userLabel", { id: kyc.userId.slice(0, 8) })}
                    </p>
                    <Badge className="border border-amber-200 bg-amber-50 capitalize text-amber-700">
                      {kyc.status.replace(/_/g, " ")}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t("admin.submitted", { date: formatDate(kyc.submittedAt) })}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700"
                      disabled={reviewMutation.isPending}
                      onClick={() => reviewMutation.mutate({ id: kyc.id, approve: true })}
                    >
                      {t("admin.approveKyc")}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={reviewMutation.isPending}
                      onClick={() => reviewMutation.mutate({ id: kyc.id, approve: false })}
                    >
                      {t("admin.rejectKyc")}
                    </Button>
                  </div>
                </PanelCard>
              ))
            )}
          </TabsContent>
        </Tabs>
      )}
    </PanelPage>
  );
}
