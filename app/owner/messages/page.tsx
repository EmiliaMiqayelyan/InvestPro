"use client";

import { MessagesPanel } from "@/components/workspace/messages-panel";
import { useSetPageTitle } from "@/components/providers/page-title-provider";
import { PageHeader } from "@/components/shared/page-header";
import { useI18n } from "@/hooks";

export default function OwnerMessagesPage() {
  const { t } = useI18n();
  useSetPageTitle(t("messages.title"));

  return (
    <div className="space-y-6">
      <PageHeader
        variant="minimal"
        title={t("messages.title")}
        description={t("messages.securityNoteShort")}
      />
      <MessagesPanel />
    </div>
  );
}
