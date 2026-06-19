import apiClient from "./client";
import type { ApiResponse, FilterParams, KycSubmission, PaginatedResponse } from "@/types";

export interface SubmitKycData {
  idDocument: File;
  selfie: File;
  addressProof: File;
}

export const kycApi = {
  getStatus: () => apiClient.get<ApiResponse<KycSubmission | null>>("/kyc/status"),

  submit: (data: FormData) =>
    apiClient.post<ApiResponse<KycSubmission>>("/kyc/submit", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  getAll: (params?: FilterParams) =>
    apiClient.get<ApiResponse<PaginatedResponse<KycSubmission>>>("/admin/kyc", {
      params,
    }),

  approve: (id: string) =>
    apiClient.post<ApiResponse<KycSubmission>>(`/admin/kyc/${id}/approve`),

  reject: (id: string, reason: string) =>
    apiClient.post<ApiResponse<KycSubmission>>(`/admin/kyc/${id}/reject`, { reason }),

  requestResubmission: (id: string, reason: string) =>
    apiClient.post<ApiResponse<KycSubmission>>(`/admin/kyc/${id}/resubmit`, {
      reason,
    }),
};
