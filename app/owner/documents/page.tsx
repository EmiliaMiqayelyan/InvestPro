"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FileText } from "lucide-react";
import { toast } from "sonner";
import { ownerApi } from "@/services/api";
import { getErrorMessage } from "@/services/api/client";
import { useI18n } from "@/hooks";
import { useSetPageTitle } from "@/components/providers/page-title-provider";
import { PanelPage } from "@/components/shared/panel-page";
import { PanelCard } from "@/components/shared/panel-card";
import { EmptyState } from "@/components/shared/empty-state";
import { PanelBlockSkeleton } from "@/components/shared/loading-skeleton";
import { QUERY_KEYS, STATUS_COLORS } from "@/constants";
import { docCategoryLabel } from "@/i18n/localize";
import { formatDate } from "@/utils/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ProjectDocument } from "@/types";

type OwnerDocument = ProjectDocument & {
  projectId?: string;
  projectTitle?: string;
  documentId?: string;
};

export default function OwnerDocumentsPage() {
  const { t, locale } = useI18n();
  useSetPageTitle(t("nav.documents"));
  const queryClient = useQueryClient();
  const { data: documents = [], isLoading } = useQuery({
    queryKey: [QUERY_KEYS.OWNER_DOCUMENTS],
    queryFn: async () => {
      const res = await ownerApi.documents();
      return (res.data.data ?? res.data) as OwnerDocument[];
    },
  });

  const removeMutation = useMutation({
    mutationFn: ({
      projectId,
      documentId,
    }: {
      projectId: string;
      documentId: string;
    }) => ownerApi.removeDocument(projectId, documentId),
    onSuccess: () => {
      toast.success(t("ownerReview.removedToast"));
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.OWNER_DOCUMENTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.OWNER_PROJECTS] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return (
    <PanelPage>
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
                <div className="flex items-start gap-3">
                  <FileText className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">{doc.name}</p>
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
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      disabled={removeMutation.isPending}
                      onClick={() => {
                        if (!window.confirm(t("ownerReview.removeDocumentConfirm"))) return;
                        removeMutation.mutate({
                          projectId: doc.projectId!,
                          documentId,
                        });
                      }}
                    >
                      {t("ownerReview.removeDocument")}
                    </Button>
                  ) : null}
                </div>
              </PanelCard>
            );
          })}
        </div>
      )}
    </PanelPage>
  );
}
