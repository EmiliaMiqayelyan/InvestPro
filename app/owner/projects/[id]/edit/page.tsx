"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, FolderKanban, Plus, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { ownerApi, uploadsApi } from "@/services/api";
import { getErrorMessage } from "@/services/api/client";
import { createId } from "@/utils/id";
import { fileToBase64, isUsableDocumentUrl } from "@/utils/document-url";
import { useI18n } from "@/hooks";
import {
  categoryLabel,
  industryLabel,
  docCategoryLabel,
  teamRoleLabel,
} from "@/i18n/localize";
import { useSetPageTitle } from "@/components/providers/page-title-provider";
import { PageHeader } from "@/components/shared/page-header";
import { PanelPage } from "@/components/shared/panel-page";
import { EmptyState } from "@/components/shared/empty-state";
import { PanelBlockSkeleton } from "@/components/shared/loading-skeleton";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { DocumentActions } from "@/components/shared/document-actions";
import {
  QUERY_KEYS,
  ROUTES,
  PROJECT_CATEGORIES,
  PROJECT_INDUSTRIES,
  PROJECT_STAGES,
  DOCUMENT_CATEGORIES,
  TEAM_ROLES,
  isOwnerMutableProjectStatus,
} from "@/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type {
  DocumentCategory,
  ProjectDocument,
  ProjectPhase,
  ProjectStage,
  TeamMember,
  TeamRole,
} from "@/types";

type TabId = "basic" | "team" | "documents" | "finance";

type DocDraft = {
  id?: string;
  name: string;
  category: DocumentCategory;
  url?: string;
  uploadedAt?: string;
  file?: File | null;
  existing?: boolean;
};

type TeamDraft = {
  id?: string;
  name: string;
  position: string;
  role: TeamRole;
  experience: string;
  biography: string;
};

type PhaseDraft = {
  id?: string;
  title: string;
  titleHy: string;
  description: string;
  budgetAsk: number;
  durationWeeks: string;
  deliverables: string;
  sortOrder: number;
  status?: ProjectPhase["status"];
};

const emptyTeam = (): TeamDraft => ({
  name: "",
  position: "",
  role: "member",
  experience: "",
  biography: "",
});

const emptyPhase = (sortOrder: number): PhaseDraft => ({
  title: "",
  titleHy: "",
  description: "",
  budgetAsk: 0,
  durationWeeks: "",
  deliverables: "",
  sortOrder,
});

const emptyDoc = (): DocDraft => ({
  name: "",
  category: "pitch_deck",
  file: null,
  existing: false,
});

const tabTriggerClass =
  "data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none";

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
  const [tab, setTab] = useState<TabId>("basic");
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [basic, setBasic] = useState({
    title: "",
    titleHy: "",
    description: "",
    descriptionHy: "",
    fullDescription: "",
    category: PROJECT_CATEGORIES[0] as string,
    industry: PROJECT_INDUSTRIES[0] as string,
    location: "",
    stage: "mvp" as ProjectStage,
    timeline: "",
    businessModel: "",
  });
  const [financial, setFinancial] = useState({
    requiredInvestment: 0,
    minInvestment: 0,
    expectedRoi: 15,
    revenueModel: "",
    financialProjections: "",
    investmentPlan: "",
  });
  const [phases, setPhases] = useState<PhaseDraft[]>([emptyPhase(0)]);
  const [documents, setDocuments] = useState<DocDraft[]>([emptyDoc()]);
  const [team, setTeam] = useState<TeamDraft[]>([emptyTeam()]);

  useEffect(() => {
    if (!project) return;
    setBasic({
      title: project.title || "",
      titleHy: project.titleHy || "",
      description: project.description || "",
      descriptionHy: project.descriptionHy || "",
      fullDescription: project.fullDescription || "",
      category: project.category || PROJECT_CATEGORIES[0],
      industry: project.industry || PROJECT_INDUSTRIES[0],
      location: project.location || "",
      stage: project.stage || "mvp",
      timeline: project.timeline || "",
      businessModel: project.businessModel || "",
    });
    setFinancial({
      requiredInvestment: project.requiredInvestment || 0,
      minInvestment: project.minInvestment || 0,
      expectedRoi: project.expectedRoi || 15,
      revenueModel: project.revenueModel || "",
      financialProjections: project.financialProjections || "",
      investmentPlan: project.investmentPlan || "",
    });
    setTeam(
      project.team?.length
        ? project.team.map((m) => ({
            id: m.id,
            name: m.name || "",
            position: m.position || "",
            role: m.role || "member",
            experience: m.experience || "",
            biography: m.biography || "",
          }))
        : [emptyTeam()]
    );
    setDocuments(
      project.documents?.length
        ? project.documents.map((d) => ({
            id: d.id,
            name: d.name || "",
            category: d.category || "other",
            url: d.url,
            uploadedAt: d.uploadedAt,
            file: null,
            existing: true,
          }))
        : [emptyDoc()]
    );
    setPhases(
      project.phases?.length
        ? project.phases.map((p, i) => ({
            id: p.id,
            title: p.title || "",
            titleHy: p.titleHy || "",
            description: p.description || "",
            budgetAsk: p.budgetAsk || 0,
            durationWeeks: p.durationWeeks ? String(p.durationWeeks) : "",
            deliverables: (p.deliverables || []).join(", "),
            sortOrder: p.sortOrder ?? i,
            status: p.status,
          }))
        : [emptyPhase(0)]
    );
  }, [project]);

  const phaseBudgetSum = useMemo(
    () => phases.reduce((sum, p) => sum + (Number(p.budgetAsk) || 0), 0),
    [phases]
  );
  const budgetMismatch =
    phases.some((p) => p.title.trim()) &&
    Math.abs(phaseBudgetSum - financial.requiredInvestment) >
      Math.max(financial.requiredInvestment * 0.05, 1);

  const buildPayload = async () => {
    const preparedDocs: ProjectDocument[] = [];
    for (const d of documents) {
      if (d.existing && d.url && !d.file) {
        preparedDocs.push({
          id: d.id || createId(),
          name: d.name.trim() || "document",
          category: d.category,
          url: d.url,
          uploadedAt: d.uploadedAt || new Date().toISOString(),
        });
        continue;
      }
      if (!d.file && !d.name.trim()) continue;
      if (!d.file) {
        throw new Error(t("owner.docFileRequired"));
      }
      const name = d.name.trim() || d.file.name;
      const contentBase64 = await fileToBase64(d.file);
      const uploaded = await uploadsApi.create({
        name,
        size: d.file.size,
        category: d.category,
        contentBase64,
        mimeType: d.file.type || undefined,
      });
      const stored = uploaded.data.data;
      preparedDocs.push({
        id: d.id || createId(),
        name: stored?.name || name,
        category: d.category,
        url: stored?.url || "",
        uploadedAt: new Date().toISOString(),
      });
    }

    const preparedTeam: TeamMember[] = team
      .filter((m) => m.name.trim())
      .map((m) => ({
        id: m.id || createId(),
        name: m.name.trim(),
        position: m.position.trim(),
        role: m.role,
        experience: m.experience.trim(),
        biography: m.biography.trim(),
      }));

    const preparedPhases: ProjectPhase[] = phases
      .filter((p) => p.title.trim())
      .map((p, i) => ({
        id: p.id || createId(),
        title: p.title.trim(),
        titleHy: p.titleHy.trim() || undefined,
        description: p.description.trim(),
        budgetAsk: Number(p.budgetAsk) || 0,
        durationWeeks: p.durationWeeks ? Number(p.durationWeeks) : undefined,
        deliverables: p.deliverables
          .split(",")
          .map((d) => d.trim())
          .filter(Boolean),
        sortOrder: p.sortOrder ?? i,
        status: p.status || "planned",
      }));

    return {
      title: basic.title.trim(),
      titleHy: basic.titleHy.trim() || undefined,
      description: basic.description.trim(),
      descriptionHy: basic.descriptionHy.trim() || undefined,
      fullDescription: basic.fullDescription.trim(),
      category: basic.category,
      industry: basic.industry,
      location: basic.location.trim(),
      stage: basic.stage,
      timeline: basic.timeline.trim(),
      businessModel: basic.businessModel.trim(),
      requiredInvestment: Number(financial.requiredInvestment) || 0,
      minInvestment: Number(financial.minInvestment) || 0,
      expectedRoi: Number(financial.expectedRoi) || 0,
      revenueModel: financial.revenueModel.trim(),
      financialProjections: financial.financialProjections.trim(),
      investmentPlan: financial.investmentPlan.trim(),
      team: preparedTeam,
      documents: preparedDocs,
      phases: preparedPhases,
    };
  };

  const validateBeforeSave = () => {
    if (!basic.title.trim()) {
      toast.error(t("owner.titleRequired"));
      setTab("basic");
      return false;
    }
    if (!basic.description.trim()) {
      toast.error(t("owner.descriptionRequired"));
      setTab("basic");
      return false;
    }
    if (!basic.location.trim()) {
      toast.error(t("owner.locationRequired"));
      setTab("basic");
      return false;
    }
    if (!financial.requiredInvestment || financial.requiredInvestment <= 0) {
      toast.error(t("owner.amountRequired"));
      setTab("finance");
      return false;
    }
    if (!team.some((m) => m.name.trim())) {
      toast.error(t("owner.teamRequired"));
      setTab("team");
      return false;
    }
    const incompleteDoc = documents.find(
      (d) => !d.existing && (d.file || d.name.trim()) && !d.file
    );
    if (incompleteDoc) {
      toast.error(t("owner.docFileRequired"));
      setTab("documents");
      return false;
    }
    if (budgetMismatch) {
      toast.warning(
        t("owner.phaseBudgetToast", {
          sum: phaseBudgetSum.toLocaleString(),
          required: financial.requiredInvestment.toLocaleString(),
        })
      );
    }
    return true;
  };

  const saveMutation = useMutation({
    mutationFn: async () => ownerApi.updateProject(id, await buildPayload()),
    onSuccess: () => {
      toast.success(t("ownerReview.savedToast"));
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.OWNER_PROJECTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.OWNER_DOCUMENTS] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const resubmitMutation = useMutation({
    mutationFn: async () => {
      await ownerApi.updateProject(id, await buildPayload());
      return ownerApi.resubmitProject(id);
    },
    onSuccess: () => {
      toast.success(t("ownerReview.resubmitToast"));
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.OWNER_PROJECTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.OWNER_DOCUMENTS] });
      router.push(ROUTES.OWNER_PROJECTS);
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const deleteMutation = useMutation({
    mutationFn: () => ownerApi.deleteProject(id),
    onSuccess: () => {
      toast.success(t("ownerReview.deletedToast"));
      setDeleteOpen(false);
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
  const busy = saveMutation.isPending || resubmitMutation.isPending;

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

      <Tabs value={tab} onValueChange={(v) => setTab(v as TabId)}>
        <TabsList className="grid h-auto w-full grid-cols-2 gap-1 bg-muted p-1 sm:grid-cols-4">
          <TabsTrigger value="basic" className={tabTriggerClass}>
            {t("owner.tabBasic")}
          </TabsTrigger>
          <TabsTrigger value="team" className={tabTriggerClass}>
            {t("owner.tabTeam")}
          </TabsTrigger>
          <TabsTrigger value="documents" className={tabTriggerClass}>
            {t("owner.tabDocuments")}
          </TabsTrigger>
          <TabsTrigger value="finance" className={tabTriggerClass}>
            {t("owner.tabFinance")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">{t("owner.basicInfo")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>
                    {t("owner.titleLabel")}
                    <span className="text-destructive"> *</span>
                  </Label>
                  <Input
                    value={basic.title}
                    onChange={(e) => setBasic({ ...basic, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("owner.titleHyOptional")}</Label>
                  <Input
                    value={basic.titleHy}
                    onChange={(e) => setBasic({ ...basic, titleHy: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>
                  {t("ownerReview.description")}
                  <span className="text-destructive"> *</span>
                </Label>
                <Textarea
                  rows={3}
                  value={basic.description}
                  onChange={(e) => setBasic({ ...basic, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("owner.descriptionHyOptional")}</Label>
                <Textarea
                  rows={3}
                  value={basic.descriptionHy}
                  onChange={(e) => setBasic({ ...basic, descriptionHy: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("ownerReview.fullDescription")}</Label>
                <Textarea
                  rows={5}
                  value={basic.fullDescription}
                  onChange={(e) => setBasic({ ...basic, fullDescription: e.target.value })}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>{t("projects.category")}</Label>
                  <Select
                    value={basic.category}
                    onValueChange={(v) => setBasic({ ...basic, category: v })}
                  >
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
                  <Select
                    value={basic.industry}
                    onValueChange={(v) => setBasic({ ...basic, industry: v })}
                  >
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
                  <Label>
                    {t("projects.location")}
                    <span className="text-destructive"> *</span>
                  </Label>
                  <Input
                    value={basic.location}
                    onChange={(e) => setBasic({ ...basic, location: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("projects.stage")}</Label>
                  <Select
                    value={basic.stage}
                    onValueChange={(v) => setBasic({ ...basic, stage: v as ProjectStage })}
                  >
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
              </div>
              <div className="space-y-2">
                <Label>{t("owner.timeline")}</Label>
                <Input
                  value={basic.timeline}
                  onChange={(e) => setBasic({ ...basic, timeline: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("projects.businessModel")}</Label>
                <Textarea
                  rows={3}
                  value={basic.businessModel}
                  onChange={(e) => setBasic({ ...basic, businessModel: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">{t("owner.tabTeam")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {team.map((member, index) => (
                <div key={member.id || index} className="space-y-3 rounded-xl border border-border p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">
                      {t("owner.addTeamMember")} {index + 1}
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={team.length === 1}
                      onClick={() => setTeam(team.filter((_, i) => i !== index))}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>{t("owner.name")}</Label>
                      <Input
                        value={member.name}
                        onChange={(e) => {
                          const next = [...team];
                          next[index] = { ...member, name: e.target.value };
                          setTeam(next);
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("owner.position")}</Label>
                      <Input
                        value={member.position}
                        onChange={(e) => {
                          const next = [...team];
                          next[index] = { ...member, position: e.target.value };
                          setTeam(next);
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("owner.role")}</Label>
                      <Select
                        value={member.role}
                        onValueChange={(v) => {
                          const next = [...team];
                          next[index] = { ...member, role: v as TeamRole };
                          setTeam(next);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TEAM_ROLES.map((r) => (
                            <SelectItem key={r.value} value={r.value}>
                              {teamRoleLabel(locale, r.value)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>{t("owner.experience")}</Label>
                      <Input
                        value={member.experience}
                        onChange={(e) => {
                          const next = [...team];
                          next[index] = { ...member, experience: e.target.value };
                          setTeam(next);
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>{t("owner.biography")}</Label>
                    <Textarea
                      value={member.biography}
                      onChange={(e) => {
                        const next = [...team];
                        next[index] = { ...member, biography: e.target.value };
                        setTeam(next);
                      }}
                    />
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                className="border-primary/30 text-primary hover:bg-primary/5"
                onClick={() => setTeam([...team, emptyTeam()])}
              >
                <Plus className="h-4 w-4" /> {t("owner.addTeamMember")}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">{t("owner.documentation")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{t("owner.documentsCreateHint")}</p>
              {documents.map((doc, index) => (
                <div key={doc.id || index} className="space-y-3 rounded-xl border border-border p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <p className="text-sm font-medium text-foreground">
                      {t("owner.addDocument")} {index + 1}
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={documents.length === 1}
                      onClick={() => setDocuments(documents.filter((_, i) => i !== index))}
                      aria-label={t("common.remove")}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>

                  {doc.existing && isUsableDocumentUrl(doc.url) && !doc.file ? (
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-4 py-3">
                      <p className="truncate text-sm text-foreground">{doc.name}</p>
                      <DocumentActions url={doc.url} name={doc.name} showDownload={false} />
                    </div>
                  ) : null}

                  <div className="rounded-xl border border-dashed border-primary/30 bg-primary/5 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground">{t("owner.docFile")}</p>
                        <p className="mt-1 truncate text-sm text-muted-foreground">
                          {doc.file
                            ? t("owner.docFileAttached", { name: doc.file.name })
                            : doc.existing
                              ? t("owner.docChangeFile")
                              : t("owner.docChooseFile")}
                        </p>
                      </div>
                      <label className="inline-flex shrink-0 cursor-pointer">
                        <span className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90">
                          <Upload className="h-4 w-4" />
                          {doc.file || doc.existing
                            ? t("owner.docChangeFile")
                            : t("owner.docAttachFile")}
                        </span>
                        <input
                          type="file"
                          className="sr-only"
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg,.webp,application/pdf"
                          onChange={(e) => {
                            const file = e.target.files?.[0] ?? null;
                            const next = [...documents];
                            next[index] = {
                              ...doc,
                              file,
                              name: doc.name.trim() || file?.name || "",
                            };
                            setDocuments(next);
                            e.target.value = "";
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>{t("owner.docDisplayName")}</Label>
                      <Input
                        value={doc.name}
                        onChange={(e) => {
                          const next = [...documents];
                          next[index] = { ...doc, name: e.target.value };
                          setDocuments(next);
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("owner.category")}</Label>
                      <Select
                        value={doc.category}
                        onValueChange={(v) => {
                          const next = [...documents];
                          next[index] = { ...doc, category: v as DocumentCategory };
                          setDocuments(next);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {DOCUMENT_CATEGORIES.map((c) => (
                            <SelectItem key={c.value} value={c.value}>
                              {docCategoryLabel(locale, c.value)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                className="border-primary/30 text-primary hover:bg-primary/5"
                onClick={() => setDocuments([...documents, emptyDoc()])}
              >
                <Plus className="h-4 w-4" /> {t("owner.addDocument")}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="finance" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">{t("owner.financialDetails")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>
                    {t("owner.requiredAmount")}
                    <span className="text-destructive"> *</span>
                  </Label>
                  <Input
                    type="number"
                    min={1}
                    value={financial.requiredInvestment}
                    onChange={(e) =>
                      setFinancial({ ...financial, requiredInvestment: +e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("owner.minAmount")}</Label>
                  <Input
                    type="number"
                    value={financial.minInvestment}
                    onChange={(e) =>
                      setFinancial({ ...financial, minInvestment: +e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("owner.expectedRoiPercent")}</Label>
                  <Input
                    type="number"
                    value={financial.expectedRoi}
                    onChange={(e) =>
                      setFinancial({ ...financial, expectedRoi: +e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t("owner.revenueModel")}</Label>
                <Textarea
                  value={financial.revenueModel}
                  onChange={(e) =>
                    setFinancial({ ...financial, revenueModel: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>{t("owner.projections")}</Label>
                <Textarea
                  value={financial.financialProjections}
                  onChange={(e) =>
                    setFinancial({ ...financial, financialProjections: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>{t("owner.investmentPlan")}</Label>
                <Textarea
                  value={financial.investmentPlan}
                  onChange={(e) =>
                    setFinancial({ ...financial, investmentPlan: e.target.value })
                  }
                />
              </div>

              <div className="space-y-3 border-t border-border pt-4">
                <div className="flex flex-wrap items-end justify-between gap-2">
                  <div>
                    <h3 className="font-display text-base font-semibold text-foreground">
                      {t("projects.phases")}
                    </h3>
                    <p className="text-xs text-muted-foreground">{t("owner.phasesHint")}</p>
                  </div>
                  <p
                    className={cn(
                      "text-sm font-medium",
                      budgetMismatch ? "text-amber-700" : "text-teal-800"
                    )}
                  >
                    {t("owner.phaseBudgetSum", {
                      sum: phaseBudgetSum.toLocaleString(),
                      required: financial.requiredInvestment.toLocaleString(),
                    })}
                  </p>
                </div>
                {budgetMismatch ? (
                  <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                    {t("owner.phaseBudgetMismatch")}
                  </p>
                ) : null}
                {phases.map((phase, index) => (
                  <div key={phase.id || index} className="space-y-3 rounded-xl border border-border p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground">
                        {t("common.phaseLabel", { n: index + 1 })}
                      </p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={phases.length === 1}
                        onClick={() =>
                          setPhases(
                            phases
                              .filter((_, i) => i !== index)
                              .map((p, i) => ({ ...p, sortOrder: i }))
                          )
                        }
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>{t("owner.titleLabel")}</Label>
                        <Input
                          value={phase.title}
                          onChange={(e) => {
                            const next = [...phases];
                            next[index] = { ...phase, title: e.target.value };
                            setPhases(next);
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>{t("owner.titleHyOptional")}</Label>
                        <Input
                          value={phase.titleHy}
                          onChange={(e) => {
                            const next = [...phases];
                            next[index] = { ...phase, titleHy: e.target.value };
                            setPhases(next);
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>{t("owner.phaseBudget")}</Label>
                        <Input
                          type="number"
                          value={phase.budgetAsk}
                          onChange={(e) => {
                            const next = [...phases];
                            next[index] = { ...phase, budgetAsk: +e.target.value };
                            setPhases(next);
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>{t("owner.phaseWeeks")}</Label>
                        <Input
                          type="number"
                          value={phase.durationWeeks}
                          onChange={(e) => {
                            const next = [...phases];
                            next[index] = { ...phase, durationWeeks: e.target.value };
                            setPhases(next);
                          }}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>{t("ownerReview.description")}</Label>
                      <Textarea
                        value={phase.description}
                        onChange={(e) => {
                          const next = [...phases];
                          next[index] = { ...phase, description: e.target.value };
                          setPhases(next);
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("owner.phaseDeliverables")}</Label>
                      <Input
                        value={phase.deliverables}
                        onChange={(e) => {
                          const next = [...phases];
                          next[index] = { ...phase, deliverables: e.target.value };
                          setPhases(next);
                        }}
                      />
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  className="border-primary/30 text-primary hover:bg-primary/5"
                  onClick={() => setPhases([...phases, emptyPhase(phases.length)])}
                >
                  <Plus className="h-4 w-4" /> {t("owner.addPhase")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          disabled={busy}
          onClick={() => {
            if (!validateBeforeSave()) return;
            saveMutation.mutate();
          }}
        >
          {saveMutation.isPending ? t("common.saving") : t("ownerReview.saveChanges")}
        </Button>
        {canResubmit ? (
          <Button
            disabled={busy}
            onClick={() => {
              if (!validateBeforeSave()) return;
              resubmitMutation.mutate();
            }}
          >
            {resubmitMutation.isPending ? t("common.saving") : t("ownerReview.resubmit")}
          </Button>
        ) : null}
        <Button
          size="icon"
          variant="ghost"
          className="h-10 w-10 text-destructive hover:bg-destructive/10 hover:text-destructive"
          disabled={deleteMutation.isPending || busy}
          aria-label={t("ownerReview.deleteProject")}
          onClick={() => setDeleteOpen(true)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={t("ownerReview.deleteConfirm")}
        description={project.title}
        confirmLabel={t("ownerReview.deleteProject")}
        loading={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate()}
      />
    </PanelPage>
  );
}
