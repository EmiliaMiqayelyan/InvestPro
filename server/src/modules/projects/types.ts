import type { Project } from "../../shared/types";

export type { Project };
export type TokenAuthLike = {
  role: string;
  membershipTier: string;
  membershipExpiresAt?: string;
};
