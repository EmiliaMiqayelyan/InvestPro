import apiClient from "./client";
import type {
  ApiResponse,
  FilterParams,
  PaginatedResponse,
  User,
  UserRole,
} from "@/types";

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export const usersApi = {
  getProfile: () => apiClient.get<ApiResponse<User>>("/users/profile"),

  updateProfile: (data: UpdateProfileData) =>
    apiClient.patch<ApiResponse<User>>("/users/profile", data),

  uploadAvatar: (file: FormData) =>
    apiClient.post<ApiResponse<{ avatar: string }>>("/users/avatar", file, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  updateSecuritySettings: (data: {
    emailNotifications?: boolean;
    pushNotifications?: boolean;
    loginAlerts?: boolean;
  }) => apiClient.patch<ApiResponse<null>>("/users/security-settings", data),

  getAll: (params?: FilterParams) =>
    apiClient.get<ApiResponse<PaginatedResponse<User>>>("/admin/users", { params }),

  getById: (id: string) =>
    apiClient.get<ApiResponse<User>>(`/admin/users/${id}`),

  update: (id: string, data: Partial<User>) =>
    apiClient.patch<ApiResponse<User>>(`/admin/users/${id}`, data),

  updateRole: (id: string, role: UserRole) =>
    apiClient.patch<ApiResponse<User>>(`/admin/users/${id}/role`, { role }),

  deactivate: (id: string) =>
    apiClient.post<ApiResponse<null>>(`/admin/users/${id}/deactivate`),

  activate: (id: string) =>
    apiClient.post<ApiResponse<null>>(`/admin/users/${id}/activate`),
};
