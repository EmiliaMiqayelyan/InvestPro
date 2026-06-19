"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { notificationsApi } from "@/services/api";
import { getErrorMessage } from "@/services/api/client";
import { toast } from "sonner";

export default function AdminNotificationsPage() {
  const [form, setForm] = useState({
    title: "",
    message: "",
    userId: "",
  });

  const mutation = useMutation({
    mutationFn: () =>
      notificationsApi.sendAdminNotification({
        title: form.title,
        message: form.message,
        userId: form.userId || undefined,
        type: "admin_message",
      }),
    onSuccess: () => {
      toast.success("Notification sent");
      setForm({ title: "", message: "", userId: "" });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">Notifications Management</h1>
        <p className="text-muted-foreground">Send notifications to users</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" /> Send Notification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>User ID (optional — leave empty for broadcast)</Label>
            <Input
              value={form.userId}
              onChange={(e) => setForm({ ...form, userId: e.target.value })}
              placeholder="user-id"
            />
          </div>
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Message</Label>
            <Input
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
          </div>
          <Button
            variant="gradient"
            className="w-full"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending || !form.title || !form.message}
          >
            Send Notification
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
