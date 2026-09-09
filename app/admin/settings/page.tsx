"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { PLATFORM_NAME, SUPPORT_EMAIL, QUERY_KEYS } from "@/constants";
import { adminFinanceApi } from "@/services/api";
import { getErrorMessage } from "@/services/api/client";
import { useI18n } from "@/hooks";
import { useSetPageTitle } from "@/components/providers/page-title-provider";
import { PageHeader } from "@/components/shared/page-header";
import type { SystemSettings } from "@/types";
import { toast } from "sonner";

const DEFAULTS: SystemSettings = {
  platformName: PLATFORM_NAME,
  supportEmail: SUPPORT_EMAIL,
  maintenanceMode: false,
  kycRequired: true,
  contactBlocking: true,
  announcement: "",
};

export default function AdminSettingsPage() {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  useSetPageTitle(t("admin.settingsTitle"));
  const [settings, setSettings] = useState<SystemSettings>(DEFAULTS);

  const { data, isLoading, isError } = useQuery({
    queryKey: [QUERY_KEYS.ADMIN_SETTINGS],
    queryFn: async () => (await adminFinanceApi.getSettings()).data.data,
  });

  useEffect(() => {
    if (data) setSettings({ ...DEFAULTS, ...data });
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: () => adminFinanceApi.saveSettings(settings),
    onSuccess: (res) => {
      setSettings({ ...DEFAULTS, ...res.data.data });
      toast.success(t("admin.settingsSaved"));
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_SETTINGS] });
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        variant="minimal"
        title={t("admin.settingsTitle")}
        description={t("admin.settingsSub")}
      />

      {isError && (
        <p className="text-sm text-destructive">{t("admin.settingsLoadError")}</p>
      )}

      <Card className="premium-card border-border bg-white shadow-none backdrop-blur-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <Settings className="h-5 w-5 text-teal-800" /> {t("admin.settingsGeneral")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {isLoading ? (
            <div className="h-40 animate-pulse rounded-xl bg-slate-100" />
          ) : (
            <>
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
                  <p className="text-sm text-muted-foreground">
                    {t("admin.contactBlockingDesc")}
                  </p>
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
                disabled={saveMutation.isPending}
                onClick={() => saveMutation.mutate()}
              >
                {saveMutation.isPending ? t("common.saving") : t("admin.saveSettings")}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
