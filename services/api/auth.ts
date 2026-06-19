import apiClient from "./client";
import type {
  ApiResponse,
  AuthTokens,
  LoginResponse,
  User,
} from "@/types";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface TwoFactorData {
  code: string;
  tempToken?: string;
}

export const authApi = {
  login: (credentials: LoginCredentials) =>
    apiClient.post<ApiResponse<LoginResponse>>("/auth/login", credentials),

  register: (data: RegisterData) =>
    apiClient.post<ApiResponse<LoginResponse>>("/auth/register", data),

  logout: () => apiClient.post<ApiResponse<null>>("/auth/logout"),

  refreshToken: (refreshToken: string) =>
    apiClient.post<ApiResponse<AuthTokens>>("/auth/refresh", { refreshToken }),

  forgotPassword: (email: string) =>
    apiClient.post<ApiResponse<null>>("/auth/forgot-password", { email }),

  resetPassword: (token: string, password: string) =>
    apiClient.post<ApiResponse<null>>("/auth/reset-password", { token, password }),

  verifyEmail: (token: string) =>
    apiClient.post<ApiResponse<null>>("/auth/verify-email", { token }),

  resendVerification: (email: string) =>
    apiClient.post<ApiResponse<null>>("/auth/resend-verification", { email }),

  verify2fa: (data: TwoFactorData) =>
    apiClient.post<ApiResponse<LoginResponse>>("/auth/verify-2fa", data),

  enable2fa: () =>
    apiClient.post<ApiResponse<{ secret: string; qrCode: string }>>("/auth/2fa/enable"),

  confirm2fa: (code: string) =>
    apiClient.post<ApiResponse<null>>("/auth/2fa/confirm", { code }),

  disable2fa: (code: string) =>
    apiClient.post<ApiResponse<null>>("/auth/2fa/disable", { code }),

  getMe: () => apiClient.get<ApiResponse<User>>("/auth/me"),

  changePassword: (currentPassword: string, newPassword: string) =>
    apiClient.post<ApiResponse<null>>("/auth/change-password", {
      currentPassword,
      newPassword,
    }),
};
