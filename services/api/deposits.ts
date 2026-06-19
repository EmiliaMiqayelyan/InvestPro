import apiClient from "./client";
import type {
  ApiResponse,
  CryptoCurrency,
  Deposit,
  FilterParams,
  PaginatedResponse,
  PaymentMethod,
} from "@/types";

export interface CreateDepositData {
  amount: number;
  currency?: string;
  paymentMethod: PaymentMethod;
  cryptoCurrency?: CryptoCurrency;
  cardToken?: string;
}

export const depositsApi = {
  getAll: (params?: FilterParams) =>
    apiClient.get<ApiResponse<PaginatedResponse<Deposit>>>("/deposits", { params }),

  getById: (id: string) =>
    apiClient.get<ApiResponse<Deposit>>(`/deposits/${id}`),

  create: (data: CreateDepositData) =>
    apiClient.post<ApiResponse<Deposit>>("/deposits", data),

  getHistory: (params?: FilterParams) =>
    apiClient.get<ApiResponse<PaginatedResponse<Deposit>>>("/deposits/history", {
      params,
    }),

  approve: (id: string) =>
    apiClient.post<ApiResponse<Deposit>>(`/admin/deposits/${id}/approve`),

  reject: (id: string, reason: string) =>
    apiClient.post<ApiResponse<Deposit>>(`/admin/deposits/${id}/reject`, { reason }),

  getPending: (params?: FilterParams) =>
    apiClient.get<ApiResponse<PaginatedResponse<Deposit>>>("/admin/deposits/pending", {
      params,
    }),
};
