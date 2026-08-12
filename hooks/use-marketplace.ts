"use client";

import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";
import {
  projectsApi,
  membershipApi,
  milestonesApi,
  offersApi,
  chatApi,
  investorApi,
  ownerApi,
  adminMarketplaceApi,
} from "@/services/api";

export function useProjects(params?: Record<string, string | number | undefined>) {
  return useQuery({
    queryKey: [QUERY_KEYS.PROJECTS, params],
    queryFn: async () => (await projectsApi.list(params)).data.data,
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.PROJECT, id],
    queryFn: async () => (await projectsApi.getById(id)).data.data,
    enabled: !!id,
  });
}

export function useRiskAnalysis(id: string, enabled = true) {
  return useQuery({
    queryKey: [QUERY_KEYS.RISK_ANALYSIS, id],
    queryFn: async () => (await projectsApi.riskAnalysis(id)).data.data,
    enabled: !!id && enabled,
  });
}

export function useMembershipPlans() {
  return useQuery({
    queryKey: [QUERY_KEYS.MEMBERSHIP, "plans"],
    queryFn: async () => (await membershipApi.getPlans()).data.data,
  });
}

export function useMyMembership() {
  return useQuery({
    queryKey: [QUERY_KEYS.MEMBERSHIP, "me"],
    queryFn: async () => (await membershipApi.getMine()).data.data,
  });
}

export function useMilestones(params?: { projectId?: string; status?: string }) {
  return useQuery({
    queryKey: [QUERY_KEYS.MILESTONES, params],
    queryFn: async () => (await milestonesApi.list(params)).data.data,
  });
}

export function useMilestone(id: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.MILESTONES, id],
    queryFn: async () => (await milestonesApi.getById(id)).data.data,
    enabled: !!id,
  });
}

export function useOffers() {
  return useQuery({
    queryKey: [QUERY_KEYS.OFFERS],
    queryFn: async () => (await offersApi.list()).data.data,
  });
}

export function useConversations() {
  return useQuery({
    queryKey: [QUERY_KEYS.CONVERSATIONS],
    queryFn: async () => (await chatApi.listConversations()).data.data,
    refetchInterval: 8000,
  });
}

export function useMessages(conversationId: string | null) {
  return useQuery({
    queryKey: [QUERY_KEYS.MESSAGES, conversationId],
    queryFn: async () => (await chatApi.getMessages(conversationId!)).data.data,
    enabled: !!conversationId,
    refetchInterval: 4000,
  });
}

export function useInvestorDashboard() {
  return useQuery({
    queryKey: [QUERY_KEYS.INVESTOR_DASHBOARD],
    queryFn: async () => (await investorApi.dashboard()).data.data,
  });
}

export function useOwnerDashboard() {
  return useQuery({
    queryKey: [QUERY_KEYS.OWNER_DASHBOARD],
    queryFn: async () => (await ownerApi.dashboard()).data.data,
  });
}

export function useOwnerProjects() {
  return useQuery({
    queryKey: [QUERY_KEYS.OWNER_PROJECTS],
    queryFn: async () => (await ownerApi.projects()).data.data,
  });
}

export function useAdminStats() {
  return useQuery({
    queryKey: [QUERY_KEYS.ADMIN_STATS],
    queryFn: async () => (await adminMarketplaceApi.stats()).data.data,
  });
}
