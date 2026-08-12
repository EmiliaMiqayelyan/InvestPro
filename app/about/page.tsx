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
import { ROUTES } from "@/constants";
import { useI18n } from "@/hooks";

export default function AboutPage() {
  const { t } = useI18n();

  const stats = [
    { label: t("about.stat1Label"), value: t("about.stat1Value") },
    { label: t("about.stat2Label"), value: t("about.stat2Value") },
    { label: t("about.stat3Label"), value: t("about.stat3Value") },
    { label: t("about.stat4Label"), value: t("about.stat4Value") },
  ];

  const team = [
    {
      name: t("about.member1Name"),
      role: t("about.member1Role"),
      bio: t("about.member1Bio"),
    },
    {
      name: t("about.member2Name"),
      role: t("about.member2Role"),
      bio: t("about.member2Bio"),
    },
    {
      name: t("about.member3Name"),
      role: t("about.member3Role"),
      bio: t("about.member3Bio"),
    },
  ];

  const securityItems = [
    {
      icon: Shield,
      title: t("about.securityLabel"),
      body: t("about.securityBody"),
    },
    {
      icon: BadgeCheck,
      title: t("about.verificationLabel"),
      body: t("about.verificationBody"),
    },
    {
      icon: Scale,
      title: t("about.investorProtection"),
      body: t("about.investorProtectionBody"),
    },
  ];

  const investorBenefits = [
    t("about.investorBenefit1"),
    t("about.investorBenefit2"),
    t("about.investorBenefit3"),
    t("about.investorBenefit4"),
  ];

  const ownerBenefits = [
    t("about.ownerBenefit1"),
    t("about.ownerBenefit2"),
    t("about.ownerBenefit3"),
    t("about.ownerBenefit4"),
  ];

  return (
    <div className="min-h-screen bg-white">
      <MarketingHeader />

      <section className="hero-mesh border-b border-border/60">
        <div className="container-narrow section-pad py-16 md:py-24 animate-fade-in">
          <p className="text-sm font-medium uppercase tracking-wide text-teal-800">
            {t("about.eyebrow")}
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold text-slate-900 md:text-5xl">
            {t("about.heroTitle")}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-600">{t("about.heroSub")}</p>
        </div>
      </section>

      <section className="container-narrow section-pad py-16">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="animate-slide-up">
            <h2 className="font-display text-2xl font-semibold text-slate-900">
              {t("about.mission")}
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              {t("about.missionBodyLong")}
            </p>
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "80ms" }}>
            <h2 className="font-display text-2xl font-semibold text-slate-900">
              {t("about.why")}
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              {t("about.whyBodyLong")}
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-border/60 bg-slate-50/80">
        <div className="container-narrow section-pad py-16">
          <h2 className="font-display text-2xl font-semibold text-slate-900">
            {t("about.securitySection")}
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {securityItems.map((item) => (
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
              <span className="text-sm font-medium">{t("about.investorsLabel")}</span>
            </div>
            <h2 className="font-display text-2xl font-semibold">
              {t("about.whatInvestorsGet")}
            </h2>
            <ul className="mt-5 space-y-3 text-sm text-slate-700">
              {investorBenefits.map((item) => (
                <li key={item} className="flex gap-2">
                  <Lock className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="mb-3 inline-flex items-center gap-2 text-blue-600">
              <Building2 className="h-4 w-4" />
              <span className="text-sm font-medium">{t("about.ownerLabel")}</span>
            </div>
            <h2 className="font-display text-2xl font-semibold">{t("about.ownerBenefits")}</h2>
            <ul className="mt-5 space-y-3 text-sm text-slate-700">
              {ownerBenefits.map((item) => (
                <li key={item} className="flex gap-2">
                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-y border-border/60 bg-white">
        <div className="container-narrow section-pad py-16">
          <h2 className="font-display text-2xl font-semibold text-slate-900">
            {t("about.trustAtGlance")}
          </h2>
          <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-display text-3xl font-semibold text-blue-600">{stat.value}</p>
                <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-narrow section-pad py-16">
        <h2 className="font-display text-2xl font-semibold text-slate-900">{t("about.team")}</h2>
        <p className="mt-2 max-w-xl text-muted-foreground">{t("about.teamSub")}</p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {team.map((member) => (
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
            <Link href={ROUTES.REGISTER}>{t("common.getStarted")}</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={ROUTES.CONTACT}>{t("about.contactTeam")}</Link>
          </Button>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
