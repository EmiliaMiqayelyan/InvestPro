"use client";

import { useQuery } from "@tanstack/react-query";
import { FileText } from "lucide-react";
import { ownerApi } from "@/services/api";
import { useI18n } from "@/hooks";
import { useSetPageTitle } from "@/components/providers/page-title-provider";
import { PageHeader } from "@/components/shared/page-header";
import { QUERY_KEYS, DOCUMENT_CATEGORIES, STATUS_COLORS } from "@/constants";
import { formatDate } from "@/utils/format";
import { Badge } from "@/components/ui/badge";
import type { ProjectDocument } from "@/types";

type OwnerDocument = ProjectDocument & {
  projectId?: string;
  projectTitle?: string;
};

export default function OwnerDocumentsPage() {
  const { t } = useI18n();
  useSetPageTitle(t("nav.documents"));
  const { data: documents = [], isLoading } = useQuery({
    queryKey: [QUERY_KEYS.OWNER_DOCUMENTS],
    queryFn: async () => {
      const res = await ownerApi.documents();
      return (res.data.data ?? res.data) as OwnerDocument[];
    },
  });

  return (
    <div className="space-y-6">
      <PageHeader variant="minimal" title={t("nav.documents")} />

      {isLoading ? (
        <div className="premium-card h-40 animate-pulse bg-slate-100" />
      ) : documents.length === 0 ? (
        <div className="premium-card flex flex-col items-center gap-3 p-12 text-center">
          <FileText className="h-10 w-10 text-slate-300" />
          <p className="font-medium text-slate-900">No documents yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {documents.map((doc) => {
            const categoryLabel =
              DOCUMENT_CATEGORIES.find((c) => c.value === doc.category)?.label ||
              doc.category;
            return (
              <div
                key={`${doc.projectId ?? "project"}-${doc.id}-${doc.name}`}
                className="premium-card flex flex-wrap items-center justify-between gap-3 p-5"
              >
                <div className="flex items-start gap-3">
                  <FileText className="mt-0.5 h-5 w-5 text-teal-800" />
                  <div>
                    <p className="font-medium text-slate-900">{doc.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {doc.projectTitle || "Project"}
                      {doc.uploadedAt ? ` · ${formatDate(doc.uploadedAt)}` : ""}
                    </p>
                  </div>
                </div>
                <Badge className={`border capitalize ${STATUS_COLORS.published}`}>
                  {categoryLabel}
                </Badge>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
