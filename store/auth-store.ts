import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";
import { clearTokens, setTokens } from "@/services/api/client";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  requires2fa: boolean;
  tempToken: string | null;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setRequires2fa: (requires: boolean, tempToken?: string) => void;
  login: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      requires2fa: false,
      tempToken: null,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setLoading: (isLoading) => set({ isLoading }),
      setRequires2fa: (requires2fa, tempToken) =>
        set({ requires2fa, tempToken: tempToken || null }),
      login: (user, accessToken, refreshToken) => {
        setTokens(accessToken, refreshToken);
        set({ user, isAuthenticated: true, requires2fa: false, tempToken: null });
      },
      logout: () => {
        clearTokens();
        set({
          user: null,
          isAuthenticated: false,
          requires2fa: false,
          tempToken: null,
        });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
