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
    <div className="space-y-6">
      <PageHeader
        variant="minimal"
        title={t("admin.membershipsTitle")}
        description={t("admin.membershipsSub")}
      />

      <div className="premium-card p-5">
        <p className="text-xs text-muted-foreground">{t("admin.activeMemberships")}</p>
        <p className="mt-1 font-display text-2xl font-semibold">{active}</p>
      </div>

      {isLoading ? (
        <div className="premium-card h-40 animate-pulse bg-slate-100" />
      ) : memberships.length === 0 ? (
        <div className="premium-card flex flex-col items-center gap-3 p-12 text-center">
          <CreditCard className="h-10 w-10 text-slate-300" />
          <p className="font-medium text-slate-900">{t("admin.noMemberships")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {memberships.map((sub) => (
            <div
              key={sub.id}
              className="premium-card flex flex-wrap items-center justify-between gap-4 p-5"
            >
              <div>
                <p className="font-semibold text-slate-900">
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
                <p className="font-semibold text-slate-900">{formatCurrency(sub.amount)}</p>
                <Badge className={cn("border capitalize", STATUS_COLORS[sub.status])}>
                  {sub.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
