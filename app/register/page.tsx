"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ROUTES } from "@/constants";
import { useAuth, useI18n } from "@/hooks";
import { AuthShell } from "@/components/layout/auth-shell";
import { PlatformLogo } from "@/components/shared/platform-logo";

type RegisterRole = "investor" | "project_owner";

type InvestorFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
};

type OwnerFormValues = {
  name: string;
  email: string;
  companyName: string;
  password: string;
  confirmPassword: string;
};

function splitFullName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  const firstName = parts[0] ?? "";
  const lastName = parts.length > 1 ? parts.slice(1).join(" ") : firstName;
  return { firstName, lastName };
}

function InvestorRegisterForm() {
  const { register: registerUser, isRegistering } = useAuth();
  const { t } = useI18n();

  const schema = useMemo(
    () =>
      z
        .object({
          firstName: z.string().min(2, t("auth.firstNameRequired")),
          lastName: z.string().min(2, t("auth.lastNameRequired")),
          email: z.string().email(t("auth.invalidEmail")),
          phone: z.string().optional(),
          password: z.string().min(8, t("auth.passwordMin8")),
          confirmPassword: z.string(),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: t("auth.passwordsMismatch"),
          path: ["confirmPassword"],
        }),
    [t]
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InvestorFormValues>({
    resolver: zodResolver(schema),
  });

  return (
    <form
      onSubmit={handleSubmit((data) => {
        const { confirmPassword: _, ...rest } = data;
        registerUser({ ...rest, role: "investor" });
      })}
      className="space-y-4"
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="investor-firstName">{t("auth.firstName")}</Label>
          <Input id="investor-firstName" {...register("firstName")} />
          {errors.firstName && (
            <p className="text-sm text-destructive">{errors.firstName.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="investor-lastName">{t("auth.lastName")}</Label>
          <Input id="investor-lastName" {...register("lastName")} />
          {errors.lastName && (
            <p className="text-sm text-destructive">{errors.lastName.message}</p>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="investor-email">{t("auth.email")}</Label>
        <Input id="investor-email" type="email" {...register("email")} />
        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="investor-phone">{t("auth.phoneOptional")}</Label>
        <Input id="investor-phone" type="tel" {...register("phone")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="investor-password">{t("auth.password")}</Label>
        <Input id="investor-password" type="password" {...register("password")} />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="investor-confirmPassword">{t("auth.confirmPassword")}</Label>
        <Input id="investor-confirmPassword" type="password" {...register("confirmPassword")} />
        {errors.confirmPassword && (
          <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
        )}
      </div>
      <Button type="submit" className="w-full" disabled={isRegistering}>
        {isRegistering ? t("auth.creatingAccount") : t("registerPage.investorCta")}
      </Button>
    </form>
  );
}

function OwnerRegisterForm() {
  const { register: registerUser, isRegistering } = useAuth();
  const { t } = useI18n();

  const schema = useMemo(
    () =>
      z
        .object({
          name: z.string().trim().min(2, t("registerOwnerPage.nameRequired")),
          email: z.string().email(t("auth.invalidEmail")),
          companyName: z.string().trim().min(2, t("auth.companyRequired")),
          password: z.string().min(8, t("auth.passwordMin8")),
          confirmPassword: z.string(),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: t("auth.passwordsMismatch"),
          path: ["confirmPassword"],
        }),
    [t]
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OwnerFormValues>({
    resolver: zodResolver(schema),
  });

  return (
    <form
      onSubmit={handleSubmit((data) => {
        const { firstName, lastName } = splitFullName(data.name);
        registerUser({
          firstName,
          lastName,
          email: data.email,
          password: data.password,
          role: "project_owner",
          companyName: data.companyName.trim(),
        });
      })}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label htmlFor="owner-name">{t("registerOwnerPage.name")}</Label>
        <Input
          id="owner-name"
          placeholder={t("registerOwnerPage.namePlaceholder")}
          {...register("name")}
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="owner-email">{t("auth.email")}</Label>
        <Input
          id="owner-email"
          type="email"
          placeholder={t("registerOwnerPage.emailPlaceholder")}
          {...register("email")}
        />
        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="owner-companyName">{t("auth.companyName")}</Label>
        <Input
          id="owner-companyName"
          placeholder={t("auth.companyPlaceholder")}
          {...register("companyName")}
        />
        {errors.companyName && (
          <p className="text-sm text-destructive">{errors.companyName.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="owner-password">{t("auth.password")}</Label>
        <Input id="owner-password" type="password" {...register("password")} />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="owner-confirmPassword">{t("auth.confirmPassword")}</Label>
        <Input id="owner-confirmPassword" type="password" {...register("confirmPassword")} />
        {errors.confirmPassword && (
          <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
        )}
      </div>
      <Button type="submit" className="w-full" disabled={isRegistering}>
        {isRegistering ? t("auth.creatingAccount") : t("registerPage.ownerCta")}
      </Button>
    </form>
  );
}

function RegisterPageContent() {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role");
  const initialRole: RegisterRole =
    roleParam === "project_owner" ? "project_owner" : "investor";
  const [role, setRole] = useState<RegisterRole>(initialRole);

  useEffect(() => {
    setRole(roleParam === "project_owner" ? "project_owner" : "investor");
  }, [roleParam]);

  const highlights =
    role === "project_owner"
      ? [
          { title: t("registerOwnerPage.b1Title"), body: t("registerOwnerPage.b1Body") },
          { title: t("registerOwnerPage.b2Title"), body: t("registerOwnerPage.b2Body") },
          { title: t("registerOwnerPage.b3Title"), body: t("registerOwnerPage.b3Body") },
          { title: t("registerOwnerPage.b4Title"), body: t("registerOwnerPage.b4Body") },
        ]
      : [
          { title: t("registerPage.b1Title"), body: t("registerPage.b1Body") },
          { title: t("registerPage.b2Title"), body: t("registerPage.b2Body") },
          { title: t("registerPage.b3Title"), body: t("registerPage.b3Body") },
          { title: t("registerPage.b4Title"), body: t("registerPage.b4Body") },
        ];

  const onRoleChange = (value: string) => {
    const next = value === "project_owner" ? "project_owner" : "investor";
    setRole(next);
    router.replace(`${ROUTES.REGISTER}?role=${next}`, { scroll: false });
  };

  return (
    <AuthShell
      title={t("registerPage.heroTitle")}
      subtitle={t("registerPage.heroSub")}
      highlightsTitle={t("registerPage.benefitsTitle")}
      highlights={highlights}
    >
      <Card className="border-border shadow-soft">
        <CardHeader className="text-center">
          <Link href={ROUTES.HOME} className="mb-2 inline-flex justify-center lg:hidden">
            <PlatformLogo />
          </Link>
          <CardTitle className="font-display text-xl">{t("registerPage.eyebrow")}</CardTitle>
          <CardDescription>{t("registerPage.heroSub")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={role} onValueChange={onRoleChange} className="w-full">
            <TabsList className="mb-6 grid h-auto w-full grid-cols-2 gap-1 p-1">
              <TabsTrigger
                value="investor"
                className="whitespace-normal px-2 py-2.5 text-center text-xs leading-snug sm:text-sm"
              >
                {t("registerPage.investorCta")}
              </TabsTrigger>
              <TabsTrigger
                value="project_owner"
                className="whitespace-normal px-2 py-2.5 text-center text-xs leading-snug sm:text-sm"
              >
                {t("registerPage.ownerCta")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="investor" className="mt-0">
              <InvestorRegisterForm />
            </TabsContent>
            <TabsContent value="project_owner" className="mt-0">
              <OwnerRegisterForm />
            </TabsContent>
          </Tabs>

          <div className="mt-6 border-t border-border pt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {t("registerPage.hasAccount")}{" "}
              <Link href={ROUTES.LOGIN} className="font-medium text-primary hover:underline">
                {t("registerPage.logIn")}
              </Link>
            </p>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              {t("registerOwnerPage.agreeBefore")}
              <Link href={ROUTES.TERMS} className="font-medium text-primary hover:underline">
                {t("registerOwnerPage.terms")}
              </Link>
              {t("registerOwnerPage.agreeMid")}
              <Link href={ROUTES.PRIVACY} className="font-medium text-primary hover:underline">
                {t("registerOwnerPage.privacy")}
              </Link>
              {t("registerOwnerPage.agreeAfter")}
            </p>
          </div>
        </CardContent>
      </Card>
    </AuthShell>
  );
}

export default function RegisterPage() {
  const { t } = useI18n();

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <Card className="w-full max-w-md p-8 shadow-soft">
            <p className="text-center text-sm text-muted-foreground">{t("common.loading")}</p>
          </Card>
        </div>
      }
    >
      <RegisterPageContent />
    </Suspense>
  );
}
