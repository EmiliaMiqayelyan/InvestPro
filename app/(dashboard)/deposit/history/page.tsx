"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowDownToLine } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DataTable, type Column } from "@/components/shared/data-table";
import { DataTableSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { DEFAULT_PAGE_SIZE, QUERY_KEYS } from "@/constants";
import { depositsApi } from "@/services/api";
import { formatCurrency, formatDate } from "@/utils/format";
import type { Deposit } from "@/types";

export default function DepositHistoryPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.DEPOSITS, "history", page],
    queryFn: async () => {
      const { data } = await depositsApi.getHistory({ page, limit: DEFAULT_PAGE_SIZE });
      return data.data;
    },
  });

  const columns: Column<Deposit>[] = [
    { key: "date", header: "Date", cell: (d) => formatDate(d.createdAt) },
    { key: "amount", header: "Amount", cell: (d) => formatCurrency(d.amount) },
    { key: "method", header: "Method", cell: (d) => d.paymentMethod },
    { key: "status", header: "Status", cell: (d) => <Badge variant={d.status}>{d.status}</Badge> },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Deposit History</h1>
        <p className="text-muted-foreground">All your deposit transactions</p>
      </div>

      {isLoading ? (
        <DataTableSkeleton />
      ) : data?.data.length ? (
        <>
          <DataTable columns={columns} data={data.data} keyExtractor={(d) => d.id} />
          <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />
        </>
      ) : (
        <EmptyState icon={ArrowDownToLine} title="No deposits" description="Your deposit history will appear here" />
      )}
    </div>
  );
}
