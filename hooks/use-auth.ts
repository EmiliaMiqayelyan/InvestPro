"use client";

import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS, ROUTES } from "@/constants";
import { authApi } from "@/services/api";
import { useAuthStore } from "@/store";
import { getRoleHome } from "@/lib/rbac";
import { getErrorMessage } from "@/services/api/client";
import type { LoginCredentials, RegisterData } from "@/services/api/auth";
import { toast } from "sonner";

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isAuthenticated, login, logout, setRequires2fa } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: (response) => {
      const { user, tokens, requires2fa } = response.data.data;
      if (requires2fa) {
        setRequires2fa(true, tokens.accessToken);
        router.push(ROUTES.TWO_FACTOR);
        return;
      }
      login(user, tokens.accessToken, tokens.refreshToken);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.AUTH] });
      toast.success("Welcome back!");
      router.push(getRoleHome(user.role));
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterData) => authApi.register(data),
    onSuccess: (response) => {
      const { user, tokens } = response.data.data;
      login(user, tokens.accessToken, tokens.refreshToken);
      toast.success("Account created successfully!");
      router.push(getRoleHome(user.role));
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      logout();
      queryClient.clear();
    },
  });

  return {
    user,
    isAuthenticated,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
  };
}

export function useCurrentUser() {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: [QUERY_KEYS.USER],
    queryFn: async () => {
      const { data } = await authApi.getMe();
      return data.data;
    },
    enabled: isAuthenticated,
  });
}
