"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Users } from "lucide-react";
import { adminMarketplaceApi } from "@/services/api";
import { QUERY_KEYS, STATUS_COLORS } from "@/constants";
import { formatDate } from "@/utils/format";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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

  return (
    <div className="space-y-6">
      <PageHeader
        variant="minimal"
        title={t("admin.usersTitle")}
        description={t("admin.usersSub")}
      />

      <div className="flex flex-wrap gap-3">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("admin.searchUsers")}
          className="max-w-sm bg-white"
        />
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className="w-44 bg-white">
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
        <div className="premium-card h-40 animate-pulse bg-slate-100" />
      ) : users.length === 0 ? (
        <div className="premium-card flex flex-col items-center gap-3 p-12 text-center">
          <Users className="h-10 w-10 text-slate-300" />
          <p className="font-medium text-slate-900">{t("admin.noUsers")}</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-slate-50 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">{t("admin.colName")}</th>
                <th className="px-4 py-3 font-medium">{t("admin.colEmail")}</th>
                <th className="px-4 py-3 font-medium">{t("admin.colRole")}</th>
                <th className="px-4 py-3 font-medium">{t("admin.colMembership")}</th>
                <th className="px-4 py-3 font-medium">{t("admin.colKyc")}</th>
                <th className="px-4 py-3 font-medium">{t("admin.colJoined")}</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {u.firstName} {u.lastName}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline">
                      {t(`roles.${u.role}` as "roles.investor")}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 capitalize text-slate-700">
                    {u.membershipTier}
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={cn("border capitalize", STATUS_COLORS[u.kycStatus])}>
                      {u.kycStatus.replace(/_/g, " ")}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(u.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
