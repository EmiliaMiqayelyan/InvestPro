"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { QUERY_KEYS } from "@/constants";
import { usersApi } from "@/services/api";
import { useAuthStore } from "@/store";
import { getErrorMessage } from "@/services/api/client";
import { useI18n } from "@/hooks";
import { useSetPageTitle } from "@/components/providers/page-title-provider";
import { PageHeader } from "@/components/shared/page-header";
import { toast } from "sonner";

const schema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  phone: z.string().optional(),
  companyName: z.string().optional(),
  bio: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function ProfileForm() {
  const { t } = useI18n();
  const { user, setUser } = useAuthStore();
  const queryClient = useQueryClient();

  useSetPageTitle(t("nav.profile"));

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phone || "",
      companyName: user?.companyName || "",
      bio: user?.bio || "",
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: FormData) => usersApi.updateProfile(data),
    onSuccess: (response) => {
      setUser(response.data.data);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER] });
      toast.success(t("ownerReview.savedToast"));
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader variant="minimal" title={t("nav.profile")} />

      <Card className="premium-card border-border bg-white shadow-none backdrop-blur-none">
        <CardHeader>
          <CardTitle className="text-slate-900">{t("nav.profile")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit((d) => updateMutation.mutate(d))}
            className="space-y-4"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>{t("auth.firstName")}</Label>
                <Input {...register("firstName")} />
                {errors.firstName && (
                  <p className="text-sm text-destructive">{errors.firstName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>{t("auth.lastName")}</Label>
                <Input {...register("lastName")} />
                {errors.lastName && (
                  <p className="text-sm text-destructive">{errors.lastName.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t("auth.email")}</Label>
              <Input value={user?.email || ""} disabled />
            </div>
            <div className="space-y-2">
              <Label>{t("auth.phone")}</Label>
              <Input {...register("phone")} />
            </div>
            <div className="space-y-2">
              <Label>{t("auth.companyName")}</Label>
              <Input {...register("companyName")} />
            </div>
            <div className="space-y-2">
              <Label>{t("admin.ownerBio")}</Label>
              <Textarea {...register("bio")} rows={4} />
            </div>
            {user?.membershipTier && user.role === "investor" && (
              <p className="text-sm text-muted-foreground">
                {t("admin.colMembership")}:{" "}
                <span className="font-medium capitalize text-slate-800">
                  {user.membershipTier}
                </span>
              </p>
            )}
            <Button
              type="submit"
              variant="gradient"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? t("common.saving") : t("common.save")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
