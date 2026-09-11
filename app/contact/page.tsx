"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowRight, Check, Clock, Mail } from "lucide-react";
import { MarketingHeader, MarketingFooter } from "@/components/layout/marketing-shell";
import { PageHeroBanner } from "@/components/shared/page-hero-banner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ROUTES } from "@/constants";
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
  const supportEmail = t("contact.supportEmail");
  const topics = [
    t("contact.topic1"),
    t("contact.topic2"),
    t("contact.topic3"),
    t("contact.topic4"),
  ];

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
        description={t("contact.heroSub")}
        height="md"
      />

      <section className="border-y border-border bg-secondary/30">
        <div className="container-wide section-pad py-14 lg:py-20">
          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="min-w-0">
              <h2 className="font-display text-2xl font-semibold">{t("contact.emailHeading")}</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">{t("contact.emailIntro")}</p>

              <a
                href={`mailto:${supportEmail}`}
                className="mt-8 flex w-full items-center gap-4 rounded-xl border border-border bg-card p-4 transition hover:border-primary/40"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Mail className="h-5 w-5 text-primary" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm text-muted-foreground">{t("contact.email")}</span>
                  <span className="mt-0.5 block font-medium">{supportEmail}</span>
                </span>
              </a>

              <div className="mt-10">
                <h3 className="font-display text-lg font-semibold">{t("contact.topicsTitle")}</h3>
                <ul className="mt-5 space-y-2.5">
                  {topics.map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm leading-relaxed">
                      <Check className="h-4 w-4 shrink-0 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 flex items-center gap-3 text-sm leading-relaxed text-muted-foreground">
                <Clock className="h-4 w-4 shrink-0 text-primary" />
                <p>
                  <span className="font-medium text-foreground">{t("contact.responseLabel")}. </span>
                  {t("contact.responseTime")}
                </p>
              </div>

              <Link
                href={ROUTES.FAQ}
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary transition hover:text-primary/80"
              >
                {t("contact.faqLink")}
                <ArrowRight className="h-4 w-4" />
              </Link>

              <p className="mt-8 border-l-2 border-primary/30 pl-4 text-sm leading-relaxed text-muted-foreground">
                {t("contact.offerNote")}
              </p>
            </div>

            <div className="min-w-0 rounded-2xl border border-border bg-card p-6 sm:p-8">
              <h2 className="font-display text-2xl font-semibold">{t("contact.formTitle")}</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">{t("contact.formDesc")}</p>
              <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t("contact.name")}</Label>
                  <Input id="name" placeholder={t("contact.namePlaceholder")} {...register("name")} />
                  {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
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
                  <Textarea
                    id="message"
                    rows={5}
                    placeholder={t("contact.messagePlaceholder")}
                    {...register("message")}
                  />
                  {errors.message && (
                    <p className="text-sm text-destructive">{errors.message.message}</p>
                  )}
                </div>
                <Button type="submit" disabled={sending}>
                  {sending ? t("common.sending") : t("contact.send")}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
