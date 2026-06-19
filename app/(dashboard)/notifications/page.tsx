"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { DataTableSkeleton } from "@/components/shared/loading-skeleton";
import { QUERY_KEYS } from "@/constants";
import { useNotifications } from "@/hooks";
import { notificationsApi } from "@/services/api";
import { formatRelativeTime } from "@/utils/format";
import { cn } from "@/lib/utils";

export default function NotificationsPage() {
  const { data, isLoading } = useNotifications({ limit: 50 });
  const queryClient = useQueryClient();

  const markAllMutation = useMutation({
    mutationFn: () => notificationsApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS] });
    },
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => notificationsApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS] });
    },
  });

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">Stay updated on your account activity</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => markAllMutation.mutate()}
          disabled={markAllMutation.isPending}
        >
          <CheckCheck className="mr-2 h-4 w-4" /> Mark all read
        </Button>
      </div>

      {isLoading ? (
        <DataTableSkeleton rows={5} columns={1} />
      ) : data?.data.length ? (
        <div className="space-y-3">
          {data.data.map((notification) => (
            <Card
              key={notification.id}
              className={cn(
                "cursor-pointer transition-colors hover:border-primary/30",
                !notification.isRead && "border-primary/20 bg-primary/5"
              )}
              onClick={() => !notification.isRead && markReadMutation.mutate(notification.id)}
            >
              <CardContent className="p-4 flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-2 shrink-0">
                  <Bell className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium truncate">{notification.title}</h3>
                    {!notification.isRead && (
                      <Badge variant="active" className="shrink-0">New</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{notification.message}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {formatRelativeTime(notification.createdAt)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState icon={Bell} title="No notifications" description="You're all caught up!" />
      )}
    </div>
  );
}
