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
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : project.riskLevel === "high"
        ? "border-red-200 bg-red-50 text-red-800"
        : "border-amber-200 bg-amber-50 text-amber-800";

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

  const facts = [
    stageLabel,
    category,
    t("projects.teamHeadcount", { count: teamSize }),
    riskLabel,
  ].filter(Boolean);

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
        <h3 className="line-clamp-2 min-h-[3.25rem] font-display text-lg font-semibold leading-snug text-slate-900">
          <Link href={detailHref} className="hover:text-teal-900">
            {title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 min-h-[2.5rem] text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>

        <div className="mt-4 space-y-3">
          <p className="font-display text-xl font-semibold text-slate-900">
            {t("projects.neededAmount", {
              amount: formatCompactCurrency(project.requiredInvestment),
            })}
          </p>

          <div>
            <p className="text-sm font-medium text-slate-800">
              {t("projects.fundedPercent", { percent: progress })}
            </p>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-teal-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {facts.map((fact) => (
              <span
                key={fact}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-xs font-medium",
                  fact === riskLabel
                    ? riskChip
                    : "border-slate-200 bg-slate-50 text-slate-700"
                )}
              >
                {fact}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-auto flex gap-2 border-t border-slate-100 pt-5">
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
