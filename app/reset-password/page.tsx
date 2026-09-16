"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
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
  password: string;
  confirmPassword: string;
};

function ResetPasswordForm() {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const schema = z
    .object({
      password: z.string().min(8, t("auth.passwordMin8")),
      confirmPassword: z.string(),
    })
    .refine((d) => d.password === d.confirmPassword, {
      message: t("auth.passwordsMismatch"),
      path: ["confirmPassword"],
    });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const mutation = useMutation({
    mutationFn: (data: FormData) => authApi.resetPassword(token, data.password),
    onSuccess: () => {
      toast.success(t("auth.resetPasswordSuccess"));
      router.push(ROUTES.LOGIN);
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  if (!token) {
    return (
      <Card className="border-border shadow-soft">
        <CardHeader className="text-center">
          <Link href={ROUTES.HOME} className="mb-2 inline-flex justify-center lg:hidden">
            <PlatformLogo />
          </Link>
          <CardTitle className="font-display text-2xl">{t("auth.resetPassword")}</CardTitle>
          <CardDescription>{t("auth.resetPasswordMissingToken")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button className="w-full" asChild>
            <Link href={ROUTES.FORGOT_PASSWORD}>{t("auth.forgotPassword")}</Link>
          </Button>
          <Button variant="ghost" className="w-full" asChild>
            <Link href={ROUTES.LOGIN}>{t("common.back")}</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border shadow-soft">
      <CardHeader className="text-center lg:hidden">
        <Link href={ROUTES.HOME} className="mb-2 inline-flex justify-center">
          <PlatformLogo />
        </Link>
      </CardHeader>
      <CardHeader className="hidden text-center lg:block">
        <CardTitle className="font-display text-2xl">{t("auth.resetPassword")}</CardTitle>
        <CardDescription>{t("auth.resetPasswordDesc")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">{t("auth.newPassword")}</Label>
            <Input id="password" type="password" {...register("password")} />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{t("auth.confirmNewPassword")}</Label>
            <Input id="confirmPassword" type="password" {...register("confirmPassword")} />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? t("common.saving") : t("auth.resetPasswordSubmit")}
          </Button>
        </form>
        <Button variant="ghost" className="mt-4 w-full" asChild>
          <Link href={ROUTES.LOGIN}>{t("common.back")}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default function ResetPasswordPage() {
  const { t } = useI18n();

  return (
    <AuthShell title={t("auth.resetPassword")} subtitle={t("auth.resetPasswordDesc")}>
      <Suspense
        fallback={
          <Card className="border-border shadow-soft">
            <CardContent className="p-8 text-center text-sm text-muted-foreground">
              {t("common.loading")}
            </CardContent>
          </Card>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </AuthShell>
  );
}
