"use client";

import { useQuery } from "@tanstack/react-query";
import { paymentsApi, type PaymentReportRow } from "@/services/api";
import { formatCurrency, formatDate } from "@/utils/format";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/hooks";
import { cn } from "@/lib/utils";
import { STATUS_COLORS } from "@/constants";

export function PaymentReport({ showUser = false }: { showUser?: boolean }) {
  const { t } = useI18n();
  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["payment-report", showUser],
    queryFn: async () => (await paymentsApi.report()).data.data,
  });

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">{t("common.loading")}</p>;
  }
  if (rows.length === 0) {
    return <p className="text-sm text-muted-foreground">{t("investor.paymentReportEmpty")}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="text-xs text-muted-foreground">
          <tr className="border-b border-border">
            <th className="py-2 pr-3 font-medium">{t("investor.colWhen")}</th>
            <th className="py-2 pr-3 font-medium">{t("investor.colType")}</th>
            <th className="py-2 pr-3 font-medium">{t("investor.colStatus")}</th>
            <th className="py-2 pr-3 font-medium">{t("investor.colUsd")}</th>
            <th className="py-2 pr-3 font-medium">{t("investor.colAsset")}</th>
            <th className="py-2 pr-3 font-medium">{t("investor.colRate")}</th>
            <th className="py-2 font-medium">{t("investor.colBalance")}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <PaymentReportLine key={row.id} row={row} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PaymentReportLine({ row }: { row: PaymentReportRow }) {
  const asset =
    row.paidAmount != null && row.paidAsset
      ? `${row.paidAmount} ${row.paidAsset}`
      : "—";
  return (
    <tr className="border-b border-border/70 align-top">
      <td className="py-3 pr-3 text-muted-foreground">{formatDate(row.createdAt)}</td>
      <td className="py-3 pr-3">
        <div>{row.type.replace(/_/g, " ")}</div>
        {row.exceptionReason ? (
          <p className="mt-1 max-w-xs text-xs text-destructive">{row.exceptionReason}</p>
        ) : null}
        {row.providerTransactionId ? (
          <p className="mt-1 max-w-[180px] truncate text-xs text-muted-foreground">
            {row.providerTransactionId}
          </p>
        ) : null}
      </td>
      <td className="py-3 pr-3">
        <Badge className={cn("border capitalize", STATUS_COLORS[row.status])}>{row.status}</Badge>
      </td>
      <td className="py-3 pr-3 font-medium">{formatCurrency(row.usdAmount)}</td>
      <td className="py-3 pr-3">{asset}</td>
      <td className="py-3 pr-3">{row.fxRate ?? "—"}</td>
      <td className="py-3">
        {row.balanceAfter == null ? "—" : formatCurrency(row.balanceAfter)}
      </td>
    </tr>
  );
}
