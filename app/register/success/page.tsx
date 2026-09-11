"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/constants";
import { getRoleHome } from "@/lib/rbac";
import { useAuthStore } from "@/store";
import { useI18n } from "@/hooks";

export default function RegisterSuccessPage() {
  const { t } = useI18n();
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuthStore();
  const [hydrated, setHydrated] = useState(false);
  const nextHref = getRoleHome(user?.role);

  useEffect(() => {
    const unsub = useAuthStore.persist.onFinishHydration(() => setHydrated(true));
    if (useAuthStore.persist.hasHydrated()) setHydrated(true);
    return unsub;
  }, []);

  useEffect(() => {
    if (!hydrated || isLoading) return;
    if (!isAuthenticated) {
      router.replace(ROUTES.LOGIN);
    }
  }, [hydrated, isAuthenticated, isLoading, router]);

  if (!hydrated || isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">{t("common.loading")}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-[480px] border-border text-center shadow-soft">
        <CardHeader>
          <CheckCircle className="mx-auto mb-4 h-12 w-12 text-primary" />
          <CardTitle className="font-display text-2xl">{t("auth.registerSuccessTitle")}</CardTitle>
          <CardDescription className="text-base">{t("auth.registerSuccessBody")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" asChild>
            <Link href={nextHref}>{t("auth.registerSuccessCta")}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
