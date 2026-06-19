import apiClient from "./client";
import type { ApiResponse, FilterParams, PaginatedResponse, Transaction } from "@/types";

export const transactionsApi = {
  getAll: (params?: FilterParams) =>
    apiClient.get<ApiResponse<PaginatedResponse<Transaction>>>("/transactions", {
      params,
    }),

  getById: (id: string) =>
    apiClient.get<ApiResponse<Transaction>>(`/transactions/${id}`),

  getRecent: (limit = 5) =>
    apiClient.get<ApiResponse<Transaction[]>>("/transactions/recent", {
      params: { limit },
    }),

  getAllAdmin: (params?: FilterParams) =>
    apiClient.get<ApiResponse<PaginatedResponse<Transaction>>>(
      "/admin/transactions",
      { params }
    ),
};
