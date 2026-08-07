"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PLATFORM_NAME, ROUTES } from "@/constants";
import { useAuth } from "@/hooks";
import { cn } from "@/lib/utils";

const registerSchema = z
  .object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    role: z.enum(["investor", "project_owner"]),
    companyName: z.string().optional(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords don't match",
        path: ["confirmPassword"],
      });
    }
    if (data.role === "project_owner" && (!data.companyName || data.companyName.trim().length < 2)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Company name is required for project owners",
        path: ["companyName"],
      });
    }
  });

type RegisterForm = z.infer<typeof registerSchema>;

function RegisterForm() {
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role");
  const defaultRole =
    roleParam === "project_owner" || roleParam === "investor" ? roleParam : "investor";

  const { register: registerUser, isRegistering } = useAuth();
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
        <Link
          href={ROUTES.HOME}
          className="mb-2 font-display text-xl font-semibold tracking-tight text-slate-900"
        >
          {PLATFORM_NAME}
        </Link>
        <CardTitle className="text-2xl font-display">Create account</CardTitle>
        <CardDescription>Join as an investor or project owner</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>I am a...</Label>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      { value: "investor", label: "Investor" },
                      { value: "project_owner", label: "Project owner" },
                    ] as const
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
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" className="bg-white" {...register("firstName")} />
              {errors.firstName && (
                <p className="text-sm text-destructive">{errors.firstName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" className="bg-white" {...register("lastName")} />
              {errors.lastName && (
                <p className="text-sm text-destructive">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {role === "project_owner" && (
            <div className="space-y-2">
              <Label htmlFor="companyName">Company name</Label>
              <Input
                id="companyName"
                className="bg-white"
                placeholder="Your company or venture"
                {...register("companyName")}
              />
              {errors.companyName && (
                <p className="text-sm text-destructive">{errors.companyName.message}</p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" className="bg-white" {...register("email")} />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone (optional)</Label>
            <Input id="phone" type="tel" className="bg-white" {...register("phone")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" className="bg-white" {...register("password")} />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
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
            {isRegistering ? "Creating account..." : "Create Account"}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href={ROUTES.LOGIN} className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

export default function RegisterPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-50 p-4 py-10">
      <div className="pointer-events-none absolute inset-0 hero-mesh opacity-80" />
      <Suspense
        fallback={
          <Card className="w-full max-w-md border-border/80 bg-white p-8 shadow-soft">
            <p className="text-center text-sm text-muted-foreground">Loading...</p>
          </Card>
        }
      >
        <RegisterForm />
      </Suspense>
    </div>
  );
}
