"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  Bookmark,
  FileText,
  MessageSquare,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
import { MarketingHeader, MarketingFooter } from "@/components/layout/marketing-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { useI18n } from "@/hooks";
import { projectsApi, offersApi, chatApi } from "@/services/api";
import { useAuthStore } from "@/store";
import { getErrorMessage } from "@/services/api/client";
import {
  ROUTES,
  RISK_LEVELS,
} from "@/constants";
import { formatCurrency, formatPercent, formatDate } from "@/utils/format";
import { projectText, teamMemberText, updateText } from "@/i18n/localize";
import { cn } from "@/lib/utils";

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { t, locale } = useI18n();
  const { user, isAuthenticated } = useAuthStore();
  const { data: project, isLoading } = useProject(id);

  const [offerOpen, setOfferOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [conditions, setConditions] = useState("");
  const [questions, setQuestions] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState<"save" | "message" | "offer" | null>(null);

  const title = projectText(project, "title", locale);
  const description = projectText(project, "description", locale);
  const fullDescription = projectText(project, "fullDescription", locale);
  const category = projectText(project, "category", locale);
  const industry = projectText(project, "industry", locale);
  const location = projectText(project, "location", locale);
  const timeline = projectText(project, "timeline", locale);
  const revenueModel = projectText(project, "revenueModel", locale);
  const financialProjections = projectText(project, "financialProjections", locale);
  const investmentPlan = projectText(project, "investmentPlan", locale);
  const businessModel = projectText(project, "businessModel", locale);

  const handleSave = async () => {
    if (!isAuthenticated) {
      toast.error(t("projects.toastSaveLogin"));
      router.push(ROUTES.LOGIN);
      return;
    }
    setBusy("save");
    try {
      await projectsApi.save(id);
      toast.success(t("projects.toastSaved"));
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setBusy(null);
    }
  };

  const handleMessage = async () => {
    if (!isAuthenticated) {
      toast.error(t("projects.toastMessageLogin"));
      router.push(ROUTES.LOGIN);
      return;
    }
    setBusy("message");
    try {
      const { data } = await chatApi.start({ projectId: id });
      toast.success(t("projects.toastConversationStarted"));
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
      toast.error(t("projects.toastOfferLogin"));
      return;
    }
    const parsed = parseFloat(amount);
    if (!parsed || parsed <= 0) {
      toast.error(t("projects.toastInvalidAmount"));
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
      toast.success(t("projects.toastOfferSent"));
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
          <h1 className="font-display text-2xl font-semibold">{t("projects.notFound")}</h1>
          <Button className="mt-6" asChild>
            <Link href={ROUTES.PROJECTS}>{t("projects.backToMarketplace")}</Link>
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
  const remainingFunding = Math.max(0, project.requiredInvestment - project.currentFunding);

  const verification = (() => {
    switch (project.status) {
      case "published":
      case "funded":
      case "closed":
        return { label: "Verified", className: "border-emerald-200 bg-emerald-50 text-emerald-700" };
      case "pending_review":
        return { label: "Under Review", className: "border-amber-200 bg-amber-50 text-amber-700" };
      case "draft":
        return {
          label: "Additional Information Required",
          className: "border-blue-200 bg-blue-50 text-blue-700",
        };
      case "rejected":
      default:
        return { label: "Not Verified", className: "border-slate-200 bg-slate-100 text-slate-700" };
    }
  })();

  return (
    <div className="min-h-screen bg-white">
      <MarketingHeader />

      <div className="container-narrow section-pad py-10 animate-fade-in">
        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-slate-100">
              <Image
                src={project.image}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width:1024px) 100vw, 60vw"
                priority
              />
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <Badge variant="outline" className={cn(verification.className)}>
                {verification.label}
              </Badge>
              <Badge variant="outline">{category}</Badge>
              {risk && (
                <Badge className={cn("border", risk.bg, risk.color)}>
                  {project.riskLevel === "low"
                    ? t("projects.lowRisk")
                    : project.riskLevel === "high"
                      ? t("projects.highRisk")
                      : t("projects.mediumRisk")}
                </Badge>
              )}
            </div>
            <h1 className="mt-4 font-display text-3xl font-semibold text-slate-900 md:text-4xl">
              {title}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {location} · {industry} · {t("projects.stage")}: {project.stage.replace("_", " ")}
            </p>

            {/* Content is not subscription-gated. */}

            <Tabs defaultValue="overview" className="mt-8">
              <TabsList className="w-full justify-start overflow-x-auto">
                <TabsTrigger value="overview">{t("projects.overview")}</TabsTrigger>
                <TabsTrigger value="financial">{t("projects.financialShort")}</TabsTrigger>
                <TabsTrigger value="team">{t("projects.team")}</TabsTrigger>
                <TabsTrigger value="documents">{t("projects.documents")}</TabsTrigger>
                <TabsTrigger value="updates">{t("projects.updates")}</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6 space-y-4">
                <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                  {fullDescription || description}
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="premium-card p-4">
                    <p className="text-xs text-muted-foreground">Industry</p>
                    <p className="mt-1 text-sm text-slate-800">{industry}</p>
                  </div>
                  <div className="premium-card p-4">
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="mt-1 text-sm text-slate-800">{location}</p>
                  </div>
                  <div className="premium-card p-4">
                    <p className="text-xs text-muted-foreground">Stage</p>
                    <p className="mt-1 text-sm text-slate-800">{project.stage.replace("_", " ")}</p>
                  </div>
                  <div className="premium-card p-4">
                    <p className="text-xs text-muted-foreground">Founded</p>
                    <p className="mt-1 text-sm text-slate-800">{formatDate(project.createdAt)}</p>
                  </div>
                  <div className="premium-card p-4">
                    <p className="text-xs text-muted-foreground">Project owner</p>
                    <p className="mt-1 text-sm text-slate-800">{project.ownerName || "—"}</p>
                  </div>
                  <div className="premium-card p-4">
                    <p className="text-xs text-muted-foreground">Team size</p>
                    <p className="mt-1 text-sm text-slate-800">{project.team.length} members</p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="premium-card p-4">
                    <p className="text-xs text-muted-foreground">Business model</p>
                    <p className="mt-1 text-sm text-slate-800 whitespace-pre-line">{businessModel}</p>
                  </div>
                  <div className="premium-card p-4">
                    <p className="text-xs text-muted-foreground">Growth strategy</p>
                    <p className="mt-1 text-sm text-slate-800 whitespace-pre-line">{timeline}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="financial" className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <Metric
                    label={t("projects.required")}
                    value={formatCurrency(project.requiredInvestment)}
                  />
                  <Metric
                    label={t("projects.raised")}
                    value={formatCurrency(project.currentFunding)}
                  />
                  <Metric
                    label={t("projects.expectedRoi")}
                    value={formatPercent(project.expectedRoi)}
                  />
                </div>
                <div className="premium-card space-y-3 p-5">
                  <h3 className="font-display font-semibold">{t("projects.revenueModel")}</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{revenueModel}</p>
                  <h3 className="font-display font-semibold pt-2">{t("projects.projections")}</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{financialProjections}</p>
                  <h3 className="font-display font-semibold pt-2">{t("projects.investmentPlan")}</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{investmentPlan}</p>
                </div>
              </TabsContent>

              <TabsContent value="team" className="mt-6">
                {project.team?.length ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="premium-card p-5">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {(project.ownerName || "Founder")
                              .split(" ")
                              .filter(Boolean)
                              .slice(0, 2)
                              .map((p) => p[0]?.toUpperCase())
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-display font-semibold">{project.ownerName || "Founder"}</h3>
                          <p className="text-sm text-blue-600">Founder</p>
                          <p className="mt-2 text-sm text-muted-foreground">
                            {project.ownerName ? `Project owner and founder.` : "—"}
                          </p>
                        </div>
                      </div>
                    </div>
                    {project.team.map((member) => (
                      <div key={member.id} className="premium-card p-5">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-10 w-10">
                            {member.avatar ? (
                              <AvatarImage alt={member.name} src={member.avatar} />
                            ) : (
                              <AvatarFallback>
                                {member.name
                                  .split(" ")
                                  .filter(Boolean)
                                  .slice(0, 2)
                                  .map((p) => p[0]?.toUpperCase())
                                  .join("")}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-display font-semibold">{member.name}</h3>
                            <p className="text-sm text-blue-600">
                              {teamMemberText(member, "position", locale)} · {member.role}
                            </p>
                            <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                              {teamMemberText(member, "biography", locale)}
                            </p>
                            <p className="mt-2 text-xs text-slate-500">
                              {teamMemberText(member, "experience", locale)}
                            </p>
                            {member.portfolio ? (
                              <a
                                href={member.portfolio}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-3 inline-flex items-center text-sm font-medium text-blue-700 underline underline-offset-4"
                              >
                                View profile
                              </a>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">{t("projects.noTeam")}</p>
                )}
              </TabsContent>

              <TabsContent value="documents" className="mt-6">
                {project.documents?.length ? (
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
                            {t("common.view")}
                          </a>
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">{t("projects.noDocuments")}</p>
                )}
              </TabsContent>

              <TabsContent value="updates" className="mt-6 space-y-4">
                {project.updates?.length ? (
                  project.updates.map((update) => (
                    <div key={update.id} className="premium-card p-5">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="font-display font-semibold">
                          {updateText(update, "title", locale)}
                        </h3>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(update.createdAt)}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground whitespace-pre-line">
                        {updateText(update, "content", locale)}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">{t("projects.noUpdates")}</p>
                )}
              </TabsContent>
            </Tabs>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start animate-slide-up">
            <div className="premium-card p-6">
              <p className="text-xs text-muted-foreground">{t("projects.fundingProgress")}</p>
              <p className="mt-1 font-display text-2xl font-semibold">
                {formatCurrency(project.currentFunding)}
              </p>
              <p className="text-sm text-muted-foreground">
                {t("projects.ofAmount", {
                  amount: formatCurrency(project.requiredInvestment),
                  progress,
                })}
              </p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-blue-600" style={{ width: `${progress}%` }} />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Required amount</p>
                  <p className="font-medium">{formatCurrency(project.requiredInvestment)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Remaining</p>
                  <p className="font-medium">{formatCurrency(remainingFunding)}</p>
                </div>
                <div className="col-span-2">
                  <div className="mt-1 h-px bg-border/70" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t("projects.minInvestment")}</p>
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
                      toast.error(t("projects.toastOfferSignIn"));
                      router.push(`${ROUTES.REGISTER}?role=investor`);
                      return;
                    }
                    setOfferOpen(true);
                  }}
                >
                  {t("projects.sendOffer")}
                </Button>
                <Button variant="outline" onClick={handleMessage} disabled={busy === "message"}>
                  <MessageSquare className="h-4 w-4" />
                  {busy === "message" ? t("common.starting") : t("projects.message")}
                </Button>
                <Button variant="outline" onClick={handleSave} disabled={busy === "save"}>
                  <Bookmark className="h-4 w-4" />
                  {busy === "save" ? t("common.saving") : t("common.save")}
                </Button>
                <Button variant="secondary" asChild>
                  <Link href={`/projects/${id}/risk-analysis`}>
                    <ShieldAlert className="h-4 w-4" />
                    {t("projects.viewRiskAnalysis")}
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
            <DialogTitle>{t("projects.sendOfferTitle")}</DialogTitle>
            <DialogDescription>
              {t("projects.sendOfferDesc", { title })}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">{t("projects.amountUsd")}</Label>
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
              <Label htmlFor="conditions">{t("projects.conditions")}</Label>
              <textarea
                id="conditions"
                rows={2}
                className="flex w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={conditions}
                onChange={(e) => setConditions(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="questions">{t("projects.questions")}</Label>
              <textarea
                id="questions"
                rows={2}
                className="flex w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={questions}
                onChange={(e) => setQuestions(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">{t("projects.notes")}</Label>
              <textarea
                id="notes"
                rows={2}
                className="flex w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            <Button className="w-full" onClick={handleOffer} disabled={busy === "offer"}>
              {busy === "offer" ? t("common.sending") : t("projects.submitOffer")}
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
