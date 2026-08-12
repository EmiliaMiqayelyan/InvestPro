import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";
import { clearTokens, setTokens } from "@/services/api/client";
import { normalizeRole, normalizeMembershipTier } from "@/lib/rbac";

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

function sanitizeUser(user: User | null): User | null {
  if (!user) return null;
  const role = normalizeRole(user.role) ?? "investor";
  return {
    ...user,
    role,
    membershipTier: normalizeMembershipTier(user.membershipTier),
  };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      requires2fa: false,
      tempToken: null,
      setUser: (user) => {
        const next = sanitizeUser(user);
        set({ user: next, isAuthenticated: !!next });
      },
      setLoading: (isLoading) => set({ isLoading }),
      setRequires2fa: (requires2fa, tempToken) =>
        set({ requires2fa, tempToken: tempToken || null }),
      login: (user, accessToken, refreshToken) => {
        setTokens(accessToken, refreshToken);
        set({
          user: sanitizeUser(user),
          isAuthenticated: true,
          requires2fa: false,
          tempToken: null,
        });
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
      merge: (persisted, current) => {
        const stored = (persisted || {}) as Partial<AuthState>;
        const user = sanitizeUser(stored.user ?? null);
        return {
          ...current,
          ...stored,
          user,
          isAuthenticated: !!user && !!stored.isAuthenticated,
        };
      },
    }
  )
);
