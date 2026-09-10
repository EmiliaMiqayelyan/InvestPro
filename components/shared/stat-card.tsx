"use client";

import { LucideIcon, TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  className?: string;
  accent?: "primary" | "gold" | "success" | "default";
  loading?: boolean;
}

const accentIconStyles = {
  primary: "bg-primary/10 text-primary",
  gold: "bg-warning/15 text-warning-foreground",
  success: "bg-success/10 text-success",
  default: "bg-secondary text-muted-foreground",
};

export function StatCard({
  title,
  value,
  change,
  icon: Icon,
  className,
  accent = "primary",
  loading,
}: StatCardProps) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 space-y-1.5">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="font-display text-2xl font-semibold tabular-nums text-foreground">
              {loading ? (
                <span className="inline-block h-8 w-16 rounded shimmer" />
              ) : (
                value
              )}
            </p>
            {change !== undefined && (
              <div
                className={cn(
                  "flex items-center gap-1 text-sm font-medium",
                  isPositive ? "text-success" : "text-destructive"
                )}
              >
                {isPositive ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span>
                  {isPositive ? "+" : ""}
                  {change.toFixed(2)}%
                </span>
              </div>
            )}
          </div>
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
              accentIconStyles[accent]
            )}
          >
            <Icon className="h-5 w-5" strokeWidth={1.75} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
