"use client";

import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Check,
  FileSearch,
  FolderOpen,
  MessageSquareLock,
  ShieldCheck,
  Users,
} from "lucide-react";
import { MarketingHeader, MarketingFooter } from "@/components/layout/marketing-shell";
import { PageHeroBanner } from "@/components/shared/page-hero-banner";
import { ImageSplitSection } from "@/components/shared/image-split-section";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants";
import { THEMATIC_IMAGES } from "@/constants/thematic-images";
import { useI18n } from "@/hooks";

export default function AboutPage() {
  const { t } = useI18n();

  const ownerFeatures = [
    t("about.ownersF1"),
    t("about.ownersF2"),
    t("about.ownersF3"),
    t("about.ownersF4"),
    t("about.ownersF5"),
    t("about.ownersF6"),
  ];

  const investorFeatures = [
    t("about.investorsF1"),
    t("about.investorsF2"),
    t("about.investorsF3"),
    t("about.investorsF4"),
    t("about.investorsF5"),
    t("about.investorsF6"),
    t("about.investorsF7"),
  ];

  const whyItems = [
    { n: "01", title: t("about.why1Title"), body: t("about.why1Body") },
    { n: "02", title: t("about.why2Title"), body: t("about.why2Body") },
    { n: "03", title: t("about.why3Title"), body: t("about.why3Body") },
    { n: "04", title: t("about.why4Title"), body: t("about.why4Body") },
  ];

  const trustItems = [
    { icon: ShieldCheck, title: t("about.trust1Title"), body: t("about.trust1Body") },
    { icon: FolderOpen, title: t("about.trust2Title"), body: t("about.trust2Body") },
    { icon: MessageSquareLock, title: t("about.trust3Title"), body: t("about.trust3Body") },
    { icon: FileSearch, title: t("about.trust4Title"), body: t("about.trust4Body") },
  ];

  const journey = [
    t("about.journey1"),
    t("about.journey2"),
    t("about.journey3"),
    t("about.journey4"),
    t("about.journey5"),
  ];

  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />

      <PageHeroBanner
        imageSrc={THEMATIC_IMAGES.hero.growth}
        imageAlt="Business growth and analytics"
        eyebrow={t("about.eyebrow")}
        title={t("about.heroTitle")}
        description={t("about.heroSub")}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button size="lg" variant="onImage" asChild>
            <Link href={ROUTES.PROJECTS}>
              {t("landing.exploreProjects")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="onImageOutline" asChild>
            <Link href={`${ROUTES.REGISTER}?role=project_owner`}>
              {t("landing.publishProject")}
            </Link>
          </Button>
        </div>
      </PageHeroBanner>

      <ImageSplitSection
        imageSrc={THEMATIC_IMAGES.sections.mission}
        imageAlt="Modern city skyline representing our mission"
        imagePosition="right"
        bordered
        compact
      >
        <h2 className="font-display text-3xl font-semibold">{t("about.missionTitle")}</h2>
        <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
          <p>{t("about.missionP1")}</p>
          <p>{t("about.missionP2")}</p>
        </div>
      </ImageSplitSection>

      <section className="border-b border-border bg-secondary/30 py-20">
        <div className="container-wide section-pad">
          <SectionHeading title={t("about.ecoTitle")} description={t("about.ecoSub")} />
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <article className="surface-card flex flex-col p-7 md:p-8">
              <div className="flex items-center gap-2 text-primary">
                <Building2 className="h-4 w-4" />
                <p className="text-xs font-medium uppercase tracking-wider">{t("about.ownersLabel")}</p>
              </div>
              <h3 className="mt-4 font-display text-2xl font-semibold">{t("about.ownersTitle")}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t("about.ownersBody")}</p>
              <ul className="mt-6 flex-1 space-y-2.5">
                {ownerFeatures.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button className="mt-8 w-full sm:w-auto" asChild>
                <Link href={`${ROUTES.REGISTER}?role=project_owner`}>
                  {t("about.ownersCta")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </article>

            <article className="surface-card flex flex-col p-7 md:p-8">
              <div className="flex items-center gap-2 text-primary">
                <Users className="h-4 w-4" />
                <p className="text-xs font-medium uppercase tracking-wider">{t("about.investorsLabel")}</p>
              </div>
              <h3 className="mt-4 font-display text-2xl font-semibold">{t("about.investorsTitle")}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t("about.investorsBody")}</p>
              <ul className="mt-6 flex-1 space-y-2.5">
                {investorFeatures.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button className="mt-8 w-full sm:w-auto" variant="outline" asChild>
                <Link href={ROUTES.PROJECTS}>
                  {t("about.investorsCta")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </article>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-secondary/30 py-20">
        <div className="container-narrow section-pad">
          <SectionHeading title={t("about.whyTitle")} />
          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {whyItems.map((item) => (
              <div key={item.n} className="border-t border-border pt-6">
                <p className="text-xs font-medium tracking-wider text-primary">{item.n}</p>
                <h3 className="mt-3 font-display text-xl font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ImageSplitSection
        imageSrc={THEMATIC_IMAGES.sections.security}
        imageAlt="Platform security and trust"
        imagePosition="left"
        compact
      >
        <SectionHeading title={t("about.trustTitle")} description={t("about.trustSub")} />
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {trustItems.map((item) => (
            <div key={item.title} className="surface-card p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <item.icon className="h-4 w-4" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 border-l-2 border-primary/30 pl-4 text-sm leading-relaxed text-muted-foreground">
          {t("about.trustNote")}
        </p>
      </ImageSplitSection>

      <ImageSplitSection
        imageSrc={THEMATIC_IMAGES.sections.innovation}
        imageAlt="Innovation and technology"
        imagePosition="right"
        bordered
        compact
      >
        <h2 className="font-display text-3xl font-semibold">{t("about.differentTitle")}</h2>
        <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
          <p>{t("about.differentP1")}</p>
          <p>{t("about.differentP2")}</p>
          <p>{t("about.differentP3")}</p>
        </div>
      </ImageSplitSection>

      <section className="border-b border-border py-20">
        <div className="container-narrow section-pad">
          <SectionHeading title={t("about.journeyTitle")} />
          <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {journey.map((label, index) => (
              <li key={label} className="relative">
                <p className="text-xs font-medium tracking-wider text-primary">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <p className="mt-3 font-display text-base font-semibold leading-snug">{label}</p>
              </li>
            ))}
          </ol>
          <p className="mt-10 text-sm text-muted-foreground">{t("about.journeyNote")}</p>
        </div>
      </section>

      <PageHeroBanner
        imageSrc={THEMATIC_IMAGES.sections.handshake}
        imageAlt="Partnership and collaboration"
        title={t("about.ctaTitle")}
        description={t("about.ctaSub")}
        height="md"
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button size="lg" variant="onImage" asChild>
            <Link href={ROUTES.CONTACT}>
              {t("landing.contactUs")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="onImageOutline" asChild>
            <Link href={ROUTES.REGISTER}>
              {t("landing.createAccount")}
            </Link>
          </Button>
        </div>
      </PageHeroBanner>

      <MarketingFooter />
    </div>
  );
}
