"use client";

import { useState } from "react";
import { Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { PLATFORM_NAME } from "@/constants";
import { useI18n } from "@/hooks";
import { useSetPageTitle } from "@/components/providers/page-title-provider";
import { PageHeader } from "@/components/shared/page-header";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const { t } = useI18n();
  useSetPageTitle(t("admin.settingsTitle"));
  const [settings, setSettings] = useState({
    platformName: PLATFORM_NAME,
    supportEmail: "support@venturebridge.com",
    maintenanceMode: false,
    kycRequired: true,
    contactBlocking: true,
    announcement: "",
  });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        variant="minimal"
        title={t("admin.settingsTitle")}
        description={t("admin.settingsSub")}
      />

      <Card className="premium-card border-border bg-white shadow-none backdrop-blur-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <Settings className="h-5 w-5 text-teal-800" /> {t("admin.settingsGeneral")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label>{t("admin.platformName")}</Label>
            <Input
              value={settings.platformName}
              onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>{t("admin.supportEmail")}</Label>
            <Input
              value={settings.supportEmail}
              onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>{t("admin.announcementBanner")}</Label>
            <Textarea
              value={settings.announcement}
              onChange={(e) => setSettings({ ...settings, announcement: e.target.value })}
              placeholder={t("admin.announcementPlaceholder")}
            />
          </div>
          <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
            <div>
              <p className="font-medium text-slate-900">{t("admin.maintenanceMode")}</p>
              <p className="text-sm text-muted-foreground">{t("admin.maintenanceModeDesc")}</p>
            </div>
            <Switch
              checked={settings.maintenanceMode}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, maintenanceMode: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
            <div>
              <p className="font-medium text-slate-900">{t("admin.kycRequired")}</p>
              <p className="text-sm text-muted-foreground">{t("admin.kycRequiredDesc")}</p>
            </div>
            <Switch
              checked={settings.kycRequired}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, kycRequired: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
            <div>
              <p className="font-medium text-slate-900">{t("admin.contactBlocking")}</p>
              <p className="text-sm text-muted-foreground">{t("admin.contactBlockingDesc")}</p>
            </div>
            <Switch
              checked={settings.contactBlocking}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, contactBlocking: checked })
              }
            />
          </div>
          <Button
            className="w-full"
            onClick={() => toast.success(t("admin.settingsSaved"))}
          >
            {t("admin.saveSettings")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
