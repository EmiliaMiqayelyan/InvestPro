"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Bookmark as BookmarkIcon, BookmarkCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Project } from "@/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatCompactCurrency } from "@/utils/format";
import { useI18n } from "@/hooks/use-i18n";
import { projectText } from "@/i18n/localize";
import { useAuthStore } from "@/store";
import { projectsApi } from "@/services/api";
import { toast } from "sonner";
import { getErrorMessage } from "@/services/api/client";
import { ROUTES } from "@/constants";

type MarketplaceProject = Project & { teamSize?: number };

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

  const riskLabel =
    project.riskLevel === "low"
      ? t("projects.lowRisk")
      : project.riskLevel === "high"
        ? t("projects.highRisk")
        : t("projects.mediumRisk");

  const stageLabel = t(`projects.stages.${project.stage ?? "idea"}`);
  const progress = Math.min(
    100,
    Math.round((project.currentFunding / Math.max(project.requiredInvestment, 1)) * 100)
  );

  const title = projectText(project, "title", locale);
  const description = projectText(project, "description", locale);
  const category = projectText(project, "category", locale);
  const teamSize = project.teamSize ?? project.team?.length ?? 0;
  const imageSrc = !imgFailed && project.image ? project.image : null;

  const riskChip =
    project.riskLevel === "low"
      ? "bg-emerald-600 text-white"
      : project.riskLevel === "high"
        ? "bg-red-600 text-white"
        : "bg-amber-600 text-white";

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
    <article className="premium-card group flex h-full flex-col overflow-hidden transition duration-200 hover:-translate-y-0.5 hover:shadow-soft">
      <Link href={detailHref} className="relative block aspect-[16/10] shrink-0 overflow-hidden bg-slate-100">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition duration-300 group-hover:scale-[1.03]"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-teal-900/20 to-amber-100/40">
            <span className="font-display text-2xl font-semibold text-teal-900/40">
              {title.slice(0, 1)}
            </span>
          </div>
        )}
        <span
          className={cn(
            "absolute left-3 top-3 rounded-md px-2 py-1 text-[11px] font-medium shadow-sm",
            riskChip
          )}
        >
          {riskLabel}
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <p className="text-xs font-medium text-teal-800">
            {stageLabel}
            {category ? (
              <>
                <span className="mx-1.5 text-teal-800/35">·</span>
                {category}
              </>
            ) : null}
          </p>
          <h3 className="mt-1.5 line-clamp-2 font-display text-lg font-semibold leading-snug text-slate-900">
            <Link href={detailHref} className="hover:text-teal-900">
              {title}
            </Link>
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>

        <div className="mt-auto space-y-3">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs text-muted-foreground">{t("projects.required")}</p>
              <p className="font-display text-xl font-semibold tabular-nums text-slate-900">
                {formatCompactCurrency(project.requiredInvestment)}
              </p>
            </div>
            <p className="pb-0.5 text-sm font-medium tabular-nums text-teal-800">
              {progress}%
            </p>
          </div>

          <div
            className="h-2.5 overflow-hidden rounded-full bg-slate-100"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={t("projects.fundedPercent", { percent: progress })}
          >
            <div
              className="h-full rounded-full bg-teal-700 transition-[width] duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-xs text-muted-foreground">
            {t("projects.teamHeadcount", { count: teamSize })}
          </p>
        </div>

        <div className="flex gap-2 border-t border-slate-100 pt-4">
          <Button asChild className="flex-1">
            <Link href={detailHref}>
              {t("projects.viewProject")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant={saved ? "default" : "outline"}
            size="icon"
            aria-label={saved ? t("projects.saved") : t("projects.save")}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              void toggleSaved();
            }}
            disabled={saving}
          >
            {saved ? <BookmarkCheck className="h-4 w-4" /> : <BookmarkIcon className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </article>
  );
}
