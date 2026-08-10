"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { MarketingHeader, MarketingFooter } from "@/components/layout/marketing-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { contactApi } from "@/services/api";
import { getErrorMessage } from "@/services/api/client";
import { useI18n } from "@/hooks";

type FormValues = {
  name: string;
  email: string;
  message: string;
};

export default function ContactPage() {
  const { t } = useI18n();
  const [sending, setSending] = useState(false);

  const schema = useMemo(
    () =>
      z.object({
        name: z.string().min(2, t("contact.nameRequired")),
        email: z.string().email(t("contact.emailInvalid")),
        message: z.string().min(10, t("contact.messageMin")),
      }),
    [t]
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    setSending(true);
    try {
      await contactApi.send(values);
      toast.success(t("contact.sent"));
      reset();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <MarketingHeader />

      <section className="hero-mesh border-b border-border/60">
        <div className="container-narrow section-pad py-16 md:py-20 animate-fade-in">
          <p className="text-sm font-medium uppercase tracking-wide text-blue-600">
            {t("contact.eyebrow")}
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-slate-900">
            {t("contact.heroTitle")}
          </h1>
          <p className="mt-4 max-w-xl text-muted-foreground">{t("contact.heroSub")}</p>
        </div>
      </section>

      <section className="container-narrow section-pad py-16">
        <div className="mx-auto max-w-xl animate-slide-up">
          <Card className="border-border/80 shadow-soft">
            <CardHeader>
              <CardTitle className="font-display text-xl">{t("contact.formTitle")}</CardTitle>
              <CardDescription>{t("contact.formDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t("contact.name")}</Label>
                  <Input
                    id="name"
                    placeholder={t("contact.namePlaceholder")}
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t("contact.email")}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("contact.emailPlaceholder")}
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">{t("contact.message")}</Label>
                  <textarea
                    id="message"
                    rows={5}
                    placeholder={t("contact.messagePlaceholder")}
                    className="flex w-full rounded-lg border border-border bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    {...register("message")}
                  />
                  {errors.message && (
                    <p className="text-sm text-destructive">{errors.message.message}</p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={sending}>
                  {sending ? t("common.sending") : t("contact.send")}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
