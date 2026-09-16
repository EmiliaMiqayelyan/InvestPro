"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Plus, Trash2, Upload } from "lucide-react";
import { ownerApi, uploadsApi } from "@/services/api";
import {
  ROUTES,
  PROJECT_CATEGORIES,
  PROJECT_INDUSTRIES,
  PROJECT_STAGES,
  DOCUMENT_CATEGORIES,
  TEAM_ROLES,
} from "@/constants";
import { getErrorMessage } from "@/services/api/client";
import { createId } from "@/utils/id";
import { useI18n } from "@/hooks";
import {
  categoryLabel,
  industryLabel,
  stageLabel,
  docCategoryLabel,
  teamRoleLabel,
} from "@/i18n/localize";
import { useSetPageTitle } from "@/components/providers/page-title-provider";
import { PageHeader } from "@/components/shared/page-header";
import { PanelPage } from "@/components/shared/panel-page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ProjectStage, TeamRole, DocumentCategory } from "@/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type DocDraft = {
  name: string;
  category: DocumentCategory;
  file?: File | null;
  url?: string;
};
type TeamDraft = {
  name: string;
  position: string;
  role: TeamRole;
  experience: string;
  biography: string;
};
type PhaseDraft = {
  title: string;
  titleHy: string;
  description: string;
  budgetAsk: number;
  durationWeeks: string;
  deliverables: string;
  sortOrder: number;
};

const TABS = ["basic", "team", "documents", "finance", "review"] as const;
type TabId = (typeof TABS)[number];

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

const tabTriggerClass =
  "data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none";

export default function OwnerCreateProjectPage() {
  const { t, locale } = useI18n();
  useSetPageTitle(t("owner.createProject"));
  const router = useRouter();
  const [tab, setTab] = useState<TabId>("basic");
  const [basic, setBasic] = useState({
    title: "",
    titleHy: "",
    description: "",
    descriptionHy: "",
    fullDescription: "",
    category: PROJECT_CATEGORIES[0],
    industry: PROJECT_INDUSTRIES[0],
    location: "",
    stage: "mvp" as ProjectStage,
    timeline: "",
    businessModel: "",
  });
  const [financial, setFinancial] = useState({
    requiredInvestment: 100000,
    minInvestment: 1000,
    expectedRoi: 15,
    revenueModel: "",
    financialProjections: "",
    investmentPlan: "",
  });
  const [phases, setPhases] = useState<PhaseDraft[]>([emptyPhase(0)]);
  const [documents, setDocuments] = useState<DocDraft[]>([
    { name: "", category: "pitch_deck", file: null },
  ]);
  const [team, setTeam] = useState<TeamDraft[]>([emptyTeam()]);

  const phaseBudgetSum = useMemo(
    () => phases.reduce((sum, p) => sum + (Number(p.budgetAsk) || 0), 0),
    [phases]
  );
  const budgetMismatch =
    phases.some((p) => p.title.trim()) &&
    Math.abs(phaseBudgetSum - financial.requiredInvestment) >
      Math.max(financial.requiredInvestment * 0.05, 1);

  const createMutation = useMutation({
    mutationFn: async () => {
      const preparedDocs = [];
      for (const d of documents) {
        if (!d.file && !d.name.trim()) continue;
        if (!d.file) {
          throw new Error(t("owner.docFileRequired"));
        }
        const name = d.name.trim() || d.file.name;
        const uploaded = await uploadsApi.create({
          name,
          size: d.file.size,
          category: d.category,
        });
        const stored = uploaded.data.data;
        preparedDocs.push({
          id: createId(),
          name: stored?.name || name,
          category: d.category,
          url: stored?.url || `#${name}`,
          uploadedAt: new Date().toISOString(),
        });
      }

      return ownerApi.createProject({
        title: basic.title,
        titleHy: basic.titleHy || undefined,
        description: basic.description,
        descriptionHy: basic.descriptionHy || undefined,
        fullDescription: basic.fullDescription,
        category: basic.category,
        industry: basic.industry,
        location: basic.location,
        stage: basic.stage,
        timeline: basic.timeline,
        businessModel: basic.businessModel,
        ...financial,
        phases: phases
          .filter((p) => p.title.trim())
          .map((p, i) => ({
            id: createId(),
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
            status: "planned" as const,
          })),
        documents: preparedDocs,
        team: team
          .filter((m) => m.name.trim())
          .map((m) => ({
            id: createId(),
            ...m,
          })),
      });
    },
    onSuccess: () => {
      toast.success(t("owner.projectCreated"));
      router.push(ROUTES.OWNER_PROJECTS);
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const goNext = (next: TabId) => setTab(next);

  const submit = () => {
    if (!basic.title.trim()) {
      toast.error(t("owner.titleRequired"));
      setTab("basic");
      return;
    }
    if (!basic.description.trim()) {
      toast.error(t("owner.descriptionRequired"));
      setTab("basic");
      return;
    }
    if (!basic.location.trim()) {
      toast.error(t("owner.locationRequired"));
      setTab("basic");
      return;
    }
    if (!financial.requiredInvestment || financial.requiredInvestment <= 0) {
      toast.error(t("owner.amountRequired"));
      setTab("finance");
      return;
    }
    if (!team.some((m) => m.name.trim())) {
      toast.error(t("owner.teamRequired"));
      setTab("team");
      return;
    }
    const incompleteDoc = documents.find((d) => d.file || d.name.trim());
    if (incompleteDoc && !incompleteDoc.file) {
      toast.error(t("owner.docFileRequired"));
      setTab("documents");
      return;
    }
    if (budgetMismatch) {
      toast.warning(
        t("owner.phaseBudgetToast", {
          sum: phaseBudgetSum.toLocaleString(),
          required: financial.requiredInvestment.toLocaleString(),
        })
      );
    }
    createMutation.mutate();
  };

  return (
    <PanelPage maxWidth="content">
      <PageHeader
        variant="minimal"
        title={t("owner.createProject")}
        description={t("owner.basicInfo")}
      />

      <Tabs value={tab} onValueChange={(v) => setTab(v as TabId)}>
        <TabsList className="grid h-auto w-full grid-cols-2 gap-1 bg-muted p-1 sm:grid-cols-5">
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
          <TabsTrigger value="review" className={tabTriggerClass}>
            {t("owner.tabReview")}
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
                    required
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
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>
                    {t("owner.shortDescription")}
                    <span className="text-destructive"> *</span>
                  </Label>
                  <Textarea
                    required
                    value={basic.description}
                    onChange={(e) => setBasic({ ...basic, description: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("owner.shortDescriptionHy")}</Label>
                  <Textarea
                    value={basic.descriptionHy}
                    onChange={(e) => setBasic({ ...basic, descriptionHy: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t("owner.fullDescription")}</Label>
                <Textarea
                  rows={5}
                  value={basic.fullDescription}
                  onChange={(e) => setBasic({ ...basic, fullDescription: e.target.value })}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>{t("owner.category")}</Label>
                  <Select
                    value={basic.category}
                    onValueChange={(v) => setBasic({ ...basic, category: v as typeof basic.category })}
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
                  <Label>{t("owner.industry")}</Label>
                  <Select
                    value={basic.industry}
                    onValueChange={(v) => setBasic({ ...basic, industry: v as typeof basic.industry })}
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
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>
                    {t("projects.location")}
                    <span className="text-destructive"> *</span>
                  </Label>
                  <Input
                    required
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
                          {stageLabel(locale, s.value)}
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
                  placeholder={t("owner.timelinePlaceholder")}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("projects.businessModel")}</Label>
                <Textarea
                  value={basic.businessModel}
                  onChange={(e) => setBasic({ ...basic, businessModel: e.target.value })}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                className="border-primary/30 text-primary hover:bg-primary/5"
                onClick={() => goNext("team")}
              >
                {t("owner.continueToTeam")}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">{t("owner.teamInfo")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {team.map((member, index) => (
                <div key={index} className="space-y-3 rounded-xl border border-border p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">
                      {t("common.memberLabel", { n: index + 1 })}
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setTeam(team.filter((_, i) => i !== index))}
                      disabled={team.length === 1}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>
                        {t("owner.name")}
                        <span className="text-destructive"> *</span>
                      </Label>
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
              <div>
                <Button
                  type="button"
                  variant="outline"
                  className="border-primary/30 text-primary hover:bg-primary/5"
                  onClick={() => goNext("documents")}
                >
                  {t("owner.continueToDocuments")}
                </Button>
              </div>
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
                <div
                  key={index}
                  className="space-y-3 rounded-xl border border-border p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <p className="text-sm font-medium text-foreground">
                      {t("owner.addDocument")} {index + 1}
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setDocuments(documents.filter((_, i) => i !== index))}
                      disabled={documents.length === 1}
                      aria-label={t("common.remove")}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>

                  <div className="rounded-xl border border-dashed border-primary/30 bg-primary/5 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {t("owner.docFile")}
                          <span className="text-destructive"> *</span>
                        </p>
                        <p className="mt-1 truncate text-sm text-muted-foreground">
                          {doc.file
                            ? t("owner.docFileAttached", { name: doc.file.name })
                            : t("owner.docChooseFile")}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {t("owner.docFileTypes")}
                        </p>
                      </div>
                      <label className="inline-flex shrink-0 cursor-pointer">
                        <span className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90">
                          <Upload className="h-4 w-4" />
                          {doc.file ? t("owner.docChangeFile") : t("owner.docAttachFile")}
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
                        placeholder={t("owner.docNamePlaceholder")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>
                        {t("owner.category")}
                        <span className="text-destructive"> *</span>
                      </Label>
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
                onClick={() =>
                  setDocuments([
                    ...documents,
                    { name: "", category: "finance_plan", file: null },
                  ])
                }
              >
                <Plus className="h-4 w-4" /> {t("owner.addDocument")}
              </Button>
              <div>
                <Button
                  type="button"
                  variant="outline"
                  className="border-primary/30 text-primary hover:bg-primary/5"
                  onClick={() => {
                    const missing = documents.some((d) => !d.file);
                    if (missing) {
                      toast.error(t("owner.docFileRequired"));
                      return;
                    }
                    goNext("finance");
                  }}
                >
                  {t("owner.continueToFinance")}
                </Button>
              </div>
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
                    required
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
                {budgetMismatch && (
                  <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                    {t("owner.phaseBudgetMismatch")}
                  </p>
                )}
                {phases.map((phase, index) => (
                  <div key={index} className="space-y-3 rounded-xl border border-border p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground">
                        {t("common.phaseLabel", { n: index + 1 })}
                      </p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setPhases(
                            phases
                              .filter((_, i) => i !== index)
                              .map((p, i) => ({ ...p, sortOrder: i }))
                          )
                        }
                        disabled={phases.length === 1}
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
                    </div>
                    <div className="space-y-2">
                      <Label>{t("owner.description")}</Label>
                      <Textarea
                        value={phase.description}
                        onChange={(e) => {
                          const next = [...phases];
                          next[index] = { ...phase, description: e.target.value };
                          setPhases(next);
                        }}
                      />
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="space-y-2">
                        <Label>{t("owner.budgetAsk")}</Label>
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
                        <Label>{t("owner.durationWeeks")}</Label>
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
                      <div className="space-y-2">
                        <Label>{t("owner.sortOrder")}</Label>
                        <Input
                          type="number"
                          value={phase.sortOrder}
                          onChange={(e) => {
                            const next = [...phases];
                            next[index] = { ...phase, sortOrder: +e.target.value };
                            setPhases(next);
                          }}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>{t("owner.deliverables")}</Label>
                      <Input
                        value={phase.deliverables}
                        onChange={(e) => {
                          const next = [...phases];
                          next[index] = { ...phase, deliverables: e.target.value };
                          setPhases(next);
                        }}
                        placeholder={t("owner.deliverablesPlaceholder")}
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

              <Button
                type="button"
                variant="outline"
                className="border-primary/30 text-primary hover:bg-primary/5"
                onClick={() => goNext("review")}
              >
                {t("owner.continueToReview")}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="review" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">{t("owner.reviewSubmit")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl border border-border bg-muted/50 p-4 text-sm space-y-2">
                <p>
                  <span className="text-muted-foreground">{t("owner.titleLabel")}:</span>{" "}
                  <span className="font-medium text-foreground">{basic.title || "—"}</span>
                </p>
                {basic.titleHy ? (
                  <p>
                    <span className="text-muted-foreground">{t("owner.titleHyReview")}:</span>{" "}
                    {basic.titleHy}
                  </p>
                ) : null}
                <p>
                  <span className="text-muted-foreground">{t("owner.tabTeam")}:</span>{" "}
                  {t("common.membersCount", {
                    count: team.filter((m) => m.name.trim()).length,
                  })}
                </p>
                <p>
                  <span className="text-muted-foreground">{t("owner.tabDocuments")}:</span>{" "}
                  {documents.filter((d) => d.file || d.name.trim()).length}
                </p>
                <p>
                  <span className="text-muted-foreground">{t("owner.requiredAmount")}:</span>{" "}
                  {financial.requiredInvestment.toLocaleString()}
                </p>
                <p>
                  <span className="text-muted-foreground">{t("projects.phases")}:</span>{" "}
                  {phases.filter((p) => p.title.trim()).length} · {t("owner.budgetSumReview")}{" "}
                  {phaseBudgetSum.toLocaleString()}
                </p>
                {budgetMismatch && (
                  <p className="text-amber-800">{t("owner.phaseBudgetWarning")}</p>
                )}
              </div>
              <Button
                className="w-full"
                onClick={submit}
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? t("common.creating") : t("owner.submitProject")}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PanelPage>
  );
}
