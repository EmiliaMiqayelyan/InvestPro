"use client";

import { useQuery } from "@tanstack/react-query";
import { Users, ArrowDownToLine, ArrowUpFromLine, Briefcase, FileCheck } from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";
import { StatsSkeleton } from "@/components/shared/loading-skeleton";
import { BarChartComponent } from "@/components/charts/portfolio-charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QUERY_KEYS } from "@/constants";
import { adminApi } from "@/services/api";
import { formatCurrency } from "@/utils/format";

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.ADMIN_STATS],
    queryFn: async () => {
      const { data } = await adminApi.getStats();
      return data.data;
    },
  });

  const { data: analytics } = useQuery({
    queryKey: [QUERY_KEYS.ADMIN_STATS, "analytics"],
    queryFn: async () => {
      const { data } = await adminApi.getAnalytics();
      return data.data;
    },
  });

  if (isLoading) return <StatsSkeleton count={4} />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Overview</h1>
        <p className="text-muted-foreground">Platform statistics and analytics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Users" value={String(stats?.totalUsers ?? 0)} icon={Users} />
        <StatCard title="Total Deposits" value={formatCurrency(stats?.totalDeposits ?? 0)} icon={ArrowDownToLine} />
        <StatCard title="Total Withdrawals" value={formatCurrency(stats?.totalWithdrawals ?? 0)} icon={ArrowUpFromLine} />
        <StatCard title="Total Investments" value={formatCurrency(stats?.totalInvestments ?? 0)} icon={Briefcase} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Pending Deposits" value={String(stats?.pendingDeposits ?? 0)} icon={ArrowDownToLine} />
        <StatCard title="Pending Withdrawals" value={String(stats?.pendingWithdrawals ?? 0)} icon={ArrowUpFromLine} />
        <StatCard title="Pending KYC" value={String(stats?.pendingKyc ?? 0)} icon={FileCheck} />
      </div>

      {analytics && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Deposits</CardTitle></CardHeader>
            <CardContent>
              <BarChartComponent data={analytics.deposits} color="#3b82f6" height={250} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>User Growth</CardTitle></CardHeader>
            <CardContent>
              <BarChartComponent data={analytics.users} color="#10b981" height={250} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
