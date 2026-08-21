"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { ownerApi } from "@/services/api";
import { getErrorMessage } from "@/services/api/client";
import { QUERY_KEYS, ROUTES, PROJECT_CATEGORIES, PROJECT_INDUSTRIES, PROJECT_STAGES } from "@/constants";
import { useI18n } from "@/hooks";
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
  const { t } = useI18n();

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

  if (isLoading) {
    return <div className="premium-card h-48 animate-pulse bg-slate-100" />;
  }

  if (!project) {
    return (
      <div className="premium-card space-y-4 p-8 text-center">
        <p className="font-medium">{t("projects.notFound")}</p>
        <Button asChild variant="outline">
          <Link href={ROUTES.OWNER_PROJECTS}>{t("common.back")}</Link>
        </Button>
      </div>
    );
  }

  if (project.status !== "rejected" && project.status !== "draft") {
    return (
      <div className="premium-card space-y-4 p-8 text-center">
        <p className="text-sm text-muted-foreground">{t("ownerReview.editOnlyRejected")}</p>
        <Button asChild variant="outline">
          <Link href={ROUTES.OWNER_PROJECTS}>{t("common.back")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="mb-3">
          <Link href={ROUTES.OWNER_PROJECTS}>
            <ArrowLeft className="h-4 w-4" />
            {t("common.back")}
          </Link>
        </Button>
        <h2 className="font-display text-2xl font-semibold text-slate-900">
          {t("ownerReview.editTitle")}
        </h2>
        <p className="text-sm text-muted-foreground">{t("ownerReview.editSub")}</p>
      </div>

      {project.rejectionReason ? (
        <div className="rounded-xl border border-red-200 bg-red-50/50 px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-red-800">
            {t("ownerReview.rejectionReason")}
          </p>
          <p className="mt-1 whitespace-pre-wrap text-sm text-slate-800">
            {project.rejectionReason}
          </p>
        </div>
      ) : null}

      <div className="premium-card space-y-4 p-5 md:p-6">
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
                    {c}
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
                    {c}
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
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          disabled={saveMutation.isPending}
          onClick={() => saveMutation.mutate()}
        >
          {t("ownerReview.saveChanges")}
        </Button>
        <Button
          disabled={resubmitMutation.isPending}
          onClick={() => resubmitMutation.mutate()}
        >
          {t("ownerReview.resubmit")}
        </Button>
      </div>
    </div>
  );
}
