"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable, type Column } from "@/components/shared/data-table";
import { DataTableSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { AreaChartComponent } from "@/components/charts/portfolio-charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DEFAULT_PAGE_SIZE, QUERY_KEYS, ROUTES } from "@/constants";
import { investmentsApi } from "@/services/api";
import { useInvestmentGrowth } from "@/hooks";
import { formatCurrency, formatDate } from "@/utils/format";
import type { Investment } from "@/types";

export default function InvestmentsPage() {
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState("active");
  const { data: growth, isLoading: growthLoading } = useInvestmentGrowth();

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.INVESTMENTS, tab, page],
    queryFn: async () => {
      const api =
        tab === "active"
          ? investmentsApi.getActive
          : tab === "completed"
            ? investmentsApi.getCompleted
            : investmentsApi.getAll;
      const { data } = await api({ page, limit: DEFAULT_PAGE_SIZE });
      return data.data;
    },
  });

  const columns: Column<Investment>[] = [
    {
      key: "project",
      header: "Project",
      cell: (inv) => inv.project?.title || inv.projectId,
    },
    { key: "amount", header: "Amount", cell: (inv) => formatCurrency(inv.amount) },
    {
      key: "roi",
      header: "ROI",
      cell: (inv) => <span className="text-emerald-400">{inv.roiPercentage}%</span>,
    },
    {
      key: "return",
      header: "Current Return",
      cell: (inv) => formatCurrency(inv.currentReturn),
    },
    {
      key: "expected",
      header: "Expected",
      cell: (inv) => formatCurrency(inv.expectedReturn),
    },
    {
      key: "status",
      header: "Status",
      cell: (inv) => <Badge variant={inv.status}>{inv.status}</Badge>,
    },
    {
      key: "end",
      header: "End Date",
      cell: (inv) => formatDate(inv.endDate),
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">My Investments</h1>
        <p className="text-muted-foreground">Track your active and completed investments</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Investment Growth</CardTitle>
        </CardHeader>
        <CardContent>
          {growthLoading ? (
            <div className="h-[250px] animate-pulse bg-muted/50 rounded-lg" />
          ) : growth && growth.length > 0 ? (
            <AreaChartComponent data={growth} color="#10b981" height={250} />
          ) : (
            <EmptyState icon={Briefcase} title="No growth data" description="Invest to see growth chart" />
          )}
        </CardContent>
      </Card>

      <Tabs value={tab} onValueChange={(v) => { setTab(v); setPage(1); }}>
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-6">
          {isLoading ? (
            <DataTableSkeleton />
          ) : data?.data.length ? (
            <>
              <DataTable columns={columns} data={data.data} keyExtractor={(i) => i.id} />
              <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} className="mt-6" />
            </>
          ) : (
            <EmptyState
              icon={Briefcase}
              title={`No ${tab} investments`}
              description="Browse projects to start investing"
              action={
                <Link href={ROUTES.PROJECTS} className="text-primary hover:underline">
                  Browse Projects
                </Link>
              }
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
