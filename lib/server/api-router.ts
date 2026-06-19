import { NextRequest, NextResponse } from "next/server";
import type { ApiResponse } from "@/types";
import {
  getStore,
  sanitizeUser,
  paginate,
  getChartData,
  getAdminStats,
  getDashboardStats,
  type StoredUser,
} from "./store";

type Handler = (
  req: NextRequest,
  params: Record<string, string>,
  userId: string | null
) => Promise<NextResponse>;

function ok<T>(data: T, message?: string, status = 200) {
  const body: ApiResponse<T> = { success: true, data, message };
  return NextResponse.json(body, { status });
}

function fail(message: string, status = 400) {
  const body: ApiResponse<null> = { success: false, data: null, message };
  return NextResponse.json(body, { status });
}

function getUserId(req: NextRequest): string | null {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  const token = auth.slice(7);
  return getStore().sessions.get(token) ?? null;
}

function createTokens(userId: string) {
  const accessToken = `access_${userId}_${crypto.randomUUID()}`;
  const refreshToken = `refresh_${userId}_${crypto.randomUUID()}`;
  const store = getStore();
  store.sessions.set(accessToken, userId);
  store.refreshTokens.set(refreshToken, userId);
  return { accessToken, refreshToken };
}

function findUserByEmail(email: string): StoredUser | undefined {
  for (const user of getStore().users.values()) {
    if (user.email.toLowerCase() === email.toLowerCase()) return user;
  }
  return undefined;
}

async function parseBody<T>(req: NextRequest): Promise<T> {
  return req.json() as Promise<T>;
}

const handlers: Record<string, Handler> = {
  "POST /auth/login": async (req) => {
    const { email, password } = await parseBody<{ email: string; password: string }>(req);
    const user = findUserByEmail(email);
    if (!user || user.password !== password) {
      return fail("Invalid email or password", 401);
    }
    const tokens = createTokens(user.id);
    return ok({ user: sanitizeUser(user), tokens });
  },

  "POST /auth/register": async (req) => {
    const body = await parseBody<{
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      phone?: string;
    }>(req);
    if (findUserByEmail(body.email)) {
      return fail("Email already registered", 409);
    }
    const store = getStore();
    const user: StoredUser = {
      id: crypto.randomUUID(),
      email: body.email,
      password: body.password,
      firstName: body.firstName,
      lastName: body.lastName,
      phone: body.phone,
      role: "user",
      isEmailVerified: false,
      is2faEnabled: false,
      kycStatus: "not_submitted",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    store.users.set(user.id, user);
    store.wallets.set(user.id, {
      id: crypto.randomUUID(),
      userId: user.id,
      availableBalance: 0,
      pendingBalance: 0,
      totalBalance: 0,
      currency: "USD",
      updatedAt: new Date().toISOString(),
    });
    const tokens = createTokens(user.id);
    return ok({ user: sanitizeUser(user), tokens }, undefined, 201);
  },

  "POST /auth/logout": async () => ok(null),

  "POST /auth/refresh": async (req) => {
    const { refreshToken } = await parseBody<{ refreshToken: string }>(req);
    const userId = getStore().refreshTokens.get(refreshToken);
    if (!userId) return fail("Invalid refresh token", 401);
    return ok(createTokens(userId));
  },

  "GET /auth/me": async (_req, _params, userId) => {
    if (!userId) return fail("Unauthorized", 401);
    const user = getStore().users.get(userId);
    if (!user) return fail("User not found", 404);
    return ok(sanitizeUser(user));
  },

  "POST /auth/forgot-password": async () =>
    ok(null, "If that email exists, a reset link has been sent"),

  "POST /auth/verify-email": async () => ok(null, "Email verified"),

  "POST /auth/verify-2fa": async (req) => {
    const { code, tempToken } = await parseBody<{ code: string; tempToken?: string }>(req);
    const userId = tempToken ? getStore().sessions.get(tempToken) : null;
    if (!userId || code.length !== 6) return fail("Invalid 2FA code", 401);
    const user = getStore().users.get(userId);
    if (!user) return fail("User not found", 404);
    const tokens = createTokens(userId);
    return ok({ user: sanitizeUser(user), tokens });
  },

  "GET /dashboard/stats": async (_req, _params, userId) => {
    if (!userId) return fail("Unauthorized", 401);
    return ok(getDashboardStats(userId));
  },

  "GET /dashboard/portfolio": async () => ok(getChartData(12000)),
  "GET /dashboard/profit-history": async () => ok(getChartData(2000)),
  "GET /dashboard/investment-growth": async () => ok(getChartData(8000)),

  "GET /wallet": async (_req, _params, userId) => {
    if (!userId) return fail("Unauthorized", 401);
    const wallet = getStore().wallets.get(userId);
    if (!wallet) return fail("Wallet not found", 404);
    return ok(wallet);
  },

  "GET /wallet/crypto-addresses": async (_req, _params, userId) => {
    if (!userId) return fail("Unauthorized", 401);
    const store = getStore();
    return ok(store.cryptoAddresses.get(userId) ?? []);
  },

  "POST /wallet/crypto-addresses": async (req, _params, userId) => {
    if (!userId) return fail("Unauthorized", 401);
    const { currency } = await parseBody<{ currency: string }>(req);
    const store = getStore();
    const addresses = store.cryptoAddresses.get(userId) ?? [];
    const address = {
      id: crypto.randomUUID(),
      currency: currency as "BTC",
      address: `0x${crypto.randomUUID().replace(/-/g, "").slice(0, 40)}`,
      network: currency === "BTC" ? "Bitcoin" : "Ethereum",
    };
    addresses.push(address);
    store.cryptoAddresses.set(userId, addresses);
    return ok(address, undefined, 201);
  },

  "GET /projects": async (req) => {
    const { searchParams } = new URL(req.url);
    let projects = getStore().projects;
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    if (search) {
      const q = search.toLowerCase();
      projects = projects.filter(
        (p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }
    if (category) projects = projects.filter((p) => p.category === category);
    if (status) projects = projects.filter((p) => p.status === status);
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);
    return ok(paginate(projects, page, limit));
  },

  "GET /projects/:id": async (_req, params) => {
    const project = getStore().projects.find((p) => p.id === params.id);
    if (!project) return fail("Project not found", 404);
    return ok(project);
  },

  "GET /projects/:id/plans": async (_req, params) => {
    const project = getStore().projects.find((p) => p.id === params.id);
    if (!project) return fail("Project not found", 404);
    return ok([
      {
        id: "plan-1",
        projectId: params.id,
        name: "Standard Plan",
        minAmount: project.minInvestment,
        maxAmount: project.maxInvestment,
        roiPercentage: project.roiPercentage,
        duration: project.investmentPeriod,
        description: "Standard investment plan with fixed returns.",
      },
    ]);
  },

  "GET /transactions/recent": async (req, _params, userId) => {
    if (!userId) return fail("Unauthorized", 401);
    const limit = Number(new URL(req.url).searchParams.get("limit") || 5);
    const txs = getStore().transactions.get(userId) ?? [];
    return ok(txs.slice(0, limit));
  },

  "GET /transactions": async (req, _params, userId) => {
    if (!userId) return fail("Unauthorized", 401);
    const { searchParams } = new URL(req.url);
    let txs = getStore().transactions.get(userId) ?? [];
    const type = searchParams.get("type");
    const status = searchParams.get("status");
    if (type) txs = txs.filter((t) => t.type === type);
    if (status) txs = txs.filter((t) => t.status === status);
    return ok(paginate(txs, Number(searchParams.get("page") || 1), Number(searchParams.get("limit") || 10)));
  },

  "GET /notifications/unread-count": async (_req, _params, userId) => {
    if (!userId) return fail("Unauthorized", 401);
    const notifs = getStore().notifications.get(userId) ?? [];
    return ok({ count: notifs.filter((n) => !n.isRead).length });
  },

  "GET /notifications": async (req, _params, userId) => {
    if (!userId) return fail("Unauthorized", 401);
    const { searchParams } = new URL(req.url);
    const notifs = getStore().notifications.get(userId) ?? [];
    return ok(paginate(notifs, Number(searchParams.get("page") || 1), Number(searchParams.get("limit") || 50)));
  },

  "POST /notifications/read-all": async (_req, _params, userId) => {
    if (!userId) return fail("Unauthorized", 401);
    const store = getStore();
    const notifs = (store.notifications.get(userId) ?? []).map((n) => ({ ...n, isRead: true }));
    store.notifications.set(userId, notifs);
    return ok(null);
  },

  "GET /kyc/status": async (_req, _params, userId) => {
    if (!userId) return fail("Unauthorized", 401);
    return ok(getStore().kyc.get(userId) ?? null);
  },

  "GET /investments/active": async (req, _params, userId) => {
    if (!userId) return fail("Unauthorized", 401);
    const invs = (getStore().investments.get(userId) ?? []).filter((i) => i.status === "active");
    const { searchParams } = new URL(req.url);
    return ok(paginate(invs, Number(searchParams.get("page") || 1), Number(searchParams.get("limit") || 10)));
  },

  "GET /investments/completed": async (req, _params, userId) => {
    if (!userId) return fail("Unauthorized", 401);
    const invs = (getStore().investments.get(userId) ?? []).filter((i) => i.status === "completed");
    const { searchParams } = new URL(req.url);
    return ok(paginate(invs, Number(searchParams.get("page") || 1), Number(searchParams.get("limit") || 10)));
  },

  "GET /investments": async (req, _params, userId) => {
    if (!userId) return fail("Unauthorized", 401);
    const invs = getStore().investments.get(userId) ?? [];
    const { searchParams } = new URL(req.url);
    return ok(paginate(invs, Number(searchParams.get("page") || 1), Number(searchParams.get("limit") || 10)));
  },

  "POST /investments": async (req, _params, userId) => {
    if (!userId) return fail("Unauthorized", 401);
    const body = await parseBody<{ projectId: string; amount: number }>(req);
    const project = getStore().projects.find((p) => p.id === body.projectId);
    if (!project) return fail("Project not found", 404);
    const expectedReturn = body.amount * (project.roiPercentage / 100);
    const investment = {
      id: crypto.randomUUID(),
      userId,
      projectId: body.projectId,
      project,
      amount: body.amount,
      expectedReturn,
      currentReturn: 0,
      roiPercentage: project.roiPercentage,
      status: "active" as const,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + project.investmentPeriod * 86400000).toISOString(),
      createdAt: new Date().toISOString(),
    };
    const store = getStore();
    const invs = store.investments.get(userId) ?? [];
    invs.push(investment);
    store.investments.set(userId, invs);
    return ok(investment, undefined, 201);
  },

  "POST /deposits": async (req, _params, userId) => {
    if (!userId) return fail("Unauthorized", 401);
    const body = await parseBody<{ amount: number; paymentMethod: string }>(req);
    const deposit = {
      id: crypto.randomUUID(),
      userId,
      amount: body.amount,
      currency: "USD",
      paymentMethod: body.paymentMethod as "mastercard",
      status: "pending" as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const store = getStore();
    const deps = store.deposits.get(userId) ?? [];
    deps.unshift(deposit);
    store.deposits.set(userId, deps);
    return ok(deposit, undefined, 201);
  },

  "GET /deposits/history": async (req, _params, userId) => {
    if (!userId) return fail("Unauthorized", 401);
    const deps = getStore().deposits.get(userId) ?? [];
    const { searchParams } = new URL(req.url);
    return ok(paginate(deps, Number(searchParams.get("page") || 1), Number(searchParams.get("limit") || 10)));
  },

  "POST /withdrawals": async (req, _params, userId) => {
    if (!userId) return fail("Unauthorized", 401);
    const body = await parseBody<{ amount: number; paymentMethod: string }>(req);
    const withdrawal = {
      id: crypto.randomUUID(),
      userId,
      amount: body.amount,
      currency: "USD",
      paymentMethod: body.paymentMethod as "mastercard",
      status: "pending" as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const store = getStore();
    const wds = store.withdrawals.get(userId) ?? [];
    wds.unshift(withdrawal);
    store.withdrawals.set(userId, wds);
    return ok(withdrawal, undefined, 201);
  },

  "GET /withdrawals/history": async (req, _params, userId) => {
    if (!userId) return fail("Unauthorized", 401);
    const wds = getStore().withdrawals.get(userId) ?? [];
    const { searchParams } = new URL(req.url);
    return ok(paginate(wds, Number(searchParams.get("page") || 1), Number(searchParams.get("limit") || 10)));
  },

  "GET /users/profile": async (_req, _params, userId) => {
    if (!userId) return fail("Unauthorized", 401);
    const user = getStore().users.get(userId);
    if (!user) return fail("User not found", 404);
    return ok(sanitizeUser(user));
  },

  "PATCH /users/profile": async (req, _params, userId) => {
    if (!userId) return fail("Unauthorized", 401);
    const body = await parseBody<Partial<StoredUser>>(req);
    const store = getStore();
    const user = store.users.get(userId);
    if (!user) return fail("User not found", 404);
    const updated = { ...user, ...body, id: user.id, email: user.email, updatedAt: new Date().toISOString() };
    store.users.set(userId, updated);
    return ok(sanitizeUser(updated));
  },

  "GET /admin/stats": async (_req, _params, userId) => {
    if (!userId) return fail("Unauthorized", 401);
    const user = getStore().users.get(userId);
    if (user?.role !== "admin") return fail("Forbidden", 403);
    return ok(getAdminStats());
  },

  "GET /admin/analytics": async (_req, _params, userId) => {
    if (!userId) return fail("Unauthorized", 401);
    const user = getStore().users.get(userId);
    if (user?.role !== "admin") return fail("Forbidden", 403);
    return ok({
      deposits: getChartData(50000),
      withdrawals: getChartData(20000),
      investments: getChartData(80000),
      users: getChartData(100),
    });
  },

  "GET /admin/users": async (req, _params, userId) => {
    if (!userId) return fail("Unauthorized", 401);
    const user = getStore().users.get(userId);
    if (user?.role !== "admin") return fail("Forbidden", 403);
    const users = Array.from(getStore().users.values()).map(sanitizeUser);
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.toLowerCase();
    const filtered = search
      ? users.filter((u) => u.email.includes(search) || u.firstName.toLowerCase().includes(search))
      : users;
    return ok(paginate(filtered, Number(searchParams.get("page") || 1), Number(searchParams.get("limit") || 10)));
  },

  "GET /admin/deposits/pending": async (req, _params, userId) => {
    if (!userId) return fail("Unauthorized", 401);
    if (getStore().users.get(userId)?.role !== "admin") return fail("Forbidden", 403);
    const all: import("@/types").Deposit[] = [];
    getStore().deposits.forEach((deps) => all.push(...deps.filter((d) => d.status === "pending")));
    const { searchParams } = new URL(req.url);
    return ok(paginate(all, Number(searchParams.get("page") || 1), Number(searchParams.get("limit") || 10)));
  },

  "GET /admin/withdrawals/pending": async (req, _params, userId) => {
    if (!userId) return fail("Unauthorized", 401);
    if (getStore().users.get(userId)?.role !== "admin") return fail("Forbidden", 403);
    const all: import("@/types").Withdrawal[] = [];
    getStore().withdrawals.forEach((wds) => all.push(...wds.filter((w) => w.status === "pending")));
    const { searchParams } = new URL(req.url);
    return ok(paginate(all, Number(searchParams.get("page") || 1), Number(searchParams.get("limit") || 10)));
  },

  "GET /admin/kyc": async (req, _params, userId) => {
    if (!userId) return fail("Unauthorized", 401);
    if (getStore().users.get(userId)?.role !== "admin") return fail("Forbidden", 403);
    const all: import("@/types").KycSubmission[] = [];
    getStore().kyc.forEach((k) => { if (k) all.push(k); });
    const { searchParams } = new URL(req.url);
    return ok(paginate(all, Number(searchParams.get("page") || 1), Number(searchParams.get("limit") || 10)));
  },

  "GET /admin/settings": async (_req, _params, userId) => {
    if (!userId) return fail("Unauthorized", 401);
    if (getStore().users.get(userId)?.role !== "admin") return fail("Forbidden", 403);
    return ok({ platformName: "InvestPro", supportEmail: "support@investpro.com", minDeposit: 10, maintenanceMode: false, kycRequired: false });
  },

  "PATCH /admin/settings": async (req, _params, userId) => {
    if (!userId) return fail("Unauthorized", 401);
    if (getStore().users.get(userId)?.role !== "admin") return fail("Forbidden", 403);
    const body = await parseBody<Record<string, unknown>>(req);
    return ok(body);
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

  const userId = getUserId(req);
  return matched.handler(req, matched.params, userId);
}
