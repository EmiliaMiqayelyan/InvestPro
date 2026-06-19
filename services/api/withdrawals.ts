import apiClient from "./client";
import type {
  ApiResponse,
  CryptoCurrency,
  FilterParams,
  PaginatedResponse,
  PaymentMethod,
  Withdrawal,
} from "@/types";

export interface CreateWithdrawalData {
  amount: number;
  currency?: string;
  paymentMethod: PaymentMethod;
  cryptoCurrency?: CryptoCurrency;
  destinationAddress?: string;
  bankDetails?: Record<string, string>;
}

export const withdrawalsApi = {
  getAll: (params?: FilterParams) =>
    apiClient.get<ApiResponse<PaginatedResponse<Withdrawal>>>("/withdrawals", { params }),

  getById: (id: string) =>
    apiClient.get<ApiResponse<Withdrawal>>(`/withdrawals/${id}`),

  create: (data: CreateWithdrawalData) =>
    apiClient.post<ApiResponse<Withdrawal>>("/withdrawals", data),

  getHistory: (params?: FilterParams) =>
    apiClient.get<ApiResponse<PaginatedResponse<Withdrawal>>>("/withdrawals/history", {
      params,
    }),

  approve: (id: string) =>
    apiClient.post<ApiResponse<Withdrawal>>(`/admin/withdrawals/${id}/approve`),

  reject: (id: string, reason: string) =>
    apiClient.post<ApiResponse<Withdrawal>>(`/admin/withdrawals/${id}/reject`, {
      reason,
    }),

  getPending: (params?: FilterParams) =>
    apiClient.get<ApiResponse<PaginatedResponse<Withdrawal>>>(
      "/admin/withdrawals/pending",
      { params }
    ),
};
