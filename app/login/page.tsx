"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthShell } from "@/components/layout/auth-shell";
import { PlatformLogo } from "@/components/shared/platform-logo";
import { ROUTES } from "@/constants";
import { useAuth, useI18n } from "@/hooks";
import { cn } from "@/lib/utils";

type LoginForm = { email: string; password: string };

const DEMO_ACCOUNTS = [
  { roleKey: "auth.demoInvestor" as const, email: "investor@investpro.com", password: "investor123" },
  { roleKey: "auth.demoOwner" as const, email: "owner@investpro.com", password: "owner123" },
  { roleKey: "auth.demoAdmin" as const, email: "admin@investpro.com", password: "admin123" },
];

export default function LoginPage() {
  const { login, isLoggingIn } = useAuth();
  const { t } = useI18n();

  const loginSchema = z.object({
    email: z.string().email(t("auth.invalidEmail")),
    password: z.string().min(6, t("auth.passwordMin")),
  });

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <AuthShell title={t("auth.welcomeBack")} subtitle={t("auth.signInToAccount")}>
      <Card className="border-border shadow-soft">
        <CardHeader className="text-center lg:hidden">
          <Link href={ROUTES.HOME} className="inline-flex justify-center"><PlatformLogo /></Link>
        </CardHeader>
        <CardHeader className="hidden lg:block">
          <CardTitle className="font-display text-xl">{t("auth.welcomeBack")}</CardTitle>
          <CardDescription>{t("auth.signInToAccount")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((data) => login(data))} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("auth.email")}</Label>
              <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">{t("auth.password")}</Label>
                <Link href={ROUTES.FORGOT_PASSWORD} className="text-xs text-primary hover:underline">{t("auth.forgotPassword")}</Link>
              </div>
              <Input id="password" type="password" {...register("password")} />
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isLoggingIn}>
              {isLoggingIn ? t("auth.signingIn") : t("common.signIn")}
            </Button>
          </form>

          <div className="mt-6 rounded-xl border border-border bg-secondary/50 p-3">
            <p className="mb-2 text-xs font-medium text-muted-foreground">{t("auth.demoAccounts")}</p>
            <div className="space-y-1.5">
              {DEMO_ACCOUNTS.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  className="flex w-full items-center justify-between rounded-lg bg-card px-3 py-2 text-left text-xs transition hover:bg-secondary"
                  onClick={() => { setValue("email", account.email); setValue("password", account.password); }}
                >
                  <span className="font-medium">{t(account.roleKey)}</span>
                  <span className="text-muted-foreground">{account.email}</span>
                </button>
              ))}
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {t("auth.noAccount")}{" "}
            <Link href={ROUTES.REGISTER} className="font-medium text-primary hover:underline">{t("auth.signUp")}</Link>
          </p>
        </CardContent>
      </Card>
    </AuthShell>
  );
}
