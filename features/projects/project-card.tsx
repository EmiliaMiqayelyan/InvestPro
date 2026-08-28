"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Bookmark, BookmarkCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Project } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

  const title = projectText(project, "title", locale);
  const description = projectText(project, "description", locale);
  const category = projectText(project, "category", locale);
  const progress = Math.min(
    100,
    Math.round((project.currentFunding / Math.max(project.requiredInvestment, 1)) * 100)
  );
  const imageSrc = !imgFailed && project.image ? project.image : null;

  const riskVariant =
    project.riskLevel === "low" ? "default" : project.riskLevel === "high" ? "destructive" : "outline";

  const toggleSaved = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
    <article className="surface-card-hover group flex h-full flex-col overflow-hidden">
      <Link href={detailHref} className="relative block aspect-[16/10] shrink-0 overflow-hidden bg-secondary">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={title}
            fill
            sizes="(max-width:640px) 100vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-[1.02]"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-secondary">
            <span className="font-display text-3xl font-bold text-muted-foreground/25">
              {title.slice(0, 1)}
            </span>
          </div>
        )}
        <Badge variant={riskVariant} className="absolute left-3 top-3">
          {project.riskLevel === "low"
            ? t("projects.lowRisk")
            : project.riskLevel === "high"
              ? t("projects.highRisk")
              : t("projects.mediumRisk")}
        </Badge>
      </Link>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="text-xs font-medium text-muted-foreground">{category}</p>
        <h3 className="mt-1 line-clamp-2 font-display text-base font-semibold leading-snug sm:text-lg">
          <Link href={detailHref} className="transition hover:text-primary">
            {title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>

        <div className="mt-4 space-y-2">
          <div className="flex items-baseline justify-between gap-2">
            <span className="font-display text-lg font-semibold tabular-nums sm:text-xl">
              {formatCompactCurrency(project.requiredInvestment)}
            </span>
            <span className="text-sm font-medium text-primary">{progress}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mt-4 flex gap-2 border-t border-border pt-4">
          <Button asChild className="flex-1" size="sm">
            <Link href={detailHref}>
              {t("projects.viewProject")} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 shrink-0"
            onClick={toggleSaved}
            disabled={saving}
            aria-label={saved ? t("projects.saved") : t("projects.save")}
          >
            {saved ? (
              <BookmarkCheck className="h-4 w-4 text-primary" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </article>
  );
}
