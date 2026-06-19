"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowUpFromLine, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable, type Column } from "@/components/shared/data-table";
import { DataTableSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { DEFAULT_PAGE_SIZE, QUERY_KEYS } from "@/constants";
import { withdrawalsApi } from "@/services/api";
import { formatCurrency, formatDate } from "@/utils/format";
import { getErrorMessage } from "@/services/api/client";
import { toast } from "sonner";
import type { Withdrawal } from "@/types";

export default function AdminWithdrawalsPage() {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.WITHDRAWALS, "admin", page],
    queryFn: async () => {
      const { data } = await withdrawalsApi.getPending({ page, limit: DEFAULT_PAGE_SIZE });
      return data.data;
    },
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => withdrawalsApi.approve(id),
    onSuccess: () => {
      toast.success("Withdrawal approved");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WITHDRAWALS] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => withdrawalsApi.reject(id, "Rejected by admin"),
    onSuccess: () => {
      toast.success("Withdrawal rejected");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WITHDRAWALS] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const columns: Column<Withdrawal>[] = [
    { key: "date", header: "Date", cell: (w) => formatDate(w.createdAt) },
    { key: "user", header: "User", cell: (w) => w.userId.slice(0, 8) + "..." },
    { key: "amount", header: "Amount", cell: (w) => formatCurrency(w.amount) },
    { key: "method", header: "Method", cell: (w) => w.paymentMethod },
    { key: "status", header: "Status", cell: (w) => <Badge variant={w.status}>{w.status}</Badge> },
    {
      key: "actions",
      header: "Actions",
      cell: (w) =>
        w.status === "pending" ? (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => approveMutation.mutate(w.id)}>
              <Check className="h-4 w-4 text-emerald-400" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => rejectMutation.mutate(w.id)}>
              <X className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ) : null,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Withdrawal Management</h1>
        <p className="text-muted-foreground">Approve or reject pending withdrawals</p>
      </div>

      {isLoading ? (
        <DataTableSkeleton />
      ) : data?.data.length ? (
        <>
          <DataTable columns={columns} data={data.data} keyExtractor={(w) => w.id} />
          <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />
        </>
      ) : (
        <EmptyState icon={ArrowUpFromLine} title="No pending withdrawals" />
      )}
    </div>
  );
}
