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
import { formatCurrency } from "@/utils/format";
import { cn } from "@/lib/utils";

const HOW_IT_WORKS = [
  {
    icon: Search,
    title: "Discover",
    description: "Browse verified projects with clear funding goals, stages, and risk previews.",
  },
  {
    icon: BadgeCheck,
    title: "Diligence",
    description: "Review financials, documents, and risk reports with membership access.",
  },
  {
    icon: MessageSquareLock,
    title: "Connect",
    description: "Message owners and send investment offers — all communication stays on-platform.",
  },
];

const INVESTOR_POINTS = [
  "Curated marketplace of verified listings",
  "Membership tiers for deeper diligence access",
  "Structured offers and on-platform messaging",
  "Risk analysis to surface gaps before you commit",
];

const OWNER_POINTS = [
  "Publish projects with documents, team, and updates",
  "Reach verified investors ready to diligence",
  "Receive structured offers with clear terms",
  "Keep conversations secure inside VentureBridge",
];

const SECURITY_POINTS = [
  {
    icon: Shield,
    title: "Verification first",
    description: "Listings and accounts go through review so investors engage with credible teams.",
  },
  {
    icon: Lock,
    title: "Access controls",
    description: "Sensitive documents and team details unlock with the right membership tier.",
  },
  {
    icon: MessageSquareLock,
    title: "On-platform only",
    description: "Offers and messages stay inside VentureBridge — no off-channel contact sharing.",
  },
];

const STORIES = [
  {
    quote:
      "We raised our seed round with investors who already understood our model. Diligence felt structured, not chaotic.",
    name: "Amina R.",
    role: "Founder, CleanGrid Energy",
  },
  {
    quote:
      "Risk reports and gated documents helped me prioritize deals. I only message teams when the fundamentals check out.",
    name: "Marcus T.",
    role: "Angel investor",
  },
  {
    quote:
      "Having offers and chat in one place kept negotiations professional and auditable for our board.",
    name: "Sofia L.",
    role: "CEO, MedStack Health",
  },
];

const FAQS = [
  {
    q: "Who can list a project?",
    a: "Project owners create an account, complete profile details, and submit projects for review before they appear in the marketplace.",
  },
  {
    q: "Do I need a membership to browse?",
    a: "Anyone can browse titles and limited previews. Premium and Enterprise unlock documents, team details, messaging, and offers.",
  },
  {
    q: "How does investment work?",
    a: "Investors send structured offers on-platform. Owners respond, negotiate, and keep communication inside VentureBridge.",
  },
  {
    q: "Is off-platform contact allowed?",
    a: "No. Sharing emails, phones, or messaging apps is blocked to protect both parties and keep deals auditable.",
  },
];

export default function HomePage() {
  const { data: projectsPage } = useProjects({ limit: 3, status: "published" });
  const { data: plans } = useMembershipPlans();
  const featured = projectsPage?.data?.slice(0, 3) ?? [];

  return (
    <div className="min-h-screen bg-white">
      <MarketingHeader />

      <section className="hero-mesh relative overflow-hidden border-b border-border/60">
        <div className="container-narrow section-pad py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center animate-fade-in">
            <p className="font-display text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
              {PLATFORM_NAME}
            </p>
            <h1 className="mt-6 font-display text-3xl font-semibold leading-tight text-slate-800 sm:text-4xl md:text-[2.75rem]">
              Connect innovative projects with trusted investors
            </h1>
            <p className="mt-5 text-base text-slate-600 sm:text-lg">
              A secure investment marketplace for raising capital, diligencing deals, and investing
              with clarity — communication stays on-platform.
            </p>
            <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center animate-slide-up">
              <Button size="lg" asChild>
                <Link href={`${ROUTES.REGISTER}?role=project_owner`}>
                  Raise capital for your project
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href={ROUTES.PROJECTS}>Discover verified opportunities</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container-narrow section-pad py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold text-slate-900">How it works</h2>
          <p className="mt-3 text-muted-foreground">
            Three steps from discovery to on-platform investment conversations.
          </p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {HOW_IT_WORKS.map((item, i) => (
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
              <span className="text-sm font-medium">For Investors</span>
            </div>
            <h2 className="font-display text-3xl font-semibold text-slate-900">
              Diligence with confidence
            </h2>
            <p className="mt-3 text-muted-foreground">
              Move beyond teasers — unlock the materials and tools you need to decide.
            </p>
            <ul className="mt-6 space-y-3">
              {INVESTOR_POINTS.map((point) => (
                <li key={point} className="flex gap-3 text-sm text-slate-700">
                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  {point}
                </li>
              ))}
            </ul>
            <Button className="mt-8" asChild>
              <Link href={`${ROUTES.REGISTER}?role=investor`}>Join as investor</Link>
            </Button>
          </div>
          <div>
            <div className="mb-3 inline-flex items-center gap-2 text-blue-600">
              <Building2 className="h-4 w-4" />
              <span className="text-sm font-medium">For Project Owners</span>
            </div>
            <h2 className="font-display text-3xl font-semibold text-slate-900">
              Raise with the right audience
            </h2>
            <p className="mt-3 text-muted-foreground">
              Present your venture professionally and engage investors who are ready to act.
            </p>
            <ul className="mt-6 space-y-3">
              {OWNER_POINTS.map((point) => (
                <li key={point} className="flex gap-3 text-sm text-slate-700">
                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  {point}
                </li>
              ))}
            </ul>
            <Button className="mt-8" variant="outline" asChild>
              <Link href={`${ROUTES.REGISTER}?role=project_owner`}>List your project</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container-narrow section-pad py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold text-slate-900">
            Security & Verification
          </h2>
          <p className="mt-3 text-muted-foreground">
            Built for trust — from listing review to membership-gated diligence.
          </p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {SECURITY_POINTS.map((item) => (
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
            <h2 className="font-display text-3xl font-semibold text-slate-900">Success stories</h2>
            <p className="mt-3 text-muted-foreground">
              Founders and investors building outcomes on VentureBridge.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {STORIES.map((story) => (
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
            <h2 className="font-display text-3xl font-semibold text-slate-900">Featured projects</h2>
            <p className="mt-2 text-muted-foreground">Live opportunities from the marketplace.</p>
          </div>
          <Button variant="outline" asChild>
            <Link href={ROUTES.PROJECTS}>
              View all <ArrowRight className="h-4 w-4" />
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
              Featured projects will appear here once listings are published.
            </p>
          )}
        </div>
      </section>

      <section className="border-y border-border/60 bg-slate-50/80">
        <div className="container-narrow section-pad py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-semibold text-slate-900">Membership plans</h2>
            <p className="mt-3 text-muted-foreground">
              Unlock deeper access as an investor — documents, messaging, and offers.
            </p>
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
                  {plan.highlighted && <Badge className="bg-blue-50 text-blue-700 border-blue-200">Popular</Badge>}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
                <p className="mt-6 font-display text-3xl font-semibold text-slate-900">
                  {formatCurrency(plan.price)}
                  <span className="text-sm font-normal text-muted-foreground">
                    /{plan.billingPeriod === "yearly" ? "yr" : "mo"}
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
                <Button className="mt-8 w-full" variant={plan.highlighted ? "default" : "outline"} asChild>
                  <Link href={ROUTES.MEMBERSHIP}>View plan</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-narrow section-pad py-20">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-center font-display text-3xl font-semibold text-slate-900">FAQ</h2>
          <p className="mt-3 text-center text-muted-foreground">
            Quick answers about how VentureBridge works.
          </p>
          <Accordion type="single" collapsible className="mt-10">
            {FAQS.map((faq, i) => (
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
          <h2 className="font-display text-3xl font-semibold text-white">Ready to get started?</h2>
          <p className="mt-3 max-w-lg text-blue-100">
            Questions about membership, listings, or diligence? Our team is here to help.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" variant="secondary" className="bg-white text-blue-700 hover:bg-blue-50" asChild>
              <Link href={ROUTES.CONTACT}>Contact us</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
              asChild
            >
              <Link href={ROUTES.REGISTER}>Create account</Link>
            </Button>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
