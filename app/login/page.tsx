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

type LoginForm = { email: string; password: string };

const DEMO_ACCOUNTS = [
  {
    roleKey: "auth.demoInvestor" as const,
    email: "investor@investpro.com",
    password: "investor123",
  },
  {
    roleKey: "auth.demoOwner" as const,
    email: "owner@investpro.com",
    password: "owner123",
  },
  {
    roleKey: "auth.demoAdmin" as const,
    email: "admin@investpro.com",
    password: "admin123",
  },
];

export default function LoginPage() {
  const { login, isLoggingIn } = useAuth();
  const { t } = useI18n();

  const loginSchema = z.object({
    email: z.string().email(t("auth.invalidEmail")),
    password: z.string().min(8, t("auth.passwordMin8")),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const highlights = [
    { title: t("loginPage.investorTitle"), body: t("loginPage.investorBody") },
    { title: t("loginPage.ownerTitle"), body: t("loginPage.ownerBody") },
  ];

  const signInAs = (email: string, password: string) => {
    setValue("email", email, { shouldDirty: true, shouldValidate: true });
    setValue("password", password, { shouldDirty: true, shouldValidate: true });
    login({ email, password });
  };

  return (
    <AuthShell
      title={t("loginPage.heroTitle")}
      subtitle={t("loginPage.heroSub")}
      highlightsTitle={t("loginPage.rolesTitle")}
      highlights={highlights}
    >
      <Card className="border-border shadow-soft">
        <CardHeader className="text-center">
          <Link href={ROUTES.HOME} className="mb-2 inline-flex justify-center lg:hidden">
            <PlatformLogo />
          </Link>
          <CardTitle className="font-display text-xl">{t("loginPage.eyebrow")}</CardTitle>
          <CardDescription>{t("loginPage.heroSub")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((data) => login(data))} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("loginPage.email")}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t("loginPage.emailPlaceholder")}
                {...register("email")}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("loginPage.password")}</Label>
              <Input id="password" type="password" {...register("password")} />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isLoggingIn}>
              {isLoggingIn ? t("auth.signingIn") : t("loginPage.logIn")}
            </Button>
            <p className="text-center">
              <Link
                href={ROUTES.FORGOT_PASSWORD}
                className="text-sm font-medium text-primary hover:underline"
              >
                {t("loginPage.forgot")}
              </Link>
            </p>
          </form>

          <div className="mt-6 rounded-xl border border-border bg-secondary/50 p-3">
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              {t("auth.demoAccounts")}
            </p>
            <div className="space-y-1.5">
              {DEMO_ACCOUNTS.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  disabled={isLoggingIn}
                  className="flex w-full items-center justify-between rounded-lg bg-card px-3 py-2.5 text-left text-xs transition hover:bg-secondary disabled:opacity-60"
                  onClick={() => signInAs(account.email, account.password)}
                >
                  <span className="font-medium">{t(account.roleKey)}</span>
                  <span className="text-muted-foreground">{account.email}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 border-t border-border pt-6 text-center">
            <p className="font-medium">{t("loginPage.noAccountTitle")}</p>
            <p className="mt-1 text-sm text-muted-foreground">{t("loginPage.noAccountBody")}</p>
            <Button variant="outline" className="mt-4 w-full" asChild>
              <Link href={ROUTES.REGISTER}>{t("loginPage.createAccount")}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </AuthShell>
  );
}
