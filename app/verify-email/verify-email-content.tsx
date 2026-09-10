"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/constants";
import { authApi } from "@/services/api";
import { useI18n } from "@/hooks";

export default function VerifyEmailContent() {
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const mutation = useMutation({
    mutationFn: () => authApi.verifyEmail(token!),
  });

  useEffect(() => {
    if (token) mutation.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center animate-slide-up">
        <CardHeader>
          {mutation.isPending && (
            <>
              <Loader2 className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
              <CardTitle>{t("auth.verifyEmailPending")}</CardTitle>
            </>
          )}
          {mutation.isSuccess && (
            <>
              <CheckCircle className="h-12 w-12 text-emerald mx-auto mb-4" />
              <CardTitle>{t("auth.verifyEmailSuccess")}</CardTitle>
              <CardDescription>{t("auth.verifyEmailSuccessBody")}</CardDescription>
            </>
          )}
          {mutation.isError && (
            <>
              <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <CardTitle>{t("auth.verifyEmailFailed")}</CardTitle>
              <CardDescription>{t("auth.verifyEmailFailedBody")}</CardDescription>
            </>
          )}
        </CardHeader>
        <CardContent>
          <Button variant="gradient" asChild>
            <Link href={ROUTES.LOGIN}>{t("auth.continueToLogin")}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
