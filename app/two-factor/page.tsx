"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authApi } from "@/services/api";
import { useAuthStore } from "@/store";
import { getErrorMessage } from "@/services/api/client";
import { getRoleHome } from "@/lib/rbac";
import { useI18n } from "@/hooks";
import { toast } from "sonner";

type FormData = {
  code: string;
};

export default function TwoFactorPage() {
  const router = useRouter();
  const { t } = useI18n();
  const { tempToken, login, setRequires2fa } = useAuthStore();
  const schema = z.object({
    code: z.string().length(6, t("auth.codeMustBe6")),
  });
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      authApi.verify2fa({ code: data.code, tempToken: tempToken || undefined }),
    onSuccess: (response) => {
      const { user, tokens } = response.data.data;
      login(user, tokens.accessToken, tokens.refreshToken);
      setRequires2fa(false);
      toast.success(t("auth.twoFactorVerified"));
      router.push(getRoleHome(user.role));
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md animate-slide-up">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 rounded-full bg-primary/10 p-3 w-fit">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">{t("auth.twoFactorTitle")}</CardTitle>
          <CardDescription>{t("auth.twoFactorDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">{t("auth.authCode")}</Label>
              <Input
                id="code"
                placeholder="000000"
                maxLength={6}
                className="text-center text-2xl tracking-widest"
                {...register("code")}
              />
              {errors.code && (
                <p className="text-sm text-destructive">{errors.code.message}</p>
              )}
            </div>
            <Button type="submit" variant="gradient" className="w-full" disabled={mutation.isPending}>
              {mutation.isPending ? t("common.verifying") : t("auth.verify")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
