"use client";

import Link from "next/link";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Briefcase,
  ArrowUpRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/shared/stat-card";
import { StatsSkeleton } from "@/components/shared/loading-skeleton";
import { AreaChartComponent } from "@/components/charts/portfolio-charts";
import { EmptyState } from "@/components/shared/empty-state";
import {
  useDashboardStats,
  usePortfolioPerformance,
} from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS, ROUTES } from "@/constants";
import { transactionsApi } from "@/services/api";
import { formatCurrency, formatDate, formatRelativeTime } from "@/utils/format";

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: portfolio, isLoading: portfolioLoading } = usePortfolioPerformance();
  const { data: recentTx } = useQuery({
    queryKey: [QUERY_KEYS.TRANSACTIONS, "recent"],
    queryFn: async () => {
      const { data } = await transactionsApi.getRecent(5);
      return data.data;
    },
  });

  if (statsLoading) return <StatsSkeleton count={4} />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here&apos;s your portfolio overview.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Balance"
          value={formatCurrency(stats?.totalBalance ?? 0)}
          icon={Wallet}
        />
        <StatCard
          title="Active Investments"
          value={String(stats?.activeInvestments ?? 0)}
          icon={Briefcase}
        />
        <StatCard
          title="Total Profit"
          value={formatCurrency(stats?.totalProfit ?? 0)}
          change={stats?.totalProfit ? 12.5 : undefined}
          icon={TrendingUp}
        />
        <StatCard
          title="Total Loss"
          value={formatCurrency(stats?.totalLoss ?? 0)}
          icon={TrendingDown}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Portfolio Performance</CardTitle>
          </CardHeader>
          <CardContent>
            {portfolioLoading ? (
              <div className="h-[300px] animate-pulse bg-muted/50 rounded-lg" />
            ) : portfolio && portfolio.length > 0 ? (
              <AreaChartComponent data={portfolio} />
            ) : (
              <EmptyState
                icon={TrendingUp}
                title="No portfolio data"
                description="Start investing to see your portfolio performance"
                action={
                  <Button variant="gradient" asChild>
                    <Link href={ROUTES.PROJECTS}>Browse Projects</Link>
                  </Button>
                }
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Transactions</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href={ROUTES.TRANSACTIONS}>
                View all <ArrowUpRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentTx && recentTx.length > 0 ? (
              <div className="space-y-4">
                {recentTx.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium capitalize">{tx.type}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatRelativeTime(tx.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatCurrency(tx.amount)}</p>
                      <Badge variant={tx.status}>{tx.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Wallet}
                title="No transactions"
                description="Your recent transactions will appear here"
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
