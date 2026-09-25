"use client";

import { Suspense } from "react";
import { MessagesPanel } from "@/components/workspace/messages-panel";
import { useSetPageTitle } from "@/components/providers/page-title-provider";
import { PageHeader } from "@/components/shared/page-header";
import { PanelPage } from "@/components/shared/panel-page";
import { useI18n } from "@/hooks";

export default function AdminMessagesPage() {
  const { t } = useI18n();
  useSetPageTitle(t("messages.title"));

  return (
    <PanelPage>
      <PageHeader
        variant="minimal"
        title={t("messages.title")}
        description={t("messages.adminSub")}
      />
      <Suspense fallback={<p className="text-sm text-muted-foreground">{t("common.loading")}</p>}>
        <MessagesPanel />
      </Suspense>
    </PanelPage>
  );
}
