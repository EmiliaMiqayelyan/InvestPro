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
import { toast } from "sonner";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(6),
    newPassword: z.string().min(8),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type PasswordForm = z.infer<typeof passwordSchema>;

export default function InvestorSecurityPage() {
  const { user } = useAuthStore();
  const [show2faSetup, setShow2faSetup] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [twoFaCode, setTwoFaCode] = useState("");

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
      toast.success("Password changed");
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
      toast.success("2FA enabled");
      setShow2faSetup(false);
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const disable2faMutation = useMutation({
    mutationFn: () => authApi.disable2fa(twoFaCode),
    onSuccess: () => toast.success("2FA disabled"),
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold text-slate-900">Security</h2>
        <p className="text-sm text-muted-foreground">Password and two-factor authentication</p>
      </div>

      <Card className="premium-card border-border bg-white shadow-none backdrop-blur-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <Key className="h-5 w-5 text-blue-600" /> Change password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit((d) => changePasswordMutation.mutate(d))}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label>Current password</Label>
              <Input type="password" {...register("currentPassword")} />
            </div>
            <div className="space-y-2">
              <Label>New password</Label>
              <Input type="password" {...register("newPassword")} />
            </div>
            <div className="space-y-2">
              <Label>Confirm new password</Label>
              <Input type="password" {...register("confirmPassword")} />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={changePasswordMutation.isPending}
            >
              Update password
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="premium-card border-border bg-white shadow-none backdrop-blur-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <Smartphone className="h-5 w-5 text-blue-600" /> Two-factor authentication
          </CardTitle>
          <CardDescription>Add an extra layer of security to your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900">Authenticator app</p>
              <p className="text-sm text-muted-foreground">
                {user?.is2faEnabled ? "2FA is enabled" : "2FA is disabled"}
              </p>
            </div>
            <Switch checked={!!user?.is2faEnabled} disabled />
          </div>
          {user?.is2faEnabled ? (
            <div className="space-y-2">
              <Input
                placeholder="Enter 2FA code to disable"
                value={twoFaCode}
                onChange={(e) => setTwoFaCode(e.target.value)}
              />
              <Button
                variant="destructive"
                onClick={() => disable2faMutation.mutate()}
                disabled={disable2faMutation.isPending}
              >
                Disable 2FA
              </Button>
            </div>
          ) : (
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => enable2faMutation.mutate()}
              disabled={enable2faMutation.isPending}
            >
              <Shield className="h-4 w-4" /> Enable 2FA
            </Button>
          )}
        </CardContent>
      </Card>

      <Dialog open={show2faSetup} onOpenChange={setShow2faSetup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Setup 2FA</DialogTitle>
            <DialogDescription>
              Scan the QR code with your authenticator app, then enter the code
            </DialogDescription>
          </DialogHeader>
          {qrCode && (
            <div className="flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrCode} alt="2FA QR Code" className="h-48 w-48" />
            </div>
          )}
          <Input
            placeholder="Enter 6-digit code"
            value={twoFaCode}
            onChange={(e) => setTwoFaCode(e.target.value)}
            maxLength={6}
          />
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => confirm2faMutation.mutate()}
            disabled={confirm2faMutation.isPending}
          >
            Confirm setup
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
