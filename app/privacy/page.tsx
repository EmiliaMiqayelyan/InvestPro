"use client";

import { LegalDocumentPage } from "@/components/shared/legal-document-page";
import { useI18n } from "@/hooks";

export default function PrivacyPage() {
  const { t } = useI18n();
  return (
    <LegalDocumentPage
      eyebrow={t("privacy.eyebrow")}
      title={t("privacy.heroTitle")}
      subtitle={t("privacy.heroSub")}
      updated={t("privacy.updated")}
      sections={[
        { title: t("privacy.s1Title"), body: t("privacy.s1Body") },
        { title: t("privacy.s2Title"), body: t("privacy.s2Body") },
        { title: t("privacy.s3Title"), body: t("privacy.s3Body") },
        { title: t("privacy.s4Title"), body: t("privacy.s4Body") },
        { title: t("privacy.s5Title"), body: t("privacy.s5Body") },
      ]}
    />
  );
}
