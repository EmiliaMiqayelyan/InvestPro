import { describe, it, expect } from "vitest";
import { analyzeProjectRisk } from "../src/shared/utils/risk-analysis";
import type { Project } from "../src/shared/types";

function baseProject(overrides: Partial<Project> = {}): Project {
  return {
    id: "p1",
    ownerId: "o1",
    title: "Test",
    slug: "test",
    description: "desc",
    fullDescription: "full",
    category: "Tech",
    industry: "SaaS",
    location: "NYC",
    stage: "mvp",
    timeline: "12m",
    image: "https://example.com/i.jpg",
    requiredInvestment: 100000,
    minInvestment: 1000,
    currentFunding: 50000,
    views: 10,
    expectedRoi: 15,
    revenueModel: "SaaS",
    financialProjections: "Projected break-even in month 24 with solid margins and growth.",
    investmentPlan: "Allocate carefully",
    businessModel: "B2B",
    phases: [
      {
        id: "1",
        title: "A",
        description: "d",
        budgetAsk: 50000,
        deliverables: [],
        sortOrder: 0,
        status: "planned",
      },
      {
        id: "2",
        title: "B",
        description: "d",
        budgetAsk: 50000,
        deliverables: [],
        sortOrder: 1,
        status: "planned",
      },
    ],
    riskLevel: "medium",
    status: "published",
    investorCount: 1,
    savedCount: 1,
    team: [
      {
        id: "t1",
        name: "A",
        position: "CEO",
        role: "member",
        experience: "x",
        biography: "y",
      },
      {
        id: "t2",
        name: "B",
        position: "CTO",
        role: "developer",
        experience: "x",
        biography: "y",
      },
      {
        id: "t3",
        name: "C",
        position: "Advisor",
        role: "advisor",
        experience: "x",
        biography: "y",
      },
    ],
    documents: [
      {
        id: "d1",
        name: "bp",
        url: "#",
        category: "business_plan",
        uploadedAt: new Date().toISOString(),
      },
      {
        id: "d2",
        name: "pitch",
        url: "#",
        category: "pitch_deck",
        uploadedAt: new Date().toISOString(),
      },
      {
        id: "d3",
        name: "legal",
        url: "#",
        category: "legal",
        uploadedAt: new Date().toISOString(),
      },
      {
        id: "d4",
        name: "fin",
        url: "#",
        category: "finance_plan",
        uploadedAt: new Date().toISOString(),
      },
    ],
    updates: [],
    ownerKycStatus: "approved",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

describe("analyzeProjectRisk", () => {
  it("scores a well-documented project as low/medium risk", () => {
    const analysis = analyzeProjectRisk(baseProject());
    expect(analysis.projectId).toBe("p1");
    expect(analysis.score).toBeGreaterThan(60);
    expect(["low", "medium"]).toContain(analysis.level);
    expect(analysis.positiveIndicators.length).toBeGreaterThan(3);
  });

  it("penalizes missing materials", () => {
    const thin = analyzeProjectRisk(
      baseProject({
        documents: [],
        team: [],
        phases: [],
        financialProjections: "short",
        ownerKycStatus: "not_submitted",
        riskLevel: "high",
      })
    );
    expect(thin.score).toBeLessThan(50);
    expect(thin.warningIndicators.length).toBeGreaterThan(0);
    expect(thin.missingDocuments.length).toBeGreaterThan(0);
  });
});
