import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL } from "@/constants";
import type { ApiError } from "@/types";

const TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const TOKEN_COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // mirror access token TTL (7d)

// The access token is mirrored into a cookie so Next.js middleware can
// enforce role-based route protection on the server.
function syncAuthCookie(accessToken: string | null): void {
  if (typeof document === "undefined") return;
  if (accessToken) {
    document.cookie = `${TOKEN_KEY}=${accessToken}; path=/; max-age=${TOKEN_COOKIE_MAX_AGE}; SameSite=Lax`;
  } else {
    document.cookie = `${TOKEN_KEY}=; path=/; max-age=0; SameSite=Lax`;
  }
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setTokens(accessToken: string, refreshToken: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  syncAuthCookie(accessToken);
}

export function clearTokens(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  syncAuthCookie(null);
}

/** Re-sync the middleware cookie from localStorage (covers sessions created before cookie support). */
export function syncAuthCookieFromStorage(): void {
  syncAuthCookie(getAccessToken());
}

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest.headers?.["X-Retry"]
    ) {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });
          setTokens(data.data.accessToken, data.data.refreshToken);
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
          originalRequest.headers["X-Retry"] = "true";
          return apiClient(originalRequest);
        } catch {
          clearTokens();
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
        }
      } else {
        clearTokens();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.code === "ERR_NETWORK" || !error.response) {
      return "Unable to connect to the server. Make sure the API is running.";
    }
    const apiError = error.response?.data as ApiError | undefined;
    return apiError?.message || error.message || "An unexpected error occurred";
  }
  if (error instanceof Error) return error.message;
  return "An unexpected error occurred";
}

export default apiClient;
