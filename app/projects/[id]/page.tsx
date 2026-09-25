"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, usePathname, useRouter } from "next/navigation";
import {
  Bookmark,
  FileText,
  MessageSquare,
  Milestone,
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
import { DocumentActions } from "@/components/shared/document-actions";
import { ServicePaywall } from "@/components/shared/service-paywall";
import { useProject } from "@/hooks/use-marketplace";
import { useI18n } from "@/hooks";
import { projectsApi, offersApi, chatApi } from "@/services/api";
import { useAuthStore } from "@/store";
import { getErrorMessage } from "@/services/api/client";
import { ROUTES, RISK_LEVELS } from "@/constants";
import { formatCurrency, formatPercent, formatDate } from "@/utils/format";
import { projectText, teamMemberText, updateText, stageLabel, teamRoleLabel, docCategoryLabel } from "@/i18n/localize";
import { hasActiveServiceAccess } from "@/lib/rbac";
import { cn } from "@/lib/utils";

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const pathname = usePathname();
  const { t, locale } = useI18n();
  const { user, isAuthenticated } = useAuthStore();
  const { data: project, isLoading } = useProject(id);
  const isHy = locale === "hy";
  const inInvestorPanel = pathname.startsWith("/investor");
  const projectsBase = inInvestorPanel ? ROUTES.INVESTOR_PROJECTS : ROUTES.PROJECTS;
  const membershipHref = ROUTES.INVESTOR_MEMBERSHIP;

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

  const hasAccess = hasActiveServiceAccess(user);
  const needsService =
    Boolean(project?.limited) || (user?.role === "investor" && !hasAccess);

  const requireInvestorService = () => {
    if (user?.role !== "investor") return true;
    if (hasAccess) return true;
    toast.error(t("projects.toastPremiumRequired"));
    router.push(membershipHref);
    return false;
  };

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
    if (user?.role === "investor" && !hasAccess) {
      toast.error(t("projects.toastMessagePremium"));
      router.push(membershipHref);
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
    if (!hasAccess) {
      toast.error(t("projects.toastOfferPremium"));
      router.push(membershipHref);
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
      const message = getErrorMessage(error);
      toast.error(message);
      if (/kyc/i.test(message)) {
        router.push(ROUTES.INVESTOR_KYC);
      }
    } finally {
      setBusy(null);
    }
  };

  if (isLoading) {
    return (
      <div className={inInvestorPanel ? "py-4" : "min-h-screen bg-white"}>
        {!inInvestorPanel && <MarketingHeader />}
        <div className={inInvestorPanel ? "" : "container-narrow section-pad py-16"}>
          <CardSkeleton className="max-w-4xl" />
        </div>
        {!inInvestorPanel && <MarketingFooter />}
      </div>
    );
  }

  if (!project) {
    return (
      <div className={inInvestorPanel ? "py-4" : "min-h-screen bg-white"}>
        {!inInvestorPanel && <MarketingHeader />}
        <div
          className={
            inInvestorPanel ? "py-16 text-center" : "container-narrow section-pad py-24 text-center"
          }
        >
          <h1 className="font-display text-2xl font-semibold">{t("projects.notFound")}</h1>
          <Button className="mt-6" asChild>
            <Link href={projectsBase}>{t("projects.backToMarketplace")}</Link>
          </Button>
        </div>
        {!inInvestorPanel && <MarketingFooter />}
      </div>
    );
  }

  const risk = RISK_LEVELS.find((r) => r.value === project.riskLevel);
  const progress = Math.min(
    100,
    Math.round((project.currentFunding / Math.max(project.requiredInvestment, 1)) * 100)
  );
  const remainingFunding = Math.max(0, project.requiredInvestment - project.currentFunding);
  const phases = [...(Array.isArray(project.phases) ? project.phases : [])].sort(
    (a, b) => a.sortOrder - b.sortOrder
  );

  const verification = (() => {
    switch (project.status) {
      case "published":
      case "funded":
      case "closed":
        return { label: t("projects.statusVerified"), className: "border-emerald-200 bg-emerald-50 text-emerald-700" };
      case "pending_review":
        return { label: t("projects.statusUnderReview"), className: "border-amber-200 bg-amber-50 text-amber-700" };
      case "draft":
        return {
          label: t("projects.statusNeedsInfo"),
          className: "border-teal-200 bg-teal-50 text-teal-800",
        };
      case "rejected":
      default:
        return { label: t("projects.statusNotVerified"), className: "border-slate-200 bg-slate-100 text-slate-700" };
    }
  })();

  return (
    <div className={inInvestorPanel ? "animate-fade-in" : "min-h-screen bg-white"}>
      {!inInvestorPanel && <MarketingHeader />}

      <div
        className={
          inInvestorPanel ? "animate-fade-in py-2" : "container-narrow section-pad py-10 animate-fade-in"
        }
      >
        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-slate-100 shadow-glow">
              <Image
                src={project.image}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width:1024px) 100vw, 60vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent" />
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <Badge variant="outline" className={cn(verification.className)}>
                {verification.label}
              </Badge>
              {project.status === "published" && (
                <Badge
                  variant="outline"
                  className="border-teal-200 bg-teal-50 text-teal-800"
                >
                  {t("projects.badgesReviewed")}
                </Badge>
              )}
              {project.ownerKycStatus === "approved" && (
                <Badge
                  variant="outline"
                  className="border-emerald-200 bg-emerald-50 text-emerald-700"
                >
                  {t("projects.badgesKyc")}
                </Badge>
              )}
              <Badge variant="outline">{category}</Badge>
              {risk && (
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold text-white",
                    risk.bg
                  )}
                >
                  {project.riskLevel === "low"
                    ? t("projects.lowRisk")
                    : project.riskLevel === "high"
                      ? t("projects.highRisk")
                      : t("projects.mediumRisk")}
                </span>
              )}
            </div>
            <h1 className="mt-4 font-display text-3xl font-semibold text-slate-900 md:text-4xl">
              {title}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {location} · {industry} · {t("projects.stage")}: {stageLabel(locale, project.stage)}
            </p>

            <Tabs defaultValue="overview" className="mt-8">
              <TabsList className="w-full justify-start overflow-x-auto">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-teal-50 data-[state=active]:text-teal-900"
                >
                  {t("projects.overview")}
                </TabsTrigger>
                <TabsTrigger
                  value="financial"
                  className="data-[state=active]:bg-teal-50 data-[state=active]:text-teal-900"
                >
                  {t("projects.financialShort")}
                </TabsTrigger>
                <TabsTrigger
                  value="team"
                  className="data-[state=active]:bg-teal-50 data-[state=active]:text-teal-900"
                >
                  {t("projects.team")}
                </TabsTrigger>
                <TabsTrigger
                  value="documents"
                  className="data-[state=active]:bg-teal-50 data-[state=active]:text-teal-900"
                >
                  {t("projects.documents")}
                </TabsTrigger>
                <TabsTrigger
                  value="updates"
                  className="data-[state=active]:bg-teal-50 data-[state=active]:text-teal-900"
                >
                  {t("projects.updates")}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6 space-y-4">
                <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                  {fullDescription || description}
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="premium-card p-4">
                    <p className="text-xs text-muted-foreground">{t("projects.industry")}</p>
                    <p className="mt-1 text-sm text-slate-800">{industry}</p>
                  </div>
                  <div className="premium-card p-4">
                    <p className="text-xs text-muted-foreground">{t("projects.location")}</p>
                    <p className="mt-1 text-sm text-slate-800">{location}</p>
                  </div>
                  <div className="premium-card p-4">
                    <p className="text-xs text-muted-foreground">{t("projects.stage")}</p>
                    <p className="mt-1 text-sm text-slate-800">{stageLabel(locale, project.stage)}</p>
                  </div>
                  <div className="premium-card p-4">
                    <p className="text-xs text-muted-foreground">{t("projects.founded")}</p>
                    <p className="mt-1 text-sm text-slate-800">{formatDate(project.createdAt)}</p>
                  </div>
                  <div className="premium-card p-4">
                    <p className="text-xs text-muted-foreground">{t("admin.ownerSection")}</p>
                    <p className="mt-1 text-sm text-slate-800">{project.ownerName || "—"}</p>
                  </div>
                  <div className="premium-card p-4">
                    <p className="text-xs text-muted-foreground">{t("projects.teamSize")}</p>
                    <p className="mt-1 text-sm text-slate-800">
                      {t("common.membersCount", { count: project.team.length })}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="premium-card p-4">
                    <p className="text-xs text-muted-foreground">{t("projects.businessModel")}</p>
                    <p className="mt-1 text-sm text-slate-800 whitespace-pre-line">{businessModel}</p>
                  </div>
                  <div className="premium-card p-4">
                    <p className="text-xs text-muted-foreground">{t("projects.growthStrategy")}</p>
                    <p className="mt-1 text-sm text-slate-800 whitespace-pre-line">{timeline}</p>
                  </div>
                </div>

                {phases.length > 0 && (
                  <div className="space-y-3">
                    <h2 className="font-display text-lg font-semibold text-slate-900">
                      {t("projects.phases")}
                    </h2>
                    <ol className="space-y-3">
                      {phases.map((phase, index) => {
                        const phaseTitle =
                          isHy && phase.titleHy?.trim() ? phase.titleHy : phase.title;
                        const phaseDesc =
                          isHy && phase.descriptionHy?.trim()
                            ? phase.descriptionHy
                            : phase.description;
                        return (
                          <li key={phase.id} className="premium-card p-4">
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-teal-800">
                                  {t("common.phaseLabel", { n: index + 1 })}
                                </p>
                                <h3 className="mt-1 font-display font-semibold text-slate-900">
                                  {phaseTitle}
                                </h3>
                              </div>
                              {hasAccess && !needsService ? (
                                <p className="text-sm font-medium text-teal-900">
                                  {t("projects.phaseBudget")}: {formatCurrency(phase.budgetAsk)}
                                </p>
                              ) : null}
                            </div>
                            {phaseDesc ? (
                              <p className="mt-2 text-sm text-muted-foreground whitespace-pre-line">
                                {phaseDesc}
                              </p>
                            ) : null}
                            {phase.durationWeeks ? (
                              <p className="mt-2 text-xs text-slate-500">
                                {t("projects.durationWeeks", { count: phase.durationWeeks })}
                              </p>
                            ) : null}
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                )}

                {needsService && (
                  <ServicePaywall className="premium-card flex flex-col items-start gap-3 border-teal-100 bg-teal-50/50 p-5" />
                )}
              </TabsContent>

              <TabsContent value="financial" className="mt-6 space-y-4">
                {needsService ? (
                  <ServicePaywall />
                ) : (
                  <>
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
                      <p className="text-sm text-muted-foreground whitespace-pre-line">
                        {revenueModel}
                      </p>
                      <h3 className="font-display font-semibold pt-2">{t("projects.projections")}</h3>
                      <p className="text-sm text-muted-foreground whitespace-pre-line">
                        {financialProjections}
                      </p>
                      <h3 className="font-display font-semibold pt-2">
                        {t("projects.investmentPlan")}
                      </h3>
                      <p className="text-sm text-muted-foreground whitespace-pre-line">
                        {investmentPlan}
                      </p>
                    </div>
                  </>
                )}
              </TabsContent>

              <TabsContent value="team" className="mt-6">
                {needsService ? (
                  <ServicePaywall />
                ) : project.team?.length ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="premium-card p-5">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {(project.ownerName || t("projects.founder"))
                              .split(" ")
                              .filter(Boolean)
                              .slice(0, 2)
                              .map((p) => p[0]?.toUpperCase())
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-display font-semibold">
                            {project.ownerName || t("projects.founder")}
                          </h3>
                          <p className="text-sm text-teal-700">{t("projects.founder")}</p>
                          <p className="mt-2 text-sm text-muted-foreground">
                            {project.ownerName ? t("projects.founderBio") : "—"}
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
                            <p className="text-sm text-teal-700">
                              {teamMemberText(member, "position", locale)} ·{" "}
                              {teamRoleLabel(locale, member.role)}
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
                                className="mt-3 inline-flex items-center text-sm font-medium text-teal-800 underline underline-offset-4"
                              >
                                {t("projects.viewProfile")}
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
                {needsService ? (
                  <ServicePaywall />
                ) : project.documents?.length ? (
                  <ul className="space-y-3">
                    {project.documents.map((doc) => (
                      <li
                        key={doc.id}
                        className="premium-card flex items-center justify-between gap-3 px-4 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-teal-700" />
                          <div>
                            <p className="text-sm font-medium">{doc.name}</p>
                            <p className="text-xs text-muted-foreground capitalize">
                              {docCategoryLabel(locale, doc.category)} · {formatDate(doc.uploadedAt)}
                            </p>
                          </div>
                        </div>
                        <DocumentActions
                          url={doc.url}
                          name={doc.name}
                          showDownload={false}
                          openLabel={t("common.view")}
                        />
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

          <aside className="relative z-10 space-y-4 lg:sticky lg:top-20 lg:self-start">
            <div className="gradient-border premium-card p-6 card-glow">
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
              <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-teal-900 via-teal-700 to-emerald-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{t("projects.required")}</p>
                  <p className="truncate font-medium">{formatCurrency(project.requiredInvestment)}</p>
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{t("projects.remaining")}</p>
                  <p className="truncate font-medium">{formatCurrency(remainingFunding)}</p>
                </div>
                <div className="col-span-2">
                  <div className="mt-1 h-px bg-border/70" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{t("projects.minInvestment")}</p>
                  <p className="truncate font-medium">{formatCurrency(project.minInvestment)}</p>
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{t("projects.investors")}</p>
                  <p className="truncate font-medium">{project.investorCount}</p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-2">
                <Button
                  variant="gradient"
                  onClick={() => {
                    if (!isAuthenticated || user?.role !== "investor") {
                      toast.error(t("projects.toastOfferSignIn"));
                      router.push(`${ROUTES.REGISTER}?role=investor`);
                      return;
                    }
                    if (!hasAccess) {
                      toast.error(t("projects.toastOfferPremium"));
                      router.push(membershipHref);
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
                {user?.role === "investor" && hasAccess && (
                  <Button variant="outline" asChild>
                    <Link href={ROUTES.INVESTOR_MILESTONES}>
                      <Milestone className="h-4 w-4" />
                      {t("projects.proposeMilestones")}
                    </Link>
                  </Button>
                )}
                <Button
                  variant="secondary"
                  onClick={() => {
                    if (!requireInvestorService()) return;
                    router.push(`${projectsBase}/${id}/risk-analysis`);
                  }}
                >
                  <ShieldAlert className="h-4 w-4" />
                  {t("projects.viewRiskAnalysis")}
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
            <DialogDescription>{t("projects.sendOfferDesc", { title })}</DialogDescription>
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
            <Button
              className="w-full bg-teal-700 hover:bg-teal-800"
              onClick={handleOffer}
              disabled={busy === "offer"}
            >
              {busy === "offer" ? t("common.sending") : t("projects.submitOffer")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {!inInvestorPanel && <MarketingFooter />}
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
