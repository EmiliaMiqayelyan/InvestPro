"use client";

import Link from "next/link";
import { MarketingHeader, MarketingFooter } from "@/components/layout/marketing-shell";
import { PageHeroBanner } from "@/components/shared/page-hero-banner";
import { SUPPORT_EMAIL, ROUTES } from "@/constants";
import { useI18n } from "@/hooks";
import { cn } from "@/lib/utils";

export type LegalSection = {
  title: string;
  body?: string;
  items?: string[];
  after?: string;
  emailLabel?: string;
};

function LegalText({ text, className }: { text: string; className?: string }) {
  const parts = text.split("{email}");

  return (
    <p className={cn("mt-3 text-sm leading-relaxed text-muted-foreground whitespace-pre-line", className)}>
      {parts.length === 1
        ? text
        : parts.map((part, index) => (
            <span key={index}>
              {part}
              {index < parts.length - 1 && (
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="font-medium text-foreground underline-offset-4 hover:underline"
                >
                  {SUPPORT_EMAIL}
                </a>
              )}
            </span>
          ))}
    </p>
  );
}

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
  sections: LegalSection[];
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
              {section.body && <LegalText text={section.body} />}
              {section.items && section.items.length > 0 && (
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
              {section.after && <LegalText text={section.after} />}
              {section.emailLabel && (
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  <span className="font-medium text-foreground">{section.emailLabel} </span>
                  <a
                    href={`mailto:${SUPPORT_EMAIL}`}
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    {SUPPORT_EMAIL}
                  </a>
                </p>
              )}
            </section>
          ))}
        </div>
        <p className="mt-12 border-t border-border pt-6 text-sm text-muted-foreground">
          <Link href={ROUTES.CONTACT} className="text-foreground underline-offset-4 hover:underline">
            {t("nav.contact")}
          </Link>
          {" · "}
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="text-foreground underline-offset-4 hover:underline"
          >
            {SUPPORT_EMAIL}
          </a>
        </p>
      </article>
      <MarketingFooter />
    </div>
  );
}
