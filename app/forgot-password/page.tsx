"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthShell } from "@/components/layout/auth-shell";
import { PlatformLogo } from "@/components/shared/platform-logo";
import { ROUTES } from "@/constants";
import { authApi } from "@/services/api";
import { getErrorMessage } from "@/services/api/client";
import { useI18n } from "@/hooks";
import { toast } from "sonner";

type FormData = {
  email: string;
};

export default function ForgotPasswordPage() {
  const { t } = useI18n();

  const schema = z.object({
    email: z.string().email(t("auth.invalidEmail")),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const mutation = useMutation({
    mutationFn: (data: FormData) => authApi.forgotPassword(data.email),
    onSuccess: () => toast.success(t("auth.forgotPasswordSent")),
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return (
    <AuthShell title={t("auth.forgotPassword")} subtitle={t("auth.forgotPasswordDesc")}>
      <Card className="border-border shadow-soft">
        <CardHeader className="text-center lg:hidden">
          <Link href={ROUTES.HOME} className="mb-2 inline-flex justify-center">
            <PlatformLogo />
          </Link>
        </CardHeader>
        <CardHeader className="hidden text-center lg:block">
          <CardTitle className="text-2xl font-display">{t("auth.forgotPassword")}</CardTitle>
          <CardDescription>{t("auth.forgotPasswordDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("auth.email")}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t("loginPage.emailPlaceholder")}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={mutation.isPending}>
              {mutation.isPending ? t("common.sending") : t("common.continue")}
            </Button>
          </form>
          <Button variant="ghost" className="mt-4 w-full" asChild>
            <Link href={ROUTES.LOGIN}>{t("common.back")}</Link>
          </Button>
        </CardContent>
      </Card>
    </AuthShell>
  );
}
