"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface DataTableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export function DataTableSkeleton({
  rows = 5,
  columns = 5,
  className,
}: DataTableSkeletonProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-10 flex-1 shimmer rounded-lg" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-14 w-full shimmer rounded-lg" />
      ))}
    </div>
  );
}

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-border/50 p-6 space-y-4 overflow-hidden", className)}>
      <Skeleton className="h-4 w-1/3 shimmer rounded" />
      <Skeleton className="h-8 w-1/2 shimmer rounded" />
      <Skeleton className="h-32 w-full shimmer rounded-xl" />
    </div>
  );
}

export function StatsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function PanelListSkeleton({
  rows = 3,
  className,
}: {
  rows?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-24 w-full rounded-xl shimmer" />
      ))}
    </div>
  );
}

export function PanelBlockSkeleton({
  className,
  height = "h-40",
}: {
  className?: string;
  height?: string;
}) {
  return <Skeleton className={cn("w-full rounded-xl shimmer", height, className)} />;
}
