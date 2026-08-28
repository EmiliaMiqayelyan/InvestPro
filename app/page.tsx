"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  FileText,
  Handshake,
  MessageSquare,
  Shield,
} from "lucide-react";
import { MarketingHeader, MarketingFooter } from "@/components/layout/marketing-shell";
import { MarketplaceProjectCard } from "@/features/projects";
import { ImageCard } from "@/components/shared/image-card";
import { ImageSplitSection } from "@/components/shared/image-split-section";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ROUTES } from "@/constants";
import { THEMATIC_IMAGES } from "@/constants/thematic-images";
import { useProjects } from "@/hooks/use-marketplace";
import { useI18n } from "@/hooks";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const { t, isHy } = useI18n();
  const { data: projectsPage } = useProjects({ limit: 3 });
  const featured = projectsPage?.data?.slice(0, 3) ?? [];

  const stats = [
    { value: "150+", label: t("landing.statsProjects") },
    { value: "$12M+", label: t("landing.statsFunding") },
    { value: "100%", label: t("landing.statsKyc") },
    { value: "24/7", label: t("landing.statsMessaging") },
  ];

  const steps = [
    { num: "1", title: t("landing.howStep1Title"), desc: t("landing.howStep1Desc") },
    { num: "2", title: t("landing.howStep2Title"), desc: t("landing.howStep2Desc") },
    { num: "3", title: t("landing.howStep3Title"), desc: t("landing.howStep3Desc") },
    { num: "4", title: t("landing.howStep4Title"), desc: t("landing.howStep4Desc") },
  ];

  const faqs = [
    { q: t("landing.faqs.q1"), a: t("landing.faqs.a1") },
    { q: t("landing.faqs.q2"), a: t("landing.faqs.a2") },
    { q: t("landing.faqs.q3"), a: t("landing.faqs.a3") },
    { q: t("landing.faqs.q4"), a: t("landing.faqs.a4") },
  ];

  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />

      {/* Hero */}
      <section className="border-b border-border">
        <div className="container-wide section-pad py-14 lg:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/80 px-3 py-1 text-xs font-medium text-muted-foreground">
                <Shield className="h-3.5 w-3.5 text-primary" />
                {t("landing.brandTagline")}
              </div>
              <h1
                className={cn(
                  "mt-5 font-display text-4xl font-semibold leading-[1.12] sm:text-5xl lg:text-[3rem]",
                  isHy && "leading-[1.35]"
                )}
              >
                {t("landing.heroTitle")}
              </h1>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
                {t("landing.heroSubtitle")}
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" asChild>
                  <Link href={ROUTES.PROJECTS}>
                    {t("landing.exploreProjects")}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href={`${ROUTES.REGISTER}?role=project_owner`}>
                    {t("landing.publishProject")}
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative animate-slide-up lg:justify-self-end lg:max-w-lg">
              <div className="surface-card overflow-hidden">
                <div className="relative aspect-[4/3] bg-secondary">
                  <Image
                    src={THEMATIC_IMAGES.hero.marketplace}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width:1024px) 100vw, 50vw"
                    priority
                  />
                  <div className="overlay-card absolute inset-0" aria-hidden />
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white sm:p-6">
                    <p className="text-xs font-medium uppercase tracking-wider text-white/70">
                      {t("nav.marketplace")}
                    </p>
                    <p className="mt-1 font-display text-xl font-semibold">
                      {t("landing.discoverOpportunities")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border bg-secondary/40">
        <div className="container-wide section-pad py-8 sm:py-10">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center lg:text-left">
                <p className="font-display text-2xl font-semibold tabular-nums sm:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <div id="how-it-works">
        <ImageSplitSection
          imageSrc={THEMATIC_IMAGES.sections.diligence}
          imageAlt=""
          imagePosition="right"
          bordered
          compact
        >
          <p className="eyebrow">{t("landing.howItWorks")}</p>
          <h2 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">
            {t("landing.howItWorksSub")}
          </h2>
          <div className="mt-8 space-y-5">
            {steps.map((step) => (
              <div key={step.num} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {step.num}
                </span>
                <div>
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </ImageSplitSection>
      </div>

      {/* Investors & owners */}
      <section className="py-14 lg:py-18">
        <div className="container-wide section-pad">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">
              {t("landing.twoSidesTitle")}
            </h2>
          </div>
          <div className="mx-auto mt-8 grid max-w-4xl gap-5 sm:grid-cols-2">
            <ImageCard
              variant="overlay"
              imageSrc={THEMATIC_IMAGES.sections.investors}
              imageAlt=""
              title={t("landing.investorHeadline")}
              description={t("landing.investorSub")}
              href={ROUTES.PROJECTS}
              ctaLabel={t("landing.browseProjects")}
            />
            <ImageCard
              variant="overlay"
              imageSrc={THEMATIC_IMAGES.sections.owners}
              imageAlt=""
              title={t("landing.ownerHeadline")}
              description={t("landing.ownerSub")}
              href={`${ROUTES.REGISTER}?role=project_owner`}
              ctaLabel={t("landing.publishProject")}
            />
          </div>
        </div>
      </section>

      {/* Featured projects */}
      <section className="border-y border-border bg-secondary/30 py-14 lg:py-18">
        <div className="container-wide section-pad">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-semibold sm:text-3xl">
                {t("landing.featuredProjects")}
              </h2>
              <p className="mt-2 text-muted-foreground">{t("landing.featuredSub")}</p>
            </div>
            <Button variant="outline" asChild>
              <Link href={ROUTES.PROJECTS}>
                {t("common.viewAll")} <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.length > 0 ? (
              featured.map((p) => <MarketplaceProjectCard key={p.id} project={p} />)
            ) : (
              <p className="col-span-full py-8 text-center text-muted-foreground">
                {t("landing.featuredEmpty")}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Security */}
      <ImageSplitSection
        imageSrc={THEMATIC_IMAGES.sections.security}
        imageAlt=""
        imagePosition="left"
        compact
      >
        <p className="eyebrow">{t("landing.securityTitle")}</p>
        <h2 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">
          {t("landing.securitySub")}
        </h2>
        <ul className="mt-8 space-y-4">
          {[
            { icon: Shield, title: t("landing.verificationFirst"), desc: t("landing.verificationFirstDesc") },
            { icon: MessageSquare, title: t("landing.onPlatformOnly"), desc: t("landing.onPlatformOnlyDesc") },
            { icon: FileText, title: t("landing.informedDecision"), desc: t("landing.informedDecisionDesc") },
            { icon: Handshake, title: t("landing.accessControls"), desc: t("landing.accessControlsDesc") },
          ].map((item) => (
            <li key={item.title} className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <item.icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </ImageSplitSection>

      {/* FAQ */}
      <section id="faq" className="py-14 lg:py-18">
        <div className="container-narrow section-pad">
          <h2 className="text-center font-display text-2xl font-semibold sm:text-3xl">
            {t("landing.faqSub")}
          </h2>
          <Accordion type="single" collapsible className="mt-8 space-y-2">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={faq.q}
                value={`faq-${i}`}
                className="surface-card border-none px-5 sm:px-6"
              >
                <AccordionTrigger className="text-left font-medium hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="relative flex min-h-[220px] items-center overflow-hidden sm:min-h-[260px]">
        <Image
          src={THEMATIC_IMAGES.hero.investment}
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="overlay-cta absolute inset-0" aria-hidden />
        <div className="on-image relative container-narrow section-pad py-12 text-center text-white">
          <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">
            {t("landing.contactCta")}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-white/80">{t("landing.contactCtaHelp")}</p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button size="lg" variant="onImage" asChild>
              <Link href={ROUTES.CONTACT}>{t("landing.contactUs")}</Link>
            </Button>
            <Button size="lg" variant="onImageOutline" asChild>
              <Link href={ROUTES.REGISTER}>{t("landing.createAccount")}</Link>
            </Button>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
