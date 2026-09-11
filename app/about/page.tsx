"use client";

import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Check,
  Eye,
  FileCheck,
  Lock,
  MessageSquareLock,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { MarketingHeader, MarketingFooter } from "@/components/layout/marketing-shell";
import { CtaBand } from "@/components/shared/cta-band";
import { PageHeroBanner } from "@/components/shared/page-hero-banner";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants";
import { useI18n } from "@/hooks";

export default function AboutPage() {
  const { t } = useI18n();

  const securityItems = [
    { icon: FileCheck, title: t("about.security1Title"), body: t("about.security1Body") },
    { icon: Lock, title: t("about.security2Title"), body: t("about.security2Body") },
    { icon: MessageSquareLock, title: t("about.security3Title"), body: t("about.security3Body") },
  ];

  const investorFeatures = [
    t("about.investorsF1"),
    t("about.investorsF2"),
    t("about.investorsF3"),
    t("about.investorsF4"),
    t("about.investorsF5"),
  ];

  const ownerFeatures = [
    t("about.ownersF1"),
    t("about.ownersF2"),
    t("about.ownersF3"),
    t("about.ownersF4"),
    t("about.ownersF5"),
  ];

  const principles = [
    { icon: Eye, title: t("about.p1Title"), body: t("about.p1Body") },
    { icon: ShieldCheck, title: t("about.p2Title"), body: t("about.p2Body") },
    { icon: Sparkles, title: t("about.p3Title"), body: t("about.p3Body") },
    { icon: Users, title: t("about.p4Title"), body: t("about.p4Body") },
  ];

  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />
      <PageHeroBanner
        eyebrow={t("about.eyebrow")}
        title={t("about.heroTitle")}
        description={t("about.heroSub")}
        height="md"
      />

      <section className="container-narrow section-pad py-14 lg:py-20">
        <h2 className="font-display text-2xl font-semibold sm:text-3xl">
          {t("about.missionTitle")}
        </h2>
        <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
          <p>{t("about.missionP1")}</p>
          <p>{t("about.missionP2")}</p>
        </div>
      </section>

      <section className="border-y border-border bg-secondary/30">
        <div className="container-narrow section-pad py-14 lg:py-20">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">
            {t("about.problemTitle")}
          </h2>
          <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
            <p>{t("about.problemP1")}</p>
            <p>{t("about.problemP2")}</p>
          </div>
        </div>
      </section>

      <section className="container-wide section-pad py-14 lg:py-20">
        <h2 className="font-display text-2xl font-semibold sm:text-3xl">
          {t("about.securityTitle")}
        </h2>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {securityItems.map((item) => (
            <div key={item.title} className="min-w-0 border-t border-border pt-6">
              <item.icon className="h-5 w-5 text-primary" />
              <h3 className="mt-4 font-display text-xl font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-secondary/30">
        <div className="container-wide section-pad py-14 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-primary">
                <Users className="h-4 w-4" />
                <h2 className="font-display text-2xl font-semibold text-foreground">
                  {t("about.investorsTitle")}
                </h2>
              </div>
              <p className="mt-3 font-medium">{t("about.investorsSub")}</p>
              <ul className="mt-6 space-y-2.5">
                {investorFeatures.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm leading-relaxed">
                    <Check className="h-4 w-4 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="min-w-0 border-t border-border pt-12 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-16">
              <div className="flex items-center gap-2 text-primary">
                <Building2 className="h-4 w-4" />
                <h2 className="font-display text-2xl font-semibold text-foreground">
                  {t("about.ownersTitle")}
                </h2>
              </div>
              <p className="mt-3 font-medium">{t("about.ownersSub")}</p>
              <ul className="mt-6 space-y-2.5">
                {ownerFeatures.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm leading-relaxed">
                    <Check className="h-4 w-4 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="container-wide section-pad py-14 lg:py-20">
        <h2 className="font-display text-2xl font-semibold sm:text-3xl">
          {t("about.principlesTitle")}
        </h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {principles.map((item) => (
            <div key={item.title} className="min-w-0 border-t border-border pt-6">
              <item.icon className="h-5 w-5 text-primary" />
              <h3 className="mt-4 font-display text-xl font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <CtaBand title={t("about.ctaTitle")} description={t("about.ctaBody")}>
        <Button size="lg" variant="onImage" className="shrink-0" asChild>
          <Link href={ROUTES.PROJECTS}>
            {t("about.ctaProjects")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button size="lg" variant="onImageOutline" className="shrink-0" asChild>
          <Link href={`${ROUTES.REGISTER}?role=project_owner`}>
            {t("about.ctaSubmit")}
          </Link>
        </Button>
        <Button size="lg" variant="onImageOutline" className="shrink-0" asChild>
          <Link href={ROUTES.CONTACT}>{t("about.ctaContact")}</Link>
        </Button>
      </CtaBand>
      <MarketingFooter />
    </div>
  );
}
