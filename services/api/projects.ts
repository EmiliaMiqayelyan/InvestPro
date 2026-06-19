import apiClient from "./client";
import type {
  ApiResponse,
  FilterParams,
  Investment,
  InvestmentPlan,
  PaginatedResponse,
  Project,
  RiskLevel,
  ProjectStatus,
} from "@/types";

export interface CreateProjectData {
  title: string;
  category: string;
  description: string;
  fullDescription: string;
  image: string;
  fundingGoal: number;
  roiPercentage: number;
  investmentPeriod: number;
  riskLevel: RiskLevel;
  status: ProjectStatus;
  minInvestment: number;
  maxInvestment: number;
  startDate: string;
  endDate: string;
}

export const projectsApi = {
  getAll: (params?: FilterParams & { category?: string; status?: string }) =>
    apiClient.get<ApiResponse<PaginatedResponse<Project>>>("/projects", { params }),

  getById: (id: string) =>
    apiClient.get<ApiResponse<Project>>(`/projects/${id}`),

  getPlans: (projectId: string) =>
    apiClient.get<ApiResponse<InvestmentPlan[]>>(`/projects/${projectId}/plans`),

  create: (data: CreateProjectData) =>
    apiClient.post<ApiResponse<Project>>("/admin/projects", data),

  update: (id: string, data: Partial<CreateProjectData>) =>
    apiClient.patch<ApiResponse<Project>>(`/admin/projects/${id}`, data),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/admin/projects/${id}`),
};
