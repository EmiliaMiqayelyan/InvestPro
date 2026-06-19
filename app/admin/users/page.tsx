"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/shared/search-input";
import { DataTable, type Column } from "@/components/shared/data-table";
import { DataTableSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { DEFAULT_PAGE_SIZE, QUERY_KEYS } from "@/constants";
import { usersApi } from "@/services/api";
import { formatDate } from "@/utils/format";
import type { User } from "@/types";

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.ADMIN_USERS, page, search],
    queryFn: async () => {
      const { data } = await usersApi.getAll({ page, limit: DEFAULT_PAGE_SIZE, search });
      return data.data;
    },
  });

  const columns: Column<User>[] = [
    {
      key: "name",
      header: "Name",
      cell: (u) => `${u.firstName} ${u.lastName}`,
    },
    { key: "email", header: "Email", cell: (u) => u.email },
    { key: "role", header: "Role", cell: (u) => <Badge variant="outline">{u.role}</Badge> },
    {
      key: "kyc",
      header: "KYC",
      cell: (u) => <Badge variant={u.kycStatus}>{u.kycStatus.replace(/_/g, " ")}</Badge>,
    },
    {
      key: "verified",
      header: "Email",
      cell: (u) => (
        <Badge variant={u.isEmailVerified ? "approved" : "pending"}>
          {u.isEmailVerified ? "Verified" : "Unverified"}
        </Badge>
      ),
    },
    { key: "joined", header: "Joined", cell: (u) => formatDate(u.createdAt) },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground">Manage platform users</p>
      </div>

      <SearchInput value={search} onChange={setSearch} placeholder="Search users..." className="max-w-md" />

      {isLoading ? (
        <DataTableSkeleton />
      ) : data?.data.length ? (
        <>
          <DataTable columns={columns} data={data.data} keyExtractor={(u) => u.id} />
          <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />
        </>
      ) : (
        <EmptyState icon={Users} title="No users found" />
      )}
    </div>
  );
}
