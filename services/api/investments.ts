import apiClient from "./client";
import type { ApiResponse, FilterParams, Investment, PaginatedResponse } from "@/types";

export interface CreateInvestmentData {
  projectId: string;
  planId?: string;
  amount: number;
}

export const investmentsApi = {
  getAll: (params?: FilterParams & { status?: string }) =>
    apiClient.get<ApiResponse<PaginatedResponse<Investment>>>("/investments", {
      params,
    }),

  getById: (id: string) =>
    apiClient.get<ApiResponse<Investment>>(`/investments/${id}`),

  create: (data: CreateInvestmentData) =>
    apiClient.post<ApiResponse<Investment>>("/investments", data),

  getActive: (params?: FilterParams) =>
    apiClient.get<ApiResponse<PaginatedResponse<Investment>>>("/investments/active", {
      params,
    }),

  getCompleted: (params?: FilterParams) =>
    apiClient.get<ApiResponse<PaginatedResponse<Investment>>>(
      "/investments/completed",
      { params }
    ),
};
