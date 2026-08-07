"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  Bookmark,
  FileText,
  Lock,
  MessageSquare,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
import { MarketingHeader, MarketingFooter } from "@/components/layout/marketing-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CardSkeleton } from "@/components/shared/loading-skeleton";
import { useProject } from "@/hooks/use-marketplace";
import { projectsApi, offersApi, chatApi } from "@/services/api";
import { useAuthStore } from "@/store";
import { getErrorMessage } from "@/services/api/client";
import {
  ROUTES,
  STATUS_COLORS,
  RISK_LEVELS,
} from "@/constants";
import { formatCurrency, formatPercent, formatDate } from "@/utils/format";
import { canAccessFullProject, canMessage, canSendOffers } from "@/lib/rbac";
import { cn } from "@/lib/utils";

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { data: project, isLoading } = useProject(id);

  const [offerOpen, setOfferOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [conditions, setConditions] = useState("");
  const [questions, setQuestions] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState<"save" | "message" | "offer" | null>(null);

  const accessLimited = Boolean(
    (project as { accessLimited?: boolean } | undefined)?.accessLimited
  );
  const fullAccess = canAccessFullProject(user?.membershipTier);
  const showLocked = accessLimited || !fullAccess;

  const handleSave = async () => {
    if (!isAuthenticated) {
      toast.error("Sign in to save projects.");
      router.push(ROUTES.LOGIN);
      return;
    }
    setBusy("save");
    try {
      await projectsApi.save(id);
      toast.success("Project saved.");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setBusy(null);
    }
  };

  const handleMessage = async () => {
    if (!isAuthenticated) {
      toast.error("Sign in to message the owner.");
      router.push(ROUTES.LOGIN);
      return;
    }
    if (!canMessage(user?.membershipTier, user?.role)) {
      toast.error("Premium membership required to message owners.");
      router.push(ROUTES.MEMBERSHIP);
      return;
    }
    setBusy("message");
    try {
      const { data } = await chatApi.start({ projectId: id });
      toast.success("Conversation started.");
      router.push(
        user?.role === "project_owner"
          ? `${ROUTES.OWNER_MESSAGES}?c=${data.data.id}`
          : `${ROUTES.INVESTOR_MESSAGES}?c=${data.data.id}`
      );
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setBusy(null);
    }
  };

  const handleOffer = async () => {
    if (!isAuthenticated || user?.role !== "investor") {
      toast.error("Investors must be signed in to send offers.");
      return;
    }
    if (!canSendOffers(user?.membershipTier)) {
      toast.error("Premium membership required to send offers.");
      router.push(ROUTES.MEMBERSHIP);
      return;
    }
    const parsed = parseFloat(amount);
    if (!parsed || parsed <= 0) {
      toast.error("Enter a valid offer amount.");
      return;
    }
    setBusy("offer");
    try {
      await offersApi.create({
        projectId: id,
        amount: parsed,
        conditions: conditions || undefined,
        questions: questions || undefined,
        notes: notes || undefined,
      });
      toast.success("Investment offer sent.");
      setOfferOpen(false);
      setAmount("");
      setConditions("");
      setQuestions("");
      setNotes("");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setBusy(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <MarketingHeader />
        <div className="container-narrow section-pad py-16">
          <CardSkeleton className="max-w-4xl" />
        </div>
        <MarketingFooter />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-white">
        <MarketingHeader />
        <div className="container-narrow section-pad py-24 text-center">
          <h1 className="font-display text-2xl font-semibold">Project not found</h1>
          <Button className="mt-6" asChild>
            <Link href={ROUTES.PROJECTS}>Back to marketplace</Link>
          </Button>
        </div>
        <MarketingFooter />
      </div>
    );
  }

  const risk = RISK_LEVELS.find((r) => r.value === project.riskLevel);
  const progress = Math.min(
    100,
    Math.round((project.currentFunding / Math.max(project.requiredInvestment, 1)) * 100)
  );

  return (
    <div className="min-h-screen bg-white">
      <MarketingHeader />

      <div className="container-narrow section-pad py-10 animate-fade-in">
        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-slate-100">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
                sizes="(max-width:1024px) 100vw, 60vw"
                priority
              />
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <Badge className={cn("border capitalize", STATUS_COLORS[project.status])}>
                {project.status.replace("_", " ")}
              </Badge>
              <Badge variant="outline">{project.category}</Badge>
              {risk && (
                <Badge className={cn("border", risk.bg, risk.color)}>{risk.label}</Badge>
              )}
            </div>
            <h1 className="mt-4 font-display text-3xl font-semibold text-slate-900 md:text-4xl">
              {project.title}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {project.location} · {project.industry} · Stage: {project.stage.replace("_", " ")}
            </p>

            {accessLimited && (
              <div className="mt-6 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                <Lock className="mt-0.5 h-4 w-4 shrink-0" />
                <div>
                  <p className="font-medium">Gated content</p>
                  <p className="mt-0.5 text-amber-800">
                    Some details are limited by your membership.{" "}
                    <Link href={ROUTES.MEMBERSHIP} className="font-medium underline">
                      Upgrade to unlock
                    </Link>{" "}
                    documents, team, and financials.
                  </p>
                </div>
              </div>
            )}

            <Tabs defaultValue="overview" className="mt-8">
              <TabsList className="w-full justify-start overflow-x-auto">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="financial">Financial</TabsTrigger>
                <TabsTrigger value="team">Team</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="updates">Updates</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6 space-y-4">
                <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                  {project.fullDescription || project.description}
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="premium-card p-4">
                    <p className="text-xs text-muted-foreground">Business model</p>
                    <p className="mt-1 text-sm text-slate-800">{project.businessModel}</p>
                  </div>
                  <div className="premium-card p-4">
                    <p className="text-xs text-muted-foreground">Timeline</p>
                    <p className="mt-1 text-sm text-slate-800">{project.timeline}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="financial" className="mt-6 space-y-4">
                {showLocked && !project.financialProjections ? (
                  <LockedPanel href={ROUTES.MEMBERSHIP} label="financial analysis" />
                ) : (
                  <>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <Metric label="Required" value={formatCurrency(project.requiredInvestment)} />
                      <Metric label="Raised" value={formatCurrency(project.currentFunding)} />
                      <Metric label="Expected ROI" value={formatPercent(project.expectedRoi)} />
                    </div>
                    <div className="premium-card space-y-3 p-5">
                      <h3 className="font-display font-semibold">Revenue model</h3>
                      <p className="text-sm text-muted-foreground whitespace-pre-line">
                        {project.revenueModel}
                      </p>
                      <h3 className="font-display font-semibold pt-2">Projections</h3>
                      <p className="text-sm text-muted-foreground whitespace-pre-line">
                        {project.financialProjections}
                      </p>
                      <h3 className="font-display font-semibold pt-2">Investment plan</h3>
                      <p className="text-sm text-muted-foreground whitespace-pre-line">
                        {project.investmentPlan}
                      </p>
                    </div>
                  </>
                )}
              </TabsContent>

              <TabsContent value="team" className="mt-6">
                {showLocked || !project.team?.length ? (
                  <LockedPanel href={ROUTES.MEMBERSHIP} label="team information" />
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {project.team.map((member) => (
                      <div key={member.id} className="premium-card p-5">
                        <h3 className="font-display font-semibold">{member.name}</h3>
                        <p className="text-sm text-blue-600">
                          {member.position} · {member.role}
                        </p>
                        <p className="mt-2 text-sm text-muted-foreground">{member.biography}</p>
                        <p className="mt-2 text-xs text-slate-500">{member.experience}</p>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="documents" className="mt-6">
                {showLocked || !project.documents?.length ? (
                  <LockedPanel href={ROUTES.MEMBERSHIP} label="documents" />
                ) : (
                  <ul className="space-y-3">
                    {project.documents.map((doc) => (
                      <li
                        key={doc.id}
                        className="premium-card flex items-center justify-between gap-3 px-4 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium">{doc.name}</p>
                            <p className="text-xs text-muted-foreground capitalize">
                              {doc.category.replace("_", " ")} · {formatDate(doc.uploadedAt)}
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <a href={doc.url} target="_blank" rel="noreferrer">
                            View
                          </a>
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </TabsContent>

              <TabsContent value="updates" className="mt-6 space-y-4">
                {project.updates?.length ? (
                  project.updates.map((update) => (
                    <div key={update.id} className="premium-card p-5">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="font-display font-semibold">{update.title}</h3>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(update.createdAt)}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground whitespace-pre-line">
                        {update.content}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No updates published yet.</p>
                )}
              </TabsContent>
            </Tabs>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start animate-slide-up">
            <div className="premium-card p-6">
              <p className="text-xs text-muted-foreground">Funding progress</p>
              <p className="mt-1 font-display text-2xl font-semibold">
                {formatCurrency(project.currentFunding)}
              </p>
              <p className="text-sm text-muted-foreground">
                of {formatCurrency(project.requiredInvestment)} · {progress}%
              </p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-blue-600" style={{ width: `${progress}%` }} />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Min investment</p>
                  <p className="font-medium">{formatCurrency(project.minInvestment)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Investors</p>
                  <p className="font-medium">{project.investorCount}</p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-2">
                <Button
                  onClick={() => {
                    if (!isAuthenticated || user?.role !== "investor") {
                      toast.error("Sign in as an investor to send an offer.");
                      router.push(`${ROUTES.REGISTER}?role=investor`);
                      return;
                    }
                    if (!canSendOffers(user?.membershipTier)) {
                      toast.error("Premium membership required.");
                      router.push(ROUTES.MEMBERSHIP);
                      return;
                    }
                    setOfferOpen(true);
                  }}
                >
                  Send Investment Offer
                </Button>
                <Button variant="outline" onClick={handleMessage} disabled={busy === "message"}>
                  <MessageSquare className="h-4 w-4" />
                  {busy === "message" ? "Starting..." : "Message"}
                </Button>
                <Button variant="outline" onClick={handleSave} disabled={busy === "save"}>
                  <Bookmark className="h-4 w-4" />
                  {busy === "save" ? "Saving..." : "Save"}
                </Button>
                <Button variant="secondary" asChild>
                  <Link href={`/projects/${id}/risk-analysis`}>
                    <ShieldAlert className="h-4 w-4" />
                    View Risk Analysis
                  </Link>
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Dialog open={offerOpen} onOpenChange={setOfferOpen}>
        <DialogContent className="bg-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send investment offer</DialogTitle>
            <DialogDescription>
              Submit a structured offer for {project.title}. Communication stays on-platform.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (USD)</Label>
              <Input
                id="amount"
                type="number"
                min={project.minInvestment}
                placeholder={String(project.minInvestment)}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="conditions">Conditions</Label>
              <textarea
                id="conditions"
                rows={2}
                className="flex w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={conditions}
                onChange={(e) => setConditions(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="questions">Questions</Label>
              <textarea
                id="questions"
                rows={2}
                className="flex w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={questions}
                onChange={(e) => setQuestions(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <textarea
                id="notes"
                rows={2}
                className="flex w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            <Button className="w-full" onClick={handleOffer} disabled={busy === "offer"}>
              {busy === "offer" ? "Sending..." : "Submit offer"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <MarketingFooter />
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="premium-card p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function LockedPanel({ href, label }: { href: string; label: string }) {
  return (
    <div className="premium-card flex flex-col items-start gap-3 p-8 text-center sm:items-center">
      <Lock className="h-8 w-8 text-slate-400" />
      <p className="text-sm text-muted-foreground">
        {label.charAt(0).toUpperCase() + label.slice(1)} is available with Premium membership or
        higher.
      </p>
      <Button asChild>
        <Link href={href}>View membership plans</Link>
      </Button>
    </div>
  );
}
