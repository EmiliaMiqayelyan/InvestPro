import { describe, it, expect } from "vitest";
import {
  canAccessFullProject,
  canMessage,
  canSendOffers,
  hasActiveServiceAccess,
  normalizeMembershipTier,
  normalizeRole,
} from "../src/shared/utils/rbac";

describe("rbac helpers", () => {
  it("normalizes roles and tiers", () => {
    expect(normalizeRole("project-owner")).toBe("project_owner");
    expect(normalizeMembershipTier("premium")).toBe("service");
    expect(normalizeMembershipTier("none")).toBe("none");
  });

  it("grants owners/admins platform access", () => {
    expect(hasActiveServiceAccess({ role: "admin", membershipTier: "none" })).toBe(true);
    expect(
      hasActiveServiceAccess({ role: "project_owner", membershipTier: "none" })
    ).toBe(true);
    expect(hasActiveServiceAccess({ role: "investor", membershipTier: "none" })).toBe(false);
    expect(
      hasActiveServiceAccess({
        role: "investor",
        membershipTier: "service",
        membershipExpiresAt: new Date(Date.now() + 86400000).toISOString(),
      })
    ).toBe(true);
  });

  it("gates project/offer/message capabilities", () => {
    const investorNone = { role: "investor" as const, membershipTier: "none" as const };
    const investorService = {
      role: "investor" as const,
      membershipTier: "service" as const,
      membershipExpiresAt: new Date(Date.now() + 86400000).toISOString(),
    };
    expect(canAccessFullProject(investorNone)).toBe(false);
    expect(canAccessFullProject(investorService)).toBe(true);
    expect(canSendOffers(investorNone)).toBe(false);
    expect(canSendOffers(investorService)).toBe(true);
    expect(canMessage(investorNone)).toBe(false);
    expect(canMessage(investorService)).toBe(true);
  });
});
