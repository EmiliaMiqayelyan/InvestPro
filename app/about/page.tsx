"use client";

import Link from "next/link";
import {
  BadgeCheck,
  Building2,
  Lock,
  Shield,
  Users,
  Scale,
} from "lucide-react";
import { MarketingHeader, MarketingFooter } from "@/components/layout/marketing-shell";
import { Button } from "@/components/ui/button";
import { PLATFORM_NAME, ROUTES } from "@/constants";

const STATS = [
  { label: "Verified listings reviewed", value: "120+" },
  { label: "Investors on platform", value: "2.4k" },
  { label: "Avg. diligence completion", value: "86%" },
  { label: "On-platform conversations", value: "100%" },
];

const TEAM = [
  { name: "Elena Vargas", role: "CEO", bio: "Former venture operator focused on marketplace trust." },
  { name: "James Okonkwo", role: "Head of Risk", bio: "Built diligence frameworks for institutional LPs." },
  { name: "Priya Shah", role: "Product", bio: "Designs membership and messaging experiences that stay secure." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <MarketingHeader />

      <section className="hero-mesh border-b border-border/60">
        <div className="container-narrow section-pad py-16 md:py-24 animate-fade-in">
          <p className="text-sm font-medium uppercase tracking-wide text-blue-600">About</p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold text-slate-900 md:text-5xl">
            Why {PLATFORM_NAME} exists
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-600">
            We connect innovative project owners with trusted investors in a marketplace designed
            for clarity, verification, and secure on-platform collaboration.
          </p>
        </div>
      </section>

      <section className="container-narrow section-pad py-16">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="animate-slide-up">
            <h2 className="font-display text-2xl font-semibold text-slate-900">Our mission</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Capital formation should not depend on opaque networks or risky off-channel deals.
              {PLATFORM_NAME} gives founders a professional surface to present their ventures and
              gives investors structured access to the materials they need — with communication
              that stays auditable and inside the platform.
            </p>
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "80ms" }}>
            <h2 className="font-display text-2xl font-semibold text-slate-900">Why we exist</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Early-stage investing is often fragmented: incomplete data rooms, unverified claims,
              and pressure to move conversations to email or chat apps. We built a light, premium
              marketplace that prioritizes verification, membership-gated diligence, and investor
              protection without sacrificing speed for serious teams.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-border/60 bg-slate-50/80">
        <div className="container-narrow section-pad py-16">
          <h2 className="font-display text-2xl font-semibold text-slate-900">
            Security, verification & protection
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Shield,
                title: "Security",
                body: "Authenticated sessions, role-based access, and guarded APIs protect accounts and deal flow.",
              },
              {
                icon: BadgeCheck,
                title: "Verification",
                body: "Projects are reviewed before publication. Sensitive materials unlock only with the right membership.",
              },
              {
                icon: Scale,
                title: "Investor protection",
                body: "Risk reports, missing-document flags, and on-platform offers reduce blind spots before capital moves.",
              },
            ].map((item) => (
              <div key={item.title} className="premium-card p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-narrow section-pad py-16">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 text-blue-600">
              <Users className="h-4 w-4" />
              <span className="text-sm font-medium">Investors</span>
            </div>
            <h2 className="font-display text-2xl font-semibold">What investors get</h2>
            <ul className="mt-5 space-y-3 text-sm text-slate-700">
              {[
                "Browse and filter verified marketplace listings",
                "Membership access to documents, team, and financials",
                "Direct messaging and structured investment offers",
                "Investment risk reports with scores and warnings",
              ].map((t) => (
                <li key={t} className="flex gap-2">
                  <Lock className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="mb-3 inline-flex items-center gap-2 text-blue-600">
              <Building2 className="h-4 w-4" />
              <span className="text-sm font-medium">Project owners</span>
            </div>
            <h2 className="font-display text-2xl font-semibold">Owner benefits</h2>
            <ul className="mt-5 space-y-3 text-sm text-slate-700">
              {[
                "Publish projects with documents, team, and updates",
                "Reach investors who are ready to diligence",
                "Receive and respond to structured offers",
                "Keep negotiations professional and on-platform",
              ].map((t) => (
                <li key={t} className="flex gap-2">
                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-y border-border/60 bg-white">
        <div className="container-narrow section-pad py-16">
          <h2 className="font-display text-2xl font-semibold text-slate-900">Trust at a glance</h2>
          <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-display text-3xl font-semibold text-blue-600">{stat.value}</p>
                <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-narrow section-pad py-16">
        <h2 className="font-display text-2xl font-semibold text-slate-900">Team</h2>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Operators, risk specialists, and product builders focused on marketplace integrity.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {TEAM.map((member) => (
            <div key={member.name} className="premium-card p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 font-display text-sm font-semibold text-slate-700">
                {member.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <h3 className="font-display text-lg font-semibold">{member.name}</h3>
              <p className="text-sm text-blue-600">{member.role}</p>
              <p className="mt-3 text-sm text-muted-foreground">{member.bio}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap gap-3">
          <Button asChild>
            <Link href={ROUTES.REGISTER}>Get started</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={ROUTES.CONTACT}>Contact the team</Link>
          </Button>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
