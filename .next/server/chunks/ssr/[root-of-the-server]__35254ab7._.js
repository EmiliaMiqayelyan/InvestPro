module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/components/providers/query-provider.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "QueryProvider",
    ()=>QueryProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/query-core/build/modern/queryClient.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2d$devtools$2f$build$2f$modern$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query-devtools/build/modern/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
function QueryProvider({ children }) {
    const [queryClient] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["QueryClient"]({
            defaultOptions: {
                queries: {
                    staleTime: 60 * 1000,
                    retry: 1,
                    refetchOnWindowFocus: false
                }
            }
        }));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["QueryClientProvider"], {
        client: queryClient,
        children: [
            children,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2d$devtools$2f$build$2f$modern$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ReactQueryDevtools"], {
                initialIsOpen: false
            }, void 0, false, {
                fileName: "[project]/components/providers/query-provider.tsx",
                lineNumber: 24,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/providers/query-provider.tsx",
        lineNumber: 22,
        columnNumber: 5
    }, this);
}
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/net [external] (net, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}),
"[externals]/tls [external] (tls, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tls", () => require("tls"));

module.exports = mod;
}),
"[externals]/assert [external] (assert, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("assert", () => require("assert"));

module.exports = mod;
}),
"[externals]/tty [external] (tty, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tty", () => require("tty"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/http2 [external] (http2, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http2", () => require("http2"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[project]/constants/index.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "API_BASE_URL",
    ()=>API_BASE_URL,
    "CONTACT_BLOCKED_PATTERNS",
    ()=>CONTACT_BLOCKED_PATTERNS,
    "DEFAULT_PAGE_SIZE",
    ()=>DEFAULT_PAGE_SIZE,
    "DOCUMENT_CATEGORIES",
    ()=>DOCUMENT_CATEGORIES,
    "MEMBERSHIP_FEATURES",
    ()=>MEMBERSHIP_FEATURES,
    "PLATFORM_NAME",
    ()=>PLATFORM_NAME,
    "PROJECT_CATEGORIES",
    ()=>PROJECT_CATEGORIES,
    "PROJECT_INDUSTRIES",
    ()=>PROJECT_INDUSTRIES,
    "PROJECT_STAGES",
    ()=>PROJECT_STAGES,
    "QUERY_KEYS",
    ()=>QUERY_KEYS,
    "RISK_LEVELS",
    ()=>RISK_LEVELS,
    "ROUTES",
    ()=>ROUTES,
    "STATUS_COLORS",
    ()=>STATUS_COLORS,
    "TEAM_ROLES",
    ()=>TEAM_ROLES
]);
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || (("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/api/v1` : "/api/v1");
const PLATFORM_NAME = "InvestPro";
const ROUTES = {
    HOME: "/",
    ABOUT: "/about",
    CONTACT: "/contact",
    MEMBERSHIP: "/membership",
    PROJECTS: "/projects",
    LOGIN: "/login",
    REGISTER: "/register",
    FORGOT_PASSWORD: "/forgot-password",
    VERIFY_EMAIL: "/verify-email",
    TWO_FACTOR: "/two-factor",
    // Investor
    INVESTOR_DASHBOARD: "/investor/dashboard",
    INVESTOR_INVESTMENTS: "/investor/investments",
    INVESTOR_SAVED: "/investor/saved",
    INVESTOR_MESSAGES: "/investor/messages",
    INVESTOR_PROFILE: "/investor/profile",
    INVESTOR_KYC: "/investor/kyc",
    INVESTOR_SECURITY: "/investor/security",
    INVESTOR_MILESTONES: "/investor/milestones",
    INVESTOR_PROJECTS: "/investor/projects",
    INVESTOR_MEMBERSHIP: "/investor/membership",
    MESSAGES: "/messages",
    // Owner
    OWNER_DASHBOARD: "/owner/dashboard",
    OWNER_PROJECTS: "/owner/projects",
    OWNER_PROJECT_CREATE: "/owner/projects/create",
    OWNER_PROJECT_EDIT: "/owner/projects",
    OWNER_MESSAGES: "/owner/messages",
    OWNER_DOCUMENTS: "/owner/documents",
    OWNER_OFFERS: "/owner/offers",
    OWNER_MILESTONES: "/owner/milestones",
    OWNER_ANALYTICS: "/owner/analytics",
    OWNER_TEAM: "/owner/team",
    OWNER_PROFILE: "/owner/profile",
    // Admin
    ADMIN: "/admin/dashboard",
    ADMIN_DASHBOARD: "/admin/dashboard",
    ADMIN_USERS: "/admin/users",
    ADMIN_PROJECTS: "/admin/projects",
    ADMIN_PROJECT_REVIEW: "/admin/projects",
    ADMIN_PAYMENTS: "/admin/payments",
    ADMIN_SECURITY: "/admin/security",
    ADMIN_MEMBERSHIPS: "/admin/memberships",
    ADMIN_COMPLAINTS: "/admin/complaints",
    ADMIN_SETTINGS: "/admin/settings",
    // Legacy aliases (redirect targets)
    DASHBOARD: "/investor/dashboard",
    PROFILE: "/investor/profile",
    SECURITY: "/investor/security",
    KYC: "/investor/kyc",
    INVESTMENTS: "/investor/investments"
};
const PROJECT_CATEGORIES = [
    "Technology",
    "FinTech",
    "Healthcare",
    "Clean Energy",
    "Real Estate",
    "Agriculture",
    "E-Commerce",
    "AI & ML",
    "Infrastructure",
    "Other"
];
const PROJECT_INDUSTRIES = [
    "Software",
    "Biotechnology",
    "Renewable Energy",
    "Financial Services",
    "Manufacturing",
    "Consumer Goods",
    "Education",
    "Logistics",
    "Media",
    "Other"
];
const PROJECT_STAGES = [
    {
        value: "idea",
        label: "Idea"
    },
    {
        value: "mvp",
        label: "MVP"
    },
    {
        value: "early_revenue",
        label: "Early Revenue"
    },
    {
        value: "growth",
        label: "Growth"
    },
    {
        value: "expansion",
        label: "Expansion"
    }
];
const DOCUMENT_CATEGORIES = [
    {
        value: "business_plan",
        label: "Business Plan"
    },
    {
        value: "pitch_deck",
        label: "Pitch Deck"
    },
    {
        value: "technical",
        label: "Technical Documentation"
    },
    {
        value: "legal",
        label: "Legal Documents"
    },
    {
        value: "certificate",
        label: "Certificates"
    },
    {
        value: "contract",
        label: "Contracts"
    },
    {
        value: "finance_plan",
        label: "Finance Plan"
    },
    {
        value: "image",
        label: "Images"
    },
    {
        value: "video",
        label: "Videos"
    },
    {
        value: "other",
        label: "Other"
    }
];
const TEAM_ROLES = [
    {
        value: "engineer",
        label: "Engineer"
    },
    {
        value: "developer",
        label: "Developer"
    },
    {
        value: "designer",
        label: "Designer"
    },
    {
        value: "advisor",
        label: "Advisor"
    },
    {
        value: "member",
        label: "Team Member"
    }
];
const RISK_LEVELS = [
    {
        value: "low",
        label: "Low Risk",
        color: "text-emerald-600",
        bg: "bg-emerald-50 border-emerald-200"
    },
    {
        value: "medium",
        label: "Medium Risk",
        color: "text-amber-600",
        bg: "bg-amber-50 border-amber-200"
    },
    {
        value: "high",
        label: "High Risk",
        color: "text-red-600",
        bg: "bg-red-50 border-red-200"
    }
];
const STATUS_COLORS = {
    draft: "bg-slate-100 text-slate-700 border-slate-200",
    pending_review: "bg-amber-50 text-amber-700 border-amber-200",
    published: "bg-emerald-50 text-emerald-700 border-emerald-200",
    funded: "bg-blue-50 text-blue-700 border-blue-200",
    closed: "bg-slate-100 text-slate-600 border-slate-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    accepted: "bg-emerald-50 text-emerald-700 border-emerald-200",
    negotiating: "bg-violet-50 text-violet-700 border-violet-200",
    active: "bg-blue-50 text-blue-700 border-blue-200",
    completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    cancelled: "bg-slate-100 text-slate-600 border-slate-200",
    approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    not_submitted: "bg-slate-100 text-slate-600 border-slate-200",
    resubmission_requested: "bg-orange-50 text-orange-700 border-orange-200",
    open: "bg-amber-50 text-amber-700 border-amber-200",
    reviewing: "bg-blue-50 text-blue-700 border-blue-200",
    resolved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dismissed: "bg-slate-100 text-slate-600 border-slate-200"
};
const MEMBERSHIP_FEATURES = {
    none: [
        "Browse project titles",
        "Limited marketplace preview",
        "Risk score preview"
    ],
    service: [
        "Full project materials & data room",
        "Documents, team, and financial detail",
        "Direct platform messaging",
        "Send investment offers",
        "Full risk analysis reports",
        "Milestone planning with owners"
    ]
};
const QUERY_KEYS = {
    AUTH: "auth",
    USER: "user",
    PROJECTS: "projects",
    PROJECT: "project",
    RISK_ANALYSIS: "risk-analysis",
    INVESTMENTS: "investments",
    OFFERS: "offers",
    SAVED: "saved-projects",
    CONVERSATIONS: "conversations",
    MESSAGES: "messages",
    MEMBERSHIP: "membership",
    MILESTONES: "milestones",
    NOTIFICATIONS: "notifications",
    KYC: "kyc",
    INVESTOR_DASHBOARD: "investor-dashboard",
    OWNER_DASHBOARD: "owner-dashboard",
    OWNER_PROJECTS: "owner-projects",
    OWNER_DOCUMENTS: "owner-documents",
    ADMIN_STATS: "admin-stats",
    ADMIN_USERS: "admin-users",
    ADMIN_PAYMENTS: "admin-payments",
    ADMIN_SECURITY: "admin-security",
    ADMIN_COMPLAINTS: "admin-complaints",
    ACTIVITY_LOGS: "activity-logs"
};
const DEFAULT_PAGE_SIZE = 10;
const CONTACT_BLOCKED_PATTERNS = [
    /\b[\w.+-]+@[\w-]+\.[\w.]+\b/i,
    /\b(?:\+?\d[\d\s().-]{7,}\d)\b/,
    /https?:\/\/[^\s]+/i,
    /(?:www\.)[^\s]+/i,
    /(?:discord\.gg|discord\.com\/invite)\/\S+/i,
    /t\.me\/\S+/i,
    /wa\.me\/\S+|whatsapp\.me\/\S+/i,
    /(?:^|[\s])@[a-zA-Z0-9_]{3,}/,
    /\b(?:whatsapp|telegram|signal|skype|wechat|discord)\b/i,
    /\b(?:call me|email me|text me|dm me|contact me at|message me at)\b/i
];
}),
"[project]/services/api/client.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearTokens",
    ()=>clearTokens,
    "default",
    ()=>__TURBOPACK__default__export__,
    "getAccessToken",
    ()=>getAccessToken,
    "getErrorMessage",
    ()=>getErrorMessage,
    "getRefreshToken",
    ()=>getRefreshToken,
    "setTokens",
    ()=>setTokens,
    "syncAuthCookieFromStorage",
    ()=>syncAuthCookieFromStorage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/constants/index.ts [app-ssr] (ecmascript)");
;
;
const TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const TOKEN_COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // mirror access token TTL (7d)
// The access token is mirrored into a cookie so Next.js middleware can
// enforce role-based route protection on the server.
function syncAuthCookie(accessToken) {
    if (typeof document === "undefined") return;
    if (accessToken) {
        document.cookie = `${TOKEN_KEY}=${accessToken}; path=/; max-age=${TOKEN_COOKIE_MAX_AGE}; SameSite=Lax`;
    } else {
        document.cookie = `${TOKEN_KEY}=; path=/; max-age=0; SameSite=Lax`;
    }
}
function getAccessToken() {
    if ("TURBOPACK compile-time truthy", 1) return null;
    //TURBOPACK unreachable
    ;
}
function getRefreshToken() {
    if ("TURBOPACK compile-time truthy", 1) return null;
    //TURBOPACK unreachable
    ;
}
function setTokens(accessToken, refreshToken) {
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
}
function clearTokens() {
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
}
function syncAuthCookieFromStorage() {
    syncAuthCookie(getAccessToken());
}
const apiClient = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_BASE_URL"],
    headers: {
        "Content-Type": "application/json"
    },
    timeout: 30000
});
apiClient.interceptors.request.use((config)=>{
    const token = getAccessToken();
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
apiClient.interceptors.response.use((response)=>response, async (error)=>{
    const originalRequest = error.config;
    if (error.response?.status === 401 && originalRequest && !originalRequest.headers?.["X-Retry"]) {
        const refreshToken = getRefreshToken();
        if (refreshToken) {
            try {
                const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post(`${__TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_BASE_URL"]}/auth/refresh`, {
                    refreshToken
                });
                setTokens(data.data.accessToken, data.data.refreshToken);
                originalRequest.headers = originalRequest.headers || {};
                originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
                originalRequest.headers["X-Retry"] = "true";
                return apiClient(originalRequest);
            } catch  {
                clearTokens();
                if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                ;
            }
        } else {
            clearTokens();
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
        }
    }
    return Promise.reject(error);
});
function getErrorMessage(error) {
    if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].isAxiosError(error)) {
        if (error.code === "ERR_NETWORK" || !error.response) {
            return "Unable to connect to the server. Make sure the API is running.";
        }
        const apiError = error.response?.data;
        return apiError?.message || error.message || "An unexpected error occurred";
    }
    if (error instanceof Error) return error.message;
    return "An unexpected error occurred";
}
const __TURBOPACK__default__export__ = apiClient;
}),
"[project]/services/api/auth.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "authApi",
    ()=>authApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/services/api/client.ts [app-ssr] (ecmascript)");
;
const authApi = {
    login: (credentials)=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post("/auth/login", credentials),
    register: (data)=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post("/auth/register", data),
    logout: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post("/auth/logout"),
    refreshToken: (refreshToken)=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post("/auth/refresh", {
            refreshToken
        }),
    forgotPassword: (email)=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post("/auth/forgot-password", {
            email
        }),
    resetPassword: (token, password)=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post("/auth/reset-password", {
            token,
            password
        }),
    verifyEmail: (token)=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post("/auth/verify-email", {
            token
        }),
    resendVerification: (email)=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post("/auth/resend-verification", {
            email
        }),
    verify2fa: (data)=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post("/auth/verify-2fa", data),
    enable2fa: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post("/auth/2fa/enable"),
    confirm2fa: (code)=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post("/auth/2fa/confirm", {
            code
        }),
    disable2fa: (code)=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post("/auth/2fa/disable", {
            code
        }),
    getMe: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get("/auth/me"),
    changePassword: (currentPassword, newPassword)=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post("/auth/change-password", {
            currentPassword,
            newPassword
        })
};
}),
"[project]/services/api/users.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usersApi",
    ()=>usersApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/services/api/client.ts [app-ssr] (ecmascript)");
;
const usersApi = {
    getProfile: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get("/users/profile"),
    updateProfile: (data)=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].patch("/users/profile", data),
    uploadAvatar: (file)=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post("/users/avatar", file, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }),
    updateSecuritySettings: (data)=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].patch("/users/security-settings", data),
    getAll: (params)=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get("/admin/users", {
            params
        }),
    getById: (id)=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get(`/admin/users/${id}`),
    update: (id, data)=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].patch(`/admin/users/${id}`, data),
    updateRole: (id, role)=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].patch(`/admin/users/${id}/role`, {
            role
        }),
    deactivate: (id)=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post(`/admin/users/${id}/deactivate`),
    activate: (id)=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post(`/admin/users/${id}/activate`)
};
}),
"[project]/services/api/marketplace.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "adminMarketplaceApi",
    ()=>adminMarketplaceApi,
    "chatApi",
    ()=>chatApi,
    "contactApi",
    ()=>contactApi,
    "investorApi",
    ()=>investorApi,
    "kycApi",
    ()=>kycApi,
    "membershipApi",
    ()=>membershipApi,
    "milestonesApi",
    ()=>milestonesApi,
    "notificationsApi",
    ()=>notificationsApi,
    "offersApi",
    ()=>offersApi,
    "ownerApi",
    ()=>ownerApi,
    "projectsApi",
    ()=>projectsApi,
    "uploadsApi",
    ()=>uploadsApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/services/api/client.ts [app-ssr] (ecmascript)");
;
const projectsApi = {
    list: (params)=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get("/projects", {
            params
        }),
    getById: (id)=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get(`/projects/${id}`),
    riskAnalysis: (id)=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get(`/projects/${id}/risk-analysis`),
    save: (id)=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post(`/projects/${id}/save`),
    unsave: (id)=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].delete(`/projects/${id}/save`)
};
const membershipApi = {
    getPlans: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get("/membership/plans"),
    getMine: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get("/membership/me"),
    subscribe: (planId = "service")=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post("/membership/subscribe", {
            planId
        }),
    checkout: (planId = "service")=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post("/membership/checkout", {
            planId
        })
};
const milestonesApi = {
    list: (params)=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get("/milestones", {
            params
        }),
    getById: (id)=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get(`/milestones/${id}`),
    create: (data)=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post("/milestones", data),
    update: (id, data)=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].patch(`/milestones/${id}`, data)
};
const uploadsApi = {
    create: (data)=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post("/uploads", data)
};
const offersApi = {
    list: (params)=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get("/offers", {
            params
        }),
    create: (data)=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post("/offers", data),
    respond: (id, data)=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].patch(`/offers/${id}`, data)
};
const chatApi = {
    listConversations: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get("/conversations"),
    start: (data)=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post("/conversations", data),
    getMessages: (id)=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get(`/conversations/${id}/messages`),
    sendMessage: (id, data)=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post(`/conversations/${id}/messages`, data)
};
const investorApi = {
    dashboard: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get("/investor/dashboard"),
    saved: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get("/investor/saved"),
    investments: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get("/investor/investments")
};
const ownerApi = {
    dashboard: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get("/owner/dashboard"),
    projects: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get("/owner/projects"),
    createProject: (data)=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post("/owner/projects", data),
    updateProject: (id, data)=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].patch(`/owner/projects/${id}`, data),
    resubmitProject: (id)=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post(`/owner/projects/${id}/resubmit`),
    addDocument: (id, data)=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post(`/owner/projects/${id}/documents`, data),
    addTeamMember: (id, data)=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post(`/owner/projects/${id}/team`, data),
    documents: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get("/owner/documents")
};
const adminMarketplaceApi = {
    stats: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get("/admin/stats"),
    users: (params)=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get("/admin/users", {
            params
        }),
    updateRole: (id, role)=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].patch(`/admin/users/${id}/role`, {
            role
        }),
    projects: (params)=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get("/admin/projects", {
            params
        }),
    pendingProjects: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get("/admin/projects/pending"),
    getProject: (id)=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get(`/admin/projects/${id}`),
    reviewHistory: (id)=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get(`/admin/projects/${id}/review-history`),
    approveProject: (id)=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post(`/admin/projects/${id}/approve`),
    rejectProject: (id, reason)=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post(`/admin/projects/${id}/reject`, {
            reason
        }),
    updateProjectStatus: (id, status, reason)=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].patch(`/admin/projects/${id}/status`, {
            status,
            reason
        }),
    payments: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get("/admin/payments"),
    security: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get("/admin/security"),
    complaints: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get("/admin/complaints")
};
const contactApi = {
    send: (data)=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post("/contact", data)
};
const notificationsApi = {
    list: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get("/notifications"),
    unreadCount: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get("/notifications/unread-count"),
    markRead: (id)=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].patch(`/notifications/${id}/read`),
    markAllRead: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post("/notifications/read-all")
};
const kycApi = {
    get: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get("/kyc"),
    submit: (data)=>__TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post("/kyc", data)
};
}),
"[project]/services/api/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/services/api/auth.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$users$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/services/api/users.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$marketplace$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/services/api/marketplace.ts [app-ssr] (ecmascript)");
;
;
;
}),
"[project]/lib/rbac.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GUEST_ONLY_ROUTES",
    ()=>GUEST_ONLY_ROUTES,
    "MEMBERSHIP_RANK",
    ()=>MEMBERSHIP_RANK,
    "ROLES",
    ()=>ROLES,
    "ROLE_HOME",
    ()=>ROLE_HOME,
    "ROUTE_ACCESS_RULES",
    ()=>ROUTE_ACCESS_RULES,
    "canAccessFullProject",
    ()=>canAccessFullProject,
    "canMessage",
    ()=>canMessage,
    "canMessageLegacy",
    ()=>canMessageLegacy,
    "canSendOffers",
    ()=>canSendOffers,
    "findRouteRule",
    ()=>findRouteRule,
    "getRoleHome",
    ()=>getRoleHome,
    "hasActiveServiceAccess",
    ()=>hasActiveServiceAccess,
    "hasMembershipAccess",
    ()=>hasMembershipAccess,
    "hasRole",
    ()=>hasRole,
    "isAdmin",
    ()=>isAdmin,
    "isInvestor",
    ()=>isInvestor,
    "isProjectOwner",
    ()=>isProjectOwner,
    "normalizeMembershipTier",
    ()=>normalizeMembershipTier,
    "normalizeRole",
    ()=>normalizeRole
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/constants/index.ts [app-ssr] (ecmascript)");
;
const ROLES = {
    INVESTOR: "investor",
    PROJECT_OWNER: "project_owner",
    ADMIN: "admin"
};
const ROLE_HOME = {
    admin: __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROUTES"].ADMIN_DASHBOARD,
    investor: __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROUTES"].INVESTOR_DASHBOARD,
    project_owner: __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROUTES"].OWNER_DASHBOARD
};
const ROUTE_ACCESS_RULES = [
    {
        prefix: "/admin",
        roles: [
            "admin"
        ]
    },
    {
        prefix: "/owner",
        roles: [
            "project_owner",
            "admin"
        ]
    },
    {
        prefix: "/investor",
        roles: [
            "investor",
            "admin"
        ]
    },
    {
        prefix: "/messages",
        roles: [
            "investor",
            "project_owner",
            "admin"
        ]
    }
];
const GUEST_ONLY_ROUTES = [
    __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROUTES"].LOGIN,
    __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROUTES"].REGISTER,
    __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROUTES"].FORGOT_PASSWORD
];
const MEMBERSHIP_RANK = {
    none: 0,
    service: 1
};
function findRouteRule(pathname) {
    return ROUTE_ACCESS_RULES.find((rule)=>pathname === rule.prefix || pathname.startsWith(`${rule.prefix}/`)) ?? null;
}
function isAdmin(user) {
    return user?.role === "admin";
}
function isInvestor(user) {
    return user?.role === "investor";
}
function isProjectOwner(user) {
    return user?.role === "project_owner";
}
function hasRole(user, allowedRoles) {
    if (!allowedRoles || allowedRoles.length === 0) return !!user;
    return !!user && allowedRoles.includes(user.role);
}
const LEGACY_ROLE_MAP = {
    user: "investor",
    projectowner: "project_owner",
    "project-owner": "project_owner"
};
function normalizeRole(role) {
    if (!role) return undefined;
    if (role === "investor" || role === "project_owner" || role === "admin") return role;
    return LEGACY_ROLE_MAP[role.toLowerCase()];
}
function getRoleHome(role) {
    const normalized = normalizeRole(role);
    if (normalized && ROLE_HOME[normalized]) return ROLE_HOME[normalized];
    return __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROUTES"].LOGIN || "/login";
}
function normalizeMembershipTier(tier) {
    if (!tier || tier === "none") return "none";
    if (tier === "service" || tier === "basic" || tier === "premium" || tier === "enterprise") {
        return "service";
    }
    return "none";
}
function hasActiveServiceAccess(user) {
    if (!user) return false;
    if (user.role === "admin" || user.role === "project_owner") return true;
    const tier = normalizeMembershipTier(user.membershipTier);
    if (tier !== "service") return false;
    if (!user.membershipExpiresAt) return true;
    return new Date(user.membershipExpiresAt).getTime() > Date.now();
}
function hasMembershipAccess(tier, required = "service") {
    const normalized = normalizeMembershipTier(tier);
    return MEMBERSHIP_RANK[normalized] >= MEMBERSHIP_RANK[required];
}
function canAccessFullProject(user) {
    if (user?.role === "admin") return true;
    return hasActiveServiceAccess(user);
}
function canSendOffers(user) {
    return hasActiveServiceAccess(user) && (!user || user.role === "investor" || user.role === "admin");
}
function canMessage(user) {
    if (!user) return false;
    if (user.role === "project_owner" || user.role === "admin") return true;
    return hasActiveServiceAccess(user);
}
function canMessageLegacy(tier, role) {
    if (role === "project_owner" || role === "admin") return true;
    return hasMembershipAccess(tier, "service");
}
}),
"[project]/store/auth-store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAuthStore",
    ()=>useAuthStore
]);
(()=>{
    const e = new Error("Cannot find module 'zustand'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module 'zustand/middleware'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
var __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/services/api/client.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$rbac$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/rbac.ts [app-ssr] (ecmascript)");
;
;
;
;
function sanitizeUser(user) {
    if (!user) return null;
    const role = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$rbac$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeRole"])(user.role) ?? "investor";
    return {
        ...user,
        role,
        membershipTier: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$rbac$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeMembershipTier"])(user.membershipTier)
    };
}
const useAuthStore = create()(persist((set)=>({
        user: null,
        isAuthenticated: false,
        isLoading: true,
        requires2fa: false,
        tempToken: null,
        setUser: (user)=>{
            const next = sanitizeUser(user);
            set({
                user: next,
                isAuthenticated: !!next
            });
        },
        setLoading: (isLoading)=>set({
                isLoading
            }),
        setRequires2fa: (requires2fa, tempToken)=>set({
                requires2fa,
                tempToken: tempToken || null
            }),
        login: (user, accessToken, refreshToken)=>{
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setTokens"])(accessToken, refreshToken);
            set({
                user: sanitizeUser(user),
                isAuthenticated: true,
                requires2fa: false,
                tempToken: null
            });
        },
        logout: ()=>{
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clearTokens"])();
            set({
                user: null,
                isAuthenticated: false,
                requires2fa: false,
                tempToken: null
            });
        }
    }), {
    name: "auth-storage",
    partialize: (state)=>({
            user: state.user,
            isAuthenticated: state.isAuthenticated
        }),
    merge: (persisted, current)=>{
        const stored = persisted || {};
        const user = sanitizeUser(stored.user ?? null);
        return {
            ...current,
            ...stored,
            user,
            isAuthenticated: !!user && !!stored.isAuthenticated
        };
    }
}));
}),
"[project]/store/ui-store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useUIStore",
    ()=>useUIStore
]);
(()=>{
    const e = new Error("Cannot find module 'zustand'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
const useUIStore = create((set)=>({
        sidebarOpen: true,
        mobileMenuOpen: false,
        toggleSidebar: ()=>set((state)=>({
                    sidebarOpen: !state.sidebarOpen
                })),
        setSidebarOpen: (sidebarOpen)=>set({
                sidebarOpen
            }),
        toggleMobileMenu: ()=>set((state)=>({
                    mobileMenuOpen: !state.mobileMenuOpen
                })),
        setMobileMenuOpen: (mobileMenuOpen)=>set({
                mobileMenuOpen
            })
    }));
}),
"[project]/i18n/config.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_LOCALE",
    ()=>DEFAULT_LOCALE,
    "LOCALES",
    ()=>LOCALES,
    "isLocale",
    ()=>isLocale
]);
const LOCALES = [
    {
        code: "en",
        label: "English",
        nativeLabel: "English"
    },
    {
        code: "hy",
        label: "Armenian",
        nativeLabel: "Հայերեն"
    }
];
const DEFAULT_LOCALE = "hy";
function isLocale(value) {
    return value === "en" || value === "hy";
}
}),
"[project]/store/locale-store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useLocaleStore",
    ()=>useLocaleStore
]);
(()=>{
    const e = new Error("Cannot find module 'zustand'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module 'zustand/middleware'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
var __TURBOPACK__imported__module__$5b$project$5d2f$i18n$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/i18n/config.ts [app-ssr] (ecmascript)");
;
;
;
const useLocaleStore = create()(persist((set)=>({
        locale: __TURBOPACK__imported__module__$5b$project$5d2f$i18n$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_LOCALE"],
        setLocale: (locale)=>{
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$i18n$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isLocale"])(locale)) return;
            set({
                locale
            });
            if (typeof document !== "undefined") {
                document.documentElement.lang = locale;
            }
        }
    }), {
    name: "locale-storage",
    partialize: (state)=>({
            locale: state.locale
        }),
    merge: (persisted, current)=>{
        const stored = persisted;
        const locale = (0, __TURBOPACK__imported__module__$5b$project$5d2f$i18n$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isLocale"])(stored?.locale) ? stored.locale : current.locale;
        return {
            ...current,
            ...stored,
            locale
        };
    }
}));
}),
"[project]/store/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$auth$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/store/auth-store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$ui$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/store/ui-store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$locale$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/store/locale-store.ts [app-ssr] (ecmascript)");
;
;
;
}),
"[project]/components/providers/auth-provider.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/services/api/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/services/api/auth.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/services/api/client.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/store/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$auth$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/store/auth-store.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
function AuthProvider({ children }) {
    const { setUser, setLoading, isAuthenticated } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$auth$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuthStore"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const initAuth = async ()=>{
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["syncAuthCookieFromStorage"])();
            if (!isAuthenticated) {
                setLoading(false);
                return;
            }
            try {
                const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$api$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authApi"].getMe();
                setUser(data.data);
            } catch  {
                __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$auth$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuthStore"].getState().logout();
            } finally{
                setLoading(false);
            }
        };
        initAuth();
    }, [
        isAuthenticated,
        setUser,
        setLoading
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false);
}
}),
"[project]/components/providers/locale-provider.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LocaleProvider",
    ()=>LocaleProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$locale$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/store/locale-store.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
function LocaleProvider({ children }) {
    const locale = (0, __TURBOPACK__imported__module__$5b$project$5d2f$store$2f$locale$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLocaleStore"])((s)=>s.locale);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const root = document.documentElement;
        root.lang = locale;
        root.dataset.locale = locale;
        root.classList.toggle("locale-hy", locale === "hy");
        root.classList.toggle("locale-en", locale === "en");
    }, [
        locale
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false);
}
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/dynamic-access-async-storage.external.js [external] (next/dist/server/app-render/dynamic-access-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/dynamic-access-async-storage.external.js", () => require("next/dist/server/app-render/dynamic-access-async-storage.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__35254ab7._.js.map