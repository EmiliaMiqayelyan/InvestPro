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
        {
          title: t("privacy.s1Title"),
          body: t("privacy.s1Body"),
          items: [
            t("privacy.s1i1"),
            t("privacy.s1i2"),
            t("privacy.s1i3"),
            t("privacy.s1i4"),
            t("privacy.s1i5"),
            t("privacy.s1i6"),
          ],
          after: t("privacy.s1After"),
        },
        {
          title: t("privacy.s2Title"),
          body: t("privacy.s2Body"),
          items: [
            t("privacy.s2i1"),
            t("privacy.s2i2"),
            t("privacy.s2i3"),
            t("privacy.s2i4"),
            t("privacy.s2i5"),
            t("privacy.s2i6"),
            t("privacy.s2i7"),
          ],
        },
        { title: t("privacy.s3Title"), body: t("privacy.s3Body") },
        { title: t("privacy.s4Title"), body: t("privacy.s4Body") },
        { title: t("privacy.s5Title"), body: t("privacy.s5Body") },
        { title: t("privacy.s6Title"), body: t("privacy.s6Body") },
        {
          title: t("privacy.s7Title"),
          body: t("privacy.s7Body"),
          items: [
            t("privacy.s7i1"),
            t("privacy.s7i2"),
            t("privacy.s7i3"),
            t("privacy.s7i4"),
            t("privacy.s7i5"),
          ],
          after: t("privacy.s7After"),
        },
        {
          title: t("privacy.s8Title"),
          body: t("privacy.s8Body"),
          emailLabel: t("privacy.emailLabel"),
        },
        { title: t("privacy.s9Title"), body: t("privacy.s9Body") },
      ]}
    />
  );
}
