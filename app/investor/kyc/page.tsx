"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FileCheck, Shield } from "lucide-react";
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
      toast.success("KYC documents submitted");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.KYC] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const canSubmit =
    !kyc ||
    kyc.status === "not_submitted" ||
    kyc.status === "rejected" ||
    kyc.status === "resubmission_requested";

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        variant="minimal"
        title={t("nav.verification")}
        description={t("investor.completeVerification")}
      />

      {kyc && (
        <Card className="premium-card border-border bg-white shadow-none backdrop-blur-none">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="font-medium text-slate-900">Current status</p>
              {kyc.submittedAt && (
                <p className="text-sm text-muted-foreground">
                  Submitted {formatDate(kyc.submittedAt)}
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
      )}

      {canSubmit && (
        <Card className="premium-card border-border bg-white shadow-none backdrop-blur-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <FileCheck className="h-5 w-5 text-teal-800" /> Submit documents
            </CardTitle>
            <CardDescription>
              Provide document URLs (upload simulation). Clear, readable scans work best.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>ID / passport document URL</Label>
              <Input
                value={form.idDocumentUrl}
                onChange={(e) => setForm({ ...form, idDocumentUrl: e.target.value })}
                placeholder="https://…"
              />
            </div>
            <div className="space-y-2">
              <Label>Selfie URL</Label>
              <Input
                value={form.selfieUrl}
                onChange={(e) => setForm({ ...form, selfieUrl: e.target.value })}
                placeholder="https://…"
              />
            </div>
            <div className="space-y-2">
              <Label>Address proof URL</Label>
              <Input
                value={form.addressProofUrl}
                onChange={(e) => setForm({ ...form, addressProofUrl: e.target.value })}
                placeholder="https://…"
              />
            </div>
            <Button
              className="w-full bg-gradient-to-r from-teal-900 to-teal-700 hover:opacity-95"
              onClick={() => {
                if (!form.idDocumentUrl || !form.selfieUrl || !form.addressProofUrl) {
                  toast.error("All document fields are required");
                  return;
                }
                submitMutation.mutate();
              }}
              disabled={submitMutation.isPending || isLoading}
            >
              <Shield className="h-4 w-4" />
              {submitMutation.isPending ? "Submitting…" : "Submit for review"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
