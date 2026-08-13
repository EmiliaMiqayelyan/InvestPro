"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Building2,
  ClipboardList,
  FileText,
  FolderPlus,
  Handshake,
  MessageSquare,
  MessageSquareLock,
  Scale,
  Search,
  Shield,
  ShieldCheck,
  Users,
} from "lucide-react";
import { MarketingHeader, MarketingFooter } from "@/components/layout/marketing-shell";
import { MarketplaceProjectCard } from "@/features/projects";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ROUTES } from "@/constants";
import { useProjects } from "@/hooks/use-marketplace";
import { useI18n } from "@/hooks";
import { cn } from "@/lib/utils";

type HowStep = {
  step: string;
  icon: LucideIcon;
  label: string;
  title: string;
  description: string;
};

function HowStepCard({ item }: { item: HowStep }) {
  return (
    <div className="relative z-10 flex flex-col items-center text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-teal-800">
        <item.icon className="h-4 w-4" />
      </div>
      <p className="mt-3 text-[11px] font-medium uppercase tracking-wider text-teal-800">
        {item.step} · {item.label}
      </p>
      <h3 className="mt-1 font-display text-sm font-semibold leading-snug text-slate-900 md:text-base">
        {item.title}
      </h3>
      <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground md:text-sm">
        {item.description}
      </p>
    </div>
  );
}

export default function HomePage() {
  const { t, isHy } = useI18n();
  const { data: projectsPage } = useProjects({ limit: 3 });
  const featured = projectsPage?.data?.slice(0, 3) ?? [];

  const howItWorks = [
    {
      step: "01",
      icon: FolderPlus,
      label: t("landing.howStep1Label"),
      title: t("landing.howStep1Title"),
      description: t("landing.howStep1Desc"),
    },
    {
      step: "02",
      icon: ShieldCheck,
      label: t("landing.howStep2Label"),
      title: t("landing.howStep2Title"),
      description: t("landing.howStep2Desc"),
    },
    {
      step: "03",
      icon: Search,
      label: t("landing.howStep3Label"),
      title: t("landing.howStep3Title"),
      description: t("landing.howStep3Desc"),
    },
    {
      step: "04",
      icon: ClipboardList,
      label: t("landing.howStep4Label"),
      title: t("landing.howStep4Title"),
      description: t("landing.howStep4Desc"),
    },
    {
      step: "05",
      icon: MessageSquare,
      label: t("landing.howStep5Label"),
      title: t("landing.howStep5Title"),
      description: t("landing.howStep5Desc"),
    },
    {
      step: "06",
      icon: Handshake,
      label: t("landing.howStep6Label"),
      title: t("landing.howStep6Title"),
      description: t("landing.howStep6Desc"),
    },
  ];

  const investorPoints = [
    { icon: BarChart3, text: t("landing.investorPoints.p1") },
    { icon: Users, text: t("landing.investorPoints.p2") },
    { icon: FileText, text: t("landing.investorPoints.p3") },
    { icon: AlertTriangle, text: t("landing.investorPoints.p4") },
    { icon: MessageSquare, text: t("landing.investorPoints.p5") },
    { icon: Handshake, text: t("landing.investorPoints.p6") },
  ];

  const ownerPoints = [
    t("landing.ownerPoints.p1"),
    t("landing.ownerPoints.p2"),
    t("landing.ownerPoints.p3"),
    t("landing.ownerPoints.p4"),
    t("landing.ownerPoints.p5"),
    t("landing.ownerPoints.p6"),
  ];

  const securityPoints = [
    {
      icon: Shield,
      title: t("landing.verificationFirst"),
      description: t("landing.verificationFirstDesc"),
    },
    {
      icon: AlertTriangle,
      title: t("landing.accessControls"),
      description: t("landing.accessControlsDesc"),
    },
    {
      icon: MessageSquareLock,
      title: t("landing.onPlatformOnly"),
      description: t("landing.onPlatformOnlyDesc"),
    },
    {
      icon: Scale,
      title: t("landing.informedDecision"),
      description: t("landing.informedDecisionDesc"),
    },
  ];

  const faqs = [
    { q: t("landing.faqs.q1"), a: t("landing.faqs.a1") },
    { q: t("landing.faqs.q2"), a: t("landing.faqs.a2") },
    { q: t("landing.faqs.q3"), a: t("landing.faqs.a3") },
    { q: t("landing.faqs.q4"), a: t("landing.faqs.a4") },
    { q: t("landing.faqs.q5"), a: t("landing.faqs.a5") },
  ];

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <MarketingHeader />

      <section className="hero-mesh relative overflow-hidden border-b border-border/60">
        <div className="container-narrow section-pad relative py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-display text-sm font-medium tracking-wide text-teal-800 md:text-base">
              {t("landing.brandTagline")}
            </p>
            <h1
              className={cn(
                "mt-5 font-display text-3xl text-slate-900 sm:text-4xl md:text-[2.75rem]",
                isHy
                  ? "mx-auto max-w-2xl font-medium leading-[1.45] tracking-wide"
                  : "font-semibold leading-tight tracking-tight"
              )}
            >
              {t("landing.heroTitle")}
            </h1>
            <p
              className={cn(
                "mx-auto mt-5 max-w-2xl text-base text-slate-600 sm:text-lg",
                isHy && "leading-relaxed tracking-wide"
              )}
            >
              {t("landing.heroSubtitle")}
            </p>
            <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
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
            <p className="mt-4 text-sm text-muted-foreground">
              <Link
                href={`${ROUTES.REGISTER}?role=investor`}
                className="inline-flex items-center gap-1 underline-offset-4 hover:underline"
              >
                {t("landing.joinAsInvestor")}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </p>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-y border-border/60 bg-white">
        <div className="container-narrow section-pad py-16 md:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-semibold text-slate-900">
              {t("landing.howItWorks")}
            </h2>
            <p className="mt-3 text-muted-foreground">{t("landing.howItWorksSub")}</p>
          </div>

          <ol className="relative mx-auto mt-14 max-w-xl md:hidden">
            <span className="absolute bottom-8 left-[1.375rem] top-8 w-px bg-slate-200" aria-hidden />
            {howItWorks.map((item) => (
              <li key={item.step} className="relative flex gap-4 pb-10 last:pb-0">
                <div className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-teal-800">
                  <item.icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 pt-0.5">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-teal-800">
                    {item.step} · {item.label}
                  </p>
                  <h3 className="mt-1 font-display text-base font-semibold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-14 hidden md:block xl:hidden">
            <ol className="grid grid-cols-3 gap-x-6 gap-y-4">
              {howItWorks.slice(0, 3).map((item, index) => (
                <li key={item.step} className="relative">
                  {index < 2 ? (
                    <span
                      className="absolute left-[calc(50%+1.5rem)] right-[-0.75rem] top-5 h-px bg-slate-200"
                      aria-hidden
                    />
                  ) : null}
                  <HowStepCard item={item} />
                </li>
              ))}
            </ol>
            <div className="flex justify-center py-2 text-slate-300">
              <ArrowDown className="h-5 w-5" />
            </div>
            <ol className="grid grid-cols-3 gap-x-6">
              {howItWorks.slice(3).map((item, index) => (
                <li key={item.step} className="relative">
                  {index < 2 ? (
                    <span
                      className="absolute left-[calc(50%+1.5rem)] right-[-0.75rem] top-5 h-px bg-slate-200"
                      aria-hidden
                    />
                  ) : null}
                  <HowStepCard item={item} />
                </li>
              ))}
            </ol>
          </div>

          <ol className="mt-14 hidden grid-cols-6 gap-3 xl:grid">
            {howItWorks.map((item, index) => (
              <li key={item.step} className="relative">
                {index < howItWorks.length - 1 ? (
                  <span
                    className="absolute left-[calc(50%+1.4rem)] right-[-0.4rem] top-5 h-px bg-slate-200"
                    aria-hidden
                  />
                ) : null}
                <HowStepCard item={item} />
              </li>
            ))}
          </ol>

          <div className="mx-auto mt-16 max-w-xl border-t border-slate-100 pt-10 text-center">
            <h3 className="font-display text-xl font-semibold text-slate-900">
              {t("landing.howCtaTitle")}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">{t("landing.howCtaSub")}</p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild>
                <Link href={ROUTES.PROJECTS}>
                  {t("landing.exploreProjects")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={`${ROUTES.REGISTER}?role=project_owner`}>
                  {t("landing.publishProject")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border/60 bg-[hsl(var(--surface-warm))]/80">
        <div className="container-narrow section-pad grid gap-16 py-16 lg:grid-cols-2">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 text-teal-800">
              <Users className="h-4 w-4" />
              <span className="text-sm font-medium">{t("landing.forInvestors")}</span>
            </div>
            <h2 className="font-display text-3xl font-semibold text-slate-900">
              {t("landing.investorHeadline")}
            </h2>
            <p className="mt-3 text-muted-foreground">{t("landing.investorSub")}</p>
            <ul className="mt-6 space-y-3">
              {investorPoints.map((point) => (
                <li key={point.text} className="flex gap-3 text-sm text-slate-700">
                  <point.icon className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" />
                  {point.text}
                </li>
              ))}
            </ul>
            <Button className="mt-8" asChild>
              <Link href={ROUTES.PROJECTS}>
                {t("landing.browseProjects")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div>
            <div className="mb-3 inline-flex items-center gap-2 text-teal-800">
              <Building2 className="h-4 w-4" />
              <span className="text-sm font-medium">{t("landing.forOwners")}</span>
            </div>
            <h2 className="font-display text-3xl font-semibold text-slate-900">
              {t("landing.ownerHeadline")}
            </h2>
            <p className="mt-3 text-muted-foreground">{t("landing.ownerSub")}</p>
            <ul className="mt-6 space-y-3">
              {ownerPoints.map((point) => (
                <li key={point} className="flex gap-3 text-sm text-slate-700">
                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" />
                  {point}
                </li>
              ))}
            </ul>
            <Button className="mt-8" variant="outline" asChild>
              <Link href={`${ROUTES.REGISTER}?role=project_owner`}>
                {t("landing.publishProject")}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container-narrow section-pad py-16 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold text-slate-900">
            {t("landing.securityTitle")}
          </h2>
          <p className="mt-3 text-muted-foreground">{t("landing.securitySub")}</p>
        </div>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {securityPoints.map((item) => (
            <div key={item.title}>
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-800">
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-narrow section-pad py-16 md:py-20">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-display text-3xl font-semibold text-slate-900">
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
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.length > 0 ? (
            featured.map((project) => (
              <MarketplaceProjectCard key={project.id} project={project} />
            ))
          ) : (
            <p className="col-span-full text-sm text-muted-foreground">
              {t("landing.featuredEmpty")}
            </p>
          )}
        </div>
      </section>

      <section className="border-y border-border/60 bg-[hsl(var(--card))]">
        <div className="container-narrow section-pad py-16 md:py-20">
          <h2 className="text-center font-display text-3xl font-semibold text-slate-900">
            {t("landing.twoSidesTitle")}
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="premium-card p-6 md:p-8">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-800">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="font-display text-xl font-semibold text-slate-900">
                {t("landing.twoSidesInvestorsTitle")}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {t("landing.twoSidesInvestorsBody")}
              </p>
            </div>
            <div className="premium-card p-6 md:p-8">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-800">
                <Building2 className="h-5 w-5" />
              </div>
              <h3 className="font-display text-xl font-semibold text-slate-900">
                {t("landing.twoSidesOwnersTitle")}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {t("landing.twoSidesOwnersBody")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-narrow section-pad py-16 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold text-slate-900">
            {t("landing.connectTitle")}
          </h2>
          <p className="mt-4 text-lg text-slate-700">{t("landing.connectLead")}</p>
          <p className="mt-4 text-muted-foreground leading-relaxed">{t("landing.connectBody")}</p>
          <div className="mt-8">
            <Button variant="outline" asChild>
              <Link href={ROUTES.ABOUT}>
                {t("nav.about")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="faq" className="container-narrow section-pad py-16 md:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="text-center text-sm font-medium uppercase tracking-wide text-teal-800">
            {t("landing.faq")}
          </p>
          <h2 className="mt-2 text-center font-display text-2xl font-semibold text-slate-900 md:text-3xl">
            {t("landing.faqSub")}
          </h2>
          <div className="premium-card mt-10 overflow-hidden px-2 sm:px-4">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem key={faq.q} value={`faq-${i}`} className="border-border/70 px-2">
                  <AccordionTrigger className="text-left text-slate-900 hover:no-underline">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600">{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <section className="border-t border-border/60 bg-[hsl(var(--surface-warm))]/60">
        <div className="container-narrow section-pad py-14 md:py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-2xl font-semibold text-slate-900 md:text-3xl">
              {t("landing.contactCta")}
            </h2>
            <p className="mt-3 text-muted-foreground">{t("landing.contactCtaSub")}</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
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
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
