"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Circle, FileCheck, Shield } from "lucide-react";
import { kycApi } from "@/services/api";
import { QUERY_KEYS, STATUS_COLORS } from "@/constants";
import { getErrorMessage } from "@/services/api/client";
import { formatDate } from "@/utils/format";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useI18n } from "@/hooks";
import { useSetPageTitle } from "@/components/providers/page-title-provider";
import { PageHeader } from "@/components/shared/page-header";
import { PanelPage } from "@/components/shared/panel-page";
import { PanelBlockSkeleton } from "@/components/shared/loading-skeleton";
import { toast } from "sonner";

export default function InvestorKycPage() {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  useSetPageTitle(t("nav.verification"));
  const [form, setForm] = useState({
    idDocumentUrl: "",
    selfieUrl: "",
    addressProofUrl: "",
  });

  const { data: kyc, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.KYC],
    queryFn: async () => (await kycApi.get()).data.data,
  });

  const submitMutation = useMutation({
    mutationFn: () => kycApi.submit(form),
    onSuccess: () => {
      toast.success(t("investor.kycSubmitDocs"));
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.KYC] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const canSubmit =
    !kyc ||
    kyc.status === "not_submitted" ||
    kyc.status === "rejected" ||
    kyc.status === "resubmission_requested";

  const status = kyc?.status ?? "not_submitted";
  const steps = [
    {
      label: t("investor.kycStep1"),
      done: status !== "not_submitted",
    },
    {
      label: t("investor.kycStep2"),
      done: status === "pending" || status === "approved" || status === "rejected",
      active: status === "pending",
    },
    {
      label:
        status === "rejected" ? t("investor.kycStepRejected") : t("investor.kycStep3"),
      done: status === "approved",
    },
  ];

  return (
    <PanelPage maxWidth="form">
      <PageHeader
        variant="minimal"
        title={t("nav.verification")}
        description={t("investor.completeVerification")}
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Shield className="h-5 w-5 text-primary" />
            {t("investor.kycTimelineTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {steps.map((step) => (
            <div key={step.label} className="flex items-start gap-3 text-sm">
              {step.done ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              ) : (
                <Circle
                  className={cn(
                    "mt-0.5 h-4 w-4 shrink-0",
                    step.active ? "text-amber-500" : "text-muted-foreground/40"
                  )}
                />
              )}
              <span className={cn(step.done ? "text-foreground" : "text-muted-foreground")}>
                {step.label}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base text-foreground">{t("investor.kycExamplesTitle")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• {t("investor.kycExampleId")}</p>
          <p>• {t("investor.kycExampleSelfie")}</p>
          <p>• {t("investor.kycExampleAddress")}</p>
        </CardContent>
      </Card>

      {isLoading ? (
        <PanelBlockSkeleton height="h-24" />
      ) : kyc ? (
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="font-medium text-foreground">{t("investor.kycCurrentStatus")}</p>
              {kyc.submittedAt && (
                <p className="text-sm text-muted-foreground">
                  {formatDate(kyc.submittedAt)}
                </p>
              )}
              {kyc.rejectionReason && (
                <p className="mt-1 text-sm text-destructive">{kyc.rejectionReason}</p>
              )}
            </div>
            <Badge className={cn("border capitalize", STATUS_COLORS[kyc.status])}>
              {kyc.status.replace(/_/g, " ")}
            </Badge>
          </CardContent>
        </Card>
      ) : null}

      {canSubmit && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <FileCheck className="h-5 w-5 text-primary" /> {t("investor.kycSubmitDocs")}
            </CardTitle>
            <CardDescription>{t("investor.kycSubmitHint")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{t("investor.kycExampleId")}</Label>
              <Input
                value={form.idDocumentUrl}
                onChange={(e) => setForm({ ...form, idDocumentUrl: e.target.value })}
                placeholder="https://…"
              />
            </div>
            <div className="space-y-2">
              <Label>{t("investor.kycExampleSelfie")}</Label>
              <Input
                value={form.selfieUrl}
                onChange={(e) => setForm({ ...form, selfieUrl: e.target.value })}
                placeholder="https://…"
              />
            </div>
            <div className="space-y-2">
              <Label>{t("investor.kycExampleAddress")}</Label>
              <Input
                value={form.addressProofUrl}
                onChange={(e) => setForm({ ...form, addressProofUrl: e.target.value })}
                placeholder="https://…"
              />
            </div>
            <Button
              className="w-full"
              variant="gradient"
              onClick={() => {
                if (!form.idDocumentUrl || !form.selfieUrl || !form.addressProofUrl) {
                  toast.error(t("common.required"));
                  return;
                }
                submitMutation.mutate();
              }}
              disabled={submitMutation.isPending}
            >
              {submitMutation.isPending ? t("common.sending") : t("common.submit")}
            </Button>
          </CardContent>
        </Card>
      )}
    </PanelPage>
  );
}
