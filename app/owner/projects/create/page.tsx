"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { ownerApi } from "@/services/api";
import {
  ROUTES,
  PROJECT_CATEGORIES,
  PROJECT_INDUSTRIES,
  PROJECT_STAGES,
  DOCUMENT_CATEGORIES,
  TEAM_ROLES,
} from "@/constants";
import { getErrorMessage } from "@/services/api/client";
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

type DocDraft = { name: string; category: DocumentCategory };
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
  "data-[state=active]:bg-teal-50 data-[state=active]:text-teal-900 data-[state=active]:shadow-none";

export default function OwnerCreateProjectPage() {
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
    { name: "", category: "pitch_deck" },
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
    mutationFn: () =>
      ownerApi.createProject({
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
            id: `phase-${i}`,
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
        documents: documents
          .filter((d) => d.name.trim())
          .map((d, i) => ({
            id: `doc-${i}`,
            name: d.name,
            category: d.category,
            url: `#${d.name}`,
            uploadedAt: new Date().toISOString(),
          })),
        team: team
          .filter((m) => m.name.trim())
          .map((m, i) => ({
            id: `team-${i}`,
            ...m,
          })),
      }),
    onSuccess: () => {
      toast.success("Project created");
      router.push(ROUTES.OWNER_PROJECTS);
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const goNext = (next: TabId) => setTab(next);

  const submit = () => {
    if (!basic.title.trim()) {
      toast.error("Project title is required");
      setTab("basic");
      return;
    }
    if (budgetMismatch) {
      toast.warning(
        `Phase budgets total ${phaseBudgetSum.toLocaleString()} vs required investment ${financial.requiredInvestment.toLocaleString()}. You can still submit.`
      );
    }
    createMutation.mutate();
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold text-slate-900">Create project</h2>
        <p className="text-sm text-muted-foreground">
          Walk through basic info, team, documents, finance with phases, then review
        </p>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as TabId)}>
        <TabsList className="grid h-auto w-full grid-cols-2 gap-1 bg-slate-100 p-1 sm:grid-cols-5">
          <TabsTrigger value="basic" className={tabTriggerClass}>
            Basic
          </TabsTrigger>
          <TabsTrigger value="team" className={tabTriggerClass}>
            Team
          </TabsTrigger>
          <TabsTrigger value="documents" className={tabTriggerClass}>
            Documents
          </TabsTrigger>
          <TabsTrigger value="finance" className={tabTriggerClass}>
            Finance
          </TabsTrigger>
          <TabsTrigger value="review" className={tabTriggerClass}>
            Review
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="mt-4">
          <Card className="premium-card border-border bg-white shadow-none backdrop-blur-none">
            <CardHeader>
              <CardTitle className="text-slate-900">Basic information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={basic.title}
                    onChange={(e) => setBasic({ ...basic, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Title (Armenian, optional)</Label>
                  <Input
                    value={basic.titleHy}
                    onChange={(e) => setBasic({ ...basic, titleHy: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Short description</Label>
                  <Textarea
                    value={basic.description}
                    onChange={(e) => setBasic({ ...basic, description: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Short description (Armenian, optional)</Label>
                  <Textarea
                    value={basic.descriptionHy}
                    onChange={(e) => setBasic({ ...basic, descriptionHy: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Full description</Label>
                <Textarea
                  rows={5}
                  value={basic.fullDescription}
                  onChange={(e) => setBasic({ ...basic, fullDescription: e.target.value })}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Category</Label>
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
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Industry</Label>
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
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    value={basic.location}
                    onChange={(e) => setBasic({ ...basic, location: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Stage</Label>
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
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Timeline</Label>
                <Input
                  value={basic.timeline}
                  onChange={(e) => setBasic({ ...basic, timeline: e.target.value })}
                  placeholder="e.g. 18 months to Series A"
                />
              </div>
              <div className="space-y-2">
                <Label>Business model</Label>
                <Textarea
                  value={basic.businessModel}
                  onChange={(e) => setBasic({ ...basic, businessModel: e.target.value })}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                className="border-teal-200 text-teal-900 hover:bg-teal-50"
                onClick={() => goNext("team")}
              >
                Continue to team
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="mt-4">
          <Card className="premium-card border-border bg-white shadow-none backdrop-blur-none">
            <CardHeader>
              <CardTitle className="text-slate-900">Team members</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {team.map((member, index) => (
                <div key={index} className="space-y-3 rounded-xl border border-border p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-900">Member {index + 1}</p>
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
                      <Label>Name</Label>
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
                      <Label>Position</Label>
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
                    <Label>Role</Label>
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
                            {r.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Experience</Label>
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
                    <Label>Biography</Label>
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
                className="border-teal-200 text-teal-900 hover:bg-teal-50"
                onClick={() => setTeam([...team, emptyTeam()])}
              >
                <Plus className="h-4 w-4" /> Add team member
              </Button>
              <div>
                <Button
                  type="button"
                  variant="outline"
                  className="border-teal-200 text-teal-900 hover:bg-teal-50"
                  onClick={() => goNext("documents")}
                >
                  Continue to documents
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="mt-4">
          <Card className="premium-card border-border bg-white shadow-none backdrop-blur-none">
            <CardHeader>
              <CardTitle className="text-slate-900">Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Simulate uploads with a document name and category (includes finance plan).
              </p>
              {documents.map((doc, index) => (
                <div
                  key={index}
                  className="flex flex-wrap items-end gap-3 rounded-xl border border-border p-3"
                >
                  <div className="min-w-[180px] flex-1 space-y-2">
                    <Label>Name</Label>
                    <Input
                      value={doc.name}
                      onChange={(e) => {
                        const next = [...documents];
                        next[index] = { ...doc, name: e.target.value };
                        setDocuments(next);
                      }}
                      placeholder="Pitch deck.pdf"
                    />
                  </div>
                  <div className="w-44 space-y-2">
                    <Label>Category</Label>
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
                            {c.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setDocuments(documents.filter((_, i) => i !== index))}
                    disabled={documents.length === 1}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                className="border-teal-200 text-teal-900 hover:bg-teal-50"
                onClick={() =>
                  setDocuments([...documents, { name: "", category: "finance_plan" }])
                }
              >
                <Plus className="h-4 w-4" /> Add document
              </Button>
              <div>
                <Button
                  type="button"
                  variant="outline"
                  className="border-teal-200 text-teal-900 hover:bg-teal-50"
                  onClick={() => goNext("finance")}
                >
                  Continue to finance
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="finance" className="mt-4">
          <Card className="premium-card border-border bg-white shadow-none backdrop-blur-none">
            <CardHeader>
              <CardTitle className="text-slate-900">Financial details & phases</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>Required investment</Label>
                  <Input
                    type="number"
                    value={financial.requiredInvestment}
                    onChange={(e) =>
                      setFinancial({ ...financial, requiredInvestment: +e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Min investment</Label>
                  <Input
                    type="number"
                    value={financial.minInvestment}
                    onChange={(e) =>
                      setFinancial({ ...financial, minInvestment: +e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Expected ROI %</Label>
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
                <Label>Revenue model</Label>
                <Textarea
                  value={financial.revenueModel}
                  onChange={(e) =>
                    setFinancial({ ...financial, revenueModel: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Financial projections</Label>
                <Textarea
                  value={financial.financialProjections}
                  onChange={(e) =>
                    setFinancial({ ...financial, financialProjections: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Investment plan</Label>
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
                    <h3 className="font-display text-base font-semibold text-slate-900">
                      Build phases
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Phase budgets should roughly match required investment
                    </p>
                  </div>
                  <p
                    className={cn(
                      "text-sm font-medium",
                      budgetMismatch ? "text-amber-700" : "text-teal-800"
                    )}
                  >
                    Sum: {phaseBudgetSum.toLocaleString()} /{" "}
                    {financial.requiredInvestment.toLocaleString()}
                  </p>
                </div>
                {budgetMismatch && (
                  <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                    Phase budget total differs from required investment. Adjust phases or continue
                    with a warning on submit.
                  </p>
                )}
                {phases.map((phase, index) => (
                  <div key={index} className="space-y-3 rounded-xl border border-border p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-900">Phase {index + 1}</p>
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
                        <Label>Title</Label>
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
                        <Label>Title (Armenian, optional)</Label>
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
                      <Label>Description</Label>
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
                        <Label>Budget ask</Label>
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
                        <Label>Duration (weeks)</Label>
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
                        <Label>Sort order</Label>
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
                      <Label>Deliverables (comma-separated)</Label>
                      <Input
                        value={phase.deliverables}
                        onChange={(e) => {
                          const next = [...phases];
                          next[index] = { ...phase, deliverables: e.target.value };
                          setPhases(next);
                        }}
                        placeholder="MVP, Hiring plan, Docs"
                      />
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  className="border-teal-200 text-teal-900 hover:bg-teal-50"
                  onClick={() => setPhases([...phases, emptyPhase(phases.length)])}
                >
                  <Plus className="h-4 w-4" /> Add phase
                </Button>
              </div>

              <Button
                type="button"
                variant="outline"
                className="border-teal-200 text-teal-900 hover:bg-teal-50"
                onClick={() => goNext("review")}
              >
                Continue to review
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="review" className="mt-4">
          <Card className="premium-card border-border bg-white shadow-none backdrop-blur-none">
            <CardHeader>
              <CardTitle className="text-slate-900">Review & submit</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl border border-border bg-slate-50/80 p-4 text-sm space-y-2">
                <p>
                  <span className="text-muted-foreground">Title:</span>{" "}
                  <span className="font-medium text-slate-900">{basic.title || "—"}</span>
                </p>
                {basic.titleHy ? (
                  <p>
                    <span className="text-muted-foreground">Title (HY):</span> {basic.titleHy}
                  </p>
                ) : null}
                <p>
                  <span className="text-muted-foreground">Team:</span>{" "}
                  {team.filter((m) => m.name.trim()).length} members
                </p>
                <p>
                  <span className="text-muted-foreground">Documents:</span>{" "}
                  {documents.filter((d) => d.name.trim()).length}
                </p>
                <p>
                  <span className="text-muted-foreground">Required investment:</span>{" "}
                  {financial.requiredInvestment.toLocaleString()}
                </p>
                <p>
                  <span className="text-muted-foreground">Phases:</span>{" "}
                  {phases.filter((p) => p.title.trim()).length} · budget sum{" "}
                  {phaseBudgetSum.toLocaleString()}
                </p>
                {budgetMismatch && (
                  <p className="text-amber-800">
                    Warning: phase budgets do not roughly match required investment.
                  </p>
                )}
              </div>
              <Button
                className="w-full bg-teal-700 hover:bg-teal-800"
                onClick={submit}
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? "Creating…" : "Submit project"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
