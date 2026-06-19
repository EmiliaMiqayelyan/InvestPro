"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeftRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/shared/search-input";
import { DataTable, type Column } from "@/components/shared/data-table";
import { DataTableSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { DEFAULT_PAGE_SIZE, QUERY_KEYS } from "@/constants";
import { transactionsApi } from "@/services/api";
import { formatCurrency, formatDate } from "@/utils/format";
import type { Transaction } from "@/types";

export default function AdminTransactionsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.TRANSACTIONS, "admin", page, search],
    queryFn: async () => {
      const { data } = await transactionsApi.getAllAdmin({ page, limit: DEFAULT_PAGE_SIZE, search });
      return data.data;
    },
  });

  const columns: Column<Transaction>[] = [
    { key: "date", header: "Date", cell: (t) => formatDate(t.createdAt) },
    { key: "user", header: "User ID", cell: (t) => t.userId.slice(0, 8) + "..." },
    { key: "type", header: "Type", cell: (t) => <span className="capitalize">{t.type}</span> },
    { key: "amount", header: "Amount", cell: (t) => formatCurrency(t.amount) },
    { key: "status", header: "Status", cell: (t) => <Badge variant={t.status}>{t.status}</Badge> },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Transaction Management</h1>
        <p className="text-muted-foreground">View all platform transactions</p>
      </div>

      <SearchInput value={search} onChange={setSearch} className="max-w-md" />

      {isLoading ? (
        <DataTableSkeleton />
      ) : data?.data.length ? (
        <>
          <DataTable columns={columns} data={data.data} keyExtractor={(t) => t.id} />
          <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />
        </>
      ) : (
        <EmptyState icon={ArrowLeftRight} title="No transactions" />
      )}
    </div>
  );
}
