"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpFromLine } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DataTable, type Column } from "@/components/shared/data-table";
import { DataTableSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { DEFAULT_PAGE_SIZE, QUERY_KEYS } from "@/constants";
import { withdrawalsApi } from "@/services/api";
import { formatCurrency, formatDate } from "@/utils/format";
import type { Withdrawal } from "@/types";

export default function WithdrawHistoryPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.WITHDRAWALS, "history", page],
    queryFn: async () => {
      const { data } = await withdrawalsApi.getHistory({ page, limit: DEFAULT_PAGE_SIZE });
      return data.data;
    },
  });

  const columns: Column<Withdrawal>[] = [
    { key: "date", header: "Date", cell: (w) => formatDate(w.createdAt) },
    { key: "amount", header: "Amount", cell: (w) => formatCurrency(w.amount) },
    { key: "method", header: "Method", cell: (w) => w.paymentMethod },
    { key: "status", header: "Status", cell: (w) => <Badge variant={w.status}>{w.status}</Badge> },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Withdrawal History</h1>
        <p className="text-muted-foreground">All your withdrawal transactions</p>
      </div>

      {isLoading ? (
        <DataTableSkeleton />
      ) : data?.data.length ? (
        <>
          <DataTable columns={columns} data={data.data} keyExtractor={(w) => w.id} />
          <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />
        </>
      ) : (
        <EmptyState icon={ArrowUpFromLine} title="No withdrawals" description="Your withdrawal history will appear here" />
      )}
    </div>
  );
}
