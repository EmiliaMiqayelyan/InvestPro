"use client";

import { useQuery } from "@tanstack/react-query";
import { Flag, ScrollText } from "lucide-react";
import { adminMarketplaceApi } from "@/services/api";
import { QUERY_KEYS } from "@/constants";
import { formatDate, formatRelativeTime } from "@/utils/format";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18n } from "@/hooks";

export default function AdminSecurityPage() {
  const { t } = useI18n();
  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.ADMIN_SECURITY],
    queryFn: async () => (await adminMarketplaceApi.security()).data.data,
  });

  const logs = data?.activityLogs ?? [];
  const flagged = data?.flaggedMessages ?? [];
  const pendingKyc = data?.pendingKyc ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold text-slate-900">
          {t("admin.securityTitle")}
        </h2>
        <p className="text-sm text-muted-foreground">{t("admin.securitySub")}</p>
      </div>

      {isLoading ? (
        <div className="premium-card h-40 animate-pulse bg-slate-100" />
      ) : (
        <Tabs defaultValue="logs">
          <TabsList className="bg-slate-100">
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
              <div className="premium-card flex flex-col items-center gap-3 p-12 text-center">
                <ScrollText className="h-10 w-10 text-slate-300" />
                <p className="font-medium text-slate-900">{t("admin.noActivityLogs")}</p>
              </div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="premium-card p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium text-slate-900">{log.action}</p>
                    <span className="text-xs text-muted-foreground">
                      {formatRelativeTime(log.createdAt)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {log.entityType}
                    {log.entityId ? ` · ${log.entityId}` : ""} · {log.userId}
                  </p>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="flagged" className="mt-4 space-y-3">
            {flagged.length === 0 ? (
              <div className="premium-card flex flex-col items-center gap-3 p-12 text-center">
                <Flag className="h-10 w-10 text-slate-300" />
                <p className="font-medium text-slate-900">{t("admin.noFlaggedMessages")}</p>
              </div>
            ) : (
              flagged.map((msg) => (
                <div key={msg.id} className="premium-card p-4">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <Badge className="border border-red-200 bg-red-50 text-red-700">
                      {t("admin.flagged")}
                    </Badge>
                    <span className="text-sm font-medium text-slate-900">{msg.senderName}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(msg.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700">{msg.content}</p>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="kyc" className="mt-4 space-y-3">
            {pendingKyc.length === 0 ? (
              <div className="premium-card p-8 text-center text-sm text-muted-foreground">
                {t("admin.noPendingKyc")}
              </div>
            ) : (
              pendingKyc.map((kyc) => (
                <div key={kyc.id} className="premium-card p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium text-slate-900">
                      {t("admin.userLabel", { id: kyc.userId.slice(0, 8) })}
                    </p>
                    <Badge className="border border-amber-200 bg-amber-50 capitalize text-amber-700">
                      {kyc.status.replace(/_/g, " ")}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t("admin.submitted", { date: formatDate(kyc.submittedAt) })}
                  </p>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
