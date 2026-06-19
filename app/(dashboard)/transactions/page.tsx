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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEFAULT_PAGE_SIZE, QUERY_KEYS } from "@/constants";
import { transactionsApi } from "@/services/api";
import { formatCurrency, formatDate } from "@/utils/format";
import type { Transaction } from "@/types";

export default function TransactionsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.TRANSACTIONS, page, search, type, status],
    queryFn: async () => {
      const { data } = await transactionsApi.getAll({
        page,
        limit: DEFAULT_PAGE_SIZE,
        search: search || undefined,
        type: type !== "all" ? type : undefined,
        status: status !== "all" ? status : undefined,
      });
      return data.data;
    },
  });

  const columns: Column<Transaction>[] = [
    { key: "date", header: "Date", cell: (t) => formatDate(t.createdAt) },
    { key: "type", header: "Type", cell: (t) => <span className="capitalize">{t.type}</span> },
    { key: "description", header: "Description", cell: (t) => t.description },
    { key: "amount", header: "Amount", cell: (t) => formatCurrency(t.amount) },
    { key: "status", header: "Status", cell: (t) => <Badge variant={t.status}>{t.status}</Badge> },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Transactions</h1>
        <p className="text-muted-foreground">Complete history of all your transactions</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <SearchInput value={search} onChange={setSearch} className="flex-1" />
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="deposit">Deposit</SelectItem>
            <SelectItem value="withdrawal">Withdrawal</SelectItem>
            <SelectItem value="investment">Investment</SelectItem>
            <SelectItem value="profit">Profit</SelectItem>
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <DataTableSkeleton />
      ) : data?.data.length ? (
        <>
          <DataTable columns={columns} data={data.data} keyExtractor={(t) => t.id} />
          <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />
        </>
      ) : (
        <EmptyState icon={ArrowLeftRight} title="No transactions" description="Your transactions will appear here" />
      )}
    </div>
  );
}
