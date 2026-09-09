"use client";

import Link from "next/link";
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
      <section className="container-wide section-pad py-12 lg:py-16">
        <Accordion type="single" collapsible className="mx-auto w-full max-w-4xl">
          {faqs.map((faq, i) => (
            <AccordionItem key={faq.q} value={`faq-${i}`}>
              <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
      <CtaBand title={t("faqPage.stillTitle")} description={t("faqPage.stillBody")}>
        <Button size="lg" variant="onImage" className="shrink-0" asChild>
          <Link href={ROUTES.CONTACT}>{t("faqPage.contactCta")}</Link>
        </Button>
      </CtaBand>
      <MarketingFooter />
    </div>
  );
}
