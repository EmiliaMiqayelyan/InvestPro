import { NextRequest, NextResponse } from "next/server";
import type {
  ApiResponse,
  Project,
  TeamMember,
  ProjectDocument,
  InvestmentOffer,
  Conversation,
  ChatMessage,
  UserRole,
  MembershipPlanId,
  MilestonePlan,
  MilestoneItem,
  MilestonePlanStatus,
} from "@/types";
import {
  getStore,
  sanitizeUser,
  paginate,
  getAdminStats,
  getInvestorStats,
  getOwnerStats,
  analyzeProjectRisk,
  logActivity,
  redactContactInfo,
  upgradeMembership,
  MEMBERSHIP_PLANS,
  listNotifications,
  getUnreadNotificationCount,
  markNotificationRead,
  markAllNotificationsRead,
  type StoredUser,
} from "./store";
import { dispatchNotificationEvent } from "./notifications";
import { subscribeNotifications } from "./notification-hub";
import {
  createTokenPair,
  verifyAccessToken,
  verifyRefreshToken,
  payloadToUser,
  type TokenPayload,
} from "./jwt";
import {
  canAccessFullProject,
  canMessage,
  canSendOffers,
  hasActiveServiceAccess,
} from "@/lib/rbac";

function authUserObj(auth: TokenPayload | null) {
  if (!auth) return null;
  return {
    role: auth.role,
    membershipTier: auth.membershipTier,
    membershipExpiresAt: auth.membershipExpiresAt,
  };
}

type Handler = (
  req: NextRequest,
  params: Record<string, string>,
  auth: TokenPayload | null
) => Promise<NextResponse>;

function ok<T>(data: T, message?: string, status = 200) {
  const body: ApiResponse<T> = { success: true, data, message };
  return NextResponse.json(body, { status });
}

function fail(message: string, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}

async function parseBody<T>(req: NextRequest): Promise<T> {
  try {
    return (await req.json()) as T;
  } catch {
    return {} as T;
  }
}

async function getAuth(req: NextRequest): Promise<TokenPayload | null> {
  const header = req.headers.get("authorization");
  if (header?.startsWith("Bearer ")) {
    return verifyAccessToken(header.slice(7));
  }
  const cookie = req.cookies.get("access_token")?.value;
  if (cookie) return verifyAccessToken(cookie);
  const token = new URL(req.url).searchParams.get("token");
  if (token) return verifyAccessToken(token);
  return null;
}

function findUserByEmail(email: string): StoredUser | undefined {
  for (const user of getStore().users.values()) {
    if (user.email.toLowerCase() === email.toLowerCase()) return user;
  }
  return undefined;
}

function requireAuth(auth: TokenPayload | null) {
  if (!auth) return fail("Unauthorized", 401);
  return null;
}

function requireRole(auth: TokenPayload | null, roles: UserRole[]) {
  const err = requireAuth(auth);
  if (err) return err;
  if (!roles.includes(auth!.role)) return fail("Forbidden", 403);
  return null;
}

function publicProjectCard(project: Project) {
  return {
    id: project.id,
    title: project.title,
    titleHy: project.titleHy,
    slug: project.slug,
    category: project.category,
    categoryHy: project.categoryHy,
    industry: project.industry,
    industryHy: project.industryHy,
    location: project.location,
    locationHy: project.locationHy,
    image: project.image,
    requiredInvestment: project.requiredInvestment,
    currentFunding: project.currentFunding,
    expectedRoi: project.expectedRoi,
    views: project.views,
    riskLevel: project.riskLevel,
    status: project.status,
    minInvestment: project.minInvestment,
    stage: project.stage,
    investorCount: project.investorCount,
    teamSize: project.team?.length ?? 0,
    description: project.description,
    descriptionHy: project.descriptionHy,
    ownerName: project.ownerName,
    ownerKycStatus: project.ownerKycStatus,
  };
}

function gatedProject(project: Project, auth: TokenPayload | null) {
  const userObj = authUserObj(auth);
  if (canAccessFullProject(userObj)) return project;
  if (auth?.role === "project_owner" && auth.sub === project.ownerId) return project;

  const teaserPhases = (project.phases || []).map((ph) => ({
    id: ph.id,
    title: ph.title,
    titleHy: ph.titleHy,
    description: "",
    descriptionHy: undefined,
    budgetAsk: 0,
    durationWeeks: undefined,
    deliverables: [] as string[],
    sortOrder: ph.sortOrder,
    status: ph.status,
  }));

  return {
    ...project,
    limited: true as const,
    documents: [],
    team: [],
    teamCount: project.team?.length ?? 0,
    financialProjections: project.financialProjections
      ? `${project.financialProjections.slice(0, 80)}…`
      : "",
    financialProjectionsHy: project.financialProjectionsHy
      ? `${project.financialProjectionsHy.slice(0, 80)}…`
      : undefined,
    investmentPlan: project.investmentPlan
      ? `${project.investmentPlan.slice(0, 80)}…`
      : "",
    investmentPlanHy: project.investmentPlanHy
      ? `${project.investmentPlanHy.slice(0, 80)}…`
      : undefined,
    fullDescription: project.fullDescription.slice(0, 200) + (project.fullDescription.length > 200 ? "…" : ""),
    fullDescriptionHy: project.fullDescriptionHy
      ? project.fullDescriptionHy.slice(0, 200) + (project.fullDescriptionHy.length > 200 ? "…" : "")
      : undefined,
    budgetBreakdown: undefined,
    phases: teaserPhases,
    updates: [],
  };
}

const handlers: Record<string, Handler> = {
  "POST /auth/login": async (req) => {
    const { email, password } = await parseBody<{ email: string; password: string }>(req);
    const user = findUserByEmail(email);
    if (!user || user.password !== password) return fail("Invalid email or password", 401);
    const tokens = await createTokenPair(sanitizeUser(user));
    logActivity(user.id, "login", "auth");
    return ok({ user: sanitizeUser(user), tokens });
  },

  "POST /auth/register": async (req) => {
    const body = await parseBody<{
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      phone?: string;
      role?: UserRole;
      companyName?: string;
    }>(req);
    if (findUserByEmail(body.email)) return fail("Email already registered", 409);
    const role: UserRole =
      body.role === "project_owner" ? "project_owner" : "investor";
    if (body.role === "admin") return fail("Cannot self-register as admin", 403);

    const store = getStore();
    const user: StoredUser = {
      id: crypto.randomUUID(),
      email: body.email,
      password: body.password,
      firstName: body.firstName,
      lastName: body.lastName,
      phone: body.phone,
      role,
      companyName: body.companyName,
      membershipTier: "none",
      isEmailVerified: false,
      is2faEnabled: false,
      kycStatus: "not_submitted",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    store.users.set(user.id, user);
    logActivity(user.id, "register", "auth", undefined, { role });
    dispatchNotificationEvent({
      kind: "user_registered",
      userId: user.id,
      role,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
    });
    const tokens = await createTokenPair(sanitizeUser(user));
    return ok({ user: sanitizeUser(user), tokens }, "Account created", 201);
  },

  "POST /auth/logout": async () => ok(null, "Logged out"),

  "POST /auth/forgot-password": async () =>
    ok(null, "If the email exists, a reset link was sent"),

  "POST /auth/verify-email": async () => ok(null, "Email verified"),

  "POST /auth/refresh": async (req) => {
    const { refreshToken } = await parseBody<{ refreshToken: string }>(req);
    const payload = await verifyRefreshToken(refreshToken);
    if (!payload) return fail("Invalid refresh token", 401);
    const stored = getStore().users.get(payload.sub);
    const user = stored ? sanitizeUser(stored) : payloadToUser(payload);
    return ok(await createTokenPair(user));
  },

  "GET /auth/me": async (_req, _p, auth) => {
    if (!auth) return fail("Unauthorized", 401);
    const stored = getStore().users.get(auth.sub);
    if (stored) return ok(sanitizeUser(stored));
    return ok(payloadToUser(auth));
  },

  "GET /membership/plans": async () => ok(MEMBERSHIP_PLANS),

  "GET /membership/me": async (_req, _p, auth) => {
    if (!auth) return fail("Unauthorized", 401);
    const sub = getStore().subscriptions.get(auth.sub) || null;
    const user = getStore().users.get(auth.sub);
    return ok({
      tier: user?.membershipTier || "none",
      expiresAt: user?.membershipExpiresAt,
      subscription: sub,
    });
  },

  "POST /membership/subscribe": async (req, _p, auth) => {
    const err = requireRole(auth, ["investor"]);
    if (err) return err;
    const body = await parseBody<{ planId?: MembershipPlanId }>(req);
    const planId: MembershipPlanId = body.planId || "service";
    const result = upgradeMembership(auth!.sub, planId);
    if (!result) return fail("Invalid plan", 400);
    const tokens = await createTokenPair(result.user);
    try {
      const { sendServiceFeeReceipt } = await import("./email");
      await sendServiceFeeReceipt(result.user.email, result.subscription.amount);
    } catch {
      /* non-blocking */
    }
    dispatchNotificationEvent({
      kind: "membership_activated",
      userId: auth!.sub,
      amount: result.subscription.amount,
    });
    return ok({ ...result, tokens }, "Membership activated");
  },

  "POST /membership/checkout": async (req, _p, auth) => {
    const err = requireRole(auth, ["investor"]);
    if (err) return err;
    const body = await parseBody<{ planId?: MembershipPlanId }>(req);
    const planId: MembershipPlanId = body.planId || "service";
    if (planId !== "service") return fail("Invalid plan", 400);
    const user = getStore().users.get(auth!.sub);
    const { createServiceFeeCheckoutSession } = await import("./stripe");
    const session = await createServiceFeeCheckoutSession({
      userId: auth!.sub,
      email: user?.email || "",
      successUrl: "/investor/membership?checkout=mock",
      cancelUrl: "/investor/membership",
    });
    return ok({
      checkoutUrl: session.checkoutUrl,
      sessionId: session.sessionId,
      planId,
    });
  },

  "GET /projects": async (req) => {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.toLowerCase();
    const category = searchParams.get("category");
    const industry = searchParams.get("industry");
    const location = searchParams.get("location")?.toLowerCase();
    const stage = searchParams.get("stage");
    const minInvestment = searchParams.get("minInvestment")
      ? Number(searchParams.get("minInvestment"))
      : undefined;
    const fundingStatus = searchParams.get("fundingStatus");
    const riskLevel = searchParams.get("riskLevel");
    const sortBy = searchParams.get("sortBy") || "newest";
    const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc" | null) || "desc";

    let projects = Array.from(getStore().projects.values()).filter(
      (p) => p.status === "published" || p.status === "funded"
    );
    if (search) {
      projects = projects.filter(
        (p) =>
          p.title.toLowerCase().includes(search) ||
          p.category.toLowerCase().includes(search) ||
          p.description.toLowerCase().includes(search)
      );
    }
    if (category) projects = projects.filter((p) => p.category === category);
    if (industry) projects = projects.filter((p) => p.industry === industry);
    if (stage) projects = projects.filter((p) => p.stage === stage);
    if (location) projects = projects.filter((p) => p.location.toLowerCase().includes(location));
    if (typeof minInvestment === "number" && !Number.isNaN(minInvestment)) {
      // Investor budget filter: include projects where the investor can meet the minimum ticket.
      projects = projects.filter((p) => p.minInvestment <= minInvestment);
    }
    if (riskLevel) projects = projects.filter((p) => p.riskLevel === riskLevel);
    if (fundingStatus) {
      if (fundingStatus === "open") projects = projects.filter((p) => p.status === "published");
      if (fundingStatus === "funded") projects = projects.filter((p) => p.status === "funded");
    }

    projects = projects.sort((a, b) => {
      const dir = sortOrder === "asc" ? 1 : -1;
      if (sortBy === "most_viewed") return dir * ((b.views || 0) - (a.views || 0));
      if (sortBy === "funding_progress") {
        const ap = a.currentFunding / Math.max(a.requiredInvestment, 1);
        const bp = b.currentFunding / Math.max(b.requiredInvestment, 1);
        return dir * (bp - ap);
      }
      // newest: recently published/updated first (not only original create date)
      const recency = (p: (typeof projects)[number]) =>
        new Date(p.approvedAt || p.updatedAt || p.submittedAt || p.createdAt).getTime();
      return dir * (recency(b) - recency(a));
    });
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 12);
    const cards = projects.map(publicProjectCard);
    return ok(paginate(cards, page, limit));
  },

  "GET /projects/:id": async (_req, params, auth) => {
    const project = getStore().projects.get(params.id);
    if (!project) return fail("Project not found", 404);
    if (
      project.status !== "published" &&
      project.status !== "funded" &&
      auth?.sub !== project.ownerId &&
      auth?.role !== "admin"
    ) {
      return fail("Project not available", 404);
    }
    return ok(gatedProject(project, auth));
  },

  "GET /projects/:id/risk-analysis": async (_req, params, auth) => {
    const err = requireAuth(auth);
    if (err) return err;
    const project = getStore().projects.get(params.id);
    if (!project) return fail("Project not found", 404);
    const analysis = analyzeProjectRisk(project);
    if (auth!.role !== "admin" && !hasActiveServiceAccess(authUserObj(auth))) {
      return ok({
        projectId: analysis.projectId,
        score: analysis.score,
        level: analysis.level,
        completeness: 0,
        positiveIndicators: [],
        warningIndicators: [],
        missingDocuments: [],
        questionsToAsk: [],
        summary: "Subscribe to the platform service to unlock the full risk report.",
        summaryHy: "Բաժանորդագրվեք հարթակի ծառայությանը՝ լրիվ ռիսկի զեկույցը բացելու համար։",
        generatedAt: analysis.generatedAt,
        limited: true,
      });
    }
    return ok(analysis);
  },

  "POST /projects/:id/save": async (_req, params, auth) => {
    const err = requireRole(auth, ["investor"]);
    if (err) return err;
    const store = getStore();
    if (!store.projects.get(params.id)) return fail("Project not found", 404);
    const list = store.savedProjects.get(auth!.sub) || [];
    if (!list.includes(params.id)) list.push(params.id);
    store.savedProjects.set(auth!.sub, list);
    return ok({ saved: true });
  },

  "DELETE /projects/:id/save": async (_req, params, auth) => {
    const err = requireRole(auth, ["investor"]);
    if (err) return err;
    const store = getStore();
    const list = (store.savedProjects.get(auth!.sub) || []).filter((id) => id !== params.id);
    store.savedProjects.set(auth!.sub, list);
    return ok({ saved: false });
  },

  "GET /investor/dashboard": async (_req, _p, auth) => {
    const err = requireRole(auth, ["investor", "admin"]);
    if (err) return err;
    return ok(getInvestorStats(auth!.sub));
  },

  "GET /investor/saved": async (_req, _p, auth) => {
    const err = requireRole(auth, ["investor"]);
    if (err) return err;
    const ids = getStore().savedProjects.get(auth!.sub) || [];
    const projects = ids
      .map((id) => getStore().projects.get(id))
      .filter(Boolean)
      .map((p) => publicProjectCard(p!));
    return ok(projects);
  },

  "GET /investor/investments": async (_req, _p, auth) => {
    const err = requireRole(auth, ["investor"]);
    if (err) return err;
    const list = getStore().investments.get(auth!.sub) || [];
    const enriched = list.map((inv) => ({
      ...inv,
      project: getStore().projects.get(inv.projectId),
    }));
    return ok(enriched);
  },

  "POST /offers": async (req, _p, auth) => {
    const err = requireRole(auth, ["investor"]);
    if (err) return err;
    if (!canSendOffers(authUserObj(auth))) {
      return fail("Platform service access required to send offers", 403);
    }
    const body = await parseBody<{
      projectId: string;
      amount: number;
      conditions?: string;
      questions?: string;
      notes?: string;
    }>(req);
    const project = getStore().projects.get(body.projectId);
    if (!project || project.status !== "published") return fail("Project not available", 404);
    if (body.amount < project.minInvestment) {
      return fail(`Minimum investment is ${project.minInvestment}`, 400);
    }
    const investor = getStore().users.get(auth!.sub)!;
    const offer: InvestmentOffer = {
      id: crypto.randomUUID(),
      projectId: project.id,
      projectTitle: project.title,
      investorId: auth!.sub,
      investorName: `${investor.firstName} ${investor.lastName}`,
      ownerId: project.ownerId,
      amount: body.amount,
      conditions: body.conditions || "",
      questions: body.questions || "",
      notes: body.notes || "",
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    getStore().offers.set(offer.id, offer);
    logActivity(auth!.sub, "offer_created", "offer", offer.id);
    dispatchNotificationEvent({ kind: "offer_created", offer });
    return ok(offer, "Offer submitted", 201);
  },

  "GET /offers": async (req, _p, auth) => {
    const err = requireAuth(auth);
    if (err) return err;
    const { searchParams } = new URL(req.url);
    let offers = Array.from(getStore().offers.values());
    if (auth!.role === "investor") offers = offers.filter((o) => o.investorId === auth!.sub);
    else if (auth!.role === "project_owner") offers = offers.filter((o) => o.ownerId === auth!.sub);
    const status = searchParams.get("status");
    if (status) offers = offers.filter((o) => o.status === status);
    return ok(paginate(offers, Number(searchParams.get("page") || 1), Number(searchParams.get("limit") || 20)));
  },

  "PATCH /offers/:id": async (req, params, auth) => {
    const err = requireRole(auth, ["project_owner", "admin"]);
    if (err) return err;
    const offer = getStore().offers.get(params.id);
    if (!offer) return fail("Offer not found", 404);
    if (auth!.role === "project_owner" && offer.ownerId !== auth!.sub) return fail("Forbidden", 403);
    const body = await parseBody<{ status: InvestmentOffer["status"]; ownerResponse?: string }>(req);
    if (!["accepted", "rejected", "negotiating"].includes(body.status)) {
      return fail("Invalid status", 400);
    }
    offer.status = body.status;
    offer.ownerResponse = body.ownerResponse;
    offer.updatedAt = new Date().toISOString();
    getStore().offers.set(offer.id, offer);

    if (body.status === "accepted") {
      const investments = getStore().investments.get(offer.investorId) || [];
      investments.push({
        id: crypto.randomUUID(),
        offerId: offer.id,
        projectId: offer.projectId,
        amount: offer.amount,
        status: "active",
        expectedReturn: offer.amount * 1.15,
        createdAt: new Date().toISOString(),
      });
      getStore().investments.set(offer.investorId, investments);
      const project = getStore().projects.get(offer.projectId);
      if (project) {
        project.currentFunding += offer.amount;
        project.investorCount += 1;
        if (project.currentFunding >= project.requiredInvestment && project.status === "published") {
          project.status = "funded";
          dispatchNotificationEvent({
            kind: "project_status_changed",
            project,
            status: "funded",
          });
        }
        getStore().projects.set(project.id, project);
      }
    }

    logActivity(auth!.sub, `offer_${body.status}`, "offer", offer.id);
    dispatchNotificationEvent({ kind: "offer_updated", offer });
    return ok(offer);
  },

  "GET /owner/dashboard": async (_req, _p, auth) => {
    const err = requireRole(auth, ["project_owner", "admin"]);
    if (err) return err;
    return ok(getOwnerStats(auth!.sub));
  },

  "GET /owner/projects": async (_req, _p, auth) => {
    const err = requireRole(auth, ["project_owner", "admin"]);
    if (err) return err;
    const projects = Array.from(getStore().projects.values()).filter(
      (p) => p.ownerId === auth!.sub || auth!.role === "admin"
    );
    const statusRank = (status: string) => {
      if (status === "pending_review") return 0;
      if (status === "published" || status === "funded") return 1;
      if (status === "draft") return 2;
      if (status === "rejected") return 3;
      return 4;
    };
    const activityTime = (p: (typeof projects)[number]) => {
      if (p.status === "pending_review") {
        return new Date(p.submittedAt || p.updatedAt || p.createdAt).getTime();
      }
      if (p.status === "published" || p.status === "funded") {
        return new Date(p.approvedAt || p.updatedAt || p.createdAt).getTime();
      }
      return new Date(p.updatedAt || p.createdAt).getTime();
    };
    projects.sort((a, b) => {
      const rank = statusRank(a.status) - statusRank(b.status);
      if (rank !== 0) return rank;
      return activityTime(b) - activityTime(a);
    });
    return ok(projects);
  },

  "POST /owner/projects": async (req, _p, auth) => {
    const err = requireRole(auth, ["project_owner"]);
    if (err) return err;
    const body = await parseBody<Partial<Project> & { title: string }>(req);
    if (!body.title) return fail("Title is required", 400);
    const owner = getStore().users.get(auth!.sub)!;
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const project: Project = {
      id,
      ownerId: auth!.sub,
      ownerName: `${owner.firstName} ${owner.lastName}`,
      ownerKycStatus: owner.kycStatus,
      title: body.title,
      slug: body.title.toLowerCase().replace(/\s+/g, "-"),
      description: body.description || "",
      fullDescription: body.fullDescription || body.description || "",
      category: body.category || "Other",
      industry: body.industry || "Other",
      location: body.location || "",
      stage: body.stage || "idea",
      timeline: body.timeline || "",
      image:
        body.image ||
        "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=1200&q=80",
      requiredInvestment: Number(body.requiredInvestment) || 0,
      minInvestment: Number(body.minInvestment) || 0,
      currentFunding: 0,
      views: 0,
      expectedRoi: Number(body.expectedRoi) || 0,
      revenueModel: body.revenueModel || "",
      financialProjections: body.financialProjections || "",
      investmentPlan: body.investmentPlan || "",
      businessModel: body.businessModel || "",
      budgetBreakdown: body.budgetBreakdown,
      phases: body.phases || [],
      riskLevel: body.riskLevel || "medium",
      status: "pending_review",
      submittedAt: now,
      reviewHistory: [],
      investorCount: 0,
      savedCount: 0,
      team: body.team || [],
      documents: body.documents || [],
      updates: [],
      createdAt: now,
      updatedAt: now,
    };
    const { markSubmitted } = await import("./project-review");
    markSubmitted(project, auth!.sub, "submitted");
    logActivity(auth!.sub, "project_created", "project", id);
    dispatchNotificationEvent({ kind: "project_created", project });
    return ok(project, "Project submitted for review", 201);
  },

  "PATCH /owner/projects/:id": async (req, params, auth) => {
    const err = requireRole(auth, ["project_owner", "admin"]);
    if (err) return err;
    const project = getStore().projects.get(params.id);
    if (!project) return fail("Project not found", 404);
    if (auth!.role === "project_owner" && project.ownerId !== auth!.sub) return fail("Forbidden", 403);
    const body = await parseBody<Partial<Project>>(req);
    const { status: _status, approvedAt: _a, approvedBy: _b, rejectedAt: _c, rejectedBy: _d, rejectionReason: _e, reviewHistory: _f, ownerId: _o, id: _id, ...safe } = body;
    const updated = {
      ...project,
      ...safe,
      id: project.id,
      ownerId: project.ownerId,
      status: project.status,
      reviewHistory: project.reviewHistory,
      updatedAt: new Date().toISOString(),
    };
    getStore().projects.set(params.id, updated);
    return ok(updated);
  },

  "POST /owner/projects/:id/documents": async (req, params, auth) => {
    const err = requireRole(auth, ["project_owner"]);
    if (err) return err;
    const project = getStore().projects.get(params.id);
    if (!project || project.ownerId !== auth!.sub) return fail("Not found", 404);
    const body = await parseBody<{ name: string; category: ProjectDocument["category"]; url?: string }>(req);
    const doc: ProjectDocument = {
      id: crypto.randomUUID(),
      name: body.name,
      category: body.category || "other",
      url: body.url || `#upload-${crypto.randomUUID()}`,
      uploadedAt: new Date().toISOString(),
    };
    project.documents.push(doc);
    project.updatedAt = new Date().toISOString();
    getStore().projects.set(project.id, project);
    return ok(doc, "Document uploaded", 201);
  },

  "POST /owner/projects/:id/team": async (req, params, auth) => {
    const err = requireRole(auth, ["project_owner"]);
    if (err) return err;
    const project = getStore().projects.get(params.id);
    if (!project || project.ownerId !== auth!.sub) return fail("Not found", 404);
    const body = await parseBody<Omit<TeamMember, "id">>(req);
    const member: TeamMember = { ...body, id: crypto.randomUUID() };
    project.team.push(member);
    project.updatedAt = new Date().toISOString();
    getStore().projects.set(project.id, project);
    return ok(member, "Team member added", 201);
  },

  "GET /owner/documents": async (_req, _p, auth) => {
    const err = requireRole(auth, ["project_owner"]);
    if (err) return err;
    const docs = Array.from(getStore().projects.values())
      .filter((p) => p.ownerId === auth!.sub)
      .flatMap((p) =>
        p.documents.map((d, index) => ({
          ...d,
          id: `${p.id}:${d.id || index}`,
          projectId: p.id,
          projectTitle: p.title,
        }))
      );
    return ok(docs);
  },

  "GET /conversations": async (_req, _p, auth) => {
    const err = requireAuth(auth);
    if (err) return err;
    let list = Array.from(getStore().conversations.values());
    if (auth!.role === "investor") list = list.filter((c) => c.investorId === auth!.sub);
    else if (auth!.role === "project_owner") list = list.filter((c) => c.ownerId === auth!.sub);
    list.sort((a, b) => (b.lastMessageAt || "").localeCompare(a.lastMessageAt || ""));
    return ok(list);
  },

  "POST /conversations": async (req, _p, auth) => {
    const err = requireRole(auth, ["investor", "project_owner"]);
    if (err) return err;
    if (!canMessage(authUserObj(auth))) {
      return fail("Platform service access required to message", 403);
    }
    const { projectId, investorId } = await parseBody<{ projectId: string; investorId?: string }>(req);
    const project = getStore().projects.get(projectId);
    if (!project) return fail("Project not found", 404);

    const invId = auth!.role === "investor" ? auth!.sub : investorId;
    if (!invId) return fail("investorId required", 400);
    const existing = Array.from(getStore().conversations.values()).find(
      (c) => c.projectId === projectId && c.investorId === invId
    );
    if (existing) return ok(existing);

    const investor = getStore().users.get(invId);
    const owner = getStore().users.get(project.ownerId);
    if (!investor || !owner) return fail("Participants not found", 404);

    const conversation: Conversation = {
      id: crypto.randomUUID(),
      projectId,
      projectTitle: project.title,
      investorId: invId,
      investorName: `${investor.firstName} ${investor.lastName}`,
      ownerId: project.ownerId,
      ownerName: `${owner.firstName} ${owner.lastName}`,
      unreadCount: 0,
      createdAt: new Date().toISOString(),
    };
    getStore().conversations.set(conversation.id, conversation);
    getStore().messages.set(conversation.id, []);
    return ok(conversation, undefined, 201);
  },

  "GET /conversations/:id/messages": async (_req, params, auth) => {
    const err = requireAuth(auth);
    if (err) return err;
    const conversation = getStore().conversations.get(params.id);
    if (!conversation) return fail("Conversation not found", 404);
    const allowed =
      auth!.role === "admin" ||
      auth!.sub === conversation.investorId ||
      auth!.sub === conversation.ownerId;
    if (!allowed) return fail("Forbidden", 403);
    return ok(getStore().messages.get(params.id) || []);
  },

  "POST /conversations/:id/messages": async (req, params, auth) => {
    const err = requireAuth(auth);
    if (err) return err;
    const conversation = getStore().conversations.get(params.id);
    if (!conversation) return fail("Conversation not found", 404);
    const isAdminParticipant =
      auth!.role === "admin" &&
      (conversation.isAdminThread || conversation.investorId === auth!.sub);
    const allowed =
      auth!.sub === conversation.investorId ||
      auth!.sub === conversation.ownerId ||
      isAdminParticipant;
    if (!allowed) return fail("Forbidden", 403);
    if (!isAdminParticipant && !canMessage(authUserObj(auth))) {
      return fail("Platform service access required", 403);
    }

    const body = await parseBody<{ content: string; attachmentUrl?: string; attachmentName?: string }>(req);
    const { text, blocked } = redactContactInfo(body.content || "");
    if (!text.trim() && !body.attachmentUrl) return fail("Message required", 400);

    const sender = getStore().users.get(auth!.sub)!;
    const message: ChatMessage = {
      id: crypto.randomUUID(),
      conversationId: params.id,
      senderId: auth!.sub,
      senderName: `${sender.firstName} ${sender.lastName}`,
      senderRole: sender.role,
      content: text,
      attachmentUrl: body.attachmentUrl,
      attachmentName: body.attachmentName,
      isFlagged: blocked,
      createdAt: new Date().toISOString(),
    };
    const msgs = getStore().messages.get(params.id) || [];
    msgs.push(message);
    getStore().messages.set(params.id, msgs);
    conversation.lastMessage = text.slice(0, 120);
    conversation.lastMessageAt = message.createdAt;
    conversation.unreadCount += 1;
    getStore().conversations.set(params.id, conversation);
    if (blocked) {
      logActivity(auth!.sub, "contact_info_blocked", "message", message.id);
      dispatchNotificationEvent({
        kind: "contact_blocked",
        conversation,
        senderId: auth!.sub,
        senderName: message.senderName,
      });
    }
    dispatchNotificationEvent({ kind: "message_sent", conversation, message });
    const recipientId =
      auth!.sub === conversation.investorId ? conversation.ownerId : conversation.investorId;
    const recipient = getStore().users.get(recipientId);
    if (recipient?.email) {
      void import("./email").then(({ sendNewMessageNotice }) =>
        sendNewMessageNotice(recipient.email, conversation.projectTitle)
      );
    }
    return ok(message, blocked ? "Message sent. External contact details were removed for security." : undefined, 201);
  },

  "GET /users/profile": async (_req, _p, auth) => {
    if (!auth) return fail("Unauthorized", 401);
    const user = getStore().users.get(auth.sub);
    if (!user) return fail("User not found", 404);
    return ok(sanitizeUser(user));
  },

  "PATCH /users/profile": async (req, _p, auth) => {
    if (!auth) return fail("Unauthorized", 401);
    const user = getStore().users.get(auth.sub);
    if (!user) return fail("User not found", 404);
    const body = await parseBody<Partial<StoredUser>>(req);
    Object.assign(user, {
      firstName: body.firstName ?? user.firstName,
      lastName: body.lastName ?? user.lastName,
      phone: body.phone ?? user.phone,
      bio: body.bio ?? user.bio,
      companyName: body.companyName ?? user.companyName,
      updatedAt: new Date().toISOString(),
    });
    getStore().users.set(user.id, user);
    return ok(sanitizeUser(user));
  },

  "GET /notifications": async (_req, _p, auth) => {
    if (!auth) return fail("Unauthorized", 401);
    return ok(listNotifications(auth.sub));
  },

  "GET /notifications/unread-count": async (_req, _p, auth) => {
    if (!auth) return fail("Unauthorized", 401);
    return ok({ unreadCount: getUnreadNotificationCount(auth.sub) });
  },

  "PATCH /notifications/:id/read": async (_req, params, auth) => {
    if (!auth) return fail("Unauthorized", 401);
    const item = markNotificationRead(auth.sub, params.id);
    if (!item) return fail("Notification not found", 404);
    return ok({
      notification: item,
      unreadCount: getUnreadNotificationCount(auth.sub),
    });
  },

  "POST /notifications/read-all": async (_req, _p, auth) => {
    if (!auth) return fail("Unauthorized", 401);
    const updated = markAllNotificationsRead(auth.sub);
    return ok({ updated, unreadCount: 0 });
  },

  "GET /notifications/stream": async (req, _p, auth) => {
    if (!auth) return fail("Unauthorized", 401);
    const userId = auth.sub;
    const encoder = new TextEncoder();
    let heartbeat: ReturnType<typeof setInterval> | undefined;
    let unsubscribe: (() => void) | undefined;

    const stream = new ReadableStream({
      start(controller) {
        const send = (event: string, data: unknown) => {
          controller.enqueue(
            encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
          );
        };
        send("connected", {
          ok: true,
          unreadCount: getUnreadNotificationCount(userId),
        });
        unsubscribe = subscribeNotifications(userId, (event, data) => {
          try {
            send(event, data);
          } catch {
            unsubscribe?.();
            if (heartbeat) clearInterval(heartbeat);
          }
        });
        heartbeat = setInterval(() => {
          try {
            controller.enqueue(encoder.encode(`: ping\n\n`));
          } catch {
            if (heartbeat) clearInterval(heartbeat);
          }
        }, 25000);
        req.signal.addEventListener("abort", () => {
          if (heartbeat) clearInterval(heartbeat);
          unsubscribe?.();
          try {
            controller.close();
          } catch {
            /* already closed */
          }
        });
      },
      cancel() {
        if (heartbeat) clearInterval(heartbeat);
        unsubscribe?.();
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  },

  "GET /kyc": async (_req, _p, auth) => {
    if (!auth) return fail("Unauthorized", 401);
    return ok(getStore().kyc.get(auth.sub) || null);
  },

  "POST /kyc": async (req, _p, auth) => {
    if (!auth) return fail("Unauthorized", 401);
    const body = await parseBody<{ idDocumentUrl: string; selfieUrl: string; addressProofUrl: string }>(req);
    const submission = {
      id: crypto.randomUUID(),
      userId: auth.sub,
      status: "pending" as const,
      idDocumentUrl: body.idDocumentUrl || "#id",
      selfieUrl: body.selfieUrl || "#selfie",
      addressProofUrl: body.addressProofUrl || "#address",
      submittedAt: new Date().toISOString(),
    };
    getStore().kyc.set(auth.sub, submission);
    const user = getStore().users.get(auth.sub);
    if (user) {
      user.kycStatus = "pending";
      getStore().users.set(user.id, user);
    }
    logActivity(auth.sub, "kyc_submitted", "kyc", submission.id);
    dispatchNotificationEvent({
      kind: "kyc_submitted",
      userId: auth.sub,
      name: user ? `${user.firstName} ${user.lastName}` : "A user",
    });
    return ok(submission, "KYC submitted", 201);
  },

  "GET /admin/stats": async (_req, _p, auth) => {
    const err = requireRole(auth, ["admin"]);
    if (err) return err;
    return ok(getAdminStats());
  },

  "GET /admin/users": async (req, _p, auth) => {
    const err = requireRole(auth, ["admin"]);
    if (err) return err;
    const { searchParams } = new URL(req.url);
    let users = Array.from(getStore().users.values()).map(sanitizeUser);
    const role = searchParams.get("role");
    const search = searchParams.get("search")?.toLowerCase();
    if (role) users = users.filter((u) => u.role === role);
    if (search) {
      users = users.filter(
        (u) =>
          u.email.includes(search) ||
          u.firstName.toLowerCase().includes(search) ||
          u.lastName.toLowerCase().includes(search)
      );
    }
    return ok(paginate(users, Number(searchParams.get("page") || 1), Number(searchParams.get("limit") || 20)));
  },

  "PATCH /admin/users/:id/role": async (req, params, auth) => {
    const err = requireRole(auth, ["admin"]);
    if (err) return err;
    const user = getStore().users.get(params.id);
    if (!user) return fail("User not found", 404);
    const { role } = await parseBody<{ role: UserRole }>(req);
    if (!["investor", "project_owner", "admin"].includes(role)) return fail("Invalid role", 400);
    user.role = role;
    user.updatedAt = new Date().toISOString();
    getStore().users.set(user.id, user);
    dispatchNotificationEvent({ kind: "role_changed", userId: user.id, role });
    return ok(sanitizeUser(user));
  },

  "GET /admin/projects": async (req, _p, auth) => {
    const err = requireRole(auth, ["admin"]);
    if (err) return err;
    const { searchParams } = new URL(req.url);
    let projects = Array.from(getStore().projects.values());
    const status = searchParams.get("status");
    if (status) projects = projects.filter((p) => p.status === status);
    projects.sort((a, b) => {
      const pendingRank = (s: string) => (s === "pending_review" ? 0 : 1);
      const rank = pendingRank(a.status) - pendingRank(b.status);
      if (rank !== 0) return rank;
      const aTime = new Date(a.submittedAt || a.createdAt).getTime();
      const bTime = new Date(b.submittedAt || b.createdAt).getTime();
      return bTime - aTime;
    });
    return ok(paginate(projects, Number(searchParams.get("page") || 1), Number(searchParams.get("limit") || 20)));
  },

  "GET /admin/projects/pending": async (_req, _p, auth) => {
    const err = requireRole(auth, ["admin"]);
    if (err) return err;
    const projects = Array.from(getStore().projects.values())
      .filter((p) => p.status === "pending_review")
      .sort(
        (a, b) =>
          new Date(b.submittedAt || b.createdAt).getTime() -
          new Date(a.submittedAt || a.createdAt).getTime()
      );
    return ok(projects);
  },

  "GET /admin/projects/:id": async (_req, params, auth) => {
    const err = requireRole(auth, ["admin"]);
    if (err) return err;
    const project = getStore().projects.get(params.id);
    if (!project) return fail("Project not found", 404);
    const owner = getStore().users.get(project.ownerId);
    const ownerProjects = Array.from(getStore().projects.values()).filter(
      (p) => p.ownerId === project.ownerId
    );
    return ok({
      project,
      owner: owner
        ? {
            id: owner.id,
            email: owner.email,
            firstName: owner.firstName,
            lastName: owner.lastName,
            companyName: owner.companyName,
            bio: owner.bio,
            kycStatus: owner.kycStatus,
            createdAt: owner.createdAt,
            previousProjects: ownerProjects.length,
          }
        : null,
      riskAnalysis: analyzeProjectRisk(project),
      reviewHistory: project.reviewHistory || [],
    });
  },

  "GET /admin/projects/:id/review-history": async (_req, params, auth) => {
    const err = requireRole(auth, ["admin"]);
    if (err) return err;
    const project = getStore().projects.get(params.id);
    if (!project) return fail("Project not found", 404);
    return ok(project.reviewHistory || []);
  },

  "POST /admin/projects/:id/approve": async (_req, params, auth) => {
    const err = requireRole(auth, ["admin"]);
    if (err) return err;
    const project = getStore().projects.get(params.id);
    if (!project) return fail("Project not found", 404);
    if (project.status !== "pending_review" && project.status !== "draft") {
      return fail("Only projects awaiting review can be approved", 400);
    }
    const admin = getStore().users.get(auth!.sub);
    if (!admin) return fail("Admin not found", 404);
    const { approveProject } = await import("./project-review");
    return ok(approveProject(project, admin), "Project approved and published");
  },

  "POST /admin/projects/:id/reject": async (req, params, auth) => {
    const err = requireRole(auth, ["admin"]);
    if (err) return err;
    const project = getStore().projects.get(params.id);
    if (!project) return fail("Project not found", 404);
    if (project.status !== "pending_review" && project.status !== "draft") {
      return fail("Only projects awaiting review can be rejected", 400);
    }
    const { reason } = await parseBody<{ reason?: string }>(req);
    const trimmed = (reason || "").trim();
    if (trimmed.length < 20) {
      return fail("Rejection reason must be at least 20 characters", 400);
    }
    const admin = getStore().users.get(auth!.sub);
    if (!admin) return fail("Admin not found", 404);
    const { rejectProject } = await import("./project-review");
    return ok(rejectProject(project, admin, trimmed), "Project rejected");
  },

  "POST /owner/projects/:id/resubmit": async (_req, params, auth) => {
    const err = requireRole(auth, ["project_owner"]);
    if (err) return err;
    const project = getStore().projects.get(params.id);
    if (!project) return fail("Project not found", 404);
    if (project.ownerId !== auth!.sub) return fail("Forbidden", 403);
    if (project.status !== "rejected" && project.status !== "draft") {
      return fail("Only rejected or draft projects can be resubmitted", 400);
    }
    const { markSubmitted } = await import("./project-review");
    const updated = markSubmitted(project, auth!.sub, "resubmitted");
    logActivity(auth!.sub, "project_resubmitted", "project", project.id);
    dispatchNotificationEvent({
      kind: "project_status_changed",
      project: updated,
      status: "pending_review",
    });
    return ok(updated, "Project resubmitted for review");
  },

  "PATCH /admin/projects/:id/status": async (req, params, auth) => {
    const err = requireRole(auth, ["admin"]);
    if (err) return err;
    const project = getStore().projects.get(params.id);
    if (!project) return fail("Project not found", 404);
    const { status, reason } = await parseBody<{
      status: Project["status"];
      reason?: string;
    }>(req);
    const admin = getStore().users.get(auth!.sub);
    if (!admin) return fail("Admin not found", 404);

    if (status === "published" || status === "rejected") {
      const { approveProject, rejectProject } = await import("./project-review");
      if (status === "published") {
        return ok(approveProject(project, admin));
      }
      const trimmed = (reason || "").trim();
      if (trimmed.length < 20) {
        return fail("Rejection reason must be at least 20 characters", 400);
      }
      return ok(rejectProject(project, admin, trimmed));
    }

    project.status = status;
    project.updatedAt = new Date().toISOString();
    getStore().projects.set(project.id, project);
    logActivity(auth!.sub, "project_status_updated", "project", project.id, { status });
    dispatchNotificationEvent({ kind: "project_status_changed", project, status });
    return ok(project);
  },

  "GET /admin/payments": async (_req, _p, auth) => {
    const err = requireRole(auth, ["admin"]);
    if (err) return err;
    return ok(Array.from(getStore().subscriptions.values()));
  },

  "GET /admin/security": async (_req, _p, auth) => {
    const err = requireRole(auth, ["admin"]);
    if (err) return err;
    return ok({
      activityLogs: getStore().activityLogs.slice(0, 100),
      flaggedMessages: Array.from(getStore().messages.values())
        .flat()
        .filter((m) => m.isFlagged)
        .slice(0, 50),
      pendingKyc: Array.from(getStore().kyc.values()).filter((k) => k?.status === "pending"),
    });
  },

  "GET /admin/complaints": async (_req, _p, auth) => {
    const err = requireRole(auth, ["admin"]);
    if (err) return err;
    return ok(getStore().complaints);
  },

  "POST /admin/complaints": async (req, _p, auth) => {
    const err = requireAuth(auth);
    if (err) return err;
    const body = await parseBody<{ subject: string; description: string; projectId?: string; againstUserId?: string }>(req);
    const complaint = {
      id: crypto.randomUUID(),
      reporterId: auth!.sub,
      againstUserId: body.againstUserId,
      projectId: body.projectId,
      subject: body.subject,
      description: body.description,
      status: "open" as const,
      createdAt: new Date().toISOString(),
    };
    getStore().complaints.push(complaint);
    dispatchNotificationEvent({ kind: "complaint_filed", complaint });
    return ok(complaint, undefined, 201);
  },

  "GET /milestones": async (req, _p, auth) => {
    const err = requireAuth(auth);
    if (err) return err;
    const { searchParams } = new URL(req.url);
    let list = Array.from(getStore().milestonePlans.values());
    if (auth!.role === "investor") list = list.filter((m) => m.investorId === auth!.sub);
    else if (auth!.role === "project_owner") list = list.filter((m) => m.ownerId === auth!.sub);
    const projectId = searchParams.get("projectId");
    if (projectId) list = list.filter((m) => m.projectId === projectId);
    const status = searchParams.get("status");
    if (status) list = list.filter((m) => m.status === status);
    list.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    return ok(list);
  },

  "GET /milestones/:id": async (_req, params, auth) => {
    const err = requireAuth(auth);
    if (err) return err;
    const plan = getStore().milestonePlans.get(params.id);
    if (!plan) return fail("Milestone plan not found", 404);
    const allowed =
      auth!.role === "admin" ||
      auth!.sub === plan.investorId ||
      auth!.sub === plan.ownerId;
    if (!allowed) return fail("Forbidden", 403);
    return ok(plan);
  },

  "POST /milestones": async (req, _p, auth) => {
    const err = requireRole(auth, ["investor"]);
    if (err) return err;
    if (!hasActiveServiceAccess(authUserObj(auth))) {
      return fail("Platform service access required", 403);
    }
    const body = await parseBody<{
      projectId: string;
      items: Array<{
        title: string;
        titleHy?: string;
        description?: string;
        descriptionHy?: string;
        amount: number;
        dueDate?: string;
      }>;
      notes?: string;
    }>(req);
    const project = getStore().projects.get(body.projectId);
    if (!project || (project.status !== "published" && project.status !== "funded")) {
      return fail("Project not available", 404);
    }
    const investor = getStore().users.get(auth!.sub)!;
    const owner = getStore().users.get(project.ownerId);
    const now = new Date().toISOString();
    const items: MilestoneItem[] = (body.items || []).map((item, idx) => ({
      id: crypto.randomUUID(),
      title: item.title,
      titleHy: item.titleHy,
      description: item.description,
      descriptionHy: item.descriptionHy,
      amount: Number(item.amount) || 0,
      dueDate: item.dueDate,
      status: "proposed" as const,
      sortOrder: idx,
    }));
    if (items.length === 0) return fail("At least one milestone item is required", 400);

    const plan: MilestonePlan = {
      id: crypto.randomUUID(),
      projectId: project.id,
      projectTitle: project.title,
      investorId: auth!.sub,
      investorName: `${investor.firstName} ${investor.lastName}`,
      ownerId: project.ownerId,
      ownerName: owner ? `${owner.firstName} ${owner.lastName}` : project.ownerName || "",
      items,
      status: "proposed",
      notes: body.notes,
      createdAt: now,
      updatedAt: now,
    };
    getStore().milestonePlans.set(plan.id, plan);
    logActivity(auth!.sub, "milestone_created", "milestone", plan.id);
    dispatchNotificationEvent({ kind: "milestone_created", plan });
    return ok(plan, "Milestone plan created", 201);
  },

  "PATCH /milestones/:id": async (req, params, auth) => {
    const err = requireRole(auth, ["investor", "project_owner", "admin"]);
    if (err) return err;
    const plan = getStore().milestonePlans.get(params.id);
    if (!plan) return fail("Milestone plan not found", 404);
    const isOwner = auth!.sub === plan.ownerId;
    const isInvestor = auth!.sub === plan.investorId;
    if (auth!.role !== "admin" && !isOwner && !isInvestor) return fail("Forbidden", 403);

    const body = await parseBody<{
      status?: MilestonePlanStatus;
      items?: MilestoneItem[];
      ownerResponse?: string;
      notes?: string;
    }>(req);

    if (body.status) plan.status = body.status;
    if (body.items) plan.items = body.items;
    if (typeof body.notes === "string") plan.notes = body.notes;
    if (typeof body.ownerResponse === "string" && (isOwner || auth!.role === "admin")) {
      plan.ownerResponse = body.ownerResponse;
    }
    plan.updatedAt = new Date().toISOString();
    getStore().milestonePlans.set(plan.id, plan);
    logActivity(auth!.sub, "milestone_updated", "milestone", plan.id, { status: plan.status });
    dispatchNotificationEvent({ kind: "milestone_updated", plan, actorId: auth!.sub });
    return ok(plan);
  },

  "POST /uploads": async (req, _p, auth) => {
    const err = requireAuth(auth);
    if (err) return err;
    const body = await parseBody<{ name?: string; size?: number; category?: string }>(req);
    const name = body.name || `upload-${Date.now()}.bin`;
    const size = typeof body.size === "number" ? body.size : 0;
    const { storeUploadedFile } = await import("./storage");
    const stored = await storeUploadedFile({
      name,
      size,
      category: body.category,
      userId: auth!.sub,
    });
    return ok(stored, "Upload accepted", 201);
  },

  "POST /contact": async (req) => {
    const body = await parseBody<{ name: string; email: string; message: string }>(req);
    if (!body.email || !body.message) return fail("Email and message required", 400);
    dispatchNotificationEvent({
      kind: "contact_form",
      name: body.name || "Visitor",
      email: body.email,
    });
    return ok(null, "Message received. Our team will respond shortly.");
  },
};

function matchRoute(method: string, path: string): { handler: Handler; params: Record<string, string> } | null {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const key = `${method} ${normalizedPath}`;
  if (handlers[key]) return { handler: handlers[key], params: {} };

  for (const pattern of Object.keys(handlers)) {
    const spaceIdx = pattern.indexOf(" ");
    const m = pattern.slice(0, spaceIdx);
    const p = pattern.slice(spaceIdx + 1);
    if (m !== method) continue;
    const patternParts = p.split("/").filter(Boolean);
    const pathParts = normalizedPath.split("/").filter(Boolean);
    if (patternParts.length !== pathParts.length) continue;
    const params: Record<string, string> = {};
    let match = true;
    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i].startsWith(":")) {
        params[patternParts[i].slice(1)] = pathParts[i];
      } else if (patternParts[i] !== pathParts[i]) {
        match = false;
        break;
      }
    }
    if (match) return { handler: handlers[pattern], params };
  }
  return null;
}

export async function handleApiRequest(req: NextRequest, pathSegments: string[]) {
  const path = pathSegments.join("/");
  const method = req.method;
  const matched = matchRoute(method, path);

  if (!matched) {
    return fail(`Endpoint not found: ${method} /${path}`, 404);
  }

  const auth = await getAuth(req);

  if (path === "admin" || path.startsWith("admin/")) {
    if (!auth) return fail("Unauthorized", 401);
    if (auth.role !== "admin") return fail("Forbidden", 403);
  }

  return matched.handler(req, matched.params, auth);
}
