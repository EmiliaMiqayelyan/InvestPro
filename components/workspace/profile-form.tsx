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
import { PanelPage } from "@/components/shared/panel-page";
import { toast } from "sonner";

type FormData = {
  firstName: string;
  lastName: string;
  phone?: string;
  companyName?: string;
  bio?: string;
};

export function ProfileForm() {
  const { t } = useI18n();
  const { user, setUser } = useAuthStore();
  const queryClient = useQueryClient();

  useSetPageTitle(t("nav.profile"));

  const schema = z.object({
    firstName: z.string().min(2, t("auth.firstNameRequired")),
    lastName: z.string().min(2, t("auth.lastNameRequired")),
    phone: z.string().optional(),
    companyName: z.string().optional(),
    bio: z.string().optional(),
  });

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
    <PanelPage maxWidth="form">
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">{t("nav.profile")}</CardTitle>
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
              <Label>{t("auth.phoneOptional")}</Label>
              <Input {...register("phone")} />
            </div>
            <div className="space-y-2">
              <Label>{t("auth.companyName")}</Label>
              <Input {...register("companyName")} />
            </div>
            <div className="space-y-2">
              <Label>{t("admin.ownerBio")}</Label>
              <Textarea rows={4} {...register("bio")} />
            </div>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? t("common.saving") : t("common.save")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </PanelPage>
  );
}
