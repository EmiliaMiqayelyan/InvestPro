"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  FileText,
  Handshake,
  MessageSquare,
  Scale,
  Shield,
  ShieldCheck,
  Trophy,
} from "lucide-react";
import { MarketingHeader, MarketingFooter } from "@/components/layout/marketing-shell";
import { FeaturedProjectsSlider } from "@/features/projects";
import { CtaBand } from "@/components/shared/cta-band";
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
  const { data: projectsPage, isPending } = useProjects({ limit: 8 });
  const featured = projectsPage?.data?.slice(0, 8) ?? [];

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

      <section className="relative isolate min-h-[calc(100dvh-4rem)] overflow-hidden border-b border-border">
        <Image
          src={THEMATIC_IMAGES.hero.marketplace}
          alt=""
          fill
          priority
          className="object-cover object-[center_40%]"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/20"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/25"
          aria-hidden
        />

        <div className="on-image relative flex min-h-[calc(100dvh-4rem)] flex-col">
          <div className="container-wide section-pad flex flex-1 flex-col justify-end pb-10 pt-24 sm:pb-12 sm:pt-28 lg:pb-14">
            <div className="w-full max-w-2xl animate-slide-up text-left lg:max-w-3xl">
              <p className="text-sm font-semibold tracking-[0.18em] text-white/90 uppercase">
                InvestIN
              </p>
              <h1
                className={cn(
                  "mt-4 font-display text-[2rem] font-bold uppercase leading-[1.12] tracking-wide text-white drop-shadow-sm sm:text-4xl md:text-5xl lg:text-[3.35rem]",
                  isHy && "leading-[1.22] tracking-normal"
                )}
              >
                {t("landing.heroTitle")}
              </h1>
              <p className="mt-4 max-w-xl text-[0.95rem] font-normal leading-relaxed text-white/90 sm:mt-5 sm:text-base md:text-lg">
                {t("landing.heroSubtitle")}
              </p>
              <div className="mt-7 flex flex-col items-stretch gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center">
                <Button
                  size="lg"
                  className="h-11 shrink-0 rounded-full bg-[#1e3a5f] px-6 text-sm font-medium text-white shadow-sm hover:bg-[#18314f] [&_svg]:text-white"
                  asChild
                >
                  <Link href={ROUTES.PROJECTS}>
                    {t("landing.exploreProjects")}
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  className="h-11 shrink-0 rounded-full border-0 bg-[#ebe6dc] px-6 text-sm font-medium text-slate-900 shadow-sm hover:bg-[#e2ddd2] [&_svg]:text-slate-900"
                  asChild
                >
                  <Link href={`${ROUTES.REGISTER}?role=project_owner`}>
                    <FileText className="h-4 w-4" />
                    {t("landing.publishProject")}
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="ghost"
                  className="h-11 shrink-0 rounded-full border border-white/85 bg-transparent px-6 text-sm font-medium text-white hover:bg-white/10 hover:text-white"
                  asChild
                >
                  <Link href={ROUTES.HOW_IT_WORKS}>{t("landing.heroHowItWorks")}</Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 bg-black/45 backdrop-blur-md">
            <div className="container-wide section-pad">
              <ul className="grid grid-cols-2 gap-x-4 gap-y-4 py-4 sm:grid-cols-4 sm:gap-6 sm:py-5">
                {[
                  { icon: Trophy, label: t("landing.heroFeature1") },
                  { icon: FileText, label: t("landing.heroFeature2") },
                  { icon: ShieldCheck, label: t("landing.heroFeature3") },
                  { icon: Scale, label: t("landing.heroFeature4") },
                ].map((item) => (
                  <li key={item.label} className="flex items-center gap-3 text-white">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/35">
                      <item.icon className="h-4 w-4" strokeWidth={1.6} />
                    </span>
                    <span className="text-xs font-medium leading-snug sm:text-sm">
                      {item.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <div id="how-it-works">
        <ImageSplitSection
          imageSrc={THEMATIC_IMAGES.sections.diligence}
          imageAlt="Due diligence and project review"
          imagePosition="right"
          imageAspect="portrait"
          bordered
          compact
        >
          <p className="eyebrow">{t("landing.howItWorks")}</p>
          <h2 className="copy-tight mt-2 font-display text-2xl font-semibold sm:text-3xl">
            {t("landing.howItWorksSub")}
          </h2>
          <div className="mt-8 space-y-5">
            {steps.map((step) => (
              <div key={step.num} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {step.num}
                </span>
                <div className="min-w-0">
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <Button className="mt-8" variant="outline" asChild>
            <Link href={ROUTES.HOW_IT_WORKS}>
              {t("common.learnMore")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </ImageSplitSection>
      </div>

      <section className="py-14 lg:py-16">
        <div className="container-wide section-pad">
          <div className="mx-auto copy-measure text-center">
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">
              {t("landing.twoSidesTitle")}
            </h2>
          </div>
          <div className="mx-auto mt-8 grid max-w-5xl gap-5 sm:grid-cols-2">
            <ImageCard
              variant="overlay"
              imageSrc={THEMATIC_IMAGES.sections.investors}
              imageAlt="Investor reviewing opportunities"
              title={t("landing.investorHeadline")}
              description={t("landing.investorSub")}
              href={ROUTES.FOR_INVESTORS}
              ctaLabel={t("landing.browseProjects")}
            />
            <ImageCard
              variant="overlay"
              imageSrc={THEMATIC_IMAGES.sections.owners}
              imageAlt="Project owners collaborating"
              title={t("landing.ownerHeadline")}
              description={t("landing.ownerSub")}
              href={ROUTES.FOR_OWNERS}
              ctaLabel={t("landing.publishProject")}
            />
          </div>
        </div>
      </section>

      {!isPending && featured.length > 0 && (
        <section className="border-y border-border bg-secondary/30 py-14 lg:py-16">
          <div className="container-wide section-pad">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="min-w-0">
                <h2 className="font-display text-2xl font-semibold sm:text-3xl">
                  {t("landing.featuredProjects")}
                </h2>
                <p className="mt-2 text-muted-foreground">{t("landing.featuredSub")}</p>
              </div>
              <Button variant="outline" className="shrink-0" asChild>
                <Link href={ROUTES.PROJECTS}>
                  {t("common.viewAll")} <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="mt-8">
              <FeaturedProjectsSlider projects={featured} />
            </div>
          </div>
        </section>
      )}

      <ImageSplitSection
        imageSrc={THEMATIC_IMAGES.sections.security}
        imageAlt="Secure platform and verified access"
        imagePosition="left"
        imageAspect="compact"
        compact
      >
        <p className="eyebrow">{t("landing.securityTitle")}</p>
        <h2 className="copy-tight mt-2 font-display text-2xl font-semibold sm:text-3xl">
          {t("landing.securitySub")}
        </h2>
        <ul className="mt-8 space-y-4">
          {[
            {
              icon: Shield,
              title: t("landing.verificationFirst"),
              desc: t("landing.verificationFirstDesc"),
            },
            {
              icon: MessageSquare,
              title: t("landing.onPlatformOnly"),
              desc: t("landing.onPlatformOnlyDesc"),
            },
            {
              icon: FileText,
              title: t("landing.informedDecision"),
              desc: t("landing.informedDecisionDesc"),
            },
            {
              icon: Handshake,
              title: t("landing.accessControls"),
              desc: t("landing.accessControlsDesc"),
            },
          ].map((item) => (
            <li key={item.title} className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <item.icon className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="font-medium">{item.title}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </ImageSplitSection>

      <section id="faq" className="py-14 lg:py-16">
        <div className="container-wide section-pad">
          <h2 className="mx-auto copy-measure text-center font-display text-2xl font-semibold sm:text-3xl">
            {t("landing.faqSub")}
          </h2>
          <Accordion type="single" collapsible className="mx-auto mt-8 max-w-4xl space-y-2">
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
          <div className="mt-8 text-center">
            <Button variant="outline" asChild>
              <Link href={ROUTES.FAQ}>{t("nav.faq")}</Link>
            </Button>
          </div>
        </div>
      </section>

      <CtaBand title={t("landing.contactCta")} description={t("landing.contactCtaHelp")}>
        <Button size="lg" variant="onImage" className="shrink-0" asChild>
          <Link href={ROUTES.CONTACT}>{t("landing.contactUs")}</Link>
        </Button>
        <Button size="lg" variant="onImageOutline" className="shrink-0" asChild>
          <Link href={ROUTES.REGISTER}>{t("landing.createAccount")}</Link>
        </Button>
      </CtaBand>

      <MarketingFooter />
    </div>
  );
}
