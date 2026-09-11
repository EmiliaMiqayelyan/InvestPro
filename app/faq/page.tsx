"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MarketingHeader, MarketingFooter } from "@/components/layout/marketing-shell";
import { CtaBand } from "@/components/shared/cta-band";
import { PageHeroBanner } from "@/components/shared/page-hero-banner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants";
import { useI18n } from "@/hooks";

export default function FaqPage() {
  const { t } = useI18n();
  const faqs = [
    { q: t("faqPage.q1"), a: t("faqPage.a1") },
    { q: t("faqPage.q2"), a: t("faqPage.a2") },
    { q: t("faqPage.q3"), a: t("faqPage.a3") },
    { q: t("faqPage.q4"), a: t("faqPage.a4") },
    { q: t("faqPage.q5"), a: t("faqPage.a5") },
    { q: t("faqPage.q6"), a: t("faqPage.a6") },
    { q: t("faqPage.q7"), a: t("faqPage.a7") },
    { q: t("faqPage.q8"), a: t("faqPage.a8") },
    { q: t("faqPage.q9"), a: t("faqPage.a9") },
    { q: t("faqPage.q10"), a: t("faqPage.a10") },
  ];

  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />
      <PageHeroBanner
        eyebrow={t("faqPage.eyebrow")}
        title={t("faqPage.heroTitle")}
        description={t("faqPage.heroSub")}
        height="md"
      />
      <section className="container-wide section-pad py-14 lg:py-20">
        <Accordion type="single" collapsible className="mx-auto w-full max-w-3xl">
          {faqs.map((faq, i) => (
            <AccordionItem key={faq.q} value={`faq-${i}`}>
              <AccordionTrigger className="text-left font-display text-base sm:text-lg">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="leading-relaxed text-muted-foreground">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
      <CtaBand title={t("faqPage.stillTitle")} description={t("faqPage.stillBody")}>
        <Button size="lg" variant="onImage" className="shrink-0" asChild>
          <Link href={ROUTES.CONTACT}>
            {t("faqPage.contactCta")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CtaBand>
      <MarketingFooter />
    </div>
  );
}
