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
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants";
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
    <div className="min-h-screen bg-white text-slate-900">
      <MarketingHeader />

      <section className="border-b border-slate-200 bg-white">
        <div className="container-narrow section-pad py-20 md:py-28">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-teal-800">
            {t("about.eyebrow")}
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-tight tracking-tight text-slate-900 md:text-5xl">
            {t("about.heroTitle")}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
            {t("about.heroSub")}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
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
      </section>

      <section className="border-b border-slate-200 bg-slate-50/80">
        <div className="container-narrow section-pad py-20">
          <h2 className="max-w-2xl font-display text-3xl font-semibold text-slate-900">
            {t("about.missionTitle")}
          </h2>
          <div className="mt-8 max-w-2xl space-y-5 text-base leading-relaxed text-slate-600">
            <p>{t("about.missionP1")}</p>
            <p>{t("about.missionP2")}</p>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="container-narrow section-pad py-20">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-semibold text-slate-900">
              {t("about.ecoTitle")}
            </h2>
            <p className="mt-3 text-slate-600">{t("about.ecoSub")}</p>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <article className="flex flex-col rounded-2xl border border-slate-200 bg-white p-7 shadow-[0_1px_2px_rgba(15,23,42,0.04)] md:p-8">
              <div className="flex items-center gap-2 text-teal-800">
                <Building2 className="h-4 w-4" />
                <p className="text-xs font-medium uppercase tracking-wider">
                  {t("about.ownersLabel")}
                </p>
              </div>
              <h3 className="mt-4 font-display text-2xl font-semibold text-slate-900">
                {t("about.ownersTitle")}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{t("about.ownersBody")}</p>
              <ul className="mt-6 flex-1 space-y-2.5">
                {ownerFeatures.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm text-slate-700">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" />
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

            <article className="flex flex-col rounded-2xl border border-slate-200 bg-white p-7 shadow-[0_1px_2px_rgba(15,23,42,0.04)] md:p-8">
              <div className="flex items-center gap-2 text-teal-800">
                <Users className="h-4 w-4" />
                <p className="text-xs font-medium uppercase tracking-wider">
                  {t("about.investorsLabel")}
                </p>
              </div>
              <h3 className="mt-4 font-display text-2xl font-semibold text-slate-900">
                {t("about.investorsTitle")}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {t("about.investorsBody")}
              </p>
              <ul className="mt-6 flex-1 space-y-2.5">
                {investorFeatures.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm text-slate-700">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" />
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

      <section className="border-b border-slate-200 bg-slate-50/80">
        <div className="container-narrow section-pad py-20">
          <h2 className="max-w-2xl font-display text-3xl font-semibold text-slate-900">
            {t("about.whyTitle")}
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {whyItems.map((item) => (
              <div key={item.n} className="border-t border-slate-200 pt-6">
                <p className="text-xs font-medium tracking-wider text-teal-800">{item.n}</p>
                <h3 className="mt-3 font-display text-xl font-semibold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="container-narrow section-pad py-20">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-semibold text-slate-900">
              {t("about.trustTitle")}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600">{t("about.trustSub")}</p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {trustItems.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-teal-800">
                  <item.icon className="h-4 w-4" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-2xl border-l-2 border-teal-800/30 pl-4 text-sm leading-relaxed text-slate-500">
            {t("about.trustNote")}
          </p>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-slate-50/80">
        <div className="container-narrow section-pad py-20">
          <h2 className="max-w-2xl font-display text-3xl font-semibold text-slate-900">
            {t("about.differentTitle")}
          </h2>
          <div className="mt-8 max-w-2xl space-y-5 text-base leading-relaxed text-slate-600">
            <p>{t("about.differentP1")}</p>
            <p>{t("about.differentP2")}</p>
            <p>{t("about.differentP3")}</p>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="container-narrow section-pad py-20">
          <h2 className="font-display text-3xl font-semibold text-slate-900">
            {t("about.journeyTitle")}
          </h2>
          <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {journey.map((label, index) => (
              <li key={label} className="relative">
                <p className="text-xs font-medium tracking-wider text-teal-800">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <p className="mt-3 font-display text-base font-semibold leading-snug text-slate-900">
                  {label}
                </p>
              </li>
            ))}
          </ol>
          <p className="mt-10 text-sm text-slate-500">{t("about.journeyNote")}</p>
        </div>
      </section>

      <section className="bg-slate-50/80">
        <div className="container-narrow section-pad py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-semibold text-slate-900">
              {t("about.ctaTitle")}
            </h2>
            <p className="mt-4 text-slate-600">{t("about.ctaSub")}</p>
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
