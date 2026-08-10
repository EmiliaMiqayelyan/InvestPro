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
  Sparkles,
  Users,
} from "lucide-react";
import { MarketingHeader, MarketingFooter } from "@/components/layout/marketing-shell";
import { MarketplaceProjectCard } from "@/features/projects";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PLATFORM_NAME, ROUTES } from "@/constants";
import { useProjects, useMembershipPlans } from "@/hooks/use-marketplace";
import { useI18n } from "@/hooks";
import { formatCurrency } from "@/utils/format";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const { t, isHy } = useI18n();
  const { data: projectsPage } = useProjects({ limit: 3, status: "published" });
  const { data: plans } = useMembershipPlans();
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

  const stories = [
    {
      quote: t("landing.stories.s1Quote"),
      name: t("landing.stories.s1Name"),
      role: t("landing.stories.s1Role"),
    },
    {
      quote: t("landing.stories.s2Quote"),
      name: t("landing.stories.s2Name"),
      role: t("landing.stories.s2Role"),
    },
    {
      quote: t("landing.stories.s3Quote"),
      name: t("landing.stories.s3Name"),
      role: t("landing.stories.s3Role"),
    },
  ];

  const faqs = [
    { q: t("landing.faqs.q1"), a: t("landing.faqs.a1") },
    { q: t("landing.faqs.q2"), a: t("landing.faqs.a2") },
    { q: t("landing.faqs.q3"), a: t("landing.faqs.a3") },
    { q: t("landing.faqs.q4"), a: t("landing.faqs.a4") },
  ];

  return (
    <div className="min-h-screen bg-white">
      <MarketingHeader />

      <section className="hero-mesh relative overflow-hidden border-b border-border/60">
        <div className="container-narrow section-pad py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center animate-fade-in">
            <p
              className={cn(
                "font-display text-3xl text-slate-800 sm:text-4xl md:text-5xl",
                isHy ? "font-medium tracking-normal leading-snug" : "font-semibold tracking-tight"
              )}
            >
              {PLATFORM_NAME}
            </p>
            <h1
              className={cn(
                "mt-6 font-display text-3xl text-slate-700 sm:text-4xl md:text-[2.75rem]",
                isHy
                  ? "font-medium tracking-wide leading-[1.5] max-w-2xl mx-auto"
                  : "font-semibold leading-tight tracking-tight"
              )}
            >
              {t("landing.heroTitle")}
            </h1>
            <p
              className={cn(
                "mt-5 text-base text-slate-600 sm:text-lg",
                isHy && "leading-relaxed tracking-wide max-w-2xl mx-auto"
              )}
            >
              {t("landing.heroSubtitle")}
            </p>
            <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center animate-slide-up">
              <Button size="lg" asChild>
                <Link href={`${ROUTES.REGISTER}?role=project_owner`}>
                  {t("landing.raiseCapital")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href={ROUTES.PROJECTS}>{t("landing.discoverOpportunities")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container-narrow section-pad py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold text-slate-900">
            {t("landing.howItWorks")}
          </h2>
          <p className="mt-3 text-muted-foreground">{t("landing.howItWorksSub")}</p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {howItWorks.map((item, i) => (
            <div
              key={item.title}
              className={cn("animate-slide-up text-center md:text-left")}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 md:mx-0">
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border/60 bg-slate-50/80">
        <div className="container-narrow section-pad grid gap-12 py-20 lg:grid-cols-2">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 text-blue-600">
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
                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  {point}
                </li>
              ))}
            </ul>
            <Button className="mt-8" asChild>
              <Link href={`${ROUTES.REGISTER}?role=investor`}>{t("landing.joinAsInvestor")}</Link>
            </Button>
          </div>
          <div>
            <div className="mb-3 inline-flex items-center gap-2 text-blue-600">
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
                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
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

      <section className="container-narrow section-pad py-20">
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

      <section className="border-y border-border/60 bg-white">
        <div className="container-narrow section-pad py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-semibold text-slate-900">
              {t("landing.successStories")}
            </h2>
            <p className="mt-3 text-muted-foreground">{t("landing.successStoriesSub")}</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {stories.map((story) => (
              <blockquote key={story.name} className="premium-card p-6">
                <p className="text-sm leading-relaxed text-slate-700">&ldquo;{story.quote}&rdquo;</p>
                <footer className="mt-5 border-t border-border pt-4">
                  <p className="text-sm font-semibold text-slate-900">{story.name}</p>
                  <p className="text-xs text-muted-foreground">{story.role}</p>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="container-narrow section-pad py-20">
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

      <section className="border-y border-border/60 bg-slate-50/80">
        <div className="container-narrow section-pad py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-semibold text-slate-900">
              {t("landing.membershipPlans")}
            </h2>
            <p className="mt-3 text-muted-foreground">{t("landing.membershipSub")}</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {(plans ?? []).map((plan) => (
              <div
                key={plan.id}
                className={cn(
                  "premium-card flex flex-col p-6",
                  plan.highlighted && "ring-2 ring-blue-600"
                )}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xl font-semibold">{plan.name}</h3>
                  {plan.highlighted && (
                    <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                      {t("common.popular")}
                    </Badge>
                  )}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
                <p className="mt-6 font-display text-3xl font-semibold text-slate-900">
                  {formatCurrency(plan.price)}
                  <span className="text-sm font-normal text-muted-foreground">
                    {plan.billingPeriod === "yearly"
                      ? t("common.perYear")
                      : t("common.perMonth")}
                  </span>
                </p>
                <ul className="mt-6 flex-1 space-y-2">
                  {plan.features.slice(0, 5).map((f) => (
                    <li key={f} className="flex gap-2 text-sm text-slate-700">
                      <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-600" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  className="mt-8 w-full"
                  variant={plan.highlighted ? "default" : "outline"}
                  asChild
                >
                  <Link href={ROUTES.MEMBERSHIP}>{t("landing.viewPlan")}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-narrow section-pad py-20">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-center font-display text-3xl font-semibold text-slate-900">
            {t("landing.faq")}
          </h2>
          <p className="mt-3 text-center text-muted-foreground">{t("landing.faqSub")}</p>
          <Accordion type="single" collapsible className="mt-10">
            {faqs.map((faq, i) => (
              <AccordionItem key={faq.q} value={`faq-${i}`}>
                <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="border-t border-border/60 bg-blue-600">
        <div className="container-narrow section-pad flex flex-col items-center py-16 text-center">
          <h2 className="font-display text-3xl font-semibold text-white">
            {t("landing.contactCta")}
          </h2>
          <p className="mt-3 max-w-lg text-blue-100">{t("landing.contactCtaHelp")}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-blue-700 hover:bg-blue-50"
              asChild
            >
              <Link href={ROUTES.CONTACT}>{t("landing.contactUs")}</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
              asChild
            >
              <Link href={ROUTES.REGISTER}>{t("landing.createAccount")}</Link>
            </Button>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
