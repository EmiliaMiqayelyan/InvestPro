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
import { toast } from "sonner";

export default function AdminSettingsPage() {
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
      <div>
        <h2 className="font-display text-2xl font-semibold text-slate-900">Settings</h2>
        <p className="text-sm text-muted-foreground">Platform configuration (UI stub)</p>
      </div>

      <Card className="premium-card border-border bg-white shadow-none backdrop-blur-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <Settings className="h-5 w-5 text-blue-600" /> General
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label>Platform name</Label>
            <Input
              value={settings.platformName}
              onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Support email</Label>
            <Input
              value={settings.supportEmail}
              onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Announcement banner</Label>
            <Textarea
              value={settings.announcement}
              onChange={(e) => setSettings({ ...settings, announcement: e.target.value })}
              placeholder="Optional platform-wide notice"
            />
          </div>
          <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
            <div>
              <p className="font-medium text-slate-900">Maintenance mode</p>
              <p className="text-sm text-muted-foreground">Temporarily disable user access</p>
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
              <p className="font-medium text-slate-900">KYC required</p>
              <p className="text-sm text-muted-foreground">Require verification for offers</p>
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
              <p className="font-medium text-slate-900">Contact blocking</p>
              <p className="text-sm text-muted-foreground">
                Block emails/phones in on-platform chat
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
            className="w-full bg-blue-600 hover:bg-blue-700"
            onClick={() => toast.success("Settings saved locally")}
          >
            Save settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
