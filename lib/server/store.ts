import type {
  User,
  UserRole,
  Project,
  ProjectDocument,
  ProjectPhase,
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
  MilestonePlan,
  KycStatus,
} from "@/types";
import { hasActiveServiceAccess, normalizeMembershipTier } from "@/lib/rbac";

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
  milestonePlans: Map<string, MilestonePlan>;
}

export const SEED_USER_IDS = {
  admin: "00000000-0000-0000-0000-000000000001",
  investor: "00000000-0000-0000-0000-000000000002",
  owner: "00000000-0000-0000-0000-000000000003",
} as const;

export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: "service",
    name: "Platform Service Access",
    nameHy: "Հարթակի ծառայության հասանելիություն",
    price: 99,
    billingPeriod: "monthly",
    description:
      "Monthly platform service fee for full diligence access, messaging, and offers. This is not investment capital.",
    descriptionHy:
      "Ամսական հարթակի ծառայության վճար՝ լրիվ ստուգման հասանելիության, հաղորդագրությունների և առաջարկների համար։ Սա ներդրումային կապիտալ չէ։",
    features: [
      "Full project materials & data room",
      "Documents, team, and financial detail",
      "Direct platform messaging",
      "Send investment offers",
      "Full risk analysis reports",
      "Milestone planning with owners",
    ],
    featuresHy: [
      "Լրիվ նախագծի նյութեր և տվյալների սենյակ",
      "Փաստաթղթեր, թիմ և ֆինանսական մանրամասներ",
      "Ուղիղ հարթակային հաղորդագրություններ",
      "Ներդրումային առաջարկներ ուղարկել",
      "Լրիվ ռիսկի վերլուծության զեկույցներ",
      "Փուլերի պլանավորում սեփականատերերի հետ",
    ],
    highlighted: true,
  },
];

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
      positionHy: "Գործադիր տնօրեն և համահիմնադիր",
      role: "member",
      experience: "12 years in deep-tech startups",
      experienceHy: "12 տարվա փորձ deep-tech ստարտափներում",
      biography: "Former product lead at a Series C climate-tech company.",
      biographyHy: "Նախկինում ապրանքային ղեկավար Series C կլիմայական տեխնոլոգիաների ընկերությունում։",
      portfolio: "https://example.com/elena",
    },
    {
      id: crypto.randomUUID(),
      name: "James Okonkwo",
      position: "CTO",
      positionHy: "Տեխնիկական տնօրեն",
      role: "developer",
      experience: "15 years distributed systems",
      experienceHy: "15 տարվա փորձ բաշխված համակարգերում",
      biography: "Built high-scale infrastructure for two unicorns.",
      biographyHy: "Կառուցել է բարձր մասշտաբի ենթակառուցվածք երկու միաեղջյուր ընկերությունների համար։",
      portfolio: "https://example.com/james",
    },
    {
      id: crypto.randomUUID(),
      name: "Priya Shah",
      position: "Advisor",
      positionHy: "Խորհրդատու",
      role: "advisor",
      experience: "Ex-partner at growth VC fund",
      experienceHy: "Նախկին գործընկեր աճի վենչուրային ֆոնդում",
      biography: "Advises early-stage founders on fundraising and GTM.",
      biographyHy: "Խորհուրդ է տալիս վաղ փուլի հիմնադիրներին ֆինանսավորման և շուկա մուտքի հարցերում։",
    },
  ];
}

function seedPhases(requiredInvestment: number): ProjectPhase[] {
  const p1 = Math.round(requiredInvestment * 0.35);
  const p2 = Math.round(requiredInvestment * 0.4);
  const p3 = requiredInvestment - p1 - p2;
  return [
    {
      id: crypto.randomUUID(),
      title: "Foundation & product build",
      titleHy: "Հիմք և արտադրանքի կառուցում",
      description: "Core product delivery, hiring, and technical foundation.",
      descriptionHy: "Հիմնական արտադրանքի մատակարարում, աշխատակազմ և տեխնիկական հիմք։",
      budgetAsk: p1,
      durationWeeks: 16,
      deliverables: ["MVP release", "Core engineering hires", "Architecture docs"],
      deliverablesHy: ["MVP թողարկում", "Հիմնական ինժեներական աշխատակազմ", "Ճարտարապետության փաստաթղթեր"],
      sortOrder: 0,
      status: "active",
    },
    {
      id: crypto.randomUUID(),
      title: "Market launch & traction",
      titleHy: "Շուկա մուտք և աճ",
      description: "Go-to-market, pilot customers, and early revenue loops.",
      descriptionHy: "Շուկա մուտք, փորձնական հաճախորդներ և վաղ եկամտի ցիկլեր։",
      budgetAsk: p2,
      durationWeeks: 20,
      deliverables: ["Pilot customers", "Sales playbook", "Retention metrics"],
      deliverablesHy: ["Փորձնական հաճախորդներ", "Վաճառքի ուղեցույց", "Պահպանման ցուցանիշներ"],
      sortOrder: 1,
      status: "planned",
    },
    {
      id: crypto.randomUUID(),
      title: "Scale & operations",
      titleHy: "Մասշտաբավորում և գործառնություններ",
      description: "Expand capacity, compliance, and operating leverage.",
      descriptionHy: "Հզորության ընդլայնում, համապատասխանություն և գործառնական լծակ։",
      budgetAsk: p3,
      durationWeeks: 24,
      deliverables: ["Regional expansion", "Compliance package", "Unit economics report"],
      deliverablesHy: ["Տարածաշրջանային ընդլայնում", "Համապատասխանության փաթեթ", "Միավոր տնտեսագիտության զեկույց"],
      sortOrder: 2,
      status: "planned",
    },
  ];
}

function seedDocuments(projectId: string, includeLegal: boolean): ProjectDocument[] {
  const now = new Date().toISOString();
  const docs: ProjectDocument[] = [
    {
      id: crypto.randomUUID(),
      name: "Business Plan.pdf",
      nameHy: "Բիզնես պլան.pdf",
      url: `#doc-${projectId}-business`,
      category: "business_plan",
      uploadedAt: now,
    },
    {
      id: crypto.randomUUID(),
      name: "Pitch Deck.pdf",
      nameHy: "Pitch Deck.pdf",
      url: `#doc-${projectId}-pitch`,
      category: "pitch_deck",
      uploadedAt: now,
    },
    {
      id: crypto.randomUUID(),
      name: "Finance Plan.xlsx",
      nameHy: "Ֆինանսական պլան.xlsx",
      url: `#doc-${projectId}-finance-plan`,
      category: "finance_plan",
      uploadedAt: now,
    },
  ];
  if (includeLegal) {
    docs.push({
      id: crypto.randomUUID(),
      name: "Legal Package.pdf",
      nameHy: "Իրավական փաթեթ.pdf",
      url: `#doc-${projectId}-legal`,
      category: "legal",
      uploadedAt: now,
    });
  }
  return docs;
}

function seedProjects(
  ownerId: string,
  ownerName: string,
  ownerKycStatus: KycStatus
): Project[] {
  const base = [
    {
      title: "Aurora Grid Storage",
      titleHy: "Aurora ցանցային պահեստավորում",
      category: "Clean Energy",
      categoryHy: "Մաքուր էներգիա",
      industry: "Renewable Energy",
      industryHy: "Վերականգնվող էներգիա",
      location: "Austin, TX",
      locationHy: "Օստին, Տեխաս",
      stage: "growth" as const,
      requiredInvestment: 2500000,
      minInvestment: 25000,
      currentFunding: 980000,
      expectedRoi: 18,
      riskLevel: "medium" as const,
      image:
        "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=60",
      description: "Modular battery storage for commercial microgrids.",
      descriptionHy: "Մոդուլային մարտկոցային պահեստավորում առևտրային միկրոցանցերի համար։",
    },
    {
      title: "Nimbus Health AI",
      titleHy: "Nimbus առողջապահական ԱԲ",
      category: "Healthcare",
      categoryHy: "Առողջապահություն",
      industry: "Biotechnology",
      industryHy: "Կենսատեխնոլոգիա",
      location: "Boston, MA",
      locationHy: "Բոստոն, Մասաչուսեթս",
      stage: "early_revenue" as const,
      requiredInvestment: 1800000,
      minInvestment: 10000,
      currentFunding: 420000,
      expectedRoi: 22,
      riskLevel: "high" as const,
      image:
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=60",
      description: "Clinical decision support for outpatient clinics.",
      descriptionHy: "Կլինիկական որոշումների աջակցություն ամբուլատոր կլինիկաների համար։",
    },
    {
      title: "Harbor Logistics OS",
      titleHy: "Harbor լոգիստիկական ՀՕՀ",
      category: "Technology",
      categoryHy: "Տեխնոլոգիա",
      industry: "Logistics",
      industryHy: "Լոգիստիկա",
      location: "Singapore",
      locationHy: "Սինգապուր",
      stage: "mvp" as const,
      requiredInvestment: 1200000,
      minInvestment: 15000,
      currentFunding: 150000,
      expectedRoi: 16,
      riskLevel: "medium" as const,
      image:
        "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=60",
      description: "Port operations software for mid-size terminals.",
      descriptionHy: "Նավահանգստային գործառնությունների ծրագրակազմ միջին տերմինալների համար։",
    },
    {
      title: "Lumen Farm Robotics",
      titleHy: "Lumen գյուղատնտեսական ռոբոտիկա",
      category: "Agriculture",
      categoryHy: "Գյուղատնտեսություն",
      industry: "Manufacturing",
      industryHy: "Արտադրություն",
      location: "Wageningen, NL",
      locationHy: "Վագենինգեն, Նիդերլանդներ",
      stage: "expansion" as const,
      requiredInvestment: 3200000,
      minInvestment: 50000,
      currentFunding: 2100000,
      expectedRoi: 14,
      riskLevel: "low" as const,
      image:
        "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=60",
      description: "Autonomous greenhouse harvesting robots.",
      descriptionHy: "Ինքնավար ջերմոցային բերքահավաքի ռոբոտներ։",
    },
  ];

  return base.map((p, i) => {
    const id = `project-seed-${i + 1}`;
    const includeLegal = i % 2 === 0;
    const phases = seedPhases(p.requiredInvestment);
    const isPending = i === 2;
    const stamp = new Date(Date.now() - (base.length - i) * 86400000).toISOString();
    return {
      id,
      ownerId,
      ownerName,
      ownerKycStatus,
      title: p.title,
      titleHy: p.titleHy,
      slug: p.title.toLowerCase().replace(/\s+/g, "-"),
      description: p.description,
      descriptionHy: p.descriptionHy,
      fullDescription: `${p.description} Built for institutional and angel investors seeking verified deal flow with transparent diligence materials. The founding team has shipped products in regulated markets and maintains audited financial projections.`,
      fullDescriptionHy: `${p.descriptionHy} Ստեղծված է ինստիտուցիոնալ և հրեշտակ ներդրողների համար, ովքեր փնտրում են ստուգված գործարքներ և թափանցիկ ստուգման նյութեր։ Հիմնադիր թիմը աշխատել է կարգավորվող շուկաներում և պահպանում է աուդիտ արված ֆինանսական կանխատեսումներ։`,
      category: p.category,
      categoryHy: p.categoryHy,
      industry: p.industry,
      industryHy: p.industryHy,
      location: p.location,
      locationHy: p.locationHy,
      stage: p.stage,
      timeline: "18–36 months to next milestone",
      timelineHy: "18–36 ամիս մինչև հաջորդ փուլ",
      image: p.image,
      requiredInvestment: p.requiredInvestment,
      minInvestment: p.minInvestment,
      currentFunding: p.currentFunding,
      views: 1200 + i * 415,
      expectedRoi: p.expectedRoi,
      revenueModel: "SaaS subscription + usage-based services",
      revenueModelHy: "SaaS բաժանորդագրություն + օգտագործման վրա հիմնված ծառայություններ",
      financialProjections: "Projected break-even in month 24 with 35% gross margin by year 3.",
      financialProjectionsHy: "Կանխատեսվող ինքնաարժեքի հասնում 24-րդ ամսում՝ 35% համախառն մարժա 3-րդ տարում։",
      investmentPlan: "Funds allocated to product (40%), go-to-market (35%), and operations (25%).",
      investmentPlanHy: "Միջոցները բաշխվում են արտադրանքին (40%), շուկա մուտքին (35%) և գործառնություններին (25%)։",
      businessModel: "B2B enterprise sales with multi-year contracts and expansion revenue.",
      businessModelHy: "B2B ձեռնարկությունների վաճառք՝ բազմամյա պայմանագրերով և ընդլայնման եկամտով։",
      budgetBreakdown: [
        { label: "Product", labelHy: "Արտադրանք", percent: 40 },
        { label: "Go-to-market", labelHy: "Շուկա մուտք", percent: 35 },
        { label: "Operations", labelHy: "Գործառնություններ", percent: 25 },
      ],
      phases,
      riskLevel: p.riskLevel,
      status: isPending ? ("pending_review" as const) : ("published" as const),
      submittedAt: stamp,
      approvedAt: isPending ? undefined : stamp,
      reviewHistory: isPending
        ? [
            {
              id: crypto.randomUUID(),
              projectId: id,
              decision: "submitted" as const,
              reviewerId: ownerId,
              reviewerName: ownerName,
              createdAt: stamp,
            },
          ]
        : [
            {
              id: crypto.randomUUID(),
              projectId: id,
              decision: "approved" as const,
              reviewerId: SEED_USER_IDS.admin,
              reviewerName: "Platform Admin",
              createdAt: stamp,
            },
          ],
      investorCount: 8 + i * 3,
      savedCount: 20 + i * 5,
      team: seedTeam(),
      documents: seedDocuments(id, includeLegal),
      updates: [
        {
          id: crypto.randomUUID(),
          title: "Q2 progress update",
          titleHy: "Ե2 առաջընթացի թարմացում",
          content: "Closed two pilot customers and completed SOC2 Type I readiness.",
          contentHy: "Փակվել են երկու փորձնական հաճախորդներ և ավարտվել է SOC2 Type I պատրաստությունը։",
          createdAt: stamp,
        },
      ],
      createdAt: stamp,
      updatedAt: stamp,
    };
  });
}

function initStore(): DevStore {
  const users = new Map<string, StoredUser>();
  const admin = createUser(
    SEED_USER_IDS.admin,
    "admin@investpro.com",
    "admin123",
    "Platform",
    "Admin",
    "admin",
    { kycStatus: "approved", membershipTier: "none" }
  );
  const investor = createUser(
    SEED_USER_IDS.investor,
    "investor@investpro.com",
    "investor123",
    "Alex",
    "Investor",
    "investor",
    {
      membershipTier: "service",
      membershipExpiresAt: new Date(Date.now() + 30 * 86400000).toISOString(),
      kycStatus: "approved",
    }
  );
  const owner = createUser(
    SEED_USER_IDS.owner,
    "owner@investpro.com",
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
  for (const project of seedProjects(owner.id, `${owner.firstName} ${owner.lastName}`, owner.kycStatus)) {
    projects.set(project.id, project);
  }

  const subscriptions = new Map<string, MembershipSubscription>();
  subscriptions.set(investor.id, {
    id: crypto.randomUUID(),
    userId: investor.id,
    planId: "service",
    status: "active",
    startedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 86400000).toISOString(),
    amount: 99,
  });

  const now = new Date().toISOString();
  const notifications = new Map<string, Notification[]>();
  notifications.set(investor.id, [
    {
      id: crypto.randomUUID(),
      userId: investor.id,
      type: "membership",
      title: "Platform access is active",
      message:
        "Full data rooms, messaging, offers, and milestone planning are unlocked for this demo account.",
      isRead: false,
      href: "/investor/projects",
      priority: "high",
      metadata: { template: "membershipActive" },
      createdAt: now,
    },
  ]);
  notifications.set(owner.id, [
    {
      id: crypto.randomUUID(),
      userId: owner.id,
      type: "project_update",
      title: "Your listings are live",
      message:
        "Horizon Labs projects are published. You will be notified when investors send offers or messages.",
      isRead: false,
      href: "/owner/offers",
      metadata: { template: "listingsLive" },
      createdAt: now,
    },
  ]);
  notifications.set(admin.id, [
    {
      id: crypto.randomUUID(),
      userId: admin.id,
      type: "general",
      title: "Moderation inbox is live",
      message:
        "You will get realtime alerts for new accounts, pending projects, KYC, complaints, and flagged chat.",
      isRead: false,
      href: "/admin/security",
      metadata: { template: "moderationInboxLive" },
      createdAt: now,
    },
  ]);

  return {
    users,
    projects,
    offers: new Map(),
    conversations: new Map(),
    messages: new Map(),
    subscriptions,
    investments: new Map(),
    savedProjects: new Map(),
    notifications,
    kyc: new Map(),
    activityLogs: [],
    complaints: [],
    milestonePlans: new Map(),
  };
}

declare global {
  // eslint-disable-next-line no-var
  var __investProStoreV5: DevStore | undefined;
}

export function getStore(): DevStore {
  if (!globalThis.__investProStoreV5) {
    globalThis.__investProStoreV5 = initStore();
  }
  return globalThis.__investProStoreV5;
}

export function hasServiceAccess(
  user: Pick<User, "membershipTier" | "membershipExpiresAt" | "role"> | null | undefined
): boolean {
  return hasActiveServiceAccess(user);
}

export function sanitizeUser(user: StoredUser): User {
  const { password: _, ...safe } = user;
  return {
    ...safe,
    membershipTier: normalizeMembershipTier(safe.membershipTier),
  };
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

const MAX_NOTIFICATIONS_PER_USER = 100;

export function listUserIdsByRole(role: UserRole): string[] {
  return Array.from(getStore().users.values())
    .filter((user) => user.role === role)
    .map((user) => user.id);
}

export function listNotifications(userId: string): Notification[] {
  return getStore().notifications.get(userId) || [];
}

export function getUnreadNotificationCount(userId: string): number {
  return listNotifications(userId).filter((n) => !n.isRead).length;
}

export function appendNotification(notification: Notification): Notification {
  const store = getStore();
  const list = store.notifications.get(notification.userId) || [];
  list.unshift(notification);
  store.notifications.set(notification.userId, list.slice(0, MAX_NOTIFICATIONS_PER_USER));
  return notification;
}

export function markNotificationRead(userId: string, id: string): Notification | null {
  const list = getStore().notifications.get(userId);
  if (!list) return null;
  const item = list.find((n) => n.id === id);
  if (!item) return null;
  item.isRead = true;
  return item;
}

export function markAllNotificationsRead(userId: string): number {
  const list = getStore().notifications.get(userId);
  if (!list) return 0;
  let changed = 0;
  for (const item of list) {
    if (!item.isRead) {
      item.isRead = true;
      changed += 1;
    }
  }
  return changed;
}

export function analyzeProjectRisk(project: Project): RiskAnalysis {
  const positive: RiskAnalysis["positiveIndicators"] = [];
  const warnings: RiskAnalysis["warningIndicators"] = [];
  const missing: string[] = [];
  const missingHy: string[] = [];
  const questions: string[] = [];
  const questionsHy: string[] = [];

  let score = 55;
  const phases = project.phases || [];
  const phaseBudgetTotal = phases.reduce((sum, ph) => sum + (ph.budgetAsk || 0), 0);
  const phaseBudgetGap = project.requiredInvestment - phaseBudgetTotal;

  if (project.documents.some((d) => d.category === "business_plan")) {
    positive.push({
      label: "Business plan uploaded",
      labelHy: "Բիզնես պլանը վերբեռնված է",
      detail: "Core planning document is available.",
      detailHy: "Հիմնական պլանավորման փաստաթուղթը հասանելի է։",
    });
    score += 8;
  } else {
    missing.push("Business plan");
    missingHy.push("Բիզնես պլան");
    warnings.push({
      label: "Missing business plan",
      labelHy: "Բացակայում է բիզնես պլանը",
      detail: "Investors cannot validate strategy depth.",
      detailHy: "Ներդրողները չեն կարող ստուգել ռազմավարության խորությունը։",
    });
    score -= 10;
  }

  if (project.documents.some((d) => d.category === "pitch_deck")) {
    positive.push({
      label: "Pitch deck available",
      labelHy: "Pitch deck-ը հասանելի է",
      detail: "Presentation materials are ready for diligence.",
      detailHy: "Ներկայացման նյութերը պատրաստ են ստուգման համար։",
    });
    score += 5;
  } else {
    missing.push("Pitch deck");
    missingHy.push("Pitch deck");
  }

  if (project.documents.some((d) => d.category === "legal")) {
    positive.push({
      label: "Legal documents present",
      labelHy: "Իրավական փաստաթղթեր կան",
      detail: "Legal package supports compliance review.",
      detailHy: "Իրավական փաթեթը աջակցում է համապատասխանության վերանայմանը։",
    });
    score += 8;
  } else {
    missing.push("Legal documents");
    missingHy.push("Իրավական փաստաթղթեր");
    warnings.push({
      label: "No legal package",
      labelHy: "Իրավական փաթեթ չկա",
      detail: "Entity and IP status may be unclear.",
      detailHy: "Կազմակերպության և մտավոր սեփականության կարգավիճակը կարող է անհասկանալի լինել։",
    });
    score -= 8;
  }

  if (project.documents.some((d) => d.category === "finance_plan")) {
    positive.push({
      label: "Finance plan available",
      labelHy: "Ֆինանսական պլանը հասանելի է",
      detail: "Dedicated finance plan supports capital allocation review.",
      detailHy: "Առանձին ֆինանսական պլանը աջակցում է կապիտալի բաշխման վերանայմանը։",
    });
    score += 5;
  } else {
    missing.push("Finance plan");
    missingHy.push("Ֆինանսական պլան");
  }

  if (phases.length >= 2) {
    positive.push({
      label: "Phased capital plan",
      labelHy: "Փուլային կապիտալի պլան",
      detail: `${phases.length} funding phases disclosed with budgets.`,
      detailHy: `${phases.length} ֆինանսավորման փուլեր բյուջեներով։`,
    });
    score += 6;
  } else {
    warnings.push({
      label: "Missing phases",
      labelHy: "Փուլերը բացակայում են",
      detail: "Fewer than 2 investment phases defined.",
      detailHy: "Սահմանված է 2-ից պակաս ներդրումային փուլ։",
    });
    score -= 5;
  }

  if (Math.abs(phaseBudgetGap) <= project.requiredInvestment * 0.05) {
    positive.push({
      label: "Phase budgets aligned",
      labelHy: "Փուլերի բյուջեները համաձայնեցված են",
      detail: "Phase asks roughly match the total raise.",
      detailHy: "Փուլերի պահանջները մոտավորապես համընկնում են ընդհանուր հավաքագրման հետ։",
    });
    score += 4;
  } else if (phases.length > 0) {
    warnings.push({
      label: "Phase budget gap",
      labelHy: "Փուլերի բյուջեի անհամապատասխանություն",
      detail: `Phase total differs from raise by $${Math.abs(phaseBudgetGap).toLocaleString()}.`,
      detailHy: `Փուլերի գումարը տարբերվում է հավաքագրումից $${Math.abs(phaseBudgetGap).toLocaleString()}-ով։`,
    });
    score -= 4;
  }

  if (project.team.length >= 3) {
    positive.push({
      label: "Complete founding team",
      labelHy: "Լրիվ հիմնադիր թիմ",
      detail: `${project.team.length} team profiles listed.`,
      detailHy: `${project.team.length} թիմի պրոֆիլ նշված է։`,
    });
    score += 7;
  } else {
    warnings.push({
      label: "Thin team roster",
      labelHy: "Թույլ թիմի կազմ",
      detail: "Fewer than 3 team members disclosed.",
      detailHy: "Բացահայտված է 3-ից պակաս թիմի անդամ։",
    });
    score -= 6;
  }

  if (project.team.some((t) => t.role === "advisor")) {
    positive.push({
      label: "Advisor on board",
      labelHy: "Խորհրդատու կա",
      detail: "External advisory support disclosed.",
      detailHy: "Արտաքին խորհրդատվական աջակցությունը բացահայտված է։",
    });
    score += 4;
  }

  if (project.financialProjections && project.financialProjections.length > 40) {
    positive.push({
      label: "Financial projections provided",
      labelHy: "Ֆինանսական կանխատեսումներ կան",
      detail: "Forward-looking numbers are documented.",
      detailHy: "Ապագա թվերը փաստաթղթավորված են։",
    });
    score += 6;
  } else {
    warnings.push({
      label: "Weak financial detail",
      labelHy: "Թույլ ֆինանսական մանրամաս",
      detail: "Projections appear incomplete.",
      detailHy: "Կանխատեսումները թերի են թվում։",
    });
    score -= 7;
  }

  if (project.ownerKycStatus === "approved") {
    positive.push({
      label: "Owner KYC approved",
      labelHy: "Սեփականատիրոջ KYC-ն հաստատված է",
      detail: "Project owner identity verification is complete.",
      detailHy: "Նախագծի սեփականատիրոջ ինքնության ստուգումն ավարտված է։",
    });
    score += 4;
  } else {
    warnings.push({
      label: "Owner KYC incomplete",
      labelHy: "Սեփականատիրոջ KYC-ն թերի է",
      detail: "Owner verification is not fully approved.",
      detailHy: "Սեփականատիրոջ ստուգումը լրիվ հաստատված չէ։",
    });
    score -= 3;
  }

  if (project.currentFunding / project.requiredInvestment > 0.4) {
    positive.push({
      label: "Strong funding traction",
      labelHy: "Ուժեղ ֆինանսավորման առաջընթաց",
      detail: `${Math.round((project.currentFunding / project.requiredInvestment) * 100)}% of goal raised.`,
      detailHy: `Նպատակի ${Math.round((project.currentFunding / project.requiredInvestment) * 100)}%-ը հավաքված է։`,
    });
    score += 5;
  }

  if (project.riskLevel === "high") score -= 8;
  if (project.riskLevel === "low") score += 6;

  questions.push("What is your current monthly burn rate and runway?");
  questionsHy.push("Որքա՞ն է ձեր ամսական ծախսը և աշխատանքային կապիտալի պահուստը։");
  questions.push("Who are your top three competitors and differentiation?");
  questionsHy.push("Ովքե՞ր են ձեր երեք հիմնական մրցակիցները և տարբերակիչ առավելությունը։");
  questions.push("How will investor funds be ring-fenced and reported?");
  questionsHy.push("Ինչպե՞ս կմեկուսացվեն և կհաղորդվեն ներդրողների միջոցները։");
  if (phases.length > 0) {
    questions.push("How do phase deliverables unlock the next capital tranche?");
    questionsHy.push("Ինչպե՞ս են փուլի արդյունքները բացում հաջորդ կապիտալի մասը։");
  }
  if (missing.includes("Legal documents")) {
    questions.push("Can you share incorporation docs and cap table?");
    questionsHy.push("Կարո՞ղ եք կիսվել գրանցման փաստաթղթերով և կապիտալի աղյուսակով։");
  }
  if (!project.documents.some((d) => d.category === "certificate")) {
    missing.push("Certificates / compliance proofs");
    missingHy.push("Վկայագրեր / համապատասխանության ապացույցներ");
    questions.push("Do you hold any industry certifications or audits?");
    questionsHy.push("Ունե՞ք արդյոք արդյունաբերական վկայագրեր կամ աուդիտներ։");
  }

  score = Math.max(5, Math.min(95, score));
  const level = score >= 70 ? "low" : score >= 45 ? "medium" : "high";
  const completeness = Math.round(
    ((project.documents.length > 0 ? 1 : 0) +
      (project.team.length > 0 ? 1 : 0) +
      (project.financialProjections ? 1 : 0) +
      (project.investmentPlan ? 1 : 0) +
      (project.businessModel ? 1 : 0) +
      (phases.length >= 2 ? 1 : 0)) /
      6 *
      100
  );

  const summary =
    level === "low"
      ? "Overall diligence posture looks solid with strong documentation, phases, and team disclosure."
      : level === "medium"
        ? "Moderate risk — several strengths exist, but investors should clarify gaps before committing."
        : "Elevated risk — missing materials and weak signals warrant caution before investing.";
  const summaryHy =
    level === "low"
      ? "Ընդհանուր ստուգման վիճակը ամուր է՝ ուժեղ փաստաթղթավորմամբ, փուլերով և թիմի բացահայտմամբ։"
      : level === "medium"
        ? "Միջին ռիսկ — կան ուժեղ կողմեր, սակայն ներդրողները պետք է պարզեն բացերը մինչև պարտավորվելը։"
        : "Բարձր ռիսկ — բացակայող նյութերն ու թույլ ազդանշանները զգուշություն են պահանջում։";

  return {
    projectId: project.id,
    score,
    level,
    completeness,
    positiveIndicators: positive,
    warningIndicators: warnings,
    missingDocuments: missing,
    missingDocumentsHy: missingHy,
    questionsToAsk: questions,
    questionsToAskHy: questionsHy,
    summary,
    summaryHy,
    phaseBudgetTotal,
    phaseBudgetGap,
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
  const activeMilestones = Array.from(store.milestonePlans.values()).filter(
    (m) =>
      m.investorId === userId &&
      (m.status === "proposed" ||
        m.status === "negotiating" ||
        m.status === "agreed" ||
        m.status === "active")
  ).length;

  const safeUser = user
    ? {
        role: user.role,
        membershipTier: normalizeMembershipTier(user.membershipTier),
        membershipExpiresAt: user.membershipExpiresAt,
      }
    : null;

  return {
    availableProjects: published.length,
    myInvestments: investments.length,
    savedProjects: saved.length,
    unreadMessages: unread,
    membershipTier: normalizeMembershipTier(user?.membershipTier),
    hasPlatformAccess: hasServiceAccess(safeUser),
    portfolioValue: investments.reduce((s, i) => s + i.amount, 0),
    activeOffers: offers.filter((o) => o.status === "pending" || o.status === "negotiating").length,
    activeMilestones,
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
  const pendingMilestones = Array.from(store.milestonePlans.values()).filter(
    (m) =>
      m.ownerId === userId &&
      (m.status === "proposed" || m.status === "negotiating" || m.status === "draft")
  ).length;

  return {
    myProjects: myProjects.length,
    publishedProjects: myProjects.filter((p) => p.status === "published").length,
    investorRequests: offers.length,
    unreadMessages: unread,
    totalFundingRaised: myProjects.reduce((s, p) => s + p.currentFunding, 0),
    teamMembers,
    pendingOffers: offers.filter((o) => o.status === "pending").length,
    pendingMilestones,
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
  const patterns: { re: RegExp; replacement: string }[] = [
    { re: /\b[\w.+-]+@[\w-]+\.[\w.]+\b/gi, replacement: "[contact hidden]" },
    { re: /\b(?:\+?\d[\d\s().-]{7,}\d)\b/g, replacement: "[contact hidden]" },
    { re: /https?:\/\/[^\s]+/gi, replacement: "[link hidden]" },
    { re: /(?:www\.)[^\s]+/gi, replacement: "[link hidden]" },
    { re: /(?:discord\.gg|discord\.com\/invite)\/\S+/gi, replacement: "[app hidden]" },
    { re: /t\.me\/\S+/gi, replacement: "[app hidden]" },
    { re: /wa\.me\/\S+|whatsapp\.me\/\S+/gi, replacement: "[app hidden]" },
    { re: /(?:^|[\s])@[a-zA-Z0-9_]{3,}/g, replacement: " [handle hidden]" },
    {
      re: /\b(?:whatsapp|telegram|signal|skype|wechat|discord)\b/gi,
      replacement: "[app hidden]",
    },
    {
      re: /\b(?:call me|email me|text me|dm me|contact me at|message me at)\b/gi,
      replacement: "[contact request hidden]",
    },
  ];

  let blocked = false;
  let cleaned = text;
  for (const { re, replacement } of patterns) {
    if (re.test(cleaned)) blocked = true;
    cleaned = cleaned.replace(re, replacement);
  }
  return { text: cleaned, blocked };
}

export function upgradeMembership(userId: string, planId: MembershipPlanId) {
  const store = getStore();
  const user = store.users.get(userId);
  if (!user) return null;
  if (planId !== "service") return null;
  const plan = MEMBERSHIP_PLANS.find((p) => p.id === planId);
  if (!plan) return null;
  const expiresAt = new Date(Date.now() + 30 * 86400000).toISOString();
  user.membershipTier = "service";
  user.membershipExpiresAt = expiresAt;
  user.updatedAt = new Date().toISOString();
  const sub: MembershipSubscription = {
    id: crypto.randomUUID(),
    userId,
    planId: "service",
    status: "active",
    startedAt: new Date().toISOString(),
    expiresAt,
    amount: plan.price,
  };
  store.subscriptions.set(userId, sub);
  logActivity(userId, "membership_purchased", "membership", planId, { amount: plan.price });
  return { user: sanitizeUser(user), subscription: sub };
}
