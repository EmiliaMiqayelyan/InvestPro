"use client";

import { useState } from "react";
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

type DocDraft = { name: string; category: DocumentCategory };
type TeamDraft = {
  name: string;
  position: string;
  role: TeamRole;
  experience: string;
  biography: string;
};

const emptyTeam = (): TeamDraft => ({
  name: "",
  position: "",
  role: "member",
  experience: "",
  biography: "",
});

export default function OwnerCreateProjectPage() {
  const router = useRouter();
  const [tab, setTab] = useState("basic");
  const [basic, setBasic] = useState({
    title: "",
    description: "",
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
  const [documents, setDocuments] = useState<DocDraft[]>([
    { name: "", category: "pitch_deck" },
  ]);
  const [team, setTeam] = useState<TeamDraft[]>([emptyTeam()]);

  const createMutation = useMutation({
    mutationFn: () =>
      ownerApi.createProject({
        title: basic.title,
        description: basic.description,
        fullDescription: basic.fullDescription,
        category: basic.category,
        industry: basic.industry,
        location: basic.location,
        stage: basic.stage,
        timeline: basic.timeline,
        businessModel: basic.businessModel,
        ...financial,
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

  const submit = () => {
    if (!basic.title.trim()) {
      toast.error("Project title is required");
      setTab("basic");
      return;
    }
    createMutation.mutate();
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold text-slate-900">Create project</h2>
        <p className="text-sm text-muted-foreground">
          Add details across basic info, financials, documents, and team
        </p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="grid h-auto w-full grid-cols-2 gap-1 bg-slate-100 p-1 sm:grid-cols-4">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="mt-4">
          <Card className="premium-card border-border bg-white shadow-none backdrop-blur-none">
            <CardHeader>
              <CardTitle className="text-slate-900">Basic information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={basic.title}
                  onChange={(e) => setBasic({ ...basic, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Short description</Label>
                <Textarea
                  value={basic.description}
                  onChange={(e) => setBasic({ ...basic, description: e.target.value })}
                />
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
              <Button type="button" variant="outline" onClick={() => setTab("financial")}>
                Continue to financial
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="mt-4">
          <Card className="premium-card border-border bg-white shadow-none backdrop-blur-none">
            <CardHeader>
              <CardTitle className="text-slate-900">Financial details</CardTitle>
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
              <Button type="button" variant="outline" onClick={() => setTab("documents")}>
                Continue to documents
              </Button>
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
                Simulate uploads with a document name and category.
              </p>
              {documents.map((doc, index) => (
                <div key={index} className="flex flex-wrap items-end gap-3 rounded-xl border border-border p-3">
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
                onClick={() =>
                  setDocuments([...documents, { name: "", category: "other" }])
                }
              >
                <Plus className="h-4 w-4" /> Add document
              </Button>
              <div>
                <Button type="button" variant="outline" onClick={() => setTab("team")}>
                  Continue to team
                </Button>
              </div>
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
                onClick={() => setTeam([...team, emptyTeam()])}
              >
                <Plus className="h-4 w-4" /> Add team member
              </Button>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
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
