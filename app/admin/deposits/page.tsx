"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowDownToLine, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable, type Column } from "@/components/shared/data-table";
import { DataTableSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { DEFAULT_PAGE_SIZE, QUERY_KEYS } from "@/constants";
import { depositsApi } from "@/services/api";
import { formatCurrency, formatDate } from "@/utils/format";
import { getErrorMessage } from "@/services/api/client";
import { toast } from "sonner";
import type { Deposit } from "@/types";

export default function AdminDepositsPage() {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.DEPOSITS, "admin", page],
    queryFn: async () => {
      const { data } = await depositsApi.getPending({ page, limit: DEFAULT_PAGE_SIZE });
      return data.data;
    },
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => depositsApi.approve(id),
    onSuccess: () => {
      toast.success("Deposit approved");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DEPOSITS] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => depositsApi.reject(id, "Rejected by admin"),
    onSuccess: () => {
      toast.success("Deposit rejected");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DEPOSITS] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const columns: Column<Deposit>[] = [
    { key: "date", header: "Date", cell: (d) => formatDate(d.createdAt) },
    { key: "user", header: "User", cell: (d) => d.userId.slice(0, 8) + "..." },
    { key: "amount", header: "Amount", cell: (d) => formatCurrency(d.amount) },
    { key: "method", header: "Method", cell: (d) => d.paymentMethod },
    { key: "status", header: "Status", cell: (d) => <Badge variant={d.status}>{d.status}</Badge> },
    {
      key: "actions",
      header: "Actions",
      cell: (d) =>
        d.status === "pending" ? (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => approveMutation.mutate(d.id)}>
              <Check className="h-4 w-4 text-emerald-400" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => rejectMutation.mutate(d.id)}>
              <X className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ) : null,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Deposit Management</h1>
        <p className="text-muted-foreground">Approve or reject pending deposits</p>
      </div>

      {isLoading ? (
        <DataTableSkeleton />
      ) : data?.data.length ? (
        <>
          <DataTable columns={columns} data={data.data} keyExtractor={(d) => d.id} />
          <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />
        </>
      ) : (
        <EmptyState icon={ArrowDownToLine} title="No pending deposits" />
      )}
    </div>
  );
}
