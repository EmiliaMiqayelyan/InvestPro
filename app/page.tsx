"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  Check,
  FileText,
  MessageSquare,
  Shield,
} from "lucide-react";
import { MarketingHeader, MarketingFooter } from "@/components/layout/marketing-shell";
import { FeaturedProjectsSlider } from "@/features/projects";
import { CtaBand } from "@/components/shared/cta-band";
import { EmptyState } from "@/components/shared/empty-state";
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
    { num: "01", title: t("landing.howStep1Title"), desc: t("landing.howStep1Desc") },
    { num: "02", title: t("landing.howStep2Title"), desc: t("landing.howStep2Desc") },
    { num: "03", title: t("landing.howStep3Title"), desc: t("landing.howStep3Desc") },
  ];

  const investorBenefits = [
    t("landing.investorPoints.p1"),
    t("landing.investorPoints.p2"),
    t("landing.investorPoints.p3"),
    t("landing.investorPoints.p4"),
  ];

  const ownerBenefits = [
    t("landing.ownerPoints.p1"),
    t("landing.ownerPoints.p2"),
    t("landing.ownerPoints.p3"),
    t("landing.ownerPoints.p4"),
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
          <div className="container-wide section-pad flex flex-1 flex-col justify-end pb-14 pt-24 sm:pb-16 sm:pt-28 lg:pb-20">
            <div className="w-full max-w-2xl animate-slide-up text-left lg:max-w-3xl">
              <h1
                className={cn(
                  "font-display text-[2rem] font-bold uppercase leading-[1.12] tracking-wide text-white drop-shadow-sm sm:text-4xl md:text-5xl lg:text-[3.35rem]",
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
                  <Link href={`${ROUTES.REGISTER}?role=investor`}>
                    {t("landing.joinAsInvestor")}
                  </Link>
                </Button>
              </div>
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
          <h2 className="copy-tight font-display text-2xl font-semibold sm:text-3xl">
            {t("landing.howItWorksTitle")}
          </h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">{t("landing.howItWorksSub")}</p>
          <div className="mt-8 space-y-5">
            {steps.map((step) => (
              <div key={step.num} className="flex items-center gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  {step.num}
                </span>
                <div className="min-w-0">
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </ImageSplitSection>
      </div>

      <ImageSplitSection
        imageSrc={THEMATIC_IMAGES.sections.investors}
        imageAlt="Investor reviewing opportunities"
        imagePosition="left"
        imageAspect="compact"
        compact
      >
        <p className="eyebrow">{t("landing.forInvestors")}</p>
        <h2 className="copy-tight mt-2 font-display text-2xl font-semibold sm:text-3xl">
          {t("landing.investorHeadline")}
        </h2>
        <p className="mt-3 text-muted-foreground leading-relaxed">{t("landing.investorSub")}</p>
        <ul className="mt-6 space-y-3">
          {investorBenefits.map((item) => (
            <li key={item} className="flex items-center gap-3 text-sm leading-relaxed">
              <Check className="h-4 w-4 shrink-0 text-primary" strokeWidth={2.2} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <Button className="mt-8" asChild>
          <Link href={`${ROUTES.REGISTER}?role=investor`}>
            {t("landing.joinAsInvestor")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </ImageSplitSection>

      <ImageSplitSection
        imageSrc={THEMATIC_IMAGES.sections.owners}
        imageAlt="Project owners collaborating"
        imagePosition="right"
        imageAspect="compact"
        bordered
        compact
      >
        <p className="eyebrow">{t("landing.forOwners")}</p>
        <h2 className="copy-tight mt-2 font-display text-2xl font-semibold sm:text-3xl">
          {t("landing.ownerHeadline")}
        </h2>
        <p className="mt-3 text-muted-foreground leading-relaxed">{t("landing.ownerSub")}</p>
        <ul className="mt-6 space-y-3">
          {ownerBenefits.map((item) => (
            <li key={item} className="flex items-center gap-3 text-sm leading-relaxed">
              <Check className="h-4 w-4 shrink-0 text-primary" strokeWidth={2.2} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <Button className="mt-8" asChild>
          <Link href={`${ROUTES.REGISTER}?role=project_owner`}>
            {t("landing.publishProject")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </ImageSplitSection>

      <ImageSplitSection
        imageSrc={THEMATIC_IMAGES.sections.security}
        imageAlt="Secure platform and verified access"
        imagePosition="left"
        imageAspect="compact"
        compact
      >
        <h2 className="copy-tight font-display text-2xl font-semibold sm:text-3xl">
          {t("landing.securityTitle")}
        </h2>
        <p className="mt-3 text-muted-foreground leading-relaxed">{t("landing.securitySub")}</p>
        <ul className="mt-8 space-y-4">
          {[
            {
              icon: Shield,
              title: t("landing.verificationFirst"),
              desc: t("landing.verificationFirstDesc"),
            },
            {
              icon: FileText,
              title: t("landing.accessControls"),
              desc: t("landing.accessControlsDesc"),
            },
            {
              icon: MessageSquare,
              title: t("landing.onPlatformOnly"),
              desc: t("landing.onPlatformOnlyDesc"),
            },
          ].map((item) => (
            <li key={item.title} className="flex items-center gap-3">
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
                {t("landing.viewAllProjects")} <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="mt-8">
            {featured.length > 0 ? (
              <FeaturedProjectsSlider projects={featured} />
            ) : !isPending ? (
              <EmptyState icon={Briefcase} title={t("landing.featuredEmpty")} variant="dashed" />
            ) : null}
          </div>
        </div>
      </section>

      <section id="faq" className="py-14 lg:py-16">
        <div className="container-wide section-pad">
          <div className="mx-auto copy-measure text-center">
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">
              {t("landing.faq")}
            </h2>
            <p className="mt-3 text-muted-foreground">{t("landing.faqSub")}</p>
          </div>
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
        </div>
      </section>

      <CtaBand title={t("landing.contactCta")} description={t("landing.contactCtaHelp")}>
        <Button size="lg" variant="onImage" className="shrink-0" asChild>
          <Link href={ROUTES.REGISTER}>{t("landing.createAccount")}</Link>
        </Button>
        <Button size="lg" variant="onImageOutline" className="shrink-0" asChild>
          <Link href={ROUTES.CONTACT}>{t("landing.contactUs")}</Link>
        </Button>
      </CtaBand>

      <MarketingFooter />
    </div>
  );
}
