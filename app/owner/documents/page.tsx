"use client";

import { useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FileText, Trash2, Upload, Save } from "lucide-react";
import { toast } from "sonner";
import { ownerApi, uploadsApi } from "@/services/api";
import { getErrorMessage } from "@/services/api/client";
import { useI18n, useOwnerProjects } from "@/hooks";
import { useSetPageTitle } from "@/components/providers/page-title-provider";
import { PageHeader } from "@/components/shared/page-header";
import { PanelPage } from "@/components/shared/panel-page";
import { PanelCard } from "@/components/shared/panel-card";
import { EmptyState } from "@/components/shared/empty-state";
import { PanelBlockSkeleton } from "@/components/shared/loading-skeleton";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { DOCUMENT_CATEGORIES, QUERY_KEYS, STATUS_COLORS } from "@/constants";
import { docCategoryLabel } from "@/i18n/localize";
import { formatDate } from "@/utils/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { DocumentCategory, ProjectDocument } from "@/types";

type OwnerDocument = ProjectDocument & {
  projectId?: string;
  projectTitle?: string;
  documentId?: string;
};

type PendingRemove = { projectId: string; documentId: string; name: string };

function RequiredMark() {
  return <span className="text-destructive"> *</span>;
}

export default function OwnerDocumentsPage() {
  const { t, locale } = useI18n();
  useSetPageTitle(t("nav.documents"));
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: projects = [], isLoading: projectsLoading } = useOwnerProjects();
  const { data: documents = [], isLoading } = useQuery({
    queryKey: [QUERY_KEYS.OWNER_DOCUMENTS],
    queryFn: async () => {
      const res = await ownerApi.documents();
      return (res.data.data ?? res.data) as OwnerDocument[];
    },
  });

  const [projectId, setProjectId] = useState("");
  const [category, setCategory] = useState<DocumentCategory>("pitch_deck");
  const [file, setFile] = useState<File | null>(null);
  const [docName, setDocName] = useState("");
  const [pendingRemove, setPendingRemove] = useState<PendingRemove | null>(null);

  const removeMutation = useMutation({
    mutationFn: ({
      projectId: pid,
      documentId,
    }: {
      projectId: string;
      documentId: string;
    }) => ownerApi.removeDocument(pid, documentId),
    onSuccess: () => {
      toast.success(t("ownerReview.removedToast"));
      setPendingRemove(null);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.OWNER_DOCUMENTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.OWNER_PROJECTS] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!projectId) throw new Error(t("owner.docProjectRequired"));
      if (!file) throw new Error(t("owner.docFileRequired"));
      const name = docName.trim() || file.name;
      const uploaded = await uploadsApi.create({
        name,
        size: file.size,
        category,
      });
      const stored = uploaded.data.data;
      await ownerApi.addDocument(projectId, {
        name: stored?.name || name,
        category,
        url: stored?.url,
      });
    },
    onSuccess: () => {
      toast.success(t("owner.docUploadedToast"));
      setFile(null);
      setDocName("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.OWNER_DOCUMENTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.OWNER_PROJECTS] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const canUpload = Boolean(projectId && file) && !uploadMutation.isPending;

  return (
    <PanelPage>
      <PageHeader
        variant="minimal"
        title={t("nav.documents")}
        description={t("owner.documentsPageSub")}
      />

      <PanelCard className="mb-6 space-y-4">
        <div>
          <p className="font-medium text-foreground">{t("owner.addDocument")}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t("owner.documentsUploadHint")}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>
              {t("owner.docProject")}
              <RequiredMark />
            </Label>
            <Select
              value={projectId || undefined}
              onValueChange={setProjectId}
              disabled={projectsLoading || projects.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("owner.docProjectPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {projects.length === 0 && !projectsLoading ? (
              <p className="text-xs text-muted-foreground">{t("owner.docNoProjects")}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label>
              {t("owner.category")}
              <RequiredMark />
            </Label>
            <Select
              value={category}
              onValueChange={(v) => setCategory(v as DocumentCategory)}
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

        <div className="space-y-2">
          <Label>{t("owner.docDisplayName")}</Label>
          <Input
            value={docName}
            onChange={(e) => setDocName(e.target.value)}
            placeholder={t("owner.docNamePlaceholder")}
          />
        </div>

        <div className="space-y-2">
          <Label>
            {t("owner.docFile")}
            <RequiredMark />
          </Label>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/40 px-4 py-8 text-center transition hover:border-primary/40 hover:bg-muted/70"
          >
            <Upload className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-foreground">
              {file ? file.name : t("owner.docChooseFile")}
            </span>
            <span className="text-xs text-muted-foreground">{t("owner.docFileTypes")}</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg,.webp"
            onChange={(e) => {
              const next = e.target.files?.[0] ?? null;
              setFile(next);
              if (next && !docName.trim()) setDocName(next.name);
            }}
          />
        </div>

        <Button
          type="button"
          className="w-full sm:w-auto"
          disabled={!canUpload}
          onClick={() => uploadMutation.mutate()}
        >
          <Save className="h-4 w-4" />
          {uploadMutation.isPending ? t("common.saving") : t("owner.saveDocument")}
        </Button>
        {!projectId || !file ? (
          <p className="text-xs text-muted-foreground">{t("owner.saveDocumentHint")}</p>
        ) : null}
      </PanelCard>

      {isLoading ? (
        <PanelBlockSkeleton height="h-40" />
      ) : documents.length === 0 ? (
        <EmptyState icon={FileText} title={t("owner.noDocumentsYet")} />
      ) : (
        <div className="space-y-3">
          {documents.map((doc) => {
            const categoryLabel = docCategoryLabel(locale, doc.category);
            const documentId =
              doc.documentId ||
              (doc.id.includes(":") ? doc.id.split(":").slice(1).join(":") : doc.id);
            return (
              <PanelCard
                key={`${doc.projectId ?? "project"}-${doc.id}-${doc.name}`}
                className="flex flex-wrap items-center justify-between gap-3"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <FileText className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">{doc.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {doc.projectTitle || t("common.projectFallback")}
                      {doc.uploadedAt ? ` · ${formatDate(doc.uploadedAt)}` : ""}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className={`border capitalize ${STATUS_COLORS.published}`}>
                    {categoryLabel}
                  </Badge>
                  {doc.projectId ? (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-9 w-9 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      disabled={removeMutation.isPending}
                      aria-label={t("ownerReview.removeDocument")}
                      onClick={() =>
                        setPendingRemove({
                          projectId: doc.projectId!,
                          documentId,
                          name: doc.name,
                        })
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  ) : null}
                </div>
              </PanelCard>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(pendingRemove)}
        onOpenChange={(open) => {
          if (!open) setPendingRemove(null);
        }}
        title={t("ownerReview.removeDocumentConfirm")}
        description={pendingRemove?.name}
        confirmLabel={t("ownerReview.removeDocument")}
        loading={removeMutation.isPending}
        onConfirm={() => {
          if (!pendingRemove) return;
          removeMutation.mutate({
            projectId: pendingRemove.projectId,
            documentId: pendingRemove.documentId,
          });
        }}
      />
    </PanelPage>
  );
}
