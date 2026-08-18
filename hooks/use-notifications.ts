"use client";

import { useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { API_BASE_URL, QUERY_KEYS } from "@/constants";
import { notificationsApi } from "@/services/api";
import { getAccessToken } from "@/services/api/client";
import { useAuthStore } from "@/store";
import type { Notification } from "@/types";

type StreamPayload = {
  notification: Notification;
  unreadCount: number;
};

function prependNotification(list: Notification[] | undefined, item: Notification) {
  const current = list || [];
  if (current.some((n) => n.id === item.id)) return current;
  return [item, ...current].slice(0, 100);
}

export function useNotifications() {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: [QUERY_KEYS.NOTIFICATIONS],
    queryFn: async () => (await notificationsApi.list()).data.data,
    enabled: isAuthenticated,
    refetchInterval: 45000,
    refetchOnWindowFocus: true,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationsApi.markRead(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS] });
      const previous = queryClient.getQueryData<Notification[]>([QUERY_KEYS.NOTIFICATIONS]);
      queryClient.setQueryData<Notification[]>([QUERY_KEYS.NOTIFICATIONS], (list) =>
        (list || []).map((item) => (item.id === id ? { ...item, isRead: true } : item))
      );
      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData([QUERY_KEYS.NOTIFICATIONS], context.previous);
      }
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => notificationsApi.markAllRead(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS] });
      const previous = queryClient.getQueryData<Notification[]>([QUERY_KEYS.NOTIFICATIONS]);
      queryClient.setQueryData<Notification[]>([QUERY_KEYS.NOTIFICATIONS], (list) =>
        (list || []).map((item) => ({ ...item, isRead: true }))
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData([QUERY_KEYS.NOTIFICATIONS], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS] });
    },
  });
}

/** Live SSE feed with polling already handled by useNotifications. */
export function useNotificationStream() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;

  useEffect(() => {
    if (!isAuthenticated) return;

    let source: EventSource | null = null;
    let stopped = false;
    let retryMs = 1000;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;

    const applyPayload = (payload: StreamPayload) => {
      queryClient.setQueryData<Notification[]>([QUERY_KEYS.NOTIFICATIONS], (list) =>
        prependNotification(list, payload.notification)
      );

      const onMessages = pathnameRef.current.includes("/messages");
      if (payload.notification.type === "message" && onMessages) return;

      toast(payload.notification.title, {
        description: payload.notification.message,
        duration: payload.notification.priority === "high" ? 7000 : 4500,
      });
    };

    const connect = () => {
      if (stopped) return;
      const token = getAccessToken();
      const url = token
        ? `${API_BASE_URL}/notifications/stream?token=${encodeURIComponent(token)}`
        : `${API_BASE_URL}/notifications/stream`;
      source = new EventSource(url);
      source.addEventListener("connected", () => {
        retryMs = 1000;
      });
      source.addEventListener("notification", (event) => {
        try {
          applyPayload(JSON.parse((event as MessageEvent).data) as StreamPayload);
        } catch {
          /* ignore malformed frames */
        }
      });
      source.onerror = () => {
        source?.close();
        source = null;
        if (stopped) return;
        retryTimer = setTimeout(connect, retryMs);
        retryMs = Math.min(retryMs * 2, 15000);
      };
    };

    connect();

    return () => {
      stopped = true;
      if (retryTimer) clearTimeout(retryTimer);
      source?.close();
    };
  }, [isAuthenticated, queryClient]);
}
