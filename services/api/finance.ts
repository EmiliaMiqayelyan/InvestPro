import apiClient from "./client";
import type {
  ApiResponse,
  PaginatedResponse,
  Wallet,
  WalletTransaction,
  PortfolioSummary,
  InvestmentReturn,
  KybSubmission,
  Dispute,
  Complaint,
  SystemSettings,
  MembershipSubscription,
} from "@/types";

export const walletApi = {
  get: () => apiClient.get<ApiResponse<Wallet>>("/wallet"),
  transactions: (params?: { page?: number; limit?: number }) =>
    apiClient.get<ApiResponse<PaginatedResponse<WalletTransaction>>>("/wallet/transactions", {
      params,
    }),
  deposit: (amount: number, idempotencyKey: string) =>
    apiClient.post<ApiResponse<Wallet>>(
      "/wallet/deposit",
      { amount },
      { headers: { "Idempotency-Key": idempotencyKey } }
    ),
  withdraw: (
    data: {
      amount: number;
      destination: {
        type: "bank" | "card" | "crypto";
        accountNumber?: string;
        bankName?: string;
      };
    },
    idempotencyKey: string
  ) =>
    apiClient.post(
      "/wallet/withdraw",
      data,
      { headers: { "Idempotency-Key": idempotencyKey } }
    ),
};

export const portfolioApi = {
  get: () => apiClient.get<ApiResponse<PortfolioSummary>>("/me/portfolio"),
  returns: () => apiClient.get<ApiResponse<InvestmentReturn[]>>("/me/returns"),
};

export const kybApi = {
  get: () => apiClient.get<ApiResponse<KybSubmission | null>>("/kyb"),
  submit: (data: {
    registrationDocumentUrl: string;
    taxDocumentUrl?: string;
    bankStatementUrl?: string;
  }) => apiClient.post<ApiResponse<KybSubmission>>("/kyb", data),
};

export const adminFinanceApi = {
  memberships: () =>
    apiClient.get<ApiResponse<MembershipSubscription[]>>("/admin/payments"),
  disputes: (params?: { status?: string; page?: number; limit?: number }) =>
    apiClient.get<ApiResponse<PaginatedResponse<Dispute>>>("/admin/disputes", { params }),
  resolveDispute: (id: string, resolution: string) =>
    apiClient.post<ApiResponse<Dispute>>(`/admin/disputes/${id}/resolve`, { resolution }),
  updateComplaint: (id: string, status: Complaint["status"]) =>
    apiClient.patch<ApiResponse<Complaint>>(`/admin/complaints/${id}`, { status }),
  getSettings: () => apiClient.get<ApiResponse<SystemSettings>>("/admin/settings"),
  saveSettings: (data: SystemSettings) =>
    apiClient.put<ApiResponse<SystemSettings>>("/admin/settings", data),
};
