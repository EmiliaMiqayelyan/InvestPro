"use client";

import { useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FileCheck, Upload, IdCard, Camera, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QUERY_KEYS } from "@/constants";
import { kycApi } from "@/services/api";
import { getErrorMessage } from "@/services/api/client";
import { formatDate } from "@/utils/format";
import { toast } from "sonner";

export default function KycPage() {
  const idRef = useRef<HTMLInputElement>(null);
  const selfieRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const { data: kyc, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.KYC],
    queryFn: async () => {
      const { data } = await kycApi.getStatus();
      return data.data;
    },
  });

  const submitMutation = useMutation({
    mutationFn: () => {
      const formData = new FormData();
      const idFile = idRef.current?.files?.[0];
      const selfieFile = selfieRef.current?.files?.[0];
      const addressFile = addressRef.current?.files?.[0];
      if (!idFile || !selfieFile || !addressFile) {
        throw new Error("All documents are required");
      }
      formData.append("idDocument", idFile);
      formData.append("selfie", selfieFile);
      formData.append("addressProof", addressFile);
      return kycApi.submit(formData);
    },
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
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">KYC Verification</h1>
        <p className="text-muted-foreground">Verify your identity to unlock all features</p>
      </div>

      {kyc && (
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="font-medium">Verification Status</p>
              {kyc.submittedAt && (
                <p className="text-sm text-muted-foreground">
                  Submitted {formatDate(kyc.submittedAt)}
                </p>
              )}
              {kyc.rejectionReason && (
                <p className="text-sm text-destructive mt-1">{kyc.rejectionReason}</p>
              )}
            </div>
            <Badge variant={kyc.status} className="capitalize">
              {kyc.status.replace(/_/g, " ")}
            </Badge>
          </CardContent>
        </Card>
      )}

      {canSubmit && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="h-5 w-5" /> Upload Documents
            </CardTitle>
            <CardDescription>
              Please upload clear photos of the following documents
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              { ref: idRef, icon: IdCard, label: "Passport or ID Card", id: "id" },
              { ref: selfieRef, icon: Camera, label: "Selfie Photo", id: "selfie" },
              { ref: addressRef, icon: MapPin, label: "Address Proof", id: "address" },
            ].map((doc) => (
              <div key={doc.id} className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <doc.icon className="h-4 w-4" /> {doc.label}
                </label>
                <div
                  className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => doc.ref.current?.click()}
                >
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Click to upload</p>
                  <input
                    ref={doc.ref}
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                  />
                </div>
              </div>
            ))}
            <Button
              variant="gradient"
              className="w-full"
              onClick={() => submitMutation.mutate()}
              disabled={submitMutation.isPending || isLoading}
            >
              {submitMutation.isPending ? "Submitting..." : "Submit for Verification"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
