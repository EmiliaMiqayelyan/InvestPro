"use client";

import { BarChart3 } from "lucide-react";
import { useOwnerProjects } from "@/hooks/use-marketplace";
import { formatCurrency } from "@/utils/format";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function OwnerAnalyticsPage() {
  const { data: projects = [], isLoading } = useOwnerProjects();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold text-slate-900">Analytics</h2>
        <p className="text-sm text-muted-foreground">Funding progress per project</p>
      </div>

      {isLoading ? (
        <div className="premium-card h-40 animate-pulse bg-slate-100" />
      ) : projects.length === 0 ? (
        <div className="premium-card flex flex-col items-center gap-3 p-12 text-center">
          <BarChart3 className="h-10 w-10 text-slate-300" />
          <p className="font-medium text-slate-900">No project data yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => {
            const progress = Math.min(
              100,
              Math.round(
                (project.currentFunding / Math.max(project.requiredInvestment, 1)) * 100
              )
            );
            return (
              <Card
                key={project.id}
                className="premium-card border-border bg-white shadow-none backdrop-blur-none"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-slate-900">{project.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap justify-between gap-2 text-sm">
                    <span className="text-muted-foreground">
                      {formatCurrency(project.currentFunding)} raised
                    </span>
                    <span className="font-medium text-slate-900">
                      Goal {formatCurrency(project.requiredInvestment)} · {progress}%
                    </span>
                  </div>
                  <Progress value={progress} />
                  <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Investors</p>
                      <p className="font-semibold text-slate-900">{project.investorCount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Saved</p>
                      <p className="font-semibold text-slate-900">{project.savedCount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Expected ROI</p>
                      <p className="font-semibold text-emerald-600">{project.expectedRoi}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
