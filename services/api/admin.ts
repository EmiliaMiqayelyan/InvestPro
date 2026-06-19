import apiClient from "./client";
import type {
  AdminStats,
  ApiResponse,
  DashboardStats,
  PortfolioData,
} from "@/types";

export const adminApi = {
  getStats: () => apiClient.get<ApiResponse<AdminStats>>("/admin/stats"),

  getAnalytics: (period = "30d") =>
    apiClient.get<
      ApiResponse<{
        deposits: PortfolioData[];
        withdrawals: PortfolioData[];
        investments: PortfolioData[];
        users: PortfolioData[];
      }>
    >("/admin/analytics", { params: { period } }),

  getSettings: () =>
    apiClient.get<ApiResponse<Record<string, unknown>>>("/admin/settings"),

  updateSettings: (data: Record<string, unknown>) =>
    apiClient.patch<ApiResponse<Record<string, unknown>>>("/admin/settings", data),
};

export const dashboardApi = {
  getStats: () => apiClient.get<ApiResponse<DashboardStats>>("/dashboard/stats"),

  getPortfolioPerformance: (period = "30d") =>
    apiClient.get<ApiResponse<PortfolioData[]>>("/dashboard/portfolio", {
      params: { period },
    }),

  getProfitHistory: (period = "30d") =>
    apiClient.get<ApiResponse<PortfolioData[]>>("/dashboard/profit-history", {
      params: { period },
    }),

  getInvestmentGrowth: (period = "30d") =>
    apiClient.get<ApiResponse<PortfolioData[]>>("/dashboard/investment-growth", {
      params: { period },
    }),
};
