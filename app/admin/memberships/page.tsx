"use client";

import { useQuery } from "@tanstack/react-query";
import { CreditCard } from "lucide-react";
import { adminFinanceApi } from "@/services/api";
import { QUERY_KEYS, STATUS_COLORS } from "@/constants";
import { formatCurrency, formatDate } from "@/utils/format";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useI18n } from "@/hooks";
import { useSetPageTitle } from "@/components/providers/page-title-provider";
import { PageHeader } from "@/components/shared/page-header";
import { PanelPage } from "@/components/shared/panel-page";
import { PanelCard } from "@/components/shared/panel-card";
import { EmptyState } from "@/components/shared/empty-state";
import { PanelListSkeleton } from "@/components/shared/loading-skeleton";
import type { MembershipSubscription } from "@/types";

type MembershipRow = MembershipSubscription & {
  userName?: string;
  userEmail?: string;
};

export default function AdminMembershipsPage() {
  const { t } = useI18n();
  useSetPageTitle(t("admin.membershipsTitle"));
  const { data: memberships = [], isLoading } = useQuery({
    queryKey: [QUERY_KEYS.ADMIN_MEMBERSHIPS],
    queryFn: async () => {
      const res = await adminFinanceApi.memberships();
      return (res.data.data ?? res.data) as MembershipRow[];
    },
  });

  const active = memberships.filter((m) => m.status === "active").length;

  return (
    <PanelPage>
      <PageHeader
        variant="minimal"
        title={t("admin.membershipsTitle")}
        description={t("admin.membershipsSub")}
      />

      <PanelCard>
        <p className="text-xs text-muted-foreground">{t("admin.activeMemberships")}</p>
        <p className="mt-1 font-display text-2xl font-semibold text-foreground">{active}</p>
      </PanelCard>

      {isLoading ? (
        <PanelListSkeleton />
      ) : memberships.length === 0 ? (
        <EmptyState icon={CreditCard} title={t("admin.noMemberships")} />
      ) : (
        <div className="space-y-3">
          {memberships.map((sub) => (
            <PanelCard
              key={sub.id}
              className="flex flex-wrap items-center justify-between gap-4"
            >
              <div>
                <p className="font-semibold text-foreground">
                  {t("admin.planLabel", { plan: sub.planId })}
                </p>
                <p className="text-sm text-muted-foreground">
                  {sub.userName || sub.userEmail || sub.userId}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(sub.startedAt)} → {formatDate(sub.expiresAt)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <p className="font-semibold text-foreground">{formatCurrency(sub.amount)}</p>
                <Badge className={cn("border capitalize", STATUS_COLORS[sub.status])}>
                  {sub.status}
                </Badge>
              </div>
            </PanelCard>
          ))}
        </div>
      )}
    </PanelPage>
  );
}
