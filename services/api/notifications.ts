import apiClient from "./client";
import type { ApiResponse, FilterParams, Notification, PaginatedResponse } from "@/types";

export const notificationsApi = {
  getAll: (params?: FilterParams) =>
    apiClient.get<ApiResponse<PaginatedResponse<Notification>>>("/notifications", {
      params,
    }),

  getUnreadCount: () =>
    apiClient.get<ApiResponse<{ count: number }>>("/notifications/unread-count"),

  markAsRead: (id: string) =>
    apiClient.patch<ApiResponse<Notification>>(`/notifications/${id}/read`),

  markAllAsRead: () =>
    apiClient.post<ApiResponse<null>>("/notifications/read-all"),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/notifications/${id}`),

  sendAdminNotification: (data: {
    userId?: string;
    title: string;
    message: string;
    type: string;
  }) => apiClient.post<ApiResponse<Notification>>("/admin/notifications", data),
};
