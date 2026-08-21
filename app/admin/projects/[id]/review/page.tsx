"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Download,
  ExternalLink,
  FileText,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
import { adminMarketplaceApi } from "@/services/api";
import { QUERY_KEYS, ROUTES, STATUS_COLORS } from "@/constants";
import { getErrorMessage } from "@/services/api/client";
import { formatCurrency, formatDate, formatPercent } from "@/utils/format";
import { useI18n } from "@/hooks";
import { projectText, teamMemberText } from "@/i18n/localize";
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
import type { ProjectReviewEntry } from "@/types";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="premium-card space-y-4 p-5 md:p-6">
      <h3 className="font-display text-lg font-semibold text-slate-900">{title}</h3>
      {children}
    </section>
  );
}

function Field({ label, value }: { label: string; value?: React.ReactNode }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="mt-1 text-sm leading-relaxed text-slate-800">{value}</div>
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

  const openRejectConfirm = () => {
    if (rejectReason.trim().length < 20) {
      toast.error(t("admin.rejectReasonRequired"));
      return;
    }
    setRejectOpen(false);
    setRejectConfirmOpen(true);
  };

  if (isLoading) {
    return <div className="premium-card h-64 animate-pulse bg-slate-100" />;
  }

  if (isError || !project) {
    return (
      <div className="premium-card space-y-4 p-8 text-center">
        <p className="font-medium text-slate-900">{t("admin.notFound")}</p>
        <Button asChild variant="outline">
          <Link href={ROUTES.ADMIN_PROJECTS}>{t("admin.backToProjects")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-28">
      <div className="flex flex-wrap items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href={ROUTES.ADMIN_PROJECTS}>
            <ArrowLeft className="h-4 w-4" />
            {t("admin.backToProjects")}
          </Link>
        </Button>
      </div>

      <div className="premium-card space-y-3 border-teal-800/15 p-5 md:p-6">
        <p className="text-sm font-medium uppercase tracking-wide text-teal-800">
          {t("admin.reviewTitle")}
        </p>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-semibold text-slate-900">{title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("admin.submissionDate")}:{" "}
              {formatDate(project.submittedAt || project.createdAt)}
              <span className="mx-2 text-slate-300">·</span>
              {t("admin.submittedBy")}: {owner ? `${owner.firstName} ${owner.lastName}` : project.ownerName}
            </p>
          </div>
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
        </div>
      </div>

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
                        : project.status === "closed"
                          ? t("admin.statusClosed")
                          : project.status
            }
          />
          <Field label={t("admin.created")} value={formatDate(project.createdAt)} />
        </div>
        <Field label={t("projects.overview")} value={description} />
        {fullDescription && fullDescription !== description ? (
          <div className="text-sm leading-relaxed text-slate-800 whitespace-pre-wrap">
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
          {project.budgetBreakdown?.length ? (
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {t("admin.budgetBreakdown")}
              </p>
              <ul className="mt-2 space-y-1 text-sm text-slate-800">
                {project.budgetBreakdown.map((item) => (
                  <li key={item.label} className="flex justify-between gap-4 border-b border-border/50 py-1.5">
                    <span>{locale === "hy" && item.labelHy ? item.labelHy : item.label}</span>
                    <span className="tabular-nums font-medium">{item.percent}%</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {project.phases?.length ? (
            <div className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {t("projects.phases")}
              </p>
              {project.phases.map((phase) => (
                <div key={phase.id} className="rounded-xl border border-border/70 bg-slate-50/80 p-3">
                  <p className="font-medium text-slate-900">
                    {locale === "hy" && phase.titleHy ? phase.titleHy : phase.title}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatCurrency(phase.budgetAsk)}
                    {phase.durationWeeks ? ` · ${phase.durationWeeks}w` : ""}
                  </p>
                  <p className="mt-2 text-sm text-slate-700">
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
                <p className="font-semibold text-slate-900">{member.name}</p>
                <p className="text-sm text-teal-800">
                  {teamMemberText(member, "position", locale)} · {member.role}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {teamMemberText(member, "experience", locale)}
                </p>
                <p className="mt-2 text-sm text-slate-700">
                  {teamMemberText(member, "biography", locale)}
                </p>
                {member.portfolio ? (
                  <a
                    href={member.portfolio}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-sm text-teal-800 hover:underline"
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
                  <FileText className="h-4 w-4 text-teal-800" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {locale === "hy" && doc.nameHy ? doc.nameHy : doc.name}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {doc.category.replace(/_/g, " ")} · {formatDate(doc.uploadedAt)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button asChild size="sm" variant="outline">
                    <a href={doc.url} target="_blank" rel="noreferrer">
                      {t("admin.openDocument")}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                  <Button asChild size="sm" variant="ghost">
                    <a href={doc.url} download>
                      {t("admin.downloadDocument")}
                      <Download className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title={t("admin.media")}>
        {project.image || mediaDocs.length ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {project.image ? (
              <div className="relative aspect-video overflow-hidden rounded-xl bg-slate-100">
                <Image src={project.image} alt={title} fill className="object-cover" />
              </div>
            ) : null}
            {mediaDocs.map((doc) => (
              <a
                key={doc.id}
                href={doc.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-border/70 p-4 text-sm hover:bg-slate-50"
              >
                {doc.name}
              </a>
            ))}
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
          <p className="text-sm leading-relaxed text-slate-700">
            {locale === "hy" && risk.summaryHy ? risk.summaryHy : risk.summary}
          </p>
        ) : null}
        {risk?.warningIndicators?.length ? (
          <div>
            <p className="mb-2 flex items-center gap-2 text-sm font-medium text-amber-900">
              <ShieldAlert className="h-4 w-4" />
              {t("admin.warnings")}
            </p>
            <ul className="space-y-2 text-sm text-slate-700">
              {risk.warningIndicators.map((w) => (
                <li key={w.label} className="rounded-lg border border-amber-100 bg-amber-50/60 px-3 py-2">
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
            <p className="mb-2 text-sm font-medium text-slate-900">{t("admin.missingInfo")}</p>
            <ul className="list-inside list-disc text-sm text-muted-foreground">
              {(locale === "hy" && risk.missingDocumentsHy?.length
                ? risk.missingDocumentsHy
                : risk.missingDocuments
              ).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </Section>

      <Section title={t("admin.ownerSection")}>
        {owner ? (
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
        ) : (
          <p className="text-sm text-muted-foreground">{project.ownerName}</p>
        )}
      </Section>

      <Section title={t("admin.reviewHistory")}>
        {!history.length ? (
          <p className="text-sm text-muted-foreground">{t("admin.noHistory")}</p>
        ) : (
          <ol className="space-y-3">
            {[...history].reverse().map((entry) => (
              <li key={entry.id} className="rounded-xl border border-border/70 px-4 py-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium text-slate-900">
                    {decisionLabel(t, entry.decision)}
                    {entry.reviewerName ? ` · ${entry.reviewerName}` : ""}
                  </p>
                  <p className="text-xs text-muted-foreground">{formatDate(entry.createdAt)}</p>
                </div>
                {entry.reason ? (
                  <p className="mt-2 text-sm text-slate-700 whitespace-pre-wrap">{entry.reason}</p>
                ) : null}
              </li>
            ))}
          </ol>
        )}
      </Section>

      {canDecide ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white/95 backdrop-blur">
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
      ) : null}

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
          <p className="rounded-xl border border-border bg-slate-50 p-3 text-sm whitespace-pre-wrap text-slate-800">
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
    </div>
  );
}
