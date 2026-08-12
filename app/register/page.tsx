"use client";

import { Suspense, useEffect, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/constants";
import { useAuth, useI18n } from "@/hooks";
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
    <Card className="relative w-full max-w-md border-border/80 bg-white shadow-soft animate-slide-up">
      <CardHeader className="text-center">
        <Link href={ROUTES.HOME} className="mb-2 inline-flex justify-center">
          <PlatformLogo />
        </Link>
        <CardTitle className="text-2xl font-display">{t("auth.createAccountShort")}</CardTitle>
        <CardDescription>{t("auth.joinAs")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>{t("auth.iAmA")}</Label>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      { value: "investor" as const, label: t("auth.investor") },
                      { value: "project_owner" as const, label: t("auth.projectOwner") },
                    ]
                  ).map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => field.onChange(option.value)}
                      className={cn(
                        "rounded-lg border px-3 py-2.5 text-sm font-medium transition",
                        field.value === option.value
                          ? "border-blue-600 bg-blue-50 text-blue-700"
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
            {isRegistering ? t("auth.creatingAccount") : t("auth.createAccountShort")}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {t("auth.hasAccount")}{" "}
          <Link href={ROUTES.LOGIN} className="text-primary hover:underline">
            {t("common.signIn")}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

export default function RegisterPage() {
  const { t } = useI18n();

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-50 p-4 py-10">
      <div className="pointer-events-none absolute inset-0 hero-mesh opacity-80" />
      <Suspense
        fallback={
          <Card className="w-full max-w-md border-border/80 bg-white p-8 shadow-soft">
            <p className="text-center text-sm text-muted-foreground">{t("common.loading")}</p>
          </Card>
        }
      >
        <RegisterForm />
      </Suspense>
    </div>
  );
}
