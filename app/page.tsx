"use client";

import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Lock,
  MessageSquareLock,
  Search,
  Shield,
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

export default function HomePage() {
  const { t, isHy } = useI18n();
  const { data: projectsPage } = useProjects({ limit: 3 });
  const featured = projectsPage?.data?.slice(0, 3) ?? [];

  const howItWorks = [
    { icon: Search, title: t("landing.discover"), description: t("landing.discoverDesc") },
    { icon: BadgeCheck, title: t("landing.diligence"), description: t("landing.diligenceDesc") },
    {
      icon: MessageSquareLock,
      title: t("landing.connect"),
      description: t("landing.connectDesc"),
    },
  ];

  const investorPoints = [
    t("landing.investorPoints.p1"),
    t("landing.investorPoints.p2"),
    t("landing.investorPoints.p3"),
    t("landing.investorPoints.p4"),
  ];

  const ownerPoints = [
    t("landing.ownerPoints.p1"),
    t("landing.ownerPoints.p2"),
    t("landing.ownerPoints.p3"),
    t("landing.ownerPoints.p4"),
  ];

  const securityPoints = [
    {
      icon: Shield,
      title: t("landing.verificationFirst"),
      description: t("landing.verificationFirstDesc"),
    },
    {
      icon: Lock,
      title: t("landing.accessControls"),
      description: t("landing.accessControlsDesc"),
    },
    {
      icon: MessageSquareLock,
      title: t("landing.onPlatformOnly"),
      description: t("landing.onPlatformOnlyDesc"),
    },
  ];

  const faqs = [
    { q: t("landing.faqs.q1"), a: t("landing.faqs.a1") },
    { q: t("landing.faqs.q2"), a: t("landing.faqs.a2") },
    { q: t("landing.faqs.q3"), a: t("landing.faqs.a3") },
    { q: t("landing.faqs.q4"), a: t("landing.faqs.a4") },
  ];

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <MarketingHeader />

      <section className="hero-mesh relative overflow-hidden border-b border-border/60">
        <div className="container-narrow section-pad relative py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-display text-sm font-medium tracking-wide text-teal-800 md:text-base">
              {t("common.platformName")}
              <span className="mx-2 text-teal-700/40">·</span>
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
              <Link href={`${ROUTES.REGISTER}?role=investor`} className="underline-offset-4 hover:underline">
                {t("landing.joinAsInvestor")}
              </Link>
            </p>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="container-narrow section-pad py-16 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold text-slate-900">
            {t("landing.howItWorks")}
          </h2>
          <p className="mt-3 text-muted-foreground">{t("landing.howItWorksSub")}</p>
        </div>
        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {howItWorks.map((item) => (
            <div key={item.title} className="text-center md:text-left">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-800 md:mx-0">
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border/60 bg-[hsl(var(--surface-warm))]/80">
        <div className="container-narrow section-pad grid gap-12 py-16 lg:grid-cols-2">
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
                <li key={point} className="flex gap-3 text-sm text-slate-700">
                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" />
                  {point}
                </li>
              ))}
            </ul>
            <Button className="mt-8" asChild>
              <Link href={`${ROUTES.REGISTER}?role=investor`}>{t("landing.joinAsInvestor")}</Link>
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
                {t("landing.listYourProject")}
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
        <div className="mt-12 grid gap-8 md:grid-cols-3">
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

      <section className="container-narrow section-pad py-16 md:py-20">
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
                <Link href={ROUTES.REGISTER}>{t("landing.createAccount")}</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href={ROUTES.CONTACT}>{t("landing.contactUs")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
