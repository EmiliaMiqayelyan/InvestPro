"use client";

import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";
import { notificationsApi } from "@/services/api";

export function useNotifications(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: [QUERY_KEYS.NOTIFICATIONS, params],
    queryFn: async () => {
      const { data } = await notificationsApi.getAll(params);
      return data.data;
    },
  });
}

export function useUnreadNotifications() {
  return useQuery({
    queryKey: [QUERY_KEYS.NOTIFICATIONS, "unread"],
    queryFn: async () => {
      const { data } = await notificationsApi.getUnreadCount();
      return data.data.count;
    },
    refetchInterval: 30000,
  });
}
