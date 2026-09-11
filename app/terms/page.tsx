"use client";

import { LegalDocumentPage } from "@/components/shared/legal-document-page";
import { useI18n } from "@/hooks";

export default function TermsPage() {
  const { t } = useI18n();
  return (
    <LegalDocumentPage
      eyebrow={t("terms.eyebrow")}
      title={t("terms.heroTitle")}
      subtitle={t("terms.heroSub")}
      updated={t("terms.updated")}
      sections={[
        { title: t("terms.s1Title"), body: t("terms.s1Body") },
        { title: t("terms.s2Title"), body: t("terms.s2Body") },
        { title: t("terms.s3Title"), body: t("terms.s3Body") },
        { title: t("terms.s4Title"), body: t("terms.s4Body") },
        { title: t("terms.s5Title"), body: t("terms.s5Body") },
        { title: t("terms.s6Title"), body: t("terms.s6Body") },
        { title: t("terms.s7Title"), body: t("terms.s7Body") },
        { title: t("terms.s8Title"), body: t("terms.s8Body") },
        { title: t("terms.s9Title"), body: t("terms.s9Body") },
        { title: t("terms.s10Title"), body: t("terms.s10Body") },
        {
          title: t("terms.s11Title"),
          body: t("terms.s11Body"),
          emailLabel: t("terms.emailLabel"),
        },
      ]}
    />
  );
}
