"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Bookmark as BookmarkIcon, BookmarkCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Project } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatCurrency, formatNumber } from "@/utils/format";
import { useI18n } from "@/hooks/use-i18n";
import { projectText } from "@/i18n/localize";
import { useAuthStore } from "@/store";
import { projectsApi } from "@/services/api";
import { toast } from "sonner";
import { getErrorMessage } from "@/services/api/client";
import { ROUTES } from "@/constants";

type MarketplaceProject = Project & { teamSize?: number };

function statusMeta(
  status: Project["status"],
  t: (key: string) => string
): { label: string; className: string } {
  switch (status) {
    case "published":
      return {
        label: t("projects.statusVerified"),
        className: "border-emerald-200 bg-emerald-50 text-emerald-800",
      };
    case "funded":
      return {
        label: t("projects.statusFunded"),
        className: "border-teal-200 bg-teal-50 text-teal-800",
      };
    case "pending_review":
      return {
        label: t("projects.statusUnderReview"),
        className: "border-amber-200 bg-amber-50 text-amber-800",
      };
    default:
      return {
        label: t("projects.statusNeedsInfo"),
        className: "border-slate-200 bg-slate-50 text-slate-700",
      };
  }
}

export function MarketplaceProjectCard({
  project,
  savedByMe,
  basePath = "/projects",
}: {
  project: MarketplaceProject;
  savedByMe?: boolean;
  /** Keep investors inside the panel (e.g. /investor/projects) */
  basePath?: string;
}) {
  const { t, locale } = useI18n();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [saved, setSaved] = useState(!!savedByMe);
  const [saving, setSaving] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const detailHref = `${basePath}/${project.id}`;

  useEffect(() => {
    setSaved(!!savedByMe);
  }, [savedByMe]);

  useEffect(() => {
    setImgFailed(false);
  }, [project.image]);

  const verification = statusMeta(project.status, t);
  const riskLabel =
    project.riskLevel === "low"
      ? t("projects.lowRisk")
      : project.riskLevel === "high"
        ? t("projects.highRisk")
        : t("projects.mediumRisk");

  const stageKey = `projects.stages.${project.stage ?? "idea"}`;
  const stageLabel = t(stageKey);
  const progress = Math.min(
    100,
    Math.round((project.currentFunding / Math.max(project.requiredInvestment, 1)) * 100)
  );

  const title = projectText(project, "title", locale);
  const description = projectText(project, "description", locale);
  const category = projectText(project, "category", locale);
  const industry = projectText(project, "industry", locale);
  const location = projectText(project, "location", locale);
  const teamSize = project.teamSize ?? project.team?.length ?? 0;
  const views = project.views ?? 0;
  const imageSrc = !imgFailed && project.image ? project.image : null;

  const riskColor =
    project.riskLevel === "low"
      ? "text-emerald-700"
      : project.riskLevel === "high"
        ? "text-red-700"
        : "text-amber-700";

  const toggleSaved = async () => {
    if (saving) return;
    if (!isAuthenticated || user?.role !== "investor") {
      toast.error(t("projects.toastSaveLogin"));
      router.push(`${ROUTES.LOGIN}?next=/projects`);
      return;
    }

    setSaving(true);
    try {
      if (saved) await projectsApi.unsave(project.id);
      else await projectsApi.save(project.id);
      setSaved((v) => !v);
      toast.success(saved ? t("projects.toastUnsaved") : t("projects.toastSaved"));
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <article className="premium-card flex h-full flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-soft">
      <Link href={detailHref} className="relative block aspect-[16/10] shrink-0 bg-slate-100">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-teal-900/20 to-amber-100/40">
            <span className="font-display text-2xl font-semibold text-teal-900/40">
              {title.slice(0, 1)}
            </span>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className={cn("border", verification.className)}>
            {verification.label}
          </Badge>
          <Badge variant="outline" className={cn("border-slate-200", riskColor)}>
            {riskLabel}
          </Badge>
          {category ? (
            <Badge variant="outline" className="border-slate-200 text-slate-700">
              {category}
            </Badge>
          ) : null}
        </div>

        <h3 className="mt-3 line-clamp-2 min-h-[3.25rem] font-display text-lg font-semibold leading-snug text-slate-900">
          <Link href={detailHref} className="hover:text-teal-900">
            {title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 min-h-[2.5rem] text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">{t("projects.industry")}</p>
            <p className="mt-0.5 truncate text-sm font-medium text-slate-900">
              {industry || "—"}
            </p>
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">{t("projects.location")}</p>
            <p className="mt-0.5 flex items-center gap-1 truncate text-sm font-medium text-slate-900">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <span className="truncate">{location || "—"}</span>
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-2.5">
          <div className="grid grid-cols-2 gap-3">
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">{t("projects.required")}</p>
              <p className="mt-0.5 truncate text-sm font-semibold text-slate-900">
                {formatCurrency(project.requiredInvestment)}
              </p>
            </div>
            <div className="min-w-0 text-right">
              <p className="text-xs text-muted-foreground">{t("projects.raised")}</p>
              <p className="mt-0.5 truncate text-sm font-semibold text-slate-900">
                {formatCurrency(project.currentFunding)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-teal-700"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="shrink-0 text-xs font-medium tabular-nums text-slate-800">
              {progress}%
            </span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-3 rounded-xl bg-slate-50/80 px-3 py-3">
          <div>
            <p className="text-xs text-muted-foreground">{t("projects.projectStage")}</p>
            <p className="mt-0.5 text-sm font-medium text-slate-900">{stageLabel}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t("projects.risk")}</p>
            <p className={cn("mt-0.5 text-sm font-medium", riskColor)}>{riskLabel}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t("projects.team")}</p>
            <p className="mt-0.5 text-sm font-medium text-slate-900">
              {t("projects.teamMembers", { count: teamSize })}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t("projects.viewsLabel")}</p>
            <p className="mt-0.5 text-sm font-medium text-slate-900">
              {formatNumber(views, 0)}
            </p>
          </div>
        </div>

        <div className="mt-auto flex gap-3 border-t border-slate-100 pt-5">
          <Button asChild className="flex-1">
            <Link href={detailHref}>{t("projects.viewProject")}</Link>
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
            {saved ? <BookmarkCheck className="h-4 w-4" /> : <BookmarkIcon className="h-4 w-4" />}
            {saving ? "…" : saved ? t("projects.saved") : t("projects.save")}
          </Button>
        </div>
      </div>
    </article>
  );
}
