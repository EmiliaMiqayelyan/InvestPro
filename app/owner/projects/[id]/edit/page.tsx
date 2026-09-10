"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, FolderKanban } from "lucide-react";
import { toast } from "sonner";
import { ownerApi } from "@/services/api";
import { getErrorMessage } from "@/services/api/client";
import { useI18n } from "@/hooks";
import { categoryLabel, industryLabel } from "@/i18n/localize";
import { useSetPageTitle } from "@/components/providers/page-title-provider";
import { PageHeader } from "@/components/shared/page-header";
import { PanelPage } from "@/components/shared/panel-page";
import { PanelCard } from "@/components/shared/panel-card";
import { EmptyState } from "@/components/shared/empty-state";
import { PanelBlockSkeleton } from "@/components/shared/loading-skeleton";
import {
  QUERY_KEYS,
  ROUTES,
  PROJECT_CATEGORIES,
  PROJECT_INDUSTRIES,
  PROJECT_STAGES,
  isOwnerMutableProjectStatus,
} from "@/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ProjectStage } from "@/types";

export default function OwnerEditProjectPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { t, locale } = useI18n();
  useSetPageTitle(t("ownerReview.editTitle"));

  const { data: projects = [], isLoading } = useQuery({
    queryKey: [QUERY_KEYS.OWNER_PROJECTS],
    queryFn: async () => (await ownerApi.projects()).data.data,
  });

  const project = projects.find((p) => p.id === id);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [category, setCategory] = useState("Other");
  const [industry, setIndustry] = useState("Other");
  const [location, setLocation] = useState("");
  const [stage, setStage] = useState<ProjectStage>("idea");
  const [requiredInvestment, setRequiredInvestment] = useState("");
  const [minInvestment, setMinInvestment] = useState("");
  const [businessModel, setBusinessModel] = useState("");
  const [revenueModel, setRevenueModel] = useState("");
  const [financialProjections, setFinancialProjections] = useState("");
  const [investmentPlan, setInvestmentPlan] = useState("");

  useEffect(() => {
    if (!project) return;
    setTitle(project.title);
    setDescription(project.description);
    setFullDescription(project.fullDescription);
    setCategory(project.category);
    setIndustry(project.industry);
    setLocation(project.location);
    setStage(project.stage);
    setRequiredInvestment(String(project.requiredInvestment || ""));
    setMinInvestment(String(project.minInvestment || ""));
    setBusinessModel(project.businessModel || "");
    setRevenueModel(project.revenueModel || "");
    setFinancialProjections(project.financialProjections || "");
    setInvestmentPlan(project.investmentPlan || "");
  }, [project]);

  const saveMutation = useMutation({
    mutationFn: () =>
      ownerApi.updateProject(id, {
        title,
        description,
        fullDescription,
        category,
        industry,
        location,
        stage,
        requiredInvestment: Number(requiredInvestment) || 0,
        minInvestment: Number(minInvestment) || 0,
        businessModel,
        revenueModel,
        financialProjections,
        investmentPlan,
      }),
    onSuccess: () => {
      toast.success(t("ownerReview.savedToast"));
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.OWNER_PROJECTS] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const resubmitMutation = useMutation({
    mutationFn: async () => {
      await ownerApi.updateProject(id, {
        title,
        description,
        fullDescription,
        category,
        industry,
        location,
        stage,
        requiredInvestment: Number(requiredInvestment) || 0,
        minInvestment: Number(minInvestment) || 0,
        businessModel,
        revenueModel,
        financialProjections,
        investmentPlan,
      });
      return ownerApi.resubmitProject(id);
    },
    onSuccess: () => {
      toast.success(t("ownerReview.resubmitToast"));
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.OWNER_PROJECTS] });
      router.push(ROUTES.OWNER_PROJECTS);
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const deleteMutation = useMutation({
    mutationFn: () => ownerApi.deleteProject(id),
    onSuccess: () => {
      toast.success(t("ownerReview.deletedToast"));
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.OWNER_PROJECTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.OWNER_DOCUMENTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.OWNER_DASHBOARD] });
      router.push(ROUTES.OWNER_PROJECTS);
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  if (isLoading) {
    return (
      <PanelPage maxWidth="content">
        <PanelBlockSkeleton height="h-48" />
      </PanelPage>
    );
  }

  if (!project) {
    return (
      <PanelPage maxWidth="content">
        <EmptyState
          icon={FolderKanban}
          title={t("projects.notFound")}
          action={
            <Button asChild variant="outline">
              <Link href={ROUTES.OWNER_PROJECTS}>{t("common.back")}</Link>
            </Button>
          }
        />
      </PanelPage>
    );
  }

  if (!isOwnerMutableProjectStatus(project.status)) {
    return (
      <PanelPage maxWidth="content">
        <EmptyState
          icon={FolderKanban}
          title={t("ownerReview.editOnlyRejected")}
          action={
            <Button asChild variant="outline">
              <Link href={ROUTES.OWNER_PROJECTS}>{t("common.back")}</Link>
            </Button>
          }
        />
      </PanelPage>
    );
  }

  const canResubmit = project.status === "rejected" || project.status === "draft";

  return (
    <PanelPage maxWidth="content">
      <Button asChild variant="ghost" size="sm">
        <Link href={ROUTES.OWNER_PROJECTS}>
          <ArrowLeft className="h-4 w-4" />
          {t("common.back")}
        </Link>
      </Button>
      <PageHeader
        variant="minimal"
        title={t("ownerReview.editTitle")}
        description={t("ownerReview.editSub")}
      />

      {project.rejectionReason ? (
        <div className="rounded-xl border border-red-200 bg-red-50/50 px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-red-800">
            {t("ownerReview.rejectionReason")}
          </p>
          <p className="mt-1 whitespace-pre-wrap text-sm text-foreground">
            {project.rejectionReason}
          </p>
        </div>
      ) : null}

      <PanelCard className="space-y-4 md:p-6" padding="md">
        <div className="space-y-2">
          <Label htmlFor="title">{t("projects.overview")}</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">{t("ownerReview.description")}</Label>
          <Textarea
            id="description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fullDescription">{t("ownerReview.fullDescription")}</Label>
          <Textarea
            id="fullDescription"
            rows={5}
            value={fullDescription}
            onChange={(e) => setFullDescription(e.target.value)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>{t("projects.category")}</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PROJECT_CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {categoryLabel(locale, c)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>{t("projects.industry")}</Label>
            <Select value={industry} onValueChange={setIndustry}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PROJECT_INDUSTRIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {industryLabel(locale, c)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">{t("projects.location")}</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>{t("projects.stage")}</Label>
            <Select value={stage} onValueChange={(v) => setStage(v as ProjectStage)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PROJECT_STAGES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {t(`projects.stages.${s.value}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="required">{t("projects.required")}</Label>
            <Input
              id="required"
              type="number"
              value={requiredInvestment}
              onChange={(e) => setRequiredInvestment(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="min">{t("projects.minInvestment")}</Label>
            <Input
              id="min"
              type="number"
              value={minInvestment}
              onChange={(e) => setMinInvestment(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="business">{t("projects.businessModel")}</Label>
          <Textarea
            id="business"
            rows={3}
            value={businessModel}
            onChange={(e) => setBusinessModel(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="revenue">{t("projects.revenueModel")}</Label>
          <Textarea
            id="revenue"
            rows={3}
            value={revenueModel}
            onChange={(e) => setRevenueModel(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="projections">{t("projects.projections")}</Label>
          <Textarea
            id="projections"
            rows={3}
            value={financialProjections}
            onChange={(e) => setFinancialProjections(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="plan">{t("projects.investmentPlan")}</Label>
          <Textarea
            id="plan"
            rows={3}
            value={investmentPlan}
            onChange={(e) => setInvestmentPlan(e.target.value)}
          />
        </div>
      </PanelCard>

      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          disabled={saveMutation.isPending}
          onClick={() => saveMutation.mutate()}
        >
          {t("ownerReview.saveChanges")}
        </Button>
        {canResubmit ? (
          <Button
            disabled={resubmitMutation.isPending}
            onClick={() => resubmitMutation.mutate()}
          >
            {t("ownerReview.resubmit")}
          </Button>
        ) : null}
        <Button
          variant="ghost"
          className="text-destructive hover:text-destructive"
          disabled={deleteMutation.isPending}
          onClick={() => {
            if (!window.confirm(t("ownerReview.deleteConfirm"))) return;
            deleteMutation.mutate();
          }}
        >
          {t("ownerReview.deleteProject")}
        </Button>
      </div>
    </PanelPage>
  );
}
