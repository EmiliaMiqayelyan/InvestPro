import type {
  User,
  UserRole,
  Project,
  ProjectDocument,
  TeamMember,
  InvestmentOffer,
  Conversation,
  ChatMessage,
  MembershipSubscription,
  MembershipPlan,
  InvestorInvestment,
  RiskAnalysis,
  Notification,
  KycSubmission,
  ActivityLog,
  Complaint,
  InvestorDashboardStats,
  OwnerDashboardStats,
  AdminStats,
  MembershipPlanId,
} from "@/types";

export interface StoredUser extends User {
  password: string;
}

export interface DevStore {
  users: Map<string, StoredUser>;
  projects: Map<string, Project>;
  offers: Map<string, InvestmentOffer>;
  conversations: Map<string, Conversation>;
  messages: Map<string, ChatMessage[]>;
  subscriptions: Map<string, MembershipSubscription>;
  investments: Map<string, InvestorInvestment[]>;
  savedProjects: Map<string, string[]>;
  notifications: Map<string, Notification[]>;
  kyc: Map<string, KycSubmission | null>;
  activityLogs: ActivityLog[];
  complaints: Complaint[];
}

export const SEED_USER_IDS = {
  admin: "00000000-0000-0000-0000-000000000001",
  investor: "00000000-0000-0000-0000-000000000002",
  owner: "00000000-0000-0000-0000-000000000003",
} as const;

export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: "basic",
    name: "Basic Investor",
    price: 29,
    billingPeriod: "monthly",
    description: "Explore curated opportunities with limited project detail.",
    features: [
      "View limited projects",
      "Basic project information",
      "Save projects",
      "Risk score preview",
    ],
  },
  {
    id: "premium",
    name: "Premium Investor",
    price: 99,
    billingPeriod: "monthly",
    description: "Full diligence toolkit for serious investors.",
    features: [
      "Full project access",
      "Documents & team access",
      "Financial analysis",
      "Direct platform messaging",
      "Send investment offers",
      "Full risk reports",
    ],
    highlighted: true,
  },
  {
    id: "enterprise",
    name: "Enterprise Investor",
    price: 299,
    billingPeriod: "monthly",
    description: "Priority access and advanced analytics for institutions.",
    features: [
      "Everything in Premium",
      "Priority communication",
      "Advanced analytics",
      "Dedicated support",
      "Early access to listings",
    ],
  },
];

declare global {
  // eslint-disable-next-line no-var
  var __ventureBridgeStore: DevStore | undefined;
}

function createUser(
  id: string,
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  role: UserRole,
  extras: Partial<StoredUser> = {}
): StoredUser {
  const now = new Date().toISOString();
  return {
    id,
    email,
    password,
    firstName,
    lastName,
    role,
    membershipTier: "none",
    isEmailVerified: true,
    is2faEnabled: false,
    kycStatus: "not_submitted",
    createdAt: now,
    updatedAt: now,
    ...extras,
  };
}

function seedTeam(): TeamMember[] {
  return [
    {
      id: crypto.randomUUID(),
      name: "Elena Vargas",
      position: "CEO & Co-founder",
      role: "member",
      experience: "12 years in deep-tech startups",
      biography: "Former product lead at a Series C climate-tech company.",
      portfolio: "https://example.com/elena",
    },
    {
      id: crypto.randomUUID(),
      name: "James Okonkwo",
      position: "CTO",
      role: "developer",
      experience: "15 years distributed systems",
      biography: "Built high-scale infrastructure for two unicorns.",
      portfolio: "https://example.com/james",
    },
    {
      id: crypto.randomUUID(),
      name: "Priya Shah",
      position: "Advisor",
      role: "advisor",
      experience: "Ex-partner at growth VC fund",
      biography: "Advises early-stage founders on fundraising and GTM.",
    },
  ];
}

function seedDocuments(projectId: string): ProjectDocument[] {
  const now = new Date().toISOString();
  return [
    {
      id: crypto.randomUUID(),
      name: "Business Plan.pdf",
      url: `#doc-${projectId}-business`,
      category: "business_plan",
      uploadedAt: now,
    },
    {
      id: crypto.randomUUID(),
      name: "Pitch Deck.pdf",
      url: `#doc-${projectId}-pitch`,
      category: "pitch_deck",
      uploadedAt: now,
    },
    {
      id: crypto.randomUUID(),
      name: "Financial Model.xlsx",
      url: `#doc-${projectId}-finance`,
      category: "other",
      uploadedAt: now,
    },
  ];
}

function seedProjects(ownerId: string, ownerName: string): Project[] {
  const now = new Date().toISOString();
  const base = [
    {
      title: "Aurora Grid Storage",
      category: "Clean Energy",
      industry: "Renewable Energy",
      location: "Austin, TX",
      stage: "growth" as const,
      requiredInvestment: 2500000,
      minInvestment: 25000,
      currentFunding: 980000,
      expectedRoi: 18,
      riskLevel: "medium" as const,
      image:
        "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&q=80",
      description: "Modular battery storage for commercial microgrids.",
    },
    {
      title: "Nimbus Health AI",
      category: "Healthcare",
      industry: "Biotechnology",
      location: "Boston, MA",
      stage: "early_revenue" as const,
      requiredInvestment: 1800000,
      minInvestment: 10000,
      currentFunding: 420000,
      expectedRoi: 22,
      riskLevel: "high" as const,
      image:
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80",
      description: "Clinical decision support for outpatient clinics.",
    },
    {
      title: "Harbor Logistics OS",
      category: "Technology",
      industry: "Logistics",
      location: "Singapore",
      stage: "mvp" as const,
      requiredInvestment: 1200000,
      minInvestment: 15000,
      currentFunding: 150000,
      expectedRoi: 16,
      riskLevel: "medium" as const,
      image:
        "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=80",
      description: "Port operations software for mid-size terminals.",
    },
    {
      title: "Lumen Farm Robotics",
      category: "Agriculture",
      industry: "Manufacturing",
      location: "Wageningen, NL",
      stage: "expansion" as const,
      requiredInvestment: 3200000,
      minInvestment: 50000,
      currentFunding: 2100000,
      expectedRoi: 14,
      riskLevel: "low" as const,
      image:
        "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&q=80",
      description: "Autonomous greenhouse harvesting robots.",
    },
  ];

  return base.map((p, i) => {
    const id = `project-seed-${i + 1}`;
    return {
      id,
      ownerId,
      ownerName,
      title: p.title,
      slug: p.title.toLowerCase().replace(/\s+/g, "-"),
      description: p.description,
      fullDescription: `${p.description} Built for institutional and angel investors seeking verified deal flow with transparent diligence materials. The founding team has shipped products in regulated markets and maintains audited financial projections.`,
      category: p.category,
      industry: p.industry,
      location: p.location,
      stage: p.stage,
      timeline: "18–36 months to next milestone",
      image: p.image,
      requiredInvestment: p.requiredInvestment,
      minInvestment: p.minInvestment,
      currentFunding: p.currentFunding,
      expectedRoi: p.expectedRoi,
      revenueModel: "SaaS subscription + usage-based services",
      financialProjections: "Projected break-even in month 24 with 35% gross margin by year 3.",
      investmentPlan: "Funds allocated to product (40%), go-to-market (35%), and operations (25%).",
      businessModel: "B2B enterprise sales with multi-year contracts and expansion revenue.",
      riskLevel: p.riskLevel,
      status: "published",
      investorCount: 8 + i * 3,
      savedCount: 20 + i * 5,
      team: seedTeam(),
      documents: seedDocuments(id),
      updates: [
        {
          id: crypto.randomUUID(),
          title: "Q2 progress update",
          content: "Closed two pilot customers and completed SOC2 Type I readiness.",
          createdAt: now,
        },
      ],
      createdAt: now,
      updatedAt: now,
    };
  });
}

function initStore(): DevStore {
  const users = new Map<string, StoredUser>();
  const admin = createUser(
    SEED_USER_IDS.admin,
    "admin@venturebridge.com",
    "admin123",
    "Platform",
    "Admin",
    "admin",
    { kycStatus: "approved", membershipTier: "enterprise" }
  );
  const investor = createUser(
    SEED_USER_IDS.investor,
    "investor@venturebridge.com",
    "investor123",
    "Alex",
    "Investor",
    "investor",
    {
      membershipTier: "premium",
      membershipExpiresAt: new Date(Date.now() + 30 * 86400000).toISOString(),
      kycStatus: "approved",
    }
  );
  const owner = createUser(
    SEED_USER_IDS.owner,
    "owner@venturebridge.com",
    "owner123",
    "Sam",
    "Founder",
    "project_owner",
    { companyName: "Horizon Labs", kycStatus: "approved" }
  );

  users.set(admin.id, admin);
  users.set(investor.id, investor);
  users.set(owner.id, owner);

  const projects = new Map<string, Project>();
  for (const project of seedProjects(owner.id, `${owner.firstName} ${owner.lastName}`)) {
    projects.set(project.id, project);
  }

  const subscriptions = new Map<string, MembershipSubscription>();
  subscriptions.set(investor.id, {
    id: crypto.randomUUID(),
    userId: investor.id,
    planId: "premium",
    status: "active",
    startedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 86400000).toISOString(),
    amount: 99,
  });

  return {
    users,
    projects,
    offers: new Map(),
    conversations: new Map(),
    messages: new Map(),
    subscriptions,
    investments: new Map(),
    savedProjects: new Map(),
    notifications: new Map(),
    kyc: new Map(),
    activityLogs: [],
    complaints: [],
  };
}

export function getStore(): DevStore {
  if (!globalThis.__ventureBridgeStore) {
    globalThis.__ventureBridgeStore = initStore();
  }
  return globalThis.__ventureBridgeStore;
}

export function sanitizeUser(user: StoredUser): User {
  const { password: _, ...safe } = user;
  return safe;
}

export function paginate<T>(items: T[], page = 1, limit = 10) {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  return {
    data: items.slice(start, start + limit),
    total,
    page,
    limit,
    totalPages,
  };
}

export function logActivity(
  userId: string,
  action: string,
  entityType: string,
  entityId?: string,
  metadata?: Record<string, unknown>
) {
  getStore().activityLogs.unshift({
    id: crypto.randomUUID(),
    userId,
    action,
    entityType,
    entityId,
    metadata,
    createdAt: new Date().toISOString(),
  });
}

export function analyzeProjectRisk(project: Project): RiskAnalysis {
  const positive: RiskAnalysis["positiveIndicators"] = [];
  const warnings: RiskAnalysis["warningIndicators"] = [];
  const missing: string[] = [];
  const questions: string[] = [];

  let score = 55;

  if (project.documents.some((d) => d.category === "business_plan")) {
    positive.push({ label: "Business plan uploaded", detail: "Core planning document is available." });
    score += 8;
  } else {
    missing.push("Business plan");
    warnings.push({ label: "Missing business plan", detail: "Investors cannot validate strategy depth." });
    score -= 10;
  }

  if (project.documents.some((d) => d.category === "pitch_deck")) {
    positive.push({ label: "Pitch deck available", detail: "Presentation materials are ready for diligence." });
    score += 5;
  } else {
    missing.push("Pitch deck");
  }

  if (project.documents.some((d) => d.category === "legal")) {
    positive.push({ label: "Legal documents present", detail: "Legal package supports compliance review." });
    score += 8;
  } else {
    missing.push("Legal documents");
    warnings.push({ label: "No legal package", detail: "Entity and IP status may be unclear." });
    score -= 8;
  }

  if (project.team.length >= 3) {
    positive.push({ label: "Complete founding team", detail: `${project.team.length} team profiles listed.` });
    score += 7;
  } else {
    warnings.push({ label: "Thin team roster", detail: "Fewer than 3 team members disclosed." });
    score -= 6;
  }

  if (project.team.some((t) => t.role === "advisor")) {
    positive.push({ label: "Advisor on board", detail: "External advisory support disclosed." });
    score += 4;
  }

  if (project.financialProjections && project.financialProjections.length > 40) {
    positive.push({ label: "Financial projections provided", detail: "Forward-looking numbers are documented." });
    score += 6;
  } else {
    warnings.push({ label: "Weak financial detail", detail: "Projections appear incomplete." });
    score -= 7;
  }

  if (project.currentFunding / project.requiredInvestment > 0.4) {
    positive.push({
      label: "Strong funding traction",
      detail: `${Math.round((project.currentFunding / project.requiredInvestment) * 100)}% of goal raised.`,
    });
    score += 5;
  }

  if (project.riskLevel === "high") score -= 8;
  if (project.riskLevel === "low") score += 6;

  questions.push("What is your current monthly burn rate and runway?");
  questions.push("Who are your top three competitors and differentiation?");
  questions.push("How will investor funds be ring-fenced and reported?");
  if (missing.includes("Legal documents")) {
    questions.push("Can you share incorporation docs and cap table?");
  }
  if (!project.documents.some((d) => d.category === "certificate")) {
    missing.push("Certificates / compliance proofs");
    questions.push("Do you hold any industry certifications or audits?");
  }

  score = Math.max(5, Math.min(95, score));
  const level = score >= 70 ? "low" : score >= 45 ? "medium" : "high";
  const completeness = Math.round(
    ((project.documents.length > 0 ? 1 : 0) +
      (project.team.length > 0 ? 1 : 0) +
      (project.financialProjections ? 1 : 0) +
      (project.investmentPlan ? 1 : 0) +
      (project.businessModel ? 1 : 0)) /
      5 *
      100
  );

  return {
    projectId: project.id,
    score,
    level,
    completeness,
    positiveIndicators: positive,
    warningIndicators: warnings,
    missingDocuments: missing,
    questionsToAsk: questions,
    summary:
      level === "low"
        ? "Overall diligence posture looks solid with strong documentation and team disclosure."
        : level === "medium"
          ? "Moderate risk — several strengths exist, but investors should clarify gaps before committing."
          : "Elevated risk — missing materials and weak signals warrant caution before investing.",
    generatedAt: new Date().toISOString(),
  };
}

export function getInvestorStats(userId: string): InvestorDashboardStats {
  const store = getStore();
  const user = store.users.get(userId);
  const published = Array.from(store.projects.values()).filter((p) => p.status === "published");
  const offers = Array.from(store.offers.values()).filter((o) => o.investorId === userId);
  const investments = store.investments.get(userId) || [];
  const saved = store.savedProjects.get(userId) || [];
  const unread = Array.from(store.conversations.values())
    .filter((c) => c.investorId === userId)
    .reduce((sum, c) => sum + c.unreadCount, 0);

  return {
    availableProjects: published.length,
    myInvestments: investments.length,
    savedProjects: saved.length,
    unreadMessages: unread,
    membershipTier: user?.membershipTier || "none",
    portfolioValue: investments.reduce((s, i) => s + i.amount, 0),
    activeOffers: offers.filter((o) => o.status === "pending" || o.status === "negotiating").length,
  };
}

export function getOwnerStats(userId: string): OwnerDashboardStats {
  const store = getStore();
  const myProjects = Array.from(store.projects.values()).filter((p) => p.ownerId === userId);
  const offers = Array.from(store.offers.values()).filter((o) => o.ownerId === userId);
  const unread = Array.from(store.conversations.values())
    .filter((c) => c.ownerId === userId)
    .reduce((sum, c) => sum + c.unreadCount, 0);
  const teamMembers = myProjects.reduce((s, p) => s + p.team.length, 0);

  return {
    myProjects: myProjects.length,
    publishedProjects: myProjects.filter((p) => p.status === "published").length,
    investorRequests: offers.length,
    unreadMessages: unread,
    totalFundingRaised: myProjects.reduce((s, p) => s + p.currentFunding, 0),
    teamMembers,
    pendingOffers: offers.filter((o) => o.status === "pending").length,
  };
}

export function getAdminStats(): AdminStats {
  const store = getStore();
  const users = Array.from(store.users.values());
  const projects = Array.from(store.projects.values());
  return {
    totalInvestors: users.filter((u) => u.role === "investor").length,
    totalOwners: users.filter((u) => u.role === "project_owner").length,
    totalProjects: projects.length,
    publishedProjects: projects.filter((p) => p.status === "published").length,
    pendingProjects: projects.filter((p) => p.status === "pending_review").length,
    activeMemberships: Array.from(store.subscriptions.values()).filter((s) => s.status === "active").length,
    pendingKyc: Array.from(store.kyc.values()).filter((k) => k?.status === "pending").length,
    openComplaints: store.complaints.filter((c) => c.status === "open" || c.status === "reviewing").length,
    totalOffers: store.offers.size,
    totalFunding: projects.reduce((s, p) => s + p.currentFunding, 0),
  };
}

export function redactContactInfo(text: string): { text: string; blocked: boolean } {
  const email = /\b[\w.+-]+@[\w-]+\.[\w.]+\b/gi;
  const phone = /\b(?:\+?\d[\d\s().-]{7,}\d)\b/g;
  const apps = /\b(?:whatsapp|telegram|signal|skype|wechat)\b/gi;
  let blocked = false;
  let cleaned = text;
  if (email.test(cleaned) || phone.test(cleaned) || apps.test(cleaned)) blocked = true;
  cleaned = cleaned.replace(email, "[contact hidden]");
  cleaned = cleaned.replace(phone, "[contact hidden]");
  cleaned = cleaned.replace(apps, "[app hidden]");
  return { text: cleaned, blocked };
}

export function upgradeMembership(userId: string, planId: MembershipPlanId) {
  const store = getStore();
  const user = store.users.get(userId);
  if (!user) return null;
  const plan = MEMBERSHIP_PLANS.find((p) => p.id === planId);
  if (!plan) return null;
  const expiresAt = new Date(Date.now() + 30 * 86400000).toISOString();
  user.membershipTier = planId;
  user.membershipExpiresAt = expiresAt;
  user.updatedAt = new Date().toISOString();
  const sub: MembershipSubscription = {
    id: crypto.randomUUID(),
    userId,
    planId,
    status: "active",
    startedAt: new Date().toISOString(),
    expiresAt,
    amount: plan.price,
  };
  store.subscriptions.set(userId, sub);
  logActivity(userId, "membership_purchased", "membership", planId, { amount: plan.price });
  return { user: sanitizeUser(user), subscription: sub };
}
