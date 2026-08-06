import { NextRequest, NextResponse } from "next/server";
import type { ApiResponse } from "@/types";
import {
  getStore,
  sanitizeUser,
  paginate,
  getChartData,
  getAdminStats,
  getDashboardStats,
  getWalletForUser,
  type StoredUser,
} from "./store";
import {
  createTokenPair,
  verifyAccessToken,
  verifyRefreshToken,
  payloadToUser,
  type TokenPayload,
} from "./jwt";

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
  const body: ApiResponse<null> = { success: false, data: null, message };
  return NextResponse.json(body, { status });
}

async function getAuth(req: NextRequest): Promise<TokenPayload | null> {
  const header = req.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return null;
  return verifyAccessToken(header.slice(7));
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
    const tokens = await createTokenPair(sanitizeUser(user));
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
    const tokens = await createTokenPair(sanitizeUser(user));
    return ok({ user: sanitizeUser(user), tokens }, undefined, 201);
  },

  "POST /auth/logout": async () => ok(null),

  "POST /auth/refresh": async (req) => {
    const { refreshToken } = await parseBody<{ refreshToken: string }>(req);
    const payload = await verifyRefreshToken(refreshToken);
    if (!payload) return fail("Invalid refresh token", 401);
    const stored = getStore().users.get(payload.sub);
    const user = stored ? sanitizeUser(stored) : payloadToUser(payload);
    return ok(await createTokenPair(user));
  },

  "GET /auth/me": async (req) => {
    const auth = await getAuth(req);
    if (!auth) return fail("Unauthorized", 401);
    const stored = getStore().users.get(auth.sub);
    if (stored) return ok(sanitizeUser(stored));
    return ok(payloadToUser(auth));
  },

  "POST /auth/forgot-password": async () =>
    ok(null, "If that email exists, a reset link has been sent"),

  "POST /auth/verify-email": async () => ok(null, "Email verified"),

  "POST /auth/verify-2fa": async (req) => {
    const { code } = await parseBody<{ code: string; tempToken?: string }>(req);
    if (code.length !== 6) return fail("Invalid 2FA code", 401);
    return fail("2FA not enabled in demo mode", 400);
  },

  "GET /dashboard/stats": async (_req, _params, auth) => {
    if (!auth) return fail("Unauthorized", 401);
    return ok(getDashboardStats(auth.sub));
  },

  "GET /dashboard/portfolio": async () => ok(getChartData(12000)),
  "GET /dashboard/profit-history": async () => ok(getChartData(2000)),
  "GET /dashboard/investment-growth": async () => ok(getChartData(8000)),

  "GET /wallet": async (_req, _params, auth) => {
    if (!auth) return fail("Unauthorized", 401);
    return ok(getWalletForUser(auth.sub));
  },

  "GET /wallet/crypto-addresses": async (_req, _params, auth) => {
    if (!auth) return fail("Unauthorized", 401);
    const store = getStore();
    return ok(store.cryptoAddresses.get(auth.sub) ?? []);
  },

  "POST /wallet/crypto-addresses": async (req, _params, auth) => {
    if (!auth) return fail("Unauthorized", 401);
    const { currency } = await parseBody<{ currency: string }>(req);
    const store = getStore();
    const addresses = store.cryptoAddresses.get(auth.sub) ?? [];
    const address = {
      id: crypto.randomUUID(),
      currency: currency as "BTC",
      address: `0x${crypto.randomUUID().replace(/-/g, "").slice(0, 40)}`,
      network: currency === "BTC" ? "Bitcoin" : "Ethereum",
    };
    addresses.push(address);
    store.cryptoAddresses.set(auth.sub, addresses);
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

  "GET /transactions/recent": async (req, _params, auth) => {
    if (!auth) return fail("Unauthorized", 401);
    const limit = Number(new URL(req.url).searchParams.get("limit") || 5);
    const txs = getStore().transactions.get(auth.sub) ?? [];
    return ok(txs.slice(0, limit));
  },

  "GET /transactions": async (req, _params, auth) => {
    if (!auth) return fail("Unauthorized", 401);
    const { searchParams } = new URL(req.url);
    let txs = getStore().transactions.get(auth.sub) ?? [];
    const type = searchParams.get("type");
    const status = searchParams.get("status");
    if (type) txs = txs.filter((t) => t.type === type);
    if (status) txs = txs.filter((t) => t.status === status);
    return ok(paginate(txs, Number(searchParams.get("page") || 1), Number(searchParams.get("limit") || 10)));
  },

  "GET /notifications/unread-count": async (_req, _params, auth) => {
    if (!auth) return fail("Unauthorized", 401);
    const notifs = getStore().notifications.get(auth.sub) ?? [];
    return ok({ count: notifs.filter((n) => !n.isRead).length });
  },

  "GET /notifications": async (req, _params, auth) => {
    if (!auth) return fail("Unauthorized", 401);
    const { searchParams } = new URL(req.url);
    const notifs = getStore().notifications.get(auth.sub) ?? [];
    return ok(paginate(notifs, Number(searchParams.get("page") || 1), Number(searchParams.get("limit") || 50)));
  },

  "POST /notifications/read-all": async (_req, _params, auth) => {
    if (!auth) return fail("Unauthorized", 401);
    const store = getStore();
    const notifs = (store.notifications.get(auth.sub) ?? []).map((n) => ({ ...n, isRead: true }));
    store.notifications.set(auth.sub, notifs);
    return ok(null);
  },

  "GET /kyc/status": async (_req, _params, auth) => {
    if (!auth) return fail("Unauthorized", 401);
    return ok(getStore().kyc.get(auth.sub) ?? null);
  },

  "GET /investments/active": async (req, _params, auth) => {
    if (!auth) return fail("Unauthorized", 401);
    const invs = (getStore().investments.get(auth.sub) ?? []).filter((i) => i.status === "active");
    const { searchParams } = new URL(req.url);
    return ok(paginate(invs, Number(searchParams.get("page") || 1), Number(searchParams.get("limit") || 10)));
  },

  "GET /investments/completed": async (req, _params, auth) => {
    if (!auth) return fail("Unauthorized", 401);
    const invs = (getStore().investments.get(auth.sub) ?? []).filter((i) => i.status === "completed");
    const { searchParams } = new URL(req.url);
    return ok(paginate(invs, Number(searchParams.get("page") || 1), Number(searchParams.get("limit") || 10)));
  },

  "GET /investments": async (req, _params, auth) => {
    if (!auth) return fail("Unauthorized", 401);
    const invs = getStore().investments.get(auth.sub) ?? [];
    const { searchParams } = new URL(req.url);
    return ok(paginate(invs, Number(searchParams.get("page") || 1), Number(searchParams.get("limit") || 10)));
  },

  "POST /investments": async (req, _params, auth) => {
    if (!auth) return fail("Unauthorized", 401);
    const body = await parseBody<{ projectId: string; amount: number }>(req);
    const project = getStore().projects.find((p) => p.id === body.projectId);
    if (!project) return fail("Project not found", 404);
    const expectedReturn = body.amount * (project.roiPercentage / 100);
    const investment = {
      id: crypto.randomUUID(),
      userId: auth.sub,
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
    const invs = store.investments.get(auth.sub) ?? [];
    invs.push(investment);
    store.investments.set(auth.sub, invs);
    return ok(investment, undefined, 201);
  },

  "POST /deposits": async (req, _params, auth) => {
    if (!auth) return fail("Unauthorized", 401);
    const body = await parseBody<{ amount: number; paymentMethod: string }>(req);
    const deposit = {
      id: crypto.randomUUID(),
      userId: auth.sub,
      amount: body.amount,
      currency: "USD",
      paymentMethod: body.paymentMethod as "mastercard",
      status: "pending" as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const store = getStore();
    const deps = store.deposits.get(auth.sub) ?? [];
    deps.unshift(deposit);
    store.deposits.set(auth.sub, deps);
    return ok(deposit, undefined, 201);
  },

  "GET /deposits/history": async (req, _params, auth) => {
    if (!auth) return fail("Unauthorized", 401);
    const deps = getStore().deposits.get(auth.sub) ?? [];
    const { searchParams } = new URL(req.url);
    return ok(paginate(deps, Number(searchParams.get("page") || 1), Number(searchParams.get("limit") || 10)));
  },

  "POST /withdrawals": async (req, _params, auth) => {
    if (!auth) return fail("Unauthorized", 401);
    const body = await parseBody<{ amount: number; paymentMethod: string }>(req);
    const withdrawal = {
      id: crypto.randomUUID(),
      userId: auth.sub,
      amount: body.amount,
      currency: "USD",
      paymentMethod: body.paymentMethod as "mastercard",
      status: "pending" as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const store = getStore();
    const wds = store.withdrawals.get(auth.sub) ?? [];
    wds.unshift(withdrawal);
    store.withdrawals.set(auth.sub, wds);
    return ok(withdrawal, undefined, 201);
  },

  "GET /withdrawals/history": async (req, _params, auth) => {
    if (!auth) return fail("Unauthorized", 401);
    const wds = getStore().withdrawals.get(auth.sub) ?? [];
    const { searchParams } = new URL(req.url);
    return ok(paginate(wds, Number(searchParams.get("page") || 1), Number(searchParams.get("limit") || 10)));
  },

  "GET /users/profile": async (_req, _params, auth) => {
    if (!auth) return fail("Unauthorized", 401);
    const user = getStore().users.get(auth.sub);
    if (user) return ok(sanitizeUser(user));
    return ok(payloadToUser(auth));
  },

  "PATCH /users/profile": async (req, _params, auth) => {
    if (!auth) return fail("Unauthorized", 401);
    const body = await parseBody<Partial<StoredUser>>(req);
    const store = getStore();
    const user = store.users.get(auth.sub);
    if (!user) return fail("User not found", 404);
    const updated = { ...user, ...body, id: user.id, email: user.email, updatedAt: new Date().toISOString() };
    store.users.set(auth.sub, updated);
    return ok(sanitizeUser(updated));
  },

  "GET /admin/stats": async (_req, _params, auth) => {
    if (!auth) return fail("Unauthorized", 401);
    if (auth.role !== "admin") return fail("Forbidden", 403);
    return ok(getAdminStats());
  },

  "GET /admin/analytics": async (_req, _params, auth) => {
    if (!auth) return fail("Unauthorized", 401);
    if (auth.role !== "admin") return fail("Forbidden", 403);
    return ok({
      deposits: getChartData(50000),
      withdrawals: getChartData(20000),
      investments: getChartData(80000),
      users: getChartData(100),
    });
  },

  "GET /admin/users": async (req, _params, auth) => {
    if (!auth) return fail("Unauthorized", 401);
    if (auth.role !== "admin") return fail("Forbidden", 403);
    const users = Array.from(getStore().users.values()).map(sanitizeUser);
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.toLowerCase();
    const filtered = search
      ? users.filter((u) => u.email.includes(search) || u.firstName.toLowerCase().includes(search))
      : users;
    return ok(paginate(filtered, Number(searchParams.get("page") || 1), Number(searchParams.get("limit") || 10)));
  },

  "GET /admin/users/:id": async (_req, params, auth) => {
    if (!auth) return fail("Unauthorized", 401);
    const user = getStore().users.get(params.id);
    if (!user) return fail("User not found", 404);
    return ok(sanitizeUser(user));
  },

  "PATCH /admin/users/:id": async (req, params, auth) => {
    if (!auth) return fail("Unauthorized", 401);
    const user = getStore().users.get(params.id);
    if (!user) return fail("User not found", 404);
    const body = await parseBody<Partial<StoredUser>>(req);
    if (body.role && body.role !== "admin" && body.role !== "user") {
      return fail("Invalid role", 400);
    }
    if (body.role && params.id === auth.sub && body.role !== "admin") {
      return fail("You cannot remove your own admin role", 400);
    }
    const updated: StoredUser = {
      ...user,
      firstName: body.firstName ?? user.firstName,
      lastName: body.lastName ?? user.lastName,
      phone: body.phone ?? user.phone,
      role: body.role ?? user.role,
      updatedAt: new Date().toISOString(),
    };
    getStore().users.set(params.id, updated);
    return ok(sanitizeUser(updated));
  },

  "PATCH /admin/users/:id/role": async (req, params, auth) => {
    if (!auth) return fail("Unauthorized", 401);
    const user = getStore().users.get(params.id);
    if (!user) return fail("User not found", 404);
    const { role } = await parseBody<{ role: string }>(req);
    if (role !== "admin" && role !== "user") {
      return fail("Invalid role. Must be 'admin' or 'user'", 400);
    }
    if (params.id === auth.sub && role !== "admin") {
      return fail("You cannot remove your own admin role", 400);
    }
    const updated: StoredUser = { ...user, role, updatedAt: new Date().toISOString() };
    getStore().users.set(params.id, updated);
    return ok(sanitizeUser(updated));
  },

  "GET /admin/deposits/pending": async (req, _params, auth) => {
    if (!auth) return fail("Unauthorized", 401);
    if (auth.role !== "admin") return fail("Forbidden", 403);
    const all: import("@/types").Deposit[] = [];
    getStore().deposits.forEach((deps) => all.push(...deps.filter((d) => d.status === "pending")));
    const { searchParams } = new URL(req.url);
    return ok(paginate(all, Number(searchParams.get("page") || 1), Number(searchParams.get("limit") || 10)));
  },

  "GET /admin/withdrawals/pending": async (req, _params, auth) => {
    if (!auth) return fail("Unauthorized", 401);
    if (auth.role !== "admin") return fail("Forbidden", 403);
    const all: import("@/types").Withdrawal[] = [];
    getStore().withdrawals.forEach((wds) => all.push(...wds.filter((w) => w.status === "pending")));
    const { searchParams } = new URL(req.url);
    return ok(paginate(all, Number(searchParams.get("page") || 1), Number(searchParams.get("limit") || 10)));
  },

  "GET /admin/kyc": async (req, _params, auth) => {
    if (!auth) return fail("Unauthorized", 401);
    if (auth.role !== "admin") return fail("Forbidden", 403);
    const all: import("@/types").KycSubmission[] = [];
    getStore().kyc.forEach((k) => { if (k) all.push(k); });
    const { searchParams } = new URL(req.url);
    return ok(paginate(all, Number(searchParams.get("page") || 1), Number(searchParams.get("limit") || 10)));
  },

  "GET /admin/settings": async (_req, _params, auth) => {
    if (!auth) return fail("Unauthorized", 401);
    if (auth.role !== "admin") return fail("Forbidden", 403);
    return ok({ platformName: "InvestPro", supportEmail: "support@investpro.com", minDeposit: 10, maintenanceMode: false, kycRequired: false });
  },

  "PATCH /admin/settings": async (req, _params, auth) => {
    if (!auth) return fail("Unauthorized", 401);
    if (auth.role !== "admin") return fail("Forbidden", 403);
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

  const auth = await getAuth(req);

  // Central RBAC guard: every /admin/* endpoint requires the admin role,
  // regardless of per-handler checks.
  if (path === "admin" || path.startsWith("admin/")) {
    if (!auth) return fail("Unauthorized", 401);
    if (auth.role !== "admin") return fail("Forbidden", 403);
  }

  return matched.handler(req, matched.params, auth);
}
