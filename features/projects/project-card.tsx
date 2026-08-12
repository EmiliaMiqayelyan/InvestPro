"use client";

import Link from "next/link";
import { MapPin, Bookmark as BookmarkIcon } from "lucide-react";
import type { Project } from "@/types";

type MarketplaceProject = Project & { teamSize?: number };
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatCurrency, formatNumber, formatPercent } from "@/utils/format";
import { useI18n } from "@/hooks/use-i18n";
import { projectText } from "@/i18n/localize";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store";
import { projectsApi } from "@/services/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getErrorMessage } from "@/services/api/client";
import { ROUTES } from "@/constants";
import { useState } from "react";
import { BookmarkCheck } from "lucide-react";
import { useEffect } from "react";

export function MarketplaceProjectCard({
  project,
  savedByMe,
}: {
  project: MarketplaceProject;
  savedByMe?: boolean;
}) {
  const { t, locale } = useI18n();

  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [saved, setSaved] = useState(!!savedByMe);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setSaved(!!savedByMe);
  }, [savedByMe]);

  const verification = (() => {
    switch (project.status) {
      case "published":
      case "funded":
      case "closed":
        return { label: "Verified", variant: "verified" as const };
      case "pending_review":
        return { label: "Under Review", variant: "under_review" as const };
      case "draft":
      case "rejected":
      default:
        return { label: "Additional Information Required", variant: "needs_info" as const };
    }
  })();

  const riskLabel =
    project.riskLevel === "low"
      ? t("projects.lowRisk")
      : project.riskLevel === "high"
        ? t("projects.highRisk")
        : t("projects.mediumRisk");

  const progress = Math.min(
    100,
    Math.round((project.currentFunding / Math.max(project.requiredInvestment, 1)) * 100)
  );

  const title = projectText(project, "title", locale);
  const description = projectText(project, "description", locale);
  const category = projectText(project, "category", locale);
  const industry = projectText(project, "industry", locale);
  const location = projectText(project, "location", locale);
  const stage = (project.stage ?? "idea").replaceAll("_", " ");
  const teamSize = project.teamSize ?? project.team?.length ?? 0;
  const views = project.views ?? 0;

  const riskColor =
    project.riskLevel === "low"
      ? "text-emerald-600"
      : project.riskLevel === "high"
        ? "text-red-600"
        : "text-amber-600";

  const toggleSaved = async () => {
    if (saving) return;
    if (!isAuthenticated || user?.role !== "investor") {
      toast.error("Please sign in as an investor to save projects.");
      router.push(`${ROUTES.REGISTER}?role=investor`);
      return;
    }

    setSaving(true);
    try {
      if (saved) await projectsApi.unsave(project.id);
      else await projectsApi.save(project.id);
      setSaved((v) => !v);
      toast.success(saved ? "Removed from saved projects" : "Saved project");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="premium-card block p-5 transition hover:-translate-y-0.5 hover:shadow-soft">
      <div className="flex flex-wrap items-center gap-2">
        <Badge
          variant="outline"
          className={cn(
            verification.variant === "verified" && "border-emerald-200 bg-emerald-50 text-emerald-700",
            verification.variant === "under_review" && "border-amber-200 bg-amber-50 text-amber-700",
            verification.variant === "needs_info" && "border-blue-200 bg-blue-50 text-blue-700"
          )}
        >
          {verification.label}
        </Badge>

        <Badge variant="outline" className={cn("border", riskColor)}>
          {riskLabel}
        </Badge>

        <Badge variant="outline" className="border-slate-200 text-slate-700">
          {category}
        </Badge>
      </div>

      <h3 className="mt-4 font-display text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{description}</p>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-muted-foreground">
          <span className="font-medium text-slate-800">Industry:</span> {industry}
        </div>
        <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 text-slate-400" />
          {location}
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <div className="flex justify-between gap-4 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">{t("projects.required")}</p>
            <p className="font-semibold text-slate-900">{formatCurrency(project.requiredInvestment)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">{t("projects.raised")}</p>
            <p className="font-semibold text-slate-900">{formatCurrency(project.currentFunding)}</p>
          </div>
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium text-slate-800">{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-blue-600" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Project stage</p>
            <p className="font-medium text-slate-900">{stage}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Risk</p>
            <p className={cn("font-medium", riskColor)}>{riskLabel}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Team</p>
            <p className="font-medium text-slate-900">{teamSize} members</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Views</p>
            <p className="font-medium text-slate-900">{formatNumber(views, 0)}</p>
          </div>
        </div>
      </div>

      <div className="mt-5 flex gap-3">
        <Button asChild className="flex-1" variant="default">
          <Link href={`/projects/${project.id}`}>
            View Project
          </Link>
        </Button>
        <Button
          variant={saved ? "default" : "outline"}
          className="gap-2"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void toggleSaved();
          }}
          disabled={saving}
        >
          {saved ? (
            <BookmarkCheck className="h-4 w-4" />
          ) : (
            <BookmarkIcon className="h-4 w-4" />
          )}
          {saving ? "…" : saved ? "Saved" : "Save"}
        </Button>
      </div>
    </div>
  );
}
