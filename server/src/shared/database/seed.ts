import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import {
  UserModel,
  ProjectModel,
  SubscriptionModel,
  NotificationModel,
} from "./associations";
import { SEED_USER_IDS } from "./seed-ids";
import { logger } from "../logger";
import type {
  ProjectDocument,
  ProjectPhase,
  TeamMember,
  KycStatus,
  Project,
} from "../types";

function seedTeam(): TeamMember[] {
  return [
    {
      id: uuidv4(),
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
      id: uuidv4(),
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
      id: uuidv4(),
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
      id: uuidv4(),
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
      id: uuidv4(),
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
      id: uuidv4(),
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
      id: uuidv4(),
      name: "Business Plan.pdf",
      nameHy: "Բիզնես պլան.pdf",
      url: `#doc-${projectId}-business`,
      category: "business_plan",
      uploadedAt: now,
    },
    {
      id: uuidv4(),
      name: "Pitch Deck.pdf",
      nameHy: "Pitch Deck.pdf",
      url: `#doc-${projectId}-pitch`,
      category: "pitch_deck",
      uploadedAt: now,
    },
    {
      id: uuidv4(),
      name: "Finance Plan.xlsx",
      nameHy: "Ֆինանսական պլան.xlsx",
      url: `#doc-${projectId}-finance-plan`,
      category: "finance_plan",
      uploadedAt: now,
    },
  ];
  if (includeLegal) {
    docs.push({
      id: uuidv4(),
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
              id: uuidv4(),
              projectId: id,
              decision: "submitted" as const,
              reviewerId: ownerId,
              reviewerName: ownerName,
              createdAt: stamp,
            },
          ]
        : [
            {
              id: uuidv4(),
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
          id: uuidv4(),
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

export async function seedDatabase(): Promise<void> {
  const [adminHash, investorHash, ownerHash] = await Promise.all([
    bcrypt.hash("admin123", 10),
    bcrypt.hash("investor123", 10),
    bcrypt.hash("owner123", 10),
  ]);

  const expiresAt = new Date(Date.now() + 30 * 86400000);

  await UserModel.bulkCreate([
    {
      id: SEED_USER_IDS.admin,
      email: "admin@investpro.com",
      passwordHash: adminHash,
      firstName: "Platform",
      lastName: "Admin",
      role: "admin",
      membershipTier: "none",
      membershipExpiresAt: null,
      isEmailVerified: true,
      is2faEnabled: false,
      kycStatus: "approved",
      companyName: null,
      bio: null,
      avatar: null,
      phone: null,
      isActive: true,
      status: "active",
      isSuperAdmin: true,
      emailVerifiedAt: new Date(),
      lastLoginAt: null,
      totpSecret: null,
    },
    {
      id: SEED_USER_IDS.investor,
      email: "investor@investpro.com",
      passwordHash: investorHash,
      firstName: "Alex",
      lastName: "Investor",
      role: "investor",
      membershipTier: "service",
      membershipExpiresAt: expiresAt,
      isEmailVerified: true,
      is2faEnabled: false,
      kycStatus: "approved",
      companyName: null,
      bio: null,
      avatar: null,
      phone: null,
      isActive: true,
      status: "active",
      isSuperAdmin: false,
      emailVerifiedAt: new Date(),
      lastLoginAt: null,
      totpSecret: null,
    },
    {
      id: SEED_USER_IDS.owner,
      email: "owner@investpro.com",
      passwordHash: ownerHash,
      firstName: "Sam",
      lastName: "Founder",
      role: "project_owner",
      membershipTier: "none",
      membershipExpiresAt: null,
      isEmailVerified: true,
      is2faEnabled: false,
      kycStatus: "approved",
      companyName: "Horizon Labs",
      bio: null,
      avatar: null,
      phone: null,
      isActive: true,
      status: "active",
      isSuperAdmin: false,
      emailVerifiedAt: new Date(),
      lastLoginAt: null,
      totpSecret: null,
    },
  ]);

  const projects = seedProjects(
    SEED_USER_IDS.owner,
    "Sam Founder",
    "approved"
  );

  for (const p of projects) {
    await ProjectModel.create({
      id: p.id,
      ownerId: p.ownerId,
      ownerName: p.ownerName ?? null,
      ownerKycStatus: p.ownerKycStatus ?? null,
      title: p.title,
      titleHy: p.titleHy ?? null,
      slug: p.slug,
      description: p.description,
      descriptionHy: p.descriptionHy ?? null,
      fullDescription: p.fullDescription,
      fullDescriptionHy: p.fullDescriptionHy ?? null,
      category: p.category,
      categoryHy: p.categoryHy ?? null,
      industry: p.industry,
      industryHy: p.industryHy ?? null,
      location: p.location,
      locationHy: p.locationHy ?? null,
      stage: p.stage,
      timeline: p.timeline,
      timelineHy: p.timelineHy ?? null,
      image: p.image,
      requiredInvestment: p.requiredInvestment,
      minInvestment: p.minInvestment,
      currentFunding: p.currentFunding,
      views: p.views,
      expectedRoi: p.expectedRoi,
      revenueModel: p.revenueModel,
      revenueModelHy: p.revenueModelHy ?? null,
      financialProjections: p.financialProjections,
      financialProjectionsHy: p.financialProjectionsHy ?? null,
      investmentPlan: p.investmentPlan,
      investmentPlanHy: p.investmentPlanHy ?? null,
      businessModel: p.businessModel,
      businessModelHy: p.businessModelHy ?? null,
      budgetBreakdown: p.budgetBreakdown ?? null,
      phases: p.phases,
      riskLevel: p.riskLevel,
      status: p.status,
      investorCount: p.investorCount,
      savedCount: p.savedCount,
      team: p.team,
      documents: p.documents,
      updates: p.updates,
      startDate: null,
      endDate: null,
      submittedAt: p.submittedAt ? new Date(p.submittedAt) : null,
      approvedAt: p.approvedAt ? new Date(p.approvedAt) : null,
      approvedBy: null,
      rejectedAt: null,
      rejectedBy: null,
      rejectionReason: null,
      reviewHistory: p.reviewHistory ?? [],
      createdAt: new Date(p.createdAt),
      updatedAt: new Date(p.updatedAt),
    });
  }

  await SubscriptionModel.create({
    id: uuidv4(),
    userId: SEED_USER_IDS.investor,
    planId: "service",
    status: "active",
    startedAt: new Date(),
    expiresAt,
    amount: 99,
    stripeSessionId: null,
  });

  const now = new Date();
  await NotificationModel.bulkCreate([
    {
      id: uuidv4(),
      userId: SEED_USER_IDS.investor,
      type: "membership",
      title: "Platform access is active",
      message:
        "Full data rooms, messaging, offers, and milestone planning are unlocked for this demo account.",
      isRead: false,
      href: "/investor/projects",
      priority: "high",
      metadata: { template: "membershipActive" },
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uuidv4(),
      userId: SEED_USER_IDS.owner,
      type: "project_update",
      title: "Your listings are live",
      message:
        "Horizon Labs projects are published. You will be notified when investors send offers or messages.",
      isRead: false,
      href: "/owner/offers",
      priority: "normal",
      metadata: { template: "listingsLive" },
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uuidv4(),
      userId: SEED_USER_IDS.admin,
      type: "general",
      title: "Moderation inbox is live",
      message:
        "You will get realtime alerts for new accounts, pending projects, KYC, complaints, and flagged chat.",
      isRead: false,
      href: "/admin/security",
      priority: "normal",
      metadata: { template: "moderationInboxLive" },
      createdAt: now,
      updatedAt: now,
    },
  ]);

  logger.info("Seed data loaded");
}

export async function seedIfEmpty(): Promise<void> {
  const count = await UserModel.count();
  if (count > 0) return;
  await seedDatabase();
}
