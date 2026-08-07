"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, TrendingUp } from "lucide-react";
import type { Project } from "@/types";
import { STATUS_COLORS, RISK_LEVELS } from "@/constants";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatCurrency, formatPercent } from "@/utils/format";

export function MarketplaceProjectCard({ project }: { project: Project }) {
  const risk = RISK_LEVELS.find((r) => r.value === project.riskLevel);
  const progress = Math.min(
    100,
    Math.round((project.currentFunding / Math.max(project.requiredInvestment, 1)) * 100)
  );

  return (
    <Link
      href={`/projects/${project.id}`}
      className="premium-card group block overflow-hidden transition hover:-translate-y-0.5 hover:shadow-soft"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width:768px) 100vw, 33vw"
        />
      </div>
      <div className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-blue-600">{project.category}</p>
            <h3 className="mt-1 font-display text-lg font-semibold text-slate-900">{project.title}</h3>
          </div>
          <Badge className={cn("border capitalize", STATUS_COLORS[project.status] || STATUS_COLORS.published)}>
            {project.status.replace("_", " ")}
          </Badge>
        </div>
        <p className="line-clamp-2 text-sm text-muted-foreground">{project.description}</p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" /> {project.location}
          </span>
          <span className={cn("inline-flex items-center gap-1 font-medium", risk?.color)}>
            <TrendingUp className="h-3.5 w-3.5" /> {risk?.label}
          </span>
        </div>
        <div>
          <div className="mb-1.5 flex justify-between text-xs">
            <span className="text-muted-foreground">Funding</span>
            <span className="font-medium text-slate-800">{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-blue-600" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-border pt-3 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Required</p>
            <p className="font-semibold text-slate-900">{formatCurrency(project.requiredInvestment)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Expected ROI</p>
            <p className="font-semibold text-emerald-600">{formatPercent(project.expectedRoi)}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
