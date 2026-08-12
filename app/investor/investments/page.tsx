"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Handshake } from "lucide-react";
import { investorApi } from "@/services/api";
import { QUERY_KEYS, ROUTES, STATUS_COLORS } from "@/constants";
import { formatCurrency, formatDate } from "@/utils/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function InvestorInvestmentsPage() {
  const { data: investments = [], isLoading } = useQuery({
    queryKey: [QUERY_KEYS.INVESTMENTS],
    queryFn: async () => (await investorApi.investments()).data.data,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-semibold text-slate-900">My investments</h2>
          <p className="text-sm text-muted-foreground">Accepted offers and active positions</p>
        </div>
        <Button asChild variant="outline">
          <Link href={ROUTES.INVESTOR_PROJECTS}>Browse marketplace</Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="premium-card h-40 animate-pulse bg-slate-100" />
      ) : investments.length === 0 ? (
        <div className="premium-card flex flex-col items-center gap-3 p-12 text-center">
          <Handshake className="h-10 w-10 text-slate-300" />
          <p className="font-medium text-slate-900">No investments yet</p>
          <p className="text-sm text-muted-foreground">
            Explore projects and send an investment offer to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {investments.map((inv) => (
            <div
              key={inv.id}
              className="premium-card flex flex-wrap items-center justify-between gap-4 p-5"
            >
              <div>
                <p className="font-semibold text-slate-900">
                  {inv.project?.title || "Project"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Invested {formatDate(inv.createdAt)}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Amount</p>
                  <p className="font-semibold text-slate-900">{formatCurrency(inv.amount)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Expected return</p>
                  <p className="font-semibold text-emerald-600">
                    {formatCurrency(inv.expectedReturn)}
                  </p>
                </div>
                <Badge className={cn("border capitalize", STATUS_COLORS[inv.status])}>
                  {inv.status}
                </Badge>
                {inv.projectId && (
                  <Button asChild size="sm" variant="outline">
                    <Link href={`${ROUTES.INVESTOR_PROJECTS}/${inv.projectId}`}>View</Link>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
