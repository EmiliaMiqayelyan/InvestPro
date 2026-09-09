"use client";

import Link from "next/link";
import { MarketingHeader, MarketingFooter } from "@/components/layout/marketing-shell";
import { PageHeroBanner } from "@/components/shared/page-hero-banner";
import { SUPPORT_EMAIL, ROUTES } from "@/constants";
import { useI18n } from "@/hooks";

type Section = { title: string; body: string };

export function LegalDocumentPage({
  eyebrow,
  title,
  subtitle,
  updated,
  sections,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  updated: string;
  sections: Section[];
}) {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />
      <PageHeroBanner
        eyebrow={eyebrow}
        title={title}
        description={subtitle}
        height="md"
      />
      <article className="container-narrow section-pad py-12 lg:py-16">
        <p className="text-sm text-muted-foreground">{updated}</p>
        <div className="mt-10 space-y-10">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-display text-xl font-semibold text-foreground">
                {section.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                {section.body.replace("{email}", SUPPORT_EMAIL)}
              </p>
            </section>
          ))}
        </div>
        <p className="mt-12 border-t border-border pt-6 text-sm text-muted-foreground">
          <Link href={ROUTES.CONTACT} className="text-foreground underline-offset-4 hover:underline">
            {t("nav.contact")}
          </Link>
          {" · "}
          {SUPPORT_EMAIL}
        </p>
      </article>
      <MarketingFooter />
    </div>
  );
}
