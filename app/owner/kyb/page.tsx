"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Building2, FileCheck } from "lucide-react";
import { kybApi } from "@/services/api";
import { QUERY_KEYS, STATUS_COLORS } from "@/constants";
import { getErrorMessage } from "@/services/api/client";
import { formatDate } from "@/utils/format";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { PanelPage } from "@/components/shared/panel-page";
import { EmptyState } from "@/components/shared/empty-state";
import { PanelBlockSkeleton } from "@/components/shared/loading-skeleton";
import { useSetPageTitle } from "@/components/providers/page-title-provider";
import { useI18n } from "@/hooks";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function OwnerKybPage() {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  useSetPageTitle(t("owner.kybTitle"));
  const [form, setForm] = useState({
    registrationDocumentUrl: "",
    taxDocumentUrl: "",
    bankStatementUrl: "",
  });

  const { data: kyb, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.KYB],
    queryFn: async () => (await kybApi.get()).data.data,
  });

  const submitMutation = useMutation({
    mutationFn: () =>
      kybApi.submit({
        registrationDocumentUrl: form.registrationDocumentUrl,
        taxDocumentUrl: form.taxDocumentUrl || undefined,
        bankStatementUrl: form.bankStatementUrl || undefined,
      }),
    onSuccess: () => {
      toast.success(t("owner.kybSubmitted"));
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.KYB] });
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const canSubmit =
    !kyb || kyb.status === "rejected" || kyb.status === "resubmission_requested";

  return (
    <PanelPage maxWidth="form">
      <PageHeader
        variant="minimal"
        title={t("owner.kybTitle")}
        description={t("owner.kybSub")}
      />

      {isLoading ? (
        <PanelBlockSkeleton height="h-24" />
      ) : kyb ? (
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="font-medium text-foreground">{t("owner.kybStatus")}</p>
              <p className="text-sm text-muted-foreground">{formatDate(kyb.submittedAt)}</p>
              {kyb.rejectionReason && (
                <p className="mt-1 text-sm text-destructive">{kyb.rejectionReason}</p>
              )}
            </div>
            <Badge className={cn("border capitalize", STATUS_COLORS[kyb.status] || STATUS_COLORS.pending)}>
              {kyb.status.replace(/_/g, " ")}
            </Badge>
          </CardContent>
        </Card>
      ) : (
        <EmptyState icon={Building2} title={t("owner.kybEmpty")} />
      )}

      {canSubmit && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <FileCheck className="h-5 w-5 text-primary" />
              {t("owner.kybSubmit")}
            </CardTitle>
            <CardDescription>{t("owner.kybHint")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{t("owner.kybRegDoc")}</Label>
              <Input
                value={form.registrationDocumentUrl}
                onChange={(e) => setForm({ ...form, registrationDocumentUrl: e.target.value })}
                placeholder="https://…"
              />
            </div>
            <div className="space-y-2">
              <Label>{t("owner.kybTaxDoc")}</Label>
              <Input
                value={form.taxDocumentUrl}
                onChange={(e) => setForm({ ...form, taxDocumentUrl: e.target.value })}
                placeholder="https://…"
              />
            </div>
            <div className="space-y-2">
              <Label>{t("owner.kybBankDoc")}</Label>
              <Input
                value={form.bankStatementUrl}
                onChange={(e) => setForm({ ...form, bankStatementUrl: e.target.value })}
                placeholder="https://…"
              />
            </div>
            <Button
              className="w-full"
              disabled={submitMutation.isPending || !form.registrationDocumentUrl}
              onClick={() => submitMutation.mutate()}
            >
              {submitMutation.isPending ? t("common.sending") : t("common.submit")}
            </Button>
          </CardContent>
        </Card>
      )}
    </PanelPage>
  );
}
