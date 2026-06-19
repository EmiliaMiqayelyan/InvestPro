"use client";

import { useEffect } from "react";
import { authApi } from "@/services/api";
import { useAuthStore } from "@/store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await authApi.getMe();
        setUser(data.data);
      } catch {
        useAuthStore.getState().logout();
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, [isAuthenticated, setUser, setLoading]);

  return <>{children}</>;
}
