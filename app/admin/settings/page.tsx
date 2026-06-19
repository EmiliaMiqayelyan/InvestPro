"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { QUERY_KEYS } from "@/constants";
import { adminApi } from "@/services/api";
import { getErrorMessage } from "@/services/api/client";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const queryClient = useQueryClient();
  const [localSettings, setLocalSettings] = useState<Record<string, unknown>>({});

  const { data: settings, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.ADMIN_STATS, "settings"],
    queryFn: async () => {
      const { data } = await adminApi.getSettings();
      setLocalSettings(data.data);
      return data.data;
    },
  });

  const mutation = useMutation({
    mutationFn: () => adminApi.updateSettings(localSettings),
    onSuccess: () => {
      toast.success("Settings saved");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_STATS, "settings"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  if (isLoading) {
    return <div className="animate-pulse h-64 bg-muted/50 rounded-xl" />;
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">Platform Settings</h1>
        <p className="text-muted-foreground">Configure platform-wide settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" /> General Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Platform Name</Label>
            <Input
              value={(localSettings.platformName as string) || "InvestPro"}
              onChange={(e) =>
                setLocalSettings({ ...localSettings, platformName: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Support Email</Label>
            <Input
              value={(localSettings.supportEmail as string) || ""}
              onChange={(e) =>
                setLocalSettings({ ...localSettings, supportEmail: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Minimum Deposit (USD)</Label>
            <Input
              type="number"
              value={(localSettings.minDeposit as number) || 10}
              onChange={(e) =>
                setLocalSettings({ ...localSettings, minDeposit: +e.target.value })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Maintenance Mode</p>
              <p className="text-sm text-muted-foreground">Disable user access temporarily</p>
            </div>
            <Switch
              checked={(localSettings.maintenanceMode as boolean) || false}
              onCheckedChange={(checked) =>
                setLocalSettings({ ...localSettings, maintenanceMode: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">KYC Required</p>
              <p className="text-sm text-muted-foreground">Require KYC for investments</p>
            </div>
            <Switch
              checked={(localSettings.kycRequired as boolean) || false}
              onCheckedChange={(checked) =>
                setLocalSettings({ ...localSettings, kycRequired: checked })
              }
            />
          </div>
          <Button
            variant="gradient"
            className="w-full"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
          >
            Save Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
