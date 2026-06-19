"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FileCheck, Check, X, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable, type Column } from "@/components/shared/data-table";
import { DataTableSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { DEFAULT_PAGE_SIZE, QUERY_KEYS } from "@/constants";
import { kycApi } from "@/services/api";
import { formatDate } from "@/utils/format";
import { getErrorMessage } from "@/services/api/client";
import { toast } from "sonner";
import type { KycSubmission } from "@/types";

export default function AdminKycPage() {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.KYC, "admin", page],
    queryFn: async () => {
      const { data } = await kycApi.getAll({ page, limit: DEFAULT_PAGE_SIZE, status: "pending" });
      return data.data;
    },
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => kycApi.approve(id),
    onSuccess: () => {
      toast.success("KYC approved");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.KYC] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => kycApi.reject(id, "Documents do not meet requirements"),
    onSuccess: () => {
      toast.success("KYC rejected");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.KYC] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const resubmitMutation = useMutation({
    mutationFn: (id: string) => kycApi.requestResubmission(id, "Please resubmit clearer documents"),
    onSuccess: () => {
      toast.success("Resubmission requested");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.KYC] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const columns: Column<KycSubmission>[] = [
    { key: "user", header: "User", cell: (k) => k.userId.slice(0, 8) + "..." },
    { key: "date", header: "Submitted", cell: (k) => formatDate(k.submittedAt) },
    { key: "status", header: "Status", cell: (k) => <Badge variant={k.status}>{k.status}</Badge> },
    {
      key: "actions",
      header: "Actions",
      cell: (k) =>
        k.status === "pending" ? (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => approveMutation.mutate(k.id)}>
              <Check className="h-4 w-4 text-emerald-400" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => rejectMutation.mutate(k.id)}>
              <X className="h-4 w-4 text-destructive" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => resubmitMutation.mutate(k.id)}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        ) : null,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">KYC Verification</h1>
        <p className="text-muted-foreground">Review and manage KYC submissions</p>
      </div>

      {isLoading ? (
        <DataTableSkeleton />
      ) : data?.data.length ? (
        <>
          <DataTable columns={columns} data={data.data} keyExtractor={(k) => k.id} />
          <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />
        </>
      ) : (
        <EmptyState icon={FileCheck} title="No pending KYC submissions" />
      )}
    </div>
  );
}
