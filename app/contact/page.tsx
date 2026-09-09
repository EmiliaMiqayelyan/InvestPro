"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Mail } from "lucide-react";
import { MarketingHeader, MarketingFooter } from "@/components/layout/marketing-shell";
import { PageHeroBanner } from "@/components/shared/page-hero-banner";
import { ThematicImage } from "@/components/shared/thematic-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { contactApi } from "@/services/api";
import { getErrorMessage } from "@/services/api/client";
import { THEMATIC_IMAGES } from "@/constants/thematic-images";
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
    <div className="min-h-screen bg-background">
      <MarketingHeader />

      <PageHeroBanner
        eyebrow={t("contact.eyebrow")}
        title={t("contact.heroTitle")}
        height="md"
      />

      <section className="py-16 lg:py-24">
        <div className="container-wide section-pad">
          <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="space-y-8">
              <ThematicImage
                src={THEMATIC_IMAGES.sections.team}
                alt="Support team collaboration"
                aspect="auto"
                overlay="bottom"
                className="aspect-[3/2] max-h-[200px] shadow-soft"
                sizes="(max-width:1024px) 100vw, 40vw"
              />
              <p className="text-sm leading-relaxed text-muted-foreground">{t("contact.heroSub")}</p>
              <div className="surface-card px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t("contact.email")}</p>
                    <p className="text-sm font-medium">hello@investin.am</p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="surface-card border-none shadow-soft">
              <CardHeader>
                <CardTitle className="font-display text-xl">{t("contact.formTitle")}</CardTitle>
                <CardDescription>{t("contact.formDesc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t("contact.name")}</Label>
                    <Input id="name" placeholder={t("contact.namePlaceholder")} {...register("name")} />
                    {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{t("contact.email")}</Label>
                    <Input id="email" type="email" placeholder={t("contact.emailPlaceholder")} {...register("email")} />
                    {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">{t("contact.message")}</Label>
                    <Textarea
                      id="message"
                      rows={5}
                      placeholder={t("contact.messagePlaceholder")}
                      {...register("message")}
                    />
                    {errors.message && <p className="text-sm text-destructive">{errors.message.message}</p>}
                  </div>
                  <Button type="submit" className="w-full" disabled={sending}>
                    {sending ? t("common.sending") : t("contact.send")}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
