import apiClient from "./client";
import type {
  ApiResponse,
  PaginatedResponse,
  Project,
  RiskAnalysis,
  InvestmentOffer,
  Conversation,
  ChatMessage,
  MembershipPlan,
  MembershipSubscription,
  MembershipTier,
  MembershipPlanId,
  InvestorDashboardStats,
  OwnerDashboardStats,
  AdminStats,
  InvestorInvestment,
  User,
  FilterParams,
  Notification,
  KycSubmission,
  ActivityLog,
  MilestonePlan,
  MilestoneItem,
  MilestonePlanStatus,
} from "@/types";

export const projectsApi = {
  list: (params?: FilterParams) =>
    apiClient.get<ApiResponse<PaginatedResponse<Project>>>("/projects", { params }),
  getById: (id: string) =>
    apiClient.get<ApiResponse<Project & { limited?: boolean; teamCount?: number }>>(
      `/projects/${id}`
    ),
  riskAnalysis: (id: string) =>
    apiClient.get<ApiResponse<RiskAnalysis>>(`/projects/${id}/risk-analysis`),
  save: (id: string) => apiClient.post<ApiResponse<{ saved: boolean }>>(`/projects/${id}/save`),
  unsave: (id: string) => apiClient.delete<ApiResponse<{ saved: boolean }>>(`/projects/${id}/save`),
};

export const membershipApi = {
  getPlans: () => apiClient.get<ApiResponse<MembershipPlan[]>>("/membership/plans"),
  getMine: () =>
    apiClient.get<
      ApiResponse<{
        tier: MembershipTier;
        expiresAt?: string;
        subscription: MembershipSubscription | null;
      }>
    >("/membership/me"),
  subscribe: (planId: MembershipPlanId = "service") =>
    apiClient.post<
      ApiResponse<{
        user: User;
        subscription: MembershipSubscription;
        tokens: { accessToken: string; refreshToken: string };
      }>
    >("/membership/subscribe", { planId }),
  checkout: (planId: MembershipPlanId = "service") =>
    apiClient.post<
      ApiResponse<{ checkoutUrl: string; sessionId: string; planId: MembershipPlanId }>
    >("/membership/checkout", { planId }),
};

export const milestonesApi = {
  list: (params?: { projectId?: string; status?: string }) =>
    apiClient.get<ApiResponse<MilestonePlan[]>>("/milestones", { params }),
  getById: (id: string) => apiClient.get<ApiResponse<MilestonePlan>>(`/milestones/${id}`),
  create: (data: {
    projectId: string;
    items: Array<{
      title: string;
      titleHy?: string;
      description?: string;
      descriptionHy?: string;
      amount: number;
      dueDate?: string;
    }>;
    notes?: string;
  }) => apiClient.post<ApiResponse<MilestonePlan>>("/milestones", data),
  update: (
    id: string,
    data: {
      status?: MilestonePlanStatus;
      items?: MilestoneItem[];
      ownerResponse?: string;
      notes?: string;
    }
  ) => apiClient.patch<ApiResponse<MilestonePlan>>(`/milestones/${id}`, data),
};

export const uploadsApi = {
  create: (data: { name?: string; size?: number; category?: string }) =>
    apiClient.post<ApiResponse<{ url: string; name: string; size: number }>>("/uploads", data),
};

export const offersApi = {
  list: (params?: FilterParams) =>
    apiClient.get<ApiResponse<PaginatedResponse<InvestmentOffer>>>("/offers", { params }),
  create: (data: {
    projectId: string;
    amount: number;
    conditions?: string;
    questions?: string;
    notes?: string;
  }) => apiClient.post<ApiResponse<InvestmentOffer>>("/offers", data),
  respond: (id: string, data: { status: InvestmentOffer["status"]; ownerResponse?: string }) =>
    apiClient.patch<ApiResponse<InvestmentOffer>>(`/offers/${id}`, data),
};

export const chatApi = {
  listConversations: () => apiClient.get<ApiResponse<Conversation[]>>("/conversations"),
  start: (data: { projectId: string; investorId?: string }) =>
    apiClient.post<ApiResponse<Conversation>>("/conversations", data),
  getMessages: (id: string) =>
    apiClient.get<ApiResponse<ChatMessage[]>>(`/conversations/${id}/messages`),
  sendMessage: (
    id: string,
    data: { content: string; attachmentUrl?: string; attachmentName?: string }
  ) => apiClient.post<ApiResponse<ChatMessage>>(`/conversations/${id}/messages`, data),
};

export const investorApi = {
  dashboard: () => apiClient.get<ApiResponse<InvestorDashboardStats>>("/investor/dashboard"),
  saved: () => apiClient.get<ApiResponse<Project[]>>("/investor/saved"),
  investments: () => apiClient.get<ApiResponse<InvestorInvestment[]>>("/investor/investments"),
};

export const ownerApi = {
  dashboard: () => apiClient.get<ApiResponse<OwnerDashboardStats>>("/owner/dashboard"),
  projects: () => apiClient.get<ApiResponse<Project[]>>("/owner/projects"),
  createProject: (data: Partial<Project> & { title: string }) =>
    apiClient.post<ApiResponse<Project>>("/owner/projects", data),
  updateProject: (id: string, data: Partial<Project>) =>
    apiClient.patch<ApiResponse<Project>>(`/owner/projects/${id}`, data),
  addDocument: (
    id: string,
    data: { name: string; category: string; url?: string }
  ) => apiClient.post(`/owner/projects/${id}/documents`, data),
  addTeamMember: (id: string, data: Record<string, string>) =>
    apiClient.post(`/owner/projects/${id}/team`, data),
  documents: () => apiClient.get("/owner/documents"),
};

export const adminMarketplaceApi = {
  stats: () => apiClient.get<ApiResponse<AdminStats>>("/admin/stats"),
  users: (params?: FilterParams & { role?: string }) =>
    apiClient.get<ApiResponse<PaginatedResponse<User>>>("/admin/users", { params }),
  updateRole: (id: string, role: string) =>
    apiClient.patch(`/admin/users/${id}/role`, { role }),
  projects: (params?: FilterParams) =>
    apiClient.get<ApiResponse<PaginatedResponse<Project>>>("/admin/projects", { params }),
  updateProjectStatus: (id: string, status: string) =>
    apiClient.patch(`/admin/projects/${id}/status`, { status }),
  payments: () => apiClient.get("/admin/payments"),
  security: () =>
    apiClient.get<
      ApiResponse<{
        activityLogs: ActivityLog[];
        flaggedMessages: ChatMessage[];
        pendingKyc: KycSubmission[];
      }>
    >("/admin/security"),
  complaints: () => apiClient.get("/admin/complaints"),
};

export const contactApi = {
  send: (data: { name: string; email: string; message: string }) =>
    apiClient.post("/contact", data),
};

export const notificationsApi = {
  list: () => apiClient.get<ApiResponse<Notification[]>>("/notifications"),
  unreadCount: () =>
    apiClient.get<ApiResponse<{ unreadCount: number }>>("/notifications/unread-count"),
  markRead: (id: string) =>
    apiClient.patch<ApiResponse<{ notification: Notification; unreadCount: number }>>(
      `/notifications/${id}/read`
    ),
  markAllRead: () =>
    apiClient.post<ApiResponse<{ updated: number; unreadCount: number }>>(
      "/notifications/read-all"
    ),
};

export const kycApi = {
  get: () => apiClient.get<ApiResponse<KycSubmission | null>>("/kyc"),
  submit: (data: { idDocumentUrl: string; selfieUrl: string; addressProofUrl: string }) =>
    apiClient.post<ApiResponse<KycSubmission>>("/kyc", data),
};
