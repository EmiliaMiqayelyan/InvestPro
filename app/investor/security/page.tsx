"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Key, Shield, Smartphone } from "lucide-react";
import { authApi } from "@/services/api";
import { useAuthStore } from "@/store";
import { getErrorMessage } from "@/services/api/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useI18n } from "@/hooks";
import { useSetPageTitle } from "@/components/providers/page-title-provider";
import { PanelPage } from "@/components/shared/panel-page";
import { toast } from "sonner";

type PasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function InvestorSecurityPage() {
  const { t } = useI18n();
  const { user, setUser } = useAuthStore();
  useSetPageTitle(t("nav.security"));
  const [show2faSetup, setShow2faSetup] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [twoFaCode, setTwoFaCode] = useState("");

  const passwordSchema = z
    .object({
      currentPassword: z.string().min(8, t("auth.passwordMin8")),
      newPassword: z.string().min(8, t("auth.passwordMin8")),
      confirmPassword: z.string(),
    })
    .refine((d) => d.newPassword === d.confirmPassword, {
      message: t("auth.passwordsMismatch"),
      path: ["confirmPassword"],
    });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data: PasswordForm) =>
      authApi.changePassword(data.currentPassword, data.newPassword),
    onSuccess: () => {
      toast.success(t("auth.passwordChanged"));
      reset();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const enable2faMutation = useMutation({
    mutationFn: () => authApi.enable2fa(),
    onSuccess: (response) => {
      setQrCode(response.data.data.qrCode);
      setShow2faSetup(true);
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const confirm2faMutation = useMutation({
    mutationFn: () => authApi.confirm2fa(twoFaCode),
    onSuccess: () => {
      if (user) setUser({ ...user, is2faEnabled: true });
      toast.success(t("auth.twoFaEnabledToast"));
      setShow2faSetup(false);
      setTwoFaCode("");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const disable2faMutation = useMutation({
    mutationFn: () => authApi.disable2fa(twoFaCode),
    onSuccess: () => {
      if (user) setUser({ ...user, is2faEnabled: false });
      toast.success(t("auth.twoFaDisabledToast"));
      setTwoFaCode("");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return (
    <PanelPage maxWidth="form">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Key className="h-5 w-5 text-primary" /> {t("auth.changePassword")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit((d) => changePasswordMutation.mutate(d))}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label>{t("auth.currentPassword")}</Label>
              <Input type="password" {...register("currentPassword")} />
            </div>
            <div className="space-y-2">
              <Label>{t("auth.newPassword")}</Label>
              <Input type="password" {...register("newPassword")} />
            </div>
            <div className="space-y-2">
              <Label>{t("auth.confirmNewPassword")}</Label>
              <Input type="password" {...register("confirmPassword")} />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>
            <Button
              type="submit"
              variant="gradient"
              disabled={changePasswordMutation.isPending}
            >
              {t("auth.updatePassword")}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Smartphone className="h-5 w-5 text-primary" /> {t("auth.twoFactorAuth")}
          </CardTitle>
          <CardDescription>{t("auth.twoFactorAuthDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">{t("auth.authenticatorApp")}</p>
              <p className="text-sm text-muted-foreground">
                {user?.is2faEnabled ? t("auth.twoFaEnabled") : t("auth.twoFaDisabled")}
              </p>
            </div>
            <Switch checked={!!user?.is2faEnabled} disabled />
          </div>
          {user?.is2faEnabled ? (
            <div className="space-y-2">
              <Input
                placeholder={t("auth.enterCodeToDisable")}
                value={twoFaCode}
                onChange={(e) => setTwoFaCode(e.target.value)}
              />
              <Button
                variant="destructive"
                onClick={() => disable2faMutation.mutate()}
                disabled={disable2faMutation.isPending}
              >
                {t("auth.disable2fa")}
              </Button>
            </div>
          ) : (
            <Button
              variant="gradient"
              onClick={() => enable2faMutation.mutate()}
              disabled={enable2faMutation.isPending}
            >
              <Shield className="h-4 w-4" /> {t("auth.enable2fa")}
            </Button>
          )}
        </CardContent>
      </Card>

      <Dialog open={show2faSetup} onOpenChange={setShow2faSetup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("auth.setup2fa")}</DialogTitle>
            <DialogDescription>{t("auth.setup2faDesc")}</DialogDescription>
          </DialogHeader>
          {qrCode && (
            <div className="flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrCode} alt={t("auth.qrCodeAlt")} className="h-48 w-48" />
            </div>
          )}
          <Input
            placeholder={t("auth.enter6DigitCode")}
            value={twoFaCode}
            onChange={(e) => setTwoFaCode(e.target.value)}
            maxLength={6}
          />
          <Button
            variant="gradient"
            onClick={() => confirm2faMutation.mutate()}
            disabled={confirm2faMutation.isPending}
          >
            {t("auth.confirmSetup")}
          </Button>
        </DialogContent>
      </Dialog>
    </PanelPage>
  );
}
