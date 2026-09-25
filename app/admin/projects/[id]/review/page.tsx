"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminMarketplaceApi, chatApi } from "@/services/api";
import { QUERY_KEYS, ROUTES, STATUS_COLORS } from "@/constants";
import { getErrorMessage } from "@/services/api/client";
import { formatCurrency, formatDate, formatPercent } from "@/utils/format";
import { useI18n } from "@/hooks";
import { useSetPageTitle } from "@/components/providers/page-title-provider";
import { PageHeader } from "@/components/shared/page-header";
import { PanelPage } from "@/components/shared/panel-page";
import { PanelCard } from "@/components/shared/panel-card";
import { EmptyState } from "@/components/shared/empty-state";
import { PanelBlockSkeleton } from "@/components/shared/loading-skeleton";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { projectText, teamMemberText, teamRoleLabel, docCategoryLabel } from "@/i18n/localize";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { DocumentActions } from "@/components/shared/document-actions";
import { documentOpenHref } from "@/utils/document-url";
import type { ProjectReviewEntry } from "@/types";
import {
  ArrowLeft,
  Archive,
  ExternalLink,
  FileText,
  FolderKanban,
  MessageSquare,
  ShieldAlert,
  Trash2,
} from "lucide-react";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <PanelCard padding="lg" className="space-y-4 md:p-6">
      <h3 className="font-display text-lg font-semibold text-foreground">{title}</h3>
      {children}
    </PanelCard>
  );
}

function Field({ label, value }: { label: string; value?: React.ReactNode }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="mt-1 text-sm leading-relaxed text-foreground">{value}</div>
    </div>
  );
}

function decisionLabel(t: (k: string) => string, decision: ProjectReviewEntry["decision"]) {
  switch (decision) {
    case "approved":
      return t("admin.decisionApproved");
    case "rejected":
      return t("admin.decisionRejected");
    case "resubmitted":
      return t("admin.decisionResubmitted");
    default:
      return t("admin.decisionSubmitted");
  }
}

export default function AdminProjectReviewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { t, locale } = useI18n();

  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectConfirmOpen, setRejectConfirmOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: [QUERY_KEYS.PROJECTS, "admin-review", id],
    queryFn: async () => (await adminMarketplaceApi.getProject(id)).data.data,
    enabled: !!id,
  });

  const project = data?.project;
  const owner = data?.owner;
  const risk = data?.riskAnalysis;
  const history = data?.reviewHistory ?? [];

  const title = projectText(project, "title", locale);
  const description = projectText(project, "description", locale);
  const fullDescription = projectText(project, "fullDescription", locale);
  const category = projectText(project, "category", locale);
  const industry = projectText(project, "industry", locale);
  const location = projectText(project, "location", locale);
  const businessModel = projectText(project, "businessModel", locale);
  const revenueModel = projectText(project, "revenueModel", locale);
  const projections = projectText(project, "financialProjections", locale);
  const investmentPlan = projectText(project, "investmentPlan", locale);

  useSetPageTitle(title || t("admin.reviewTitle"), [
    { label: t("admin.projectsTitle"), href: ROUTES.ADMIN_PROJECTS },
    { label: title || t("admin.reviewTitle") },
  ]);

  const mediaDocs = useMemo(
    () =>
      (project?.documents || []).filter(
        (d) => d.category === "image" || d.category === "video"
      ),
    [project]
  );
  const fileDocs = useMemo(
    () =>
      (project?.documents || []).filter(
        (d) => d.category !== "image" && d.category !== "video"
      ),
    [project]
  );

  const canDecide =
    project?.status === "pending_review" || project?.status === "draft";
  const hasInvestors =
    (project?.investorCount ?? 0) > 0 || (project?.currentFunding ?? 0) > 0;
  const canArchive =
    !!project &&
    project.status !== "archived" &&
    project.status !== "rejected" &&
    project.status !== "draft";
  const canRemove = !!project && project.status !== "funded";

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROJECTS] });
  };

  const approveMutation = useMutation({
    mutationFn: () => adminMarketplaceApi.approveProject(id),
    onSuccess: () => {
      toast.success(t("admin.approvedToast"));
      setApproveOpen(false);
      invalidate();
      router.push(ROUTES.ADMIN_PROJECTS);
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const rejectMutation = useMutation({
    mutationFn: () => adminMarketplaceApi.rejectProject(id, rejectReason.trim()),
    onSuccess: () => {
      toast.success(t("admin.rejectedToast"));
      setRejectOpen(false);
      setRejectConfirmOpen(false);
      setRejectReason("");
      invalidate();
      router.push(ROUTES.ADMIN_PROJECTS);
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const archiveMutation = useMutation({
    mutationFn: () => adminMarketplaceApi.archiveProject(id),
    onSuccess: () => {
      toast.success(t("admin.archiveToast"));
      setArchiveOpen(false);
      invalidate();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const removeMutation = useMutation({
    mutationFn: () => adminMarketplaceApi.deleteProject(id),
    onSuccess: () => {
      toast.success(t("admin.removeToast"));
      setRemoveOpen(false);
      invalidate();
      router.push(ROUTES.ADMIN_PROJECTS);
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const messageOwnerMutation = useMutation({
    mutationFn: () =>
      chatApi.start({
        userId: owner?.id || project?.ownerId,
        projectId: project?.id,
      }),
    onSuccess: (res) => {
      const conversation = res.data.data;
      toast.success(t("messages.startedToast"));
      router.push(
        conversation?.id
          ? `${ROUTES.ADMIN_MESSAGES}?c=${conversation.id}`
          : ROUTES.ADMIN_MESSAGES
      );
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const openRejectConfirm = () => {
    if (rejectReason.trim().length < 20) {
      toast.error(t("admin.rejectReasonRequired"));
      return;
    }
    setRejectOpen(false);
    setRejectConfirmOpen(true);
  };

  if (isLoading) {
    return (
      <PanelPage>
        <PanelBlockSkeleton height="h-64" />
      </PanelPage>
    );
  }

  if (isError || !project) {
    return (
      <PanelPage>
        <EmptyState
          icon={FolderKanban}
          title={t("admin.notFound")}
          action={
            <Button asChild variant="outline">
              <Link href={ROUTES.ADMIN_PROJECTS}>{t("admin.backToProjects")}</Link>
            </Button>
          }
        />
      </PanelPage>
    );
  }

  return (
    <PanelPage className="pb-28">
      <div className="flex flex-wrap items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href={ROUTES.ADMIN_PROJECTS}>
            <ArrowLeft className="h-4 w-4" />
            {t("admin.backToProjects")}
          </Link>
        </Button>
      </div>

      <PageHeader
        variant="minimal"
        title={title}
        description={`${t("admin.submissionDate")}: ${formatDate(project.submittedAt || project.createdAt)} · ${t("admin.submittedBy")}: ${owner ? `${owner.firstName} ${owner.lastName}` : project.ownerName}`}
        actions={
          <Badge
            className={cn(
              "border",
              project.status === "pending_review"
                ? "border-amber-200 bg-amber-50 text-amber-900"
                : STATUS_COLORS[project.status]
            )}
          >
            {project.status === "pending_review"
              ? t("admin.reviewStatus")
              : project.status.replace(/_/g, " ")}
          </Badge>
        }
      />

      <Section title={t("admin.overview")}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t("admin.category")} value={category} />
          <Field label={t("admin.industry")} value={industry} />
          <Field label={t("admin.location")} value={location} />
          <Field
            label={t("admin.stage")}
            value={t(`projects.stages.${project.stage ?? "idea"}`)}
          />
          <Field
            label={t("admin.status")}
            value={
              project.status === "pending_review"
                ? t("admin.statusPending")
                : project.status === "published"
                  ? t("admin.statusPublished")
                  : project.status === "rejected"
                    ? t("admin.statusRejected")
                    : project.status === "draft"
                      ? t("admin.statusDraft")
                      : project.status === "funded"
                        ? t("admin.statusFunded")
                        : project.status === "funding"
                          ? t("admin.statusFunding")
                          : project.status === "archived"
                            ? t("admin.statusArchived")
                            : project.status === "removal_requested"
                              ? t("admin.statusRemovalRequested")
                              : project.status === "closed"
                                ? t("admin.statusClosed")
                                : project.status
            }
          />
          <Field label={t("admin.created")} value={formatDate(project.createdAt)} />
        </div>
        <Field label={t("projects.overview")} value={description} />
        {fullDescription && fullDescription !== description ? (
          <div className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
            {fullDescription}
          </div>
        ) : null}
      </Section>

      <Section title={t("admin.funding")}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field
            label={t("admin.requiredInvestment")}
            value={formatCurrency(project.requiredInvestment)}
          />
          <Field
            label={t("admin.minInvestment")}
            value={formatCurrency(project.minInvestment)}
          />
          <Field
            label={t("admin.currentFunding")}
            value={formatCurrency(project.currentFunding)}
          />
          <Field
            label={t("admin.fundingTarget")}
            value={formatCurrency(project.requiredInvestment)}
          />
          <Field
            label={t("admin.fundingDeadline")}
            value={project.endDate ? formatDate(project.endDate) : "—"}
          />
          <Field label={t("projects.expectedRoi")} value={formatPercent(project.expectedRoi)} />
        </div>
      </Section>

      <Section title={t("admin.businessInfo")}>
        <div className="space-y-4">
          <Field label={t("admin.businessModel")} value={businessModel} />
          <Field label={t("admin.revenueModel")} value={revenueModel} />
          <Field label={t("projects.timeline")} value={projectText(project, "timeline", locale)} />
        </div>
      </Section>

      <Section title={t("admin.financialInfo")}>
        <div className="space-y-4">
          <Field label={t("admin.projections")} value={projections} />
          <Field label={t("admin.investmentPlan")} value={investmentPlan} />
          {Array.isArray(project.budgetBreakdown) && project.budgetBreakdown.length ? (
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {t("admin.budgetBreakdown")}
              </p>
              <ul className="mt-2 space-y-1 text-sm text-foreground">
                {project.budgetBreakdown.map((item, index) => (
                  <li
                    key={`${item.label}-${index}`}
                    className="flex justify-between gap-4 border-b border-border/50 py-1.5"
                  >
                    <span>{locale === "hy" && item.labelHy ? item.labelHy : item.label}</span>
                    <span className="tabular-nums font-medium">{item.percent}%</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {Array.isArray(project.phases) && project.phases.length ? (
            <div className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {t("projects.phases")}
              </p>
              {project.phases.map((phase) => (
                <div key={phase.id} className="rounded-xl border border-border/70 bg-muted/50 p-3">
                  <p className="font-medium text-foreground">
                    {locale === "hy" && phase.titleHy ? phase.titleHy : phase.title}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatCurrency(phase.budgetAsk)}
                    {phase.durationWeeks
                      ? ` · ${t("projects.durationWeeks", { count: phase.durationWeeks })}`
                      : ""}
                  </p>
                  <p className="mt-2 text-sm text-foreground">
                    {locale === "hy" && phase.descriptionHy
                      ? phase.descriptionHy
                      : phase.description}
                  </p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </Section>

      <Section title={t("admin.team")}>
        {!project.team?.length ? (
          <p className="text-sm text-muted-foreground">{t("admin.noTeam")}</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {project.team.map((member) => (
              <div key={member.id} className="rounded-xl border border-border/70 p-4">
                <p className="font-semibold text-foreground">{member.name}</p>
                <p className="text-sm text-primary">
                  {teamMemberText(member, "position", locale)} · {teamRoleLabel(locale, member.role)}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {teamMemberText(member, "experience", locale)}
                </p>
                <p className="mt-2 text-sm text-foreground">
                  {teamMemberText(member, "biography", locale)}
                </p>
                {member.portfolio ? (
                  <a
                    href={member.portfolio}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    {t("admin.profileLink")} <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section title={t("admin.documents")}>
        {!fileDocs.length ? (
          <p className="text-sm text-muted-foreground">{t("admin.noDocuments")}</p>
        ) : (
          <ul className="space-y-2">
            {fileDocs.map((doc) => (
              <li
                key={doc.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/70 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {locale === "hy" && doc.nameHy ? doc.nameHy : doc.name}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {docCategoryLabel(locale, doc.category)} · {formatDate(doc.uploadedAt)}
                    </p>
                  </div>
                </div>
                <DocumentActions url={doc.url} name={doc.name} />
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title={t("admin.media")}>
        {project.image || mediaDocs.length ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {project.image ? (
              <div className="relative aspect-video overflow-hidden rounded-xl bg-muted">
                <Image src={project.image} alt={title} fill className="object-cover" />
              </div>
            ) : null}
            {mediaDocs.map((doc) => {
              const href = documentOpenHref(doc.url);
              if (!href) {
                return (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => toast.error(t("common.fileUnavailable"))}
                    className="rounded-xl border border-border/70 p-4 text-left text-sm hover:bg-muted"
                  >
                    {doc.name}
                  </button>
                );
              }
              return (
                <a
                  key={doc.id}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-border/70 p-4 text-sm hover:bg-muted"
                >
                  {doc.name}
                </a>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">—</p>
        )}
      </Section>

      <Section title={t("admin.riskInfo")}>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label={t("admin.riskLevel")} value={project.riskLevel} />
          <Field label={t("admin.riskScore")} value={risk ? `${risk.score}/100` : "—"} />
          <Field
            label={t("projects.progress")}
            value={risk ? `${risk.completeness}%` : "—"}
          />
        </div>
        {risk?.summary ? (
          <p className="text-sm leading-relaxed text-foreground">
            {locale === "hy" && risk.summaryHy ? risk.summaryHy : risk.summary}
          </p>
        ) : null}
        {risk?.warningIndicators?.length ? (
          <div>
            <p className="mb-2 flex items-center gap-2 text-sm font-medium text-amber-900">
              <ShieldAlert className="h-4 w-4" />
              {t("admin.warnings")}
            </p>
            <ul className="space-y-2 text-sm text-foreground">
              {risk.warningIndicators.map((w, index) => (
                <li
                  key={`${w.label}-${index}`}
                  className="rounded-lg border border-amber-100 bg-amber-50/60 px-3 py-2"
                >
                  <span className="font-medium">
                    {locale === "hy" && w.labelHy ? w.labelHy : w.label}
                  </span>
                  <span className="mt-0.5 block text-muted-foreground">
                    {locale === "hy" && w.detailHy ? w.detailHy : w.detail}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {risk?.missingDocuments?.length ? (
          <div>
            <p className="mb-2 text-sm font-medium text-foreground">{t("admin.missingInfo")}</p>
            <ul className="list-inside list-disc text-sm text-muted-foreground">
              {(locale === "hy" && risk.missingDocumentsHy?.length
                ? risk.missingDocumentsHy
                : risk.missingDocuments
              ).map((item, index) => (
                <li key={`${item}-${index}`}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </Section>

      <Section title={t("admin.ownerSection")}>
        {owner ? (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label={t("admin.submittedBy")}
                value={`${owner.firstName} ${owner.lastName}`}
              />
              <Field label={t("admin.ownerEmail")} value={owner.email} />
              <Field label={t("admin.ownerKyc")} value={owner.kycStatus} />
              <Field label={t("admin.ownerProjects")} value={owner.previousProjects} />
              <Field label={t("admin.ownerJoined")} value={formatDate(owner.createdAt)} />
              {owner.companyName ? (
                <Field label={t("admin.ownerCompany")} value={owner.companyName} />
              ) : null}
              {owner.bio ? <Field label={t("admin.ownerBio")} value={owner.bio} /> : null}
            </div>
            <Button
              type="button"
              variant="outline"
              disabled={messageOwnerMutation.isPending || !owner.id}
              onClick={() => messageOwnerMutation.mutate()}
            >
              <MessageSquare className="h-4 w-4" />
              {t("messages.startChatAction")}
            </Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{project.ownerName}</p>
        )}
      </Section>

      <Section title={t("admin.reviewHistory")}>
        {!history.length ? (
          <p className="text-sm text-muted-foreground">{t("admin.noHistory")}</p>
        ) : (
          <ol className="space-y-3">
            {[...history].reverse().map((entry, index) => (
              <li
                key={`${entry.id || "entry"}-${entry.decision}-${entry.createdAt || index}-${index}`}
                className="rounded-xl border border-border/70 px-4 py-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium text-foreground">
                    {decisionLabel(t, entry.decision)}
                    {entry.reviewerName ? ` · ${entry.reviewerName}` : ""}
                  </p>
                  <p className="text-xs text-muted-foreground">{formatDate(entry.createdAt)}</p>
                </div>
                {entry.reason ? (
                  <p className="mt-2 text-sm text-foreground whitespace-pre-wrap">{entry.reason}</p>
                ) : null}
              </li>
            ))}
          </ol>
        )}
      </Section>

      {hasInvestors ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm text-amber-950">
          <div className="flex items-start gap-2">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{t("admin.hasInvestorsWarning")}</p>
          </div>
        </div>
      ) : null}

      {canDecide ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-end gap-3 px-4 py-4 sm:px-6">
            <Button
              variant="destructive"
              disabled={rejectMutation.isPending || approveMutation.isPending}
              onClick={() => setRejectOpen(true)}
            >
              {t("admin.reject")}
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700"
              disabled={approveMutation.isPending || rejectMutation.isPending}
              onClick={() => setApproveOpen(true)}
            >
              {t("admin.approve")}
            </Button>
          </div>
        </div>
      ) : canArchive || canRemove ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-end gap-3 px-4 py-4 sm:px-6">
            {canArchive ? (
              <Button
                variant="outline"
                disabled={archiveMutation.isPending || removeMutation.isPending}
                onClick={() => setArchiveOpen(true)}
              >
                <Archive className="h-4 w-4" />
                {t("admin.archiveProject")}
              </Button>
            ) : null}
            {canRemove ? (
              <Button
                variant="destructive"
                disabled={
                  hasInvestors ||
                  archiveMutation.isPending ||
                  removeMutation.isPending
                }
                title={hasInvestors ? t("admin.removeBlockedInvestors") : undefined}
                onClick={() => {
                  if (hasInvestors) {
                    toast.error(t("admin.removeBlockedInvestors"));
                    return;
                  }
                  setRemoveOpen(true);
                }}
              >
                <Trash2 className="h-4 w-4" />
                {t("admin.removeProject")}
              </Button>
            ) : null}
          </div>
        </div>
      ) : null}

      <ConfirmDialog
        open={archiveOpen}
        onOpenChange={setArchiveOpen}
        title={t("admin.archiveConfirmTitle")}
        description={t("admin.archiveConfirmBody")}
        confirmLabel={t("admin.archiveProject")}
        loading={archiveMutation.isPending}
        onConfirm={() => archiveMutation.mutate()}
      />

      <ConfirmDialog
        open={removeOpen}
        onOpenChange={setRemoveOpen}
        title={t("admin.removeConfirmTitle")}
        description={t("admin.removeConfirmBody")}
        confirmLabel={t("admin.removeProject")}
        loading={removeMutation.isPending}
        onConfirm={() => removeMutation.mutate()}
      />

      <Dialog open={approveOpen} onOpenChange={setApproveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("admin.approveConfirmTitle")}</DialogTitle>
            <DialogDescription>{t("admin.approveConfirmBody")}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveOpen(false)}>
              {t("admin.cancel")}
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700"
              disabled={approveMutation.isPending}
              onClick={() => approveMutation.mutate()}
            >
              {t("admin.confirmApprove")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("admin.rejectTitle")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="reject-reason">{t("admin.rejectReasonLabel")}</Label>
            <Textarea
              id="reject-reason"
              rows={5}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder={t("admin.rejectReasonPlaceholder")}
            />
            <p className="text-xs text-muted-foreground">
              {rejectReason.trim().length}/20+
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)}>
              {t("admin.cancel")}
            </Button>
            <Button variant="destructive" onClick={openRejectConfirm}>
              {t("admin.confirmReject")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={rejectConfirmOpen} onOpenChange={setRejectConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("admin.rejectConfirmTitle")}</DialogTitle>
            <DialogDescription>
              {t("admin.rejectConfirmBody")}
            </DialogDescription>
          </DialogHeader>
          <p className="rounded-xl border border-border bg-muted/50 p-3 text-sm whitespace-pre-wrap text-foreground">
            {rejectReason}
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejectConfirmOpen(false);
                setRejectOpen(true);
              }}
            >
              {t("admin.cancel")}
            </Button>
            <Button
              variant="destructive"
              disabled={rejectMutation.isPending}
              onClick={() => rejectMutation.mutate()}
            >
              {t("admin.confirmReject")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PanelPage>
  );
}
