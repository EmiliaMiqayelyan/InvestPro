"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Users } from "lucide-react";
import { adminMarketplaceApi } from "@/services/api";
import { QUERY_KEYS, STATUS_COLORS } from "@/constants";
import { formatDate } from "@/utils/format";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useI18n } from "@/hooks";
import { useSetPageTitle } from "@/components/providers/page-title-provider";
import { PageHeader } from "@/components/shared/page-header";
import { PanelPage } from "@/components/shared/panel-page";
import { EmptyState } from "@/components/shared/empty-state";
import { PanelListSkeleton } from "@/components/shared/loading-skeleton";
import { SearchInput } from "@/components/shared/search-input";
import { DataTable, type Column } from "@/components/shared/data-table";
import type { User } from "@/types";

export default function AdminUsersPage() {
  const { t } = useI18n();
  useSetPageTitle(t("admin.usersTitle"));
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<string>("all");

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.ADMIN_USERS, search, role],
    queryFn: async () =>
      (
        await adminMarketplaceApi.users({
          search: search || undefined,
          role: role === "all" ? undefined : role,
          limit: 100,
        })
      ).data.data,
  });

  const users = data?.data ?? [];

  const columns: Column<User>[] = useMemo(
    () => [
      {
        key: "name",
        header: t("admin.colName"),
        cell: (u) => (
          <span className="font-medium text-foreground">
            {u.firstName} {u.lastName}
          </span>
        ),
      },
      {
        key: "email",
        header: t("admin.colEmail"),
        cell: (u) => (
          <span className="text-muted-foreground">{u.email}</span>
        ),
      },
      {
        key: "role",
        header: t("admin.colRole"),
        cell: (u) => (
          <Badge variant="outline">
            {t(`roles.${u.role}` as "roles.investor")}
          </Badge>
        ),
      },
      {
        key: "membership",
        header: t("admin.colMembership"),
        cell: (u) => (
          <span className="capitalize text-foreground">{u.membershipTier}</span>
        ),
      },
      {
        key: "kyc",
        header: t("admin.colKyc"),
        cell: (u) => (
          <Badge className={cn("border capitalize", STATUS_COLORS[u.kycStatus])}>
            {u.kycStatus.replace(/_/g, " ")}
          </Badge>
        ),
      },
      {
        key: "joined",
        header: t("admin.colJoined"),
        cell: (u) => (
          <span className="text-muted-foreground">{formatDate(u.createdAt)}</span>
        ),
      },
    ],
    [t]
  );

  return (
    <PanelPage>
      <PageHeader
        variant="minimal"
        title={t("admin.usersTitle")}
        description={t("admin.usersSub")}
      />

      <div className="flex flex-wrap gap-3">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder={t("admin.searchUsers")}
          className="max-w-sm"
        />
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder={t("admin.role")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("admin.allRoles")}</SelectItem>
            <SelectItem value="investor">{t("roles.investor")}</SelectItem>
            <SelectItem value="project_owner">{t("roles.project_owner")}</SelectItem>
            <SelectItem value="admin">{t("roles.admin")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <PanelListSkeleton />
      ) : users.length === 0 ? (
        <EmptyState icon={Users} title={t("admin.noUsers")} />
      ) : (
        <DataTable
          columns={columns}
          data={users}
          keyExtractor={(u) => u.id}
        />
      )}
    </PanelPage>
  );
}
