"use client";

import { Suspense } from "react";
import { MessagesPanel } from "@/components/workspace/messages-panel";
import { useSetPageTitle } from "@/components/providers/page-title-provider";
import { PanelPage } from "@/components/shared/panel-page";
import { useI18n } from "@/hooks";

export default function OwnerMessagesPage() {
  const { t } = useI18n();
  useSetPageTitle(t("messages.title"));

  return (
    <PanelPage>
      <Suspense fallback={<p className="text-sm text-muted-foreground">{t("common.loading")}</p>}>
        <MessagesPanel />
      </Suspense>
    </PanelPage>
  );
}
