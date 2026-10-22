"use client";

import { useQuery } from "@tanstack/react-query";
import { CreditCard } from "lucide-react";
import { adminMarketplaceApi } from "@/services/api";
import type { PaymentReportRow } from "@/services/api";
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

export default function AdminPaymentsPage() {
  const { t } = useI18n();
  useSetPageTitle(t("admin.paymentsTitle"));
  const { data: payments = [], isLoading } = useQuery({
    queryKey: [QUERY_KEYS.ADMIN_PAYMENTS],
    queryFn: async () => {
      const res = await adminMarketplaceApi.payments();
      return (res.data.data ?? []) as PaymentReportRow[];
    },
  });
  const reviewCount = payments.filter((row) => row.status === "review").length;

  return (
    <PanelPage>
      <PageHeader
        variant="minimal"
        title={t("admin.paymentsTitle")}
        description={t("admin.paymentsSub")}
      />

      {reviewCount > 0 ? (
        <p className="text-sm text-destructive">
          {t("admin.paymentReview", { count: reviewCount })}
        </p>
      ) : null}

      {isLoading ? (
        <PanelListSkeleton />
      ) : payments.length === 0 ? (
        <EmptyState icon={CreditCard} title={t("admin.noPayments")} />
      ) : (
        <div className="space-y-3">
          {payments.map((row) => (
            <PanelCard
              key={row.id}
              className="flex flex-wrap items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <p className="font-semibold capitalize text-foreground">
                  {row.type.replace(/_/g, " ")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {row.userEmail || row.userId}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(row.createdAt)}
                  {row.paidAmount != null && row.paidAsset
                    ? ` · ${row.paidAmount} ${row.paidAsset}`
                    : ""}
                  {row.fxRate != null ? ` · ${row.fxRate}` : ""}
                </p>
                {row.exceptionReason ? (
                  <p className="mt-1 text-xs text-destructive">{row.exceptionReason}</p>
                ) : null}
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="font-semibold text-foreground">{formatCurrency(row.usdAmount)}</p>
                  {row.balanceAfter != null ? (
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(row.balanceAfter)}
                    </p>
                  ) : null}
                </div>
                <Badge className={cn("border capitalize", STATUS_COLORS[row.status])}>
                  {row.status}
                </Badge>
              </div>
            </PanelCard>
          ))}
        </div>
      )}
    </PanelPage>
  );
}
