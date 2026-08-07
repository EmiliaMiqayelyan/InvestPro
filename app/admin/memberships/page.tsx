"use client";

import { useQuery } from "@tanstack/react-query";
import { CreditCard } from "lucide-react";
import { adminMarketplaceApi } from "@/services/api";
import { QUERY_KEYS, STATUS_COLORS } from "@/constants";
import { formatCurrency, formatDate } from "@/utils/format";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { MembershipSubscription } from "@/types";

type MembershipRow = MembershipSubscription & {
  userName?: string;
  userEmail?: string;
};

export default function AdminMembershipsPage() {
  const { data: memberships = [], isLoading } = useQuery({
    queryKey: [QUERY_KEYS.ADMIN_PAYMENTS, "memberships"],
    queryFn: async () => {
      const res = await adminMarketplaceApi.payments();
      return (res.data.data ?? res.data) as MembershipRow[];
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold text-slate-900">Memberships</h2>
        <p className="text-sm text-muted-foreground">
          Active and historical membership subscriptions
        </p>
      </div>

      {isLoading ? (
        <div className="premium-card h-40 animate-pulse bg-slate-100" />
      ) : memberships.length === 0 ? (
        <div className="premium-card flex flex-col items-center gap-3 p-12 text-center">
          <CreditCard className="h-10 w-10 text-slate-300" />
          <p className="font-medium text-slate-900">No memberships</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-slate-50 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Plan</th>
                <th className="px-4 py-3 font-medium">Member</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Period</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {memberships.map((m) => (
                <tr key={m.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium capitalize text-slate-900">
                    {m.planId}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {m.userName || m.userEmail || m.userId}
                  </td>
                  <td className="px-4 py-3 text-slate-900">{formatCurrency(m.amount)}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(m.startedAt)} – {formatDate(m.expiresAt)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={cn("border capitalize", STATUS_COLORS[m.status])}>
                      {m.status}
                    </Badge>
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
