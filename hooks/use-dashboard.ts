"use client";

import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";
import { dashboardApi } from "@/services/api";

export function useDashboardStats() {
  return useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD, "stats"],
    queryFn: async () => {
      const { data } = await dashboardApi.getStats();
      return data.data;
    },
  });
}

export function usePortfolioPerformance(period = "30d") {
  return useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD, "portfolio", period],
    queryFn: async () => {
      const { data } = await dashboardApi.getPortfolioPerformance(period);
      return data.data;
    },
  });
}

export function useProfitHistory(period = "30d") {
  return useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD, "profit", period],
    queryFn: async () => {
      const { data } = await dashboardApi.getProfitHistory(period);
      return data.data;
    },
  });
}

export function useInvestmentGrowth(period = "30d") {
  return useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD, "growth", period],
    queryFn: async () => {
      const { data } = await dashboardApi.getInvestmentGrowth(period);
      return data.data;
    },
  });
}
