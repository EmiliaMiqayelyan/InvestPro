"use client";

import { useEffect, useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/hooks";
import { getWebmailUrl } from "@/utils/webmail";

export default function RegisterSuccessPage() {
  const { t } = useI18n();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("pendingVerifyEmail");
    if (stored) setEmail(stored);
  }, []);

  const body = email
    ? t("auth.registerSuccessBodyWithEmail", { email })
    : t("auth.registerSuccessBody");
  const mailUrl = getWebmailUrl(email);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-[480px] border-border text-center shadow-soft">
        <CardHeader>
          <Mail className="mx-auto mb-4 h-12 w-12 text-primary" />
          <CardTitle className="font-display text-2xl">{t("auth.registerSuccessTitle")}</CardTitle>
          <CardDescription className="text-base">{body}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{t("auth.registerSuccessHint")}</p>
          <Button className="w-full" asChild>
            <a href={mailUrl} target="_blank" rel="noopener noreferrer">
              {t("auth.registerSuccessCta")}
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
