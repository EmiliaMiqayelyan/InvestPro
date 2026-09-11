"use client";

import { Suspense, useEffect, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowRight,
  Briefcase,
  Building2,
  FileText,
  FolderOpen,
  ListChecks,
  MessageSquareLock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/constants";
import { useAuth, useI18n } from "@/hooks";
import { AuthShell } from "@/components/layout/auth-shell";
import { MarketingHeader, MarketingFooter } from "@/components/layout/marketing-shell";
import { CtaBand } from "@/components/shared/cta-band";
import { PageHeroBanner } from "@/components/shared/page-hero-banner";
import { PlatformLogo } from "@/components/shared/platform-logo";
import { cn } from "@/lib/utils";

type RegisterForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: "investor" | "project_owner";
  companyName?: string;
  password: string;
  confirmPassword: string;
};

type OwnerRegisterFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

function splitFullName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  const firstName = parts[0] ?? "";
  const lastName = parts.length > 1 ? parts.slice(1).join(" ") : firstName;
  return { firstName, lastName };
}

function RegisterLanding() {
  const { t } = useI18n();
  const roles = [
    {
      icon: Briefcase,
      title: t("registerPage.investorTitle"),
      body: t("registerPage.investorBody"),
      cta: t("registerPage.investorCta"),
      href: `${ROUTES.REGISTER}?role=investor`,
    },
    {
      icon: Building2,
      title: t("registerPage.ownerTitle"),
      body: t("registerPage.ownerBody"),
      cta: t("registerPage.ownerCta"),
      href: `${ROUTES.REGISTER}?role=project_owner`,
    },
  ];
  const benefits = [
    { icon: FolderOpen, title: t("registerPage.b1Title"), body: t("registerPage.b1Body") },
    { icon: FileText, title: t("registerPage.b2Title"), body: t("registerPage.b2Body") },
    { icon: MessageSquareLock, title: t("registerPage.b3Title"), body: t("registerPage.b3Body") },
    { icon: ListChecks, title: t("registerPage.b4Title"), body: t("registerPage.b4Body") },
  ];

  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />
      <PageHeroBanner
        eyebrow={t("registerPage.eyebrow")}
        title={t("registerPage.heroTitle")}
        description={t("registerPage.heroSub")}
        height="md"
      />
      <section className="container-wide section-pad py-14 lg:py-20">
        <h2 className="font-display text-2xl font-semibold sm:text-3xl">
          {t("registerPage.chooseTitle")}
        </h2>
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          {roles.map((role) => (
            <article key={role.title} className="min-w-0 border-t border-border pt-6">
              <role.icon className="h-5 w-5 text-primary" />
              <h3 className="mt-4 font-display text-xl font-semibold">{role.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{role.body}</p>
              <Button className="mt-6" asChild>
                <Link href={role.href}>
                  {role.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </article>
          ))}
        </div>
      </section>
      <section className="border-y border-border bg-secondary/30">
        <div className="container-wide section-pad py-14 lg:py-20">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">
            {t("registerPage.benefitsTitle")}
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((item) => (
              <div key={item.title} className="min-w-0 border-t border-border pt-6">
                <item.icon className="h-5 w-5 text-primary" />
                <h3 className="mt-4 font-display text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CtaBand title={t("registerPage.hasAccount")}>
        <Button size="lg" variant="onImage" className="shrink-0" asChild>
          <Link href={ROUTES.LOGIN}>
            {t("registerPage.logIn")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CtaBand>
      <MarketingFooter />
    </div>
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
          password: z.string().min(8, t("auth.passwordMin8")),
          confirmPassword: z.string(),
        })
        .superRefine((data, ctx) => {
          if (data.password !== data.confirmPassword) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t("auth.passwordsMismatch"),
              path: ["confirmPassword"],
            });
          }
        }),
    [t]
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OwnerRegisterFormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: OwnerRegisterFormValues) => {
    const { firstName, lastName } = splitFullName(data.name);
    registerUser({
      firstName,
      lastName,
      email: data.email,
      password: data.password,
      role: "project_owner",
    });
  };

  return (
    <Card className="relative w-full max-w-md shadow-soft">
      <CardHeader className="space-y-2 pb-4 text-center">
        <Link href={ROUTES.HOME} className="mb-1 inline-flex justify-center lg:hidden">
          <PlatformLogo />
        </Link>
        <CardTitle className="text-2xl font-display">{t("registerOwnerPage.formTitle")}</CardTitle>
        <CardDescription>{t("registerOwnerPage.heroSub")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="name">{t("registerOwnerPage.name")}</Label>
            <Input
              id="name"
              className="bg-white"
              placeholder={t("registerOwnerPage.namePlaceholder")}
              {...register("name")}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t("registerOwnerPage.email")}</Label>
            <Input
              id="email"
              type="email"
              className="bg-white"
              placeholder={t("registerOwnerPage.emailPlaceholder")}
              {...register("email")}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t("registerOwnerPage.password")}</Label>
            <Input
              id="password"
              type="password"
              className="bg-white"
              placeholder={t("registerOwnerPage.passwordPlaceholder")}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{t("registerOwnerPage.confirmPassword")}</Label>
            <Input
              id="confirmPassword"
              type="password"
              className="bg-white"
              placeholder={t("registerOwnerPage.confirmPlaceholder")}
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isRegistering}>
            {isRegistering ? t("auth.creatingAccount") : t("registerOwnerPage.submit")}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          {t("registerOwnerPage.hasAccount")}{" "}
          <Link href={ROUTES.LOGIN} className="font-medium text-teal-800 hover:underline">
            {t("registerOwnerPage.logIn")}
          </Link>
        </p>
        <p className="mt-3 text-center text-xs leading-relaxed text-muted-foreground">
          {t("registerOwnerPage.agreeBefore")}
          <Link href={ROUTES.TERMS} className="font-medium text-teal-800 hover:underline">
            {t("registerOwnerPage.terms")}
          </Link>
          {t("registerOwnerPage.agreeMid")}
          <Link href={ROUTES.PRIVACY} className="font-medium text-teal-800 hover:underline">
            {t("registerOwnerPage.privacy")}
          </Link>{t("registerOwnerPage.agreeAfter")}
        </p>
      </CardContent>
    </Card>
  );
}

function RegisterForm() {
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role");
  const defaultRole =
    roleParam === "project_owner" || roleParam === "investor" ? roleParam : "investor";

  const { register: registerUser, isRegistering } = useAuth();
  const { t } = useI18n();

  const registerSchema = useMemo(
    () =>
      z
        .object({
          firstName: z.string().min(2, t("auth.firstNameRequired")),
          lastName: z.string().min(2, t("auth.lastNameRequired")),
          email: z.string().email(t("auth.invalidEmail")),
          phone: z.string().optional(),
          role: z.enum(["investor", "project_owner"]),
          companyName: z.string().optional(),
          password: z.string().min(8, t("auth.passwordMin8")),
          confirmPassword: z.string(),
        })
        .superRefine((data, ctx) => {
          if (data.password !== data.confirmPassword) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t("auth.passwordsMismatch"),
              path: ["confirmPassword"],
            });
          }
          if (
            data.role === "project_owner" &&
            (!data.companyName || data.companyName.trim().length < 2)
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t("auth.companyRequired"),
              path: ["companyName"],
            });
          }
        }),
    [t]
  );

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: defaultRole,
      companyName: "",
    },
  });

  const role = watch("role");

  useEffect(() => {
    if (roleParam === "investor" || roleParam === "project_owner") {
      setValue("role", roleParam);
    }
  }, [roleParam, setValue]);

  const onSubmit = (data: RegisterForm) => {
    const { confirmPassword: _, ...registerData } = data;
    registerUser({
      ...registerData,
      companyName:
        data.role === "project_owner" ? data.companyName?.trim() || undefined : undefined,
    });
  };

  return (
    <Card className="relative w-full max-w-md shadow-soft animate-slide-up">
      <CardHeader className="text-center lg:hidden">
        <Link href={ROUTES.HOME} className="mb-2 inline-flex justify-center">
          <PlatformLogo />
        </Link>
      </CardHeader>
      <CardHeader className="hidden text-center lg:block">
        <CardTitle className="text-2xl font-display">{t("registerPage.eyebrow")}</CardTitle>
        <CardDescription>{t("registerPage.heroSub")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>{t("registerPage.chooseTitle")}</Label>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      { value: "investor" as const, label: t("registerPage.investorTitle") },
                      { value: "project_owner" as const, label: t("registerPage.ownerTitle") },
                    ]
                  ).map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => field.onChange(option.value)}
                      className={cn(
                        "rounded-lg border px-3 py-2.5 text-sm font-medium transition",
                        field.value === option.value
                          ? option.value === "investor"
                            ? "border-teal-700 bg-teal-50 text-teal-900"
                            : "border-brand-gold bg-amber-50 text-amber-900"
                          : "border-border bg-white text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            />
            {errors.role && (
              <p className="text-sm text-destructive">{errors.role.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">{t("auth.firstName")}</Label>
              <Input id="firstName" className="bg-white" {...register("firstName")} />
              {errors.firstName && (
                <p className="text-sm text-destructive">{errors.firstName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">{t("auth.lastName")}</Label>
              <Input id="lastName" className="bg-white" {...register("lastName")} />
              {errors.lastName && (
                <p className="text-sm text-destructive">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {role === "project_owner" && (
            <div className="space-y-2">
              <Label htmlFor="companyName">{t("auth.companyName")}</Label>
              <Input
                id="companyName"
                className="bg-white"
                placeholder={t("auth.companyPlaceholder")}
                {...register("companyName")}
              />
              {errors.companyName && (
                <p className="text-sm text-destructive">{errors.companyName.message}</p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">{t("auth.email")}</Label>
            <Input id="email" type="email" className="bg-white" {...register("email")} />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">{t("auth.phoneOptional")}</Label>
            <Input id="phone" type="tel" className="bg-white" {...register("phone")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t("auth.password")}</Label>
            <Input id="password" type="password" className="bg-white" {...register("password")} />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{t("auth.confirmPassword")}</Label>
            <Input
              id="confirmPassword"
              type="password"
              className="bg-white"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isRegistering}>
            {isRegistering
              ? t("auth.creatingAccount")
              : role === "project_owner"
                ? t("registerPage.ownerCta")
                : t("registerPage.investorCta")}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {t("registerPage.hasAccount")}{" "}
          <Link href={ROUTES.LOGIN} className="font-medium text-teal-800 hover:underline">
            {t("registerPage.logIn")}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

function RegisterPageContent() {
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role");

  if (roleParam !== "investor" && roleParam !== "project_owner") {
    return <RegisterLanding />;
  }

  if (roleParam === "project_owner") {
    return (
      <AuthShell
        title={t("registerOwnerPage.heroTitle")}
        subtitle={t("registerOwnerPage.heroSub")}
        highlightsTitle={t("registerOwnerPage.benefitsTitle")}
        highlights={[
          { title: t("registerOwnerPage.b1Title"), body: t("registerOwnerPage.b1Body") },
          { title: t("registerOwnerPage.b2Title"), body: t("registerOwnerPage.b2Body") },
          { title: t("registerOwnerPage.b3Title"), body: t("registerOwnerPage.b3Body") },
          { title: t("registerOwnerPage.b4Title"), body: t("registerOwnerPage.b4Body") },
        ]}
      >
        <OwnerRegisterForm />
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title={t("registerPage.heroTitle")}
      subtitle={t("registerPage.heroSub")}
      highlightsTitle={t("registerPage.benefitsTitle")}
      highlights={[
        { title: t("registerPage.b1Title"), body: t("registerPage.b1Body") },
        { title: t("registerPage.b2Title"), body: t("registerPage.b2Body") },
        { title: t("registerPage.b3Title"), body: t("registerPage.b3Body") },
        { title: t("registerPage.b4Title"), body: t("registerPage.b4Body") },
      ]}
    >
      <RegisterForm />
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
