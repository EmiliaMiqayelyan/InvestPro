module.exports = [
"[project]/.next-internal/server/app/api/v1/[...path]/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/constants/index.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/lib/rbac.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/constants/index.ts [app-route] (ecmascript)");
;
const ROLES = {
    INVESTOR: "investor",
    PROJECT_OWNER: "project_owner",
    ADMIN: "admin"
};
const ROLE_HOME = {
    admin: __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ROUTES"].ADMIN_DASHBOARD,
    investor: __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ROUTES"].INVESTOR_DASHBOARD,
    project_owner: __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ROUTES"].OWNER_DASHBOARD
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
    __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ROUTES"].LOGIN,
    __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ROUTES"].REGISTER,
    __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ROUTES"].FORGOT_PASSWORD
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
    return __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ROUTES"].LOGIN || "/login";
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
"[project]/lib/server/store.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MEMBERSHIP_PLANS",
    ()=>MEMBERSHIP_PLANS,
    "SEED_USER_IDS",
    ()=>SEED_USER_IDS,
    "analyzeProjectRisk",
    ()=>analyzeProjectRisk,
    "appendNotification",
    ()=>appendNotification,
    "getAdminStats",
    ()=>getAdminStats,
    "getInvestorStats",
    ()=>getInvestorStats,
    "getOwnerStats",
    ()=>getOwnerStats,
    "getStore",
    ()=>getStore,
    "getUnreadNotificationCount",
    ()=>getUnreadNotificationCount,
    "hasServiceAccess",
    ()=>hasServiceAccess,
    "listNotifications",
    ()=>listNotifications,
    "listUserIdsByRole",
    ()=>listUserIdsByRole,
    "logActivity",
    ()=>logActivity,
    "markAllNotificationsRead",
    ()=>markAllNotificationsRead,
    "markNotificationRead",
    ()=>markNotificationRead,
    "paginate",
    ()=>paginate,
    "redactContactInfo",
    ()=>redactContactInfo,
    "sanitizeUser",
    ()=>sanitizeUser,
    "upgradeMembership",
    ()=>upgradeMembership
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$rbac$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/rbac.ts [app-route] (ecmascript)");
;
const SEED_USER_IDS = {
    admin: "00000000-0000-0000-0000-000000000001",
    investor: "00000000-0000-0000-0000-000000000002",
    owner: "00000000-0000-0000-0000-000000000003"
};
const MEMBERSHIP_PLANS = [
    {
        id: "service",
        name: "Platform Service Access",
        nameHy: "Հարթակի ծառայության հասանելիություն",
        price: 99,
        billingPeriod: "monthly",
        description: "Monthly platform service fee for full diligence access, messaging, and offers. This is not investment capital.",
        descriptionHy: "Ամսական հարթակի ծառայության վճար՝ լրիվ ստուգման հասանելիության, հաղորդագրությունների և առաջարկների համար։ Սա ներդրումային կապիտալ չէ։",
        features: [
            "Full project materials & data room",
            "Documents, team, and financial detail",
            "Direct platform messaging",
            "Send investment offers",
            "Full risk analysis reports",
            "Milestone planning with owners"
        ],
        featuresHy: [
            "Լրիվ նախագծի նյութեր և տվյալների սենյակ",
            "Փաստաթղթեր, թիմ և ֆինանսական մանրամասներ",
            "Ուղիղ հարթակային հաղորդագրություններ",
            "Ներդրումային առաջարկներ ուղարկել",
            "Լրիվ ռիսկի վերլուծության զեկույցներ",
            "Նշաձողերի պլանավորում սեփականատերերի հետ"
        ],
        highlighted: true
    }
];
function createUser(id, email, password, firstName, lastName, role, extras = {}) {
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
        ...extras
    };
}
function seedTeam() {
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
            portfolio: "https://example.com/elena"
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
            portfolio: "https://example.com/james"
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
            biographyHy: "Խորհուրդ է տալիս վաղ փուլի հիմնադիրներին ֆինանսավորման և շուկա մուտքի հարցերում։"
        }
    ];
}
function seedPhases(requiredInvestment) {
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
            deliverables: [
                "MVP release",
                "Core engineering hires",
                "Architecture docs"
            ],
            deliverablesHy: [
                "MVP թողարկում",
                "Հիմնական ինժեներական աշխատակազմ",
                "Ճարտարապետության փաստաթղթեր"
            ],
            sortOrder: 0,
            status: "active"
        },
        {
            id: crypto.randomUUID(),
            title: "Market launch & traction",
            titleHy: "Շուկա մուտք և աճ",
            description: "Go-to-market, pilot customers, and early revenue loops.",
            descriptionHy: "Շուկա մուտք, փորձնական հաճախորդներ և վաղ եկամտի ցիկլեր։",
            budgetAsk: p2,
            durationWeeks: 20,
            deliverables: [
                "Pilot customers",
                "Sales playbook",
                "Retention metrics"
            ],
            deliverablesHy: [
                "Փորձնական հաճախորդներ",
                "Վաճառքի ուղեցույց",
                "Պահպանման ցուցանիշներ"
            ],
            sortOrder: 1,
            status: "planned"
        },
        {
            id: crypto.randomUUID(),
            title: "Scale & operations",
            titleHy: "Մասշտաբավորում և գործառնություններ",
            description: "Expand capacity, compliance, and operating leverage.",
            descriptionHy: "Հզորության ընդլայնում, համապատասխանություն և գործառնական լծակ։",
            budgetAsk: p3,
            durationWeeks: 24,
            deliverables: [
                "Regional expansion",
                "Compliance package",
                "Unit economics report"
            ],
            deliverablesHy: [
                "Տարածաշրջանային ընդլայնում",
                "Համապատասխանության փաթեթ",
                "Միավոր տնտեսագիտության զեկույց"
            ],
            sortOrder: 2,
            status: "planned"
        }
    ];
}
function seedDocuments(projectId, includeLegal) {
    const now = new Date().toISOString();
    const docs = [
        {
            id: crypto.randomUUID(),
            name: "Business Plan.pdf",
            nameHy: "Բիզնես պլան.pdf",
            url: `#doc-${projectId}-business`,
            category: "business_plan",
            uploadedAt: now
        },
        {
            id: crypto.randomUUID(),
            name: "Pitch Deck.pdf",
            nameHy: "Pitch Deck.pdf",
            url: `#doc-${projectId}-pitch`,
            category: "pitch_deck",
            uploadedAt: now
        },
        {
            id: crypto.randomUUID(),
            name: "Finance Plan.xlsx",
            nameHy: "Ֆինանսական պլան.xlsx",
            url: `#doc-${projectId}-finance-plan`,
            category: "finance_plan",
            uploadedAt: now
        }
    ];
    if (includeLegal) {
        docs.push({
            id: crypto.randomUUID(),
            name: "Legal Package.pdf",
            nameHy: "Իրավական փաթեթ.pdf",
            url: `#doc-${projectId}-legal`,
            category: "legal",
            uploadedAt: now
        });
    }
    return docs;
}
function seedProjects(ownerId, ownerName, ownerKycStatus) {
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
            stage: "growth",
            requiredInvestment: 2500000,
            minInvestment: 25000,
            currentFunding: 980000,
            expectedRoi: 18,
            riskLevel: "medium",
            image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=60",
            description: "Modular battery storage for commercial microgrids.",
            descriptionHy: "Մոդուլային մարտկոցային պահեստավորում առևտրային միկրոցանցերի համար։"
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
            stage: "early_revenue",
            requiredInvestment: 1800000,
            minInvestment: 10000,
            currentFunding: 420000,
            expectedRoi: 22,
            riskLevel: "high",
            image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=60",
            description: "Clinical decision support for outpatient clinics.",
            descriptionHy: "Կլինիկական որոշումների աջակցություն ամբուլատոր կլինիկաների համար։"
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
            stage: "mvp",
            requiredInvestment: 1200000,
            minInvestment: 15000,
            currentFunding: 150000,
            expectedRoi: 16,
            riskLevel: "medium",
            image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=60",
            description: "Port operations software for mid-size terminals.",
            descriptionHy: "Նավահանգստային գործառնությունների ծրագրակազմ միջին տերմինալների համար։"
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
            stage: "expansion",
            requiredInvestment: 3200000,
            minInvestment: 50000,
            currentFunding: 2100000,
            expectedRoi: 14,
            riskLevel: "low",
            image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=60",
            description: "Autonomous greenhouse harvesting robots.",
            descriptionHy: "Ինքնավար ջերմոցային բերքահավաքի ռոբոտներ։"
        }
    ];
    return base.map((p, i)=>{
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
            timelineHy: "18–36 ամիս մինչև հաջորդ նշաձող",
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
                {
                    label: "Product",
                    labelHy: "Արտադրանք",
                    percent: 40
                },
                {
                    label: "Go-to-market",
                    labelHy: "Շուկա մուտք",
                    percent: 35
                },
                {
                    label: "Operations",
                    labelHy: "Գործառնություններ",
                    percent: 25
                }
            ],
            phases,
            riskLevel: p.riskLevel,
            status: isPending ? "pending_review" : "published",
            submittedAt: stamp,
            approvedAt: isPending ? undefined : stamp,
            reviewHistory: isPending ? [
                {
                    id: crypto.randomUUID(),
                    projectId: id,
                    decision: "submitted",
                    reviewerId: ownerId,
                    reviewerName: ownerName,
                    createdAt: stamp
                }
            ] : [
                {
                    id: crypto.randomUUID(),
                    projectId: id,
                    decision: "approved",
                    reviewerId: SEED_USER_IDS.admin,
                    reviewerName: "Platform Admin",
                    createdAt: stamp
                }
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
                    createdAt: stamp
                }
            ],
            createdAt: stamp,
            updatedAt: stamp
        };
    });
}
function initStore() {
    const users = new Map();
    const admin = createUser(SEED_USER_IDS.admin, "admin@investpro.com", "admin123", "Platform", "Admin", "admin", {
        kycStatus: "approved",
        membershipTier: "none"
    });
    const investor = createUser(SEED_USER_IDS.investor, "investor@investpro.com", "investor123", "Alex", "Investor", "investor", {
        membershipTier: "service",
        membershipExpiresAt: new Date(Date.now() + 30 * 86400000).toISOString(),
        kycStatus: "approved"
    });
    const owner = createUser(SEED_USER_IDS.owner, "owner@investpro.com", "owner123", "Sam", "Founder", "project_owner", {
        companyName: "Horizon Labs",
        kycStatus: "approved"
    });
    users.set(admin.id, admin);
    users.set(investor.id, investor);
    users.set(owner.id, owner);
    const projects = new Map();
    for (const project of seedProjects(owner.id, `${owner.firstName} ${owner.lastName}`, owner.kycStatus)){
        projects.set(project.id, project);
    }
    const subscriptions = new Map();
    subscriptions.set(investor.id, {
        id: crypto.randomUUID(),
        userId: investor.id,
        planId: "service",
        status: "active",
        startedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 86400000).toISOString(),
        amount: 99
    });
    const now = new Date().toISOString();
    const notifications = new Map();
    notifications.set(investor.id, [
        {
            id: crypto.randomUUID(),
            userId: investor.id,
            type: "membership",
            title: "Platform access is active",
            message: "Full data rooms, messaging, offers, and milestone planning are unlocked for this demo account.",
            isRead: false,
            href: "/investor/projects",
            priority: "high",
            createdAt: now
        }
    ]);
    notifications.set(owner.id, [
        {
            id: crypto.randomUUID(),
            userId: owner.id,
            type: "project_update",
            title: "Your listings are live",
            message: "Horizon Labs projects are published. You will be notified when investors send offers or messages.",
            isRead: false,
            href: "/owner/offers",
            createdAt: now
        }
    ]);
    notifications.set(admin.id, [
        {
            id: crypto.randomUUID(),
            userId: admin.id,
            type: "general",
            title: "Moderation inbox is live",
            message: "You will get realtime alerts for new accounts, pending projects, KYC, complaints, and flagged chat.",
            isRead: false,
            href: "/admin/security",
            createdAt: now
        }
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
        milestonePlans: new Map()
    };
}
function getStore() {
    if (!globalThis.__investProStoreV5) {
        globalThis.__investProStoreV5 = initStore();
    }
    return globalThis.__investProStoreV5;
}
function hasServiceAccess(user) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$rbac$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["hasActiveServiceAccess"])(user);
}
function sanitizeUser(user) {
    const { password: _, ...safe } = user;
    return {
        ...safe,
        membershipTier: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$rbac$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeMembershipTier"])(safe.membershipTier)
    };
}
function paginate(items, page = 1, limit = 10) {
    const total = items.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const start = (page - 1) * limit;
    return {
        data: items.slice(start, start + limit),
        total,
        page,
        limit,
        totalPages
    };
}
function logActivity(userId, action, entityType, entityId, metadata) {
    getStore().activityLogs.unshift({
        id: crypto.randomUUID(),
        userId,
        action,
        entityType,
        entityId,
        metadata,
        createdAt: new Date().toISOString()
    });
}
const MAX_NOTIFICATIONS_PER_USER = 100;
function listUserIdsByRole(role) {
    return Array.from(getStore().users.values()).filter((user)=>user.role === role).map((user)=>user.id);
}
function listNotifications(userId) {
    return getStore().notifications.get(userId) || [];
}
function getUnreadNotificationCount(userId) {
    return listNotifications(userId).filter((n)=>!n.isRead).length;
}
function appendNotification(notification) {
    const store = getStore();
    const list = store.notifications.get(notification.userId) || [];
    list.unshift(notification);
    store.notifications.set(notification.userId, list.slice(0, MAX_NOTIFICATIONS_PER_USER));
    return notification;
}
function markNotificationRead(userId, id) {
    const list = getStore().notifications.get(userId);
    if (!list) return null;
    const item = list.find((n)=>n.id === id);
    if (!item) return null;
    item.isRead = true;
    return item;
}
function markAllNotificationsRead(userId) {
    const list = getStore().notifications.get(userId);
    if (!list) return 0;
    let changed = 0;
    for (const item of list){
        if (!item.isRead) {
            item.isRead = true;
            changed += 1;
        }
    }
    return changed;
}
function analyzeProjectRisk(project) {
    const positive = [];
    const warnings = [];
    const missing = [];
    const missingHy = [];
    const questions = [];
    const questionsHy = [];
    let score = 55;
    const phases = project.phases || [];
    const phaseBudgetTotal = phases.reduce((sum, ph)=>sum + (ph.budgetAsk || 0), 0);
    const phaseBudgetGap = project.requiredInvestment - phaseBudgetTotal;
    if (project.documents.some((d)=>d.category === "business_plan")) {
        positive.push({
            label: "Business plan uploaded",
            labelHy: "Բիզնես պլանը վերբեռնված է",
            detail: "Core planning document is available.",
            detailHy: "Հիմնական պլանավորման փաստաթուղթը հասանելի է։"
        });
        score += 8;
    } else {
        missing.push("Business plan");
        missingHy.push("Բիզնես պլան");
        warnings.push({
            label: "Missing business plan",
            labelHy: "Բացակայում է բիզնես պլանը",
            detail: "Investors cannot validate strategy depth.",
            detailHy: "Ներդրողները չեն կարող ստուգել ռազմավարության խորությունը։"
        });
        score -= 10;
    }
    if (project.documents.some((d)=>d.category === "pitch_deck")) {
        positive.push({
            label: "Pitch deck available",
            labelHy: "Pitch deck-ը հասանելի է",
            detail: "Presentation materials are ready for diligence.",
            detailHy: "Ներկայացման նյութերը պատրաստ են ստուգման համար։"
        });
        score += 5;
    } else {
        missing.push("Pitch deck");
        missingHy.push("Pitch deck");
    }
    if (project.documents.some((d)=>d.category === "legal")) {
        positive.push({
            label: "Legal documents present",
            labelHy: "Իրավական փաստաթղթեր կան",
            detail: "Legal package supports compliance review.",
            detailHy: "Իրավական փաթեթը աջակցում է համապատասխանության վերանայմանը։"
        });
        score += 8;
    } else {
        missing.push("Legal documents");
        missingHy.push("Իրավական փաստաթղթեր");
        warnings.push({
            label: "No legal package",
            labelHy: "Իրավական փաթեթ չկա",
            detail: "Entity and IP status may be unclear.",
            detailHy: "Կազմակերպության և մտավոր սեփականության կարգավիճակը կարող է անհասկանալի լինել։"
        });
        score -= 8;
    }
    if (project.documents.some((d)=>d.category === "finance_plan")) {
        positive.push({
            label: "Finance plan available",
            labelHy: "Ֆինանսական պլանը հասանելի է",
            detail: "Dedicated finance plan supports capital allocation review.",
            detailHy: "Առանձին ֆինանսական պլանը աջակցում է կապիտալի բաշխման վերանայմանը։"
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
            detailHy: `${phases.length} ֆինանսավորման փուլեր բյուջեներով։`
        });
        score += 6;
    } else {
        warnings.push({
            label: "Missing phases",
            labelHy: "Փուլերը բացակայում են",
            detail: "Fewer than 2 investment phases defined.",
            detailHy: "Սահմանված է 2-ից պակաս ներդրումային փուլ։"
        });
        score -= 5;
    }
    if (Math.abs(phaseBudgetGap) <= project.requiredInvestment * 0.05) {
        positive.push({
            label: "Phase budgets aligned",
            labelHy: "Փուլերի բյուջեները համաձայնեցված են",
            detail: "Phase asks roughly match the total raise.",
            detailHy: "Փուլերի պահանջները մոտավորապես համընկնում են ընդհանուր հավաքագրման հետ։"
        });
        score += 4;
    } else if (phases.length > 0) {
        warnings.push({
            label: "Phase budget gap",
            labelHy: "Փուլերի բյուջեի անհամապատասխանություն",
            detail: `Phase total differs from raise by $${Math.abs(phaseBudgetGap).toLocaleString()}.`,
            detailHy: `Փուլերի գումարը տարբերվում է հավաքագրումից $${Math.abs(phaseBudgetGap).toLocaleString()}-ով։`
        });
        score -= 4;
    }
    if (project.team.length >= 3) {
        positive.push({
            label: "Complete founding team",
            labelHy: "Լրիվ հիմնադիր թիմ",
            detail: `${project.team.length} team profiles listed.`,
            detailHy: `${project.team.length} թիմի պրոֆիլ նշված է։`
        });
        score += 7;
    } else {
        warnings.push({
            label: "Thin team roster",
            labelHy: "Թույլ թիմի կազմ",
            detail: "Fewer than 3 team members disclosed.",
            detailHy: "Բացահայտված է 3-ից պակաս թիմի անդամ։"
        });
        score -= 6;
    }
    if (project.team.some((t)=>t.role === "advisor")) {
        positive.push({
            label: "Advisor on board",
            labelHy: "Խորհրդատու կա",
            detail: "External advisory support disclosed.",
            detailHy: "Արտաքին խորհրդատվական աջակցությունը բացահայտված է։"
        });
        score += 4;
    }
    if (project.financialProjections && project.financialProjections.length > 40) {
        positive.push({
            label: "Financial projections provided",
            labelHy: "Ֆինանսական կանխատեսումներ կան",
            detail: "Forward-looking numbers are documented.",
            detailHy: "Ապագա թվերը փաստաթղթավորված են։"
        });
        score += 6;
    } else {
        warnings.push({
            label: "Weak financial detail",
            labelHy: "Թույլ ֆինանսական մանրամաս",
            detail: "Projections appear incomplete.",
            detailHy: "Կանխատեսումները թերի են թվում։"
        });
        score -= 7;
    }
    if (project.ownerKycStatus === "approved") {
        positive.push({
            label: "Owner KYC approved",
            labelHy: "Սեփականատիրոջ KYC-ն հաստատված է",
            detail: "Project owner identity verification is complete.",
            detailHy: "Նախագծի սեփականատիրոջ ինքնության ստուգումն ավարտված է։"
        });
        score += 4;
    } else {
        warnings.push({
            label: "Owner KYC incomplete",
            labelHy: "Սեփականատիրոջ KYC-ն թերի է",
            detail: "Owner verification is not fully approved.",
            detailHy: "Սեփականատիրոջ ստուգումը լրիվ հաստատված չէ։"
        });
        score -= 3;
    }
    if (project.currentFunding / project.requiredInvestment > 0.4) {
        positive.push({
            label: "Strong funding traction",
            labelHy: "Ուժեղ ֆինանսավորման առաջընթաց",
            detail: `${Math.round(project.currentFunding / project.requiredInvestment * 100)}% of goal raised.`,
            detailHy: `Նպատակի ${Math.round(project.currentFunding / project.requiredInvestment * 100)}%-ը հավաքված է։`
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
    if (!project.documents.some((d)=>d.category === "certificate")) {
        missing.push("Certificates / compliance proofs");
        missingHy.push("Վկայագրեր / համապատասխանության ապացույցներ");
        questions.push("Do you hold any industry certifications or audits?");
        questionsHy.push("Ունե՞ք արդյոք արդյունաբերական վկայագրեր կամ աուդիտներ։");
    }
    score = Math.max(5, Math.min(95, score));
    const level = score >= 70 ? "low" : score >= 45 ? "medium" : "high";
    const completeness = Math.round(((project.documents.length > 0 ? 1 : 0) + (project.team.length > 0 ? 1 : 0) + (project.financialProjections ? 1 : 0) + (project.investmentPlan ? 1 : 0) + (project.businessModel ? 1 : 0) + (phases.length >= 2 ? 1 : 0)) / 6 * 100);
    const summary = level === "low" ? "Overall diligence posture looks solid with strong documentation, phases, and team disclosure." : level === "medium" ? "Moderate risk — several strengths exist, but investors should clarify gaps before committing." : "Elevated risk — missing materials and weak signals warrant caution before investing.";
    const summaryHy = level === "low" ? "Ընդհանուր ստուգման վիճակը ամուր է՝ ուժեղ փաստաթղթավորմամբ, փուլերով և թիմի բացահայտմամբ։" : level === "medium" ? "Միջին ռիսկ — կան ուժեղ կողմեր, սակայն ներդրողները պետք է պարզեն բացերը մինչև պարտավորվելը։" : "Բարձր ռիսկ — բացակայող նյութերն ու թույլ ազդանշանները զգուշություն են պահանջում։";
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
        generatedAt: new Date().toISOString()
    };
}
function getInvestorStats(userId) {
    const store = getStore();
    const user = store.users.get(userId);
    const published = Array.from(store.projects.values()).filter((p)=>p.status === "published");
    const offers = Array.from(store.offers.values()).filter((o)=>o.investorId === userId);
    const investments = store.investments.get(userId) || [];
    const saved = store.savedProjects.get(userId) || [];
    const unread = Array.from(store.conversations.values()).filter((c)=>c.investorId === userId).reduce((sum, c)=>sum + c.unreadCount, 0);
    const activeMilestones = Array.from(store.milestonePlans.values()).filter((m)=>m.investorId === userId && (m.status === "proposed" || m.status === "negotiating" || m.status === "agreed" || m.status === "active")).length;
    const safeUser = user ? {
        role: user.role,
        membershipTier: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$rbac$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeMembershipTier"])(user.membershipTier),
        membershipExpiresAt: user.membershipExpiresAt
    } : null;
    return {
        availableProjects: published.length,
        myInvestments: investments.length,
        savedProjects: saved.length,
        unreadMessages: unread,
        membershipTier: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$rbac$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeMembershipTier"])(user?.membershipTier),
        hasPlatformAccess: hasServiceAccess(safeUser),
        portfolioValue: investments.reduce((s, i)=>s + i.amount, 0),
        activeOffers: offers.filter((o)=>o.status === "pending" || o.status === "negotiating").length,
        activeMilestones
    };
}
function getOwnerStats(userId) {
    const store = getStore();
    const myProjects = Array.from(store.projects.values()).filter((p)=>p.ownerId === userId);
    const offers = Array.from(store.offers.values()).filter((o)=>o.ownerId === userId);
    const unread = Array.from(store.conversations.values()).filter((c)=>c.ownerId === userId).reduce((sum, c)=>sum + c.unreadCount, 0);
    const teamMembers = myProjects.reduce((s, p)=>s + p.team.length, 0);
    const pendingMilestones = Array.from(store.milestonePlans.values()).filter((m)=>m.ownerId === userId && (m.status === "proposed" || m.status === "negotiating" || m.status === "draft")).length;
    return {
        myProjects: myProjects.length,
        publishedProjects: myProjects.filter((p)=>p.status === "published").length,
        investorRequests: offers.length,
        unreadMessages: unread,
        totalFundingRaised: myProjects.reduce((s, p)=>s + p.currentFunding, 0),
        teamMembers,
        pendingOffers: offers.filter((o)=>o.status === "pending").length,
        pendingMilestones
    };
}
function getAdminStats() {
    const store = getStore();
    const users = Array.from(store.users.values());
    const projects = Array.from(store.projects.values());
    return {
        totalInvestors: users.filter((u)=>u.role === "investor").length,
        totalOwners: users.filter((u)=>u.role === "project_owner").length,
        totalProjects: projects.length,
        publishedProjects: projects.filter((p)=>p.status === "published").length,
        pendingProjects: projects.filter((p)=>p.status === "pending_review").length,
        activeMemberships: Array.from(store.subscriptions.values()).filter((s)=>s.status === "active").length,
        pendingKyc: Array.from(store.kyc.values()).filter((k)=>k?.status === "pending").length,
        openComplaints: store.complaints.filter((c)=>c.status === "open" || c.status === "reviewing").length,
        totalOffers: store.offers.size,
        totalFunding: projects.reduce((s, p)=>s + p.currentFunding, 0)
    };
}
function redactContactInfo(text) {
    const patterns = [
        {
            re: /\b[\w.+-]+@[\w-]+\.[\w.]+\b/gi,
            replacement: "[contact hidden]"
        },
        {
            re: /\b(?:\+?\d[\d\s().-]{7,}\d)\b/g,
            replacement: "[contact hidden]"
        },
        {
            re: /https?:\/\/[^\s]+/gi,
            replacement: "[link hidden]"
        },
        {
            re: /(?:www\.)[^\s]+/gi,
            replacement: "[link hidden]"
        },
        {
            re: /(?:discord\.gg|discord\.com\/invite)\/\S+/gi,
            replacement: "[app hidden]"
        },
        {
            re: /t\.me\/\S+/gi,
            replacement: "[app hidden]"
        },
        {
            re: /wa\.me\/\S+|whatsapp\.me\/\S+/gi,
            replacement: "[app hidden]"
        },
        {
            re: /(?:^|[\s])@[a-zA-Z0-9_]{3,}/g,
            replacement: " [handle hidden]"
        },
        {
            re: /\b(?:whatsapp|telegram|signal|skype|wechat|discord)\b/gi,
            replacement: "[app hidden]"
        },
        {
            re: /\b(?:call me|email me|text me|dm me|contact me at|message me at)\b/gi,
            replacement: "[contact request hidden]"
        }
    ];
    let blocked = false;
    let cleaned = text;
    for (const { re, replacement } of patterns){
        if (re.test(cleaned)) blocked = true;
        cleaned = cleaned.replace(re, replacement);
    }
    return {
        text: cleaned,
        blocked
    };
}
function upgradeMembership(userId, planId) {
    const store = getStore();
    const user = store.users.get(userId);
    if (!user) return null;
    if (planId !== "service") return null;
    const plan = MEMBERSHIP_PLANS.find((p)=>p.id === planId);
    if (!plan) return null;
    const expiresAt = new Date(Date.now() + 30 * 86400000).toISOString();
    user.membershipTier = "service";
    user.membershipExpiresAt = expiresAt;
    user.updatedAt = new Date().toISOString();
    const sub = {
        id: crypto.randomUUID(),
        userId,
        planId: "service",
        status: "active",
        startedAt: new Date().toISOString(),
        expiresAt,
        amount: plan.price
    };
    store.subscriptions.set(userId, sub);
    logActivity(userId, "membership_purchased", "membership", planId, {
        amount: plan.price
    });
    return {
        user: sanitizeUser(user),
        subscription: sub
    };
}
}),
"[project]/lib/server/notification-hub.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * In-process SSE fan-out. Lives on globalThis so it survives Next.js HMR
 * and stays aligned with the in-memory store.
 */ __turbopack_context__.s([
    "connectedNotificationClients",
    ()=>connectedNotificationClients,
    "publishNotification",
    ()=>publishNotification,
    "subscribeNotifications",
    ()=>subscribeNotifications
]);
function getHub() {
    if (!globalThis.__investProNotificationHub) {
        globalThis.__investProNotificationHub = {
            listeners: new Map()
        };
    }
    return globalThis.__investProNotificationHub;
}
function subscribeNotifications(userId, listener) {
    const hub = getHub();
    const set = hub.listeners.get(userId) ?? new Set();
    set.add(listener);
    hub.listeners.set(userId, set);
    return ()=>{
        set.delete(listener);
        if (set.size === 0) hub.listeners.delete(userId);
    };
}
function publishNotification(userId, event, data) {
    const listeners = getHub().listeners.get(userId);
    if (!listeners) return;
    for (const listener of listeners){
        try {
            listener(event, data);
        } catch  {
        /* ignore a dead subscriber */ }
    }
}
function connectedNotificationClients(userId) {
    return getHub().listeners.get(userId)?.size ?? 0;
}
}),
"[project]/lib/server/email.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Email delivery stub for receipts / verify / notifications.
 * Configure SMTP_* env vars to enable; otherwise logs to console in development.
 */ __turbopack_context__.s([
    "sendEmail",
    ()=>sendEmail,
    "sendNewMessageNotice",
    ()=>sendNewMessageNotice,
    "sendServiceFeeReceipt",
    ()=>sendServiceFeeReceipt
]);
async function sendEmail(payload) {
    const host = process.env.SMTP_HOST;
    if (!host) {
        if ("TURBOPACK compile-time truthy", 1) {
            console.info("[email:dev]", payload.to, payload.subject, payload.text.slice(0, 120));
        }
        return {
            ok: true
        };
    }
    // Placeholder for nodemailer / Resend integration
    console.info("[email]", payload.to, payload.subject);
    return {
        ok: true
    };
}
async function sendServiceFeeReceipt(to, amount) {
    return sendEmail({
        to,
        subject: "InvestPro — Platform service fee receipt / Ծառայավճարի անդորրագիր",
        text: `Your platform service access is active. Amount: $${amount}. This is a platform fee, not investment capital.`
    });
}
async function sendNewMessageNotice(to, projectTitle) {
    return sendEmail({
        to,
        subject: "InvestPro — New message / Նոր հաղորդագրություն",
        text: `You have a new on-platform message about "${projectTitle}". Sign in to reply — do not share external contact details.`
    });
}
}),
"[project]/lib/server/notifications.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "dispatchNotificationEvent",
    ()=>dispatchNotificationEvent,
    "hrefForRole",
    ()=>hrefForRole
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/constants/index.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/store.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$notification$2d$hub$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/notification-hub.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$email$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/email.ts [app-route] (ecmascript)");
;
;
;
;
const MAX_EMAIL_BODY = 280;
function money(amount) {
    return `$${amount.toLocaleString()}`;
}
function push(draft) {
    const notification = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["appendNotification"])({
        id: crypto.randomUUID(),
        userId: draft.userId,
        type: draft.type,
        title: draft.title,
        message: draft.message,
        isRead: false,
        href: draft.href,
        priority: draft.priority ?? "normal",
        metadata: draft.metadata,
        createdAt: new Date().toISOString()
    });
    const unreadCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getUnreadNotificationCount"])(draft.userId);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$notification$2d$hub$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["publishNotification"])(draft.userId, "notification", {
        notification,
        unreadCount
    });
    if (draft.email) {
        void sendInAppEmail(draft);
    }
    return notification;
}
async function sendInAppEmail(draft) {
    const { getStore } = await __turbopack_context__.A("[project]/lib/server/store.ts [app-route] (ecmascript, async loader)");
    const user = getStore().users.get(draft.userId);
    if (!user?.email) return;
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$email$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendEmail"])({
        to: user.email,
        subject: `InvestPro — ${draft.title}`,
        text: draft.message.slice(0, MAX_EMAIL_BODY)
    });
}
function notifyAdmins(partial) {
    for (const userId of (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["listUserIdsByRole"])("admin")){
        push({
            ...partial,
            userId
        });
    }
}
function hrefForRole(role, type, meta) {
    const projectId = typeof meta?.projectId === "string" ? meta.projectId : undefined;
    if (role === "investor") {
        switch(type){
            case "offer_received":
            case "offer_updated":
                return __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ROUTES"].INVESTOR_INVESTMENTS;
            case "message":
                return __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ROUTES"].INVESTOR_MESSAGES;
            case "membership":
                return __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ROUTES"].INVESTOR_MEMBERSHIP;
            case "kyc_update":
                return __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ROUTES"].INVESTOR_KYC;
            case "milestone_update":
                return __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ROUTES"].INVESTOR_MILESTONES;
            case "project_update":
                return projectId ? `${__TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ROUTES"].INVESTOR_PROJECTS}/${projectId}` : __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ROUTES"].INVESTOR_PROJECTS;
            case "security_alert":
                return __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ROUTES"].INVESTOR_SECURITY;
            default:
                return __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ROUTES"].INVESTOR_DASHBOARD;
        }
    }
    if (role === "project_owner") {
        switch(type){
            case "offer_received":
            case "offer_updated":
                return __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ROUTES"].OWNER_OFFERS;
            case "message":
                return __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ROUTES"].OWNER_MESSAGES;
            case "milestone_update":
                return __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ROUTES"].OWNER_MILESTONES;
            case "project_update":
                return __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ROUTES"].OWNER_PROJECTS;
            case "security_alert":
                return __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ROUTES"].OWNER_MESSAGES;
            default:
                return __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ROUTES"].OWNER_DASHBOARD;
        }
    }
    switch(type){
        case "project_update":
            return projectId ? `${__TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ROUTES"].ADMIN_PROJECTS}/${projectId}/review` : __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ROUTES"].ADMIN_PROJECTS;
        case "kyc_update":
        case "security_alert":
            return __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ROUTES"].ADMIN_SECURITY;
        case "membership":
            return __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ROUTES"].ADMIN_PAYMENTS;
        case "complaint":
            return __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ROUTES"].ADMIN_COMPLAINTS;
        case "user_update":
            return __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ROUTES"].ADMIN_USERS;
        default:
            return __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ROUTES"].ADMIN_DASHBOARD;
    }
}
function draftsForEvent(event) {
    switch(event.kind){
        case "user_registered":
            {
                const home = event.role === "project_owner" ? __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ROUTES"].OWNER_DASHBOARD : __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ROUTES"].INVESTOR_DASHBOARD;
                const welcome = {
                    userId: event.userId,
                    type: "general",
                    title: event.role === "project_owner" ? "Welcome, project owner" : "Welcome, investor",
                    message: event.role === "project_owner" ? "Create your first project and submit it for review. Investors will see it once it is published." : "Browse the marketplace, unlock full diligence with the service fee, then message owners and send offers.",
                    href: home,
                    metadata: {
                        role: event.role
                    }
                };
                const adminDrafts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["listUserIdsByRole"])("admin").map((userId)=>({
                        userId,
                        type: "user_update",
                        title: "New account registered",
                        message: `${event.name} joined as ${event.role.replace("_", " ")} (${event.email}).`,
                        href: hrefForRole("admin", "user_update"),
                        metadata: {
                            userId: event.userId,
                            role: event.role
                        }
                    }));
                return [
                    welcome,
                    ...adminDrafts
                ];
            }
        case "offer_created":
            {
                const { offer } = event;
                return [
                    {
                        userId: offer.ownerId,
                        type: "offer_received",
                        title: "New investment offer",
                        message: `${offer.investorName} offered ${money(offer.amount)} on ${offer.projectTitle}.`,
                        href: hrefForRole("project_owner", "offer_received", {
                            projectId: offer.projectId
                        }),
                        priority: "high",
                        email: true,
                        metadata: {
                            offerId: offer.id,
                            projectId: offer.projectId,
                            investorId: offer.investorId
                        }
                    }
                ];
            }
        case "offer_updated":
            {
                const { offer } = event;
                const verb = offer.status === "accepted" ? "accepted" : offer.status === "rejected" ? "declined" : "opened negotiation on";
                const followUp = offer.status === "accepted" ? "The amount is now tracked in your investments." : offer.status === "rejected" ? "You can browse other projects or send a revised offer." : "Reply on-platform to agree terms.";
                return [
                    {
                        userId: offer.investorId,
                        type: "offer_updated",
                        title: `Offer ${offer.status}`,
                        message: `The owner ${verb} your ${money(offer.amount)} offer for ${offer.projectTitle}. ${followUp}`,
                        href: hrefForRole("investor", "offer_updated", {
                            projectId: offer.projectId
                        }),
                        priority: "high",
                        email: true,
                        metadata: {
                            offerId: offer.id,
                            projectId: offer.projectId,
                            status: offer.status
                        }
                    }
                ];
            }
        case "message_sent":
            {
                const recipientId = event.message.senderId === event.conversation.investorId ? event.conversation.ownerId : event.conversation.investorId;
                const recipientRole = recipientId === event.conversation.ownerId ? "project_owner" : "investor";
                const preview = event.message.content.slice(0, 90) || "Sent an attachment";
                return [
                    {
                        userId: recipientId,
                        type: "message",
                        title: `New message · ${event.conversation.projectTitle}`,
                        message: `${event.message.senderName}: ${preview}`,
                        href: hrefForRole(recipientRole, "message", {
                            conversationId: event.conversation.id,
                            projectId: event.conversation.projectId
                        }),
                        metadata: {
                            conversationId: event.conversation.id,
                            projectId: event.conversation.projectId,
                            senderId: event.message.senderId
                        }
                    }
                ];
            }
        case "membership_activated":
            {
                const adminDrafts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["listUserIdsByRole"])("admin").map((userId)=>({
                        userId,
                        type: "membership",
                        title: "Service fee paid",
                        message: `An investor activated platform access (${money(event.amount)}).`,
                        href: hrefForRole("admin", "membership"),
                        metadata: {
                            payerId: event.userId,
                            amount: event.amount
                        }
                    }));
                return [
                    {
                        userId: event.userId,
                        type: "membership",
                        title: "Platform access is active",
                        message: "Full data rooms, messaging, offers, and milestone planning are unlocked. This is a platform fee, not investment capital.",
                        href: hrefForRole("investor", "membership"),
                        priority: "high",
                        metadata: {
                            amount: event.amount
                        }
                    },
                    ...adminDrafts
                ];
            }
        case "kyc_submitted":
            {
                const adminDrafts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["listUserIdsByRole"])("admin").map((userId)=>({
                        userId,
                        type: "kyc_update",
                        title: "KYC awaiting review",
                        message: `${event.name} submitted identity documents.`,
                        href: hrefForRole("admin", "kyc_update"),
                        priority: "high",
                        metadata: {
                            userId: event.userId
                        }
                    }));
                return [
                    {
                        userId: event.userId,
                        type: "kyc_update",
                        title: "Verification submitted",
                        message: "Your KYC documents are in review. We will notify you when the status changes.",
                        href: hrefForRole("investor", "kyc_update"),
                        metadata: {
                            status: "pending"
                        }
                    },
                    ...adminDrafts
                ];
            }
        case "project_created":
            {
                const { project } = event;
                const adminDrafts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["listUserIdsByRole"])("admin").map((userId)=>({
                        userId,
                        type: "project_update",
                        title: "Նոր նախագիծ է սպասում ստուգման",
                        message: `«${project.title}» նախագիծը ուղարկվել է հաստատման։`,
                        href: hrefForRole("admin", "project_update", {
                            projectId: project.id
                        }),
                        priority: "high",
                        metadata: {
                            projectId: project.id
                        }
                    }));
                return [
                    {
                        userId: project.ownerId,
                        type: "project_update",
                        title: "Project submitted for review",
                        message: `“${project.title}” is in the review queue. Investors will see it after it is published.`,
                        href: hrefForRole("project_owner", "project_update", {
                            projectId: project.id
                        }),
                        metadata: {
                            projectId: project.id,
                            status: project.status
                        }
                    },
                    ...adminDrafts
                ];
            }
        case "project_status_changed":
            {
                const { project, status, rejectionReason } = event;
                const drafts = [];
                if (status === "published") {
                    drafts.push({
                        userId: project.ownerId,
                        type: "project_update",
                        title: "Ձեր նախագիծը հաստատվել է",
                        message: `Ձեր «${project.title}» նախագիծը հաջողությամբ անցել է ստուգումը և այժմ հասանելի է հարթակում։`,
                        href: hrefForRole("project_owner", "project_update", {
                            projectId: project.id
                        }),
                        priority: "high",
                        email: true,
                        metadata: {
                            projectId: project.id,
                            status
                        }
                    });
                    for (const investorId of (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["listUserIdsByRole"])("investor")){
                        drafts.push({
                            userId: investorId,
                            type: "project_update",
                            title: "New project on the marketplace",
                            message: `“${project.title}” was just published. Open it to review the opportunity.`,
                            href: hrefForRole("investor", "project_update", {
                                projectId: project.id
                            }),
                            metadata: {
                                projectId: project.id,
                                status
                            }
                        });
                    }
                } else if (status === "rejected") {
                    const reasonText = rejectionReason || project.rejectionReason || "";
                    drafts.push({
                        userId: project.ownerId,
                        type: "project_update",
                        title: "Նախագիծը մերժվել է",
                        message: reasonText ? `«${project.title}» նախագիծը մերժվել է։ Պատճառ՝ ${reasonText.slice(0, 160)}` : `«${project.title}» նախագիծը այս պահին չի հաստատվել։ Ստուգեք հաղորդագրությունները և կրկին ուղարկեք։`,
                        href: __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ROUTES"].OWNER_MESSAGES,
                        priority: "high",
                        email: true,
                        metadata: {
                            projectId: project.id,
                            status,
                            rejectionReason: reasonText
                        }
                    });
                } else if (status === "funded") {
                    drafts.push({
                        userId: project.ownerId,
                        type: "project_update",
                        title: "Project funded",
                        message: `“${project.title}” reached its funding goal.`,
                        href: hrefForRole("project_owner", "project_update", {
                            projectId: project.id
                        }),
                        priority: "high",
                        email: true,
                        metadata: {
                            projectId: project.id,
                            status
                        }
                    });
                } else if (status === "closed") {
                    drafts.push({
                        userId: project.ownerId,
                        type: "project_update",
                        title: "Project closed",
                        message: `“${project.title}” is no longer open for new offers.`,
                        href: hrefForRole("project_owner", "project_update", {
                            projectId: project.id
                        }),
                        metadata: {
                            projectId: project.id,
                            status
                        }
                    });
                } else if (status === "pending_review") {
                    const adminDrafts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["listUserIdsByRole"])("admin").map((userId)=>({
                            userId,
                            type: "project_update",
                            title: "Նոր նախագիծ է սպասում ստուգման",
                            message: `«${project.title}» նախագիծը ուղարկվել է հաստատման։`,
                            href: hrefForRole("admin", "project_update", {
                                projectId: project.id
                            }),
                            priority: "high",
                            metadata: {
                                projectId: project.id
                            }
                        }));
                    drafts.push(...adminDrafts);
                }
                return drafts;
            }
        case "milestone_created":
            {
                const { plan } = event;
                return [
                    {
                        userId: plan.ownerId,
                        type: "milestone_update",
                        title: "New milestone plan",
                        message: `${plan.investorName} proposed milestones for ${plan.projectTitle}.`,
                        href: hrefForRole("project_owner", "milestone_update", {
                            projectId: plan.projectId
                        }),
                        priority: "high",
                        metadata: {
                            planId: plan.id,
                            projectId: plan.projectId
                        }
                    }
                ];
            }
        case "milestone_updated":
            {
                const { plan, actorId } = event;
                const recipientId = actorId === plan.ownerId ? plan.investorId : plan.ownerId;
                const recipientRole = recipientId === plan.ownerId ? "project_owner" : "investor";
                return [
                    {
                        userId: recipientId,
                        type: "milestone_update",
                        title: "Milestone plan updated",
                        message: `The milestone plan for ${plan.projectTitle} is now ${plan.status.replace("_", " ")}.`,
                        href: hrefForRole(recipientRole, "milestone_update", {
                            projectId: plan.projectId
                        }),
                        metadata: {
                            planId: plan.id,
                            projectId: plan.projectId,
                            status: plan.status
                        }
                    }
                ];
            }
        case "contact_blocked":
            {
                const recipientId = event.senderId === event.conversation.investorId ? event.conversation.ownerId : event.conversation.investorId;
                const senderRole = event.senderId === event.conversation.investorId ? "investor" : "project_owner";
                return [
                    {
                        userId: event.senderId,
                        type: "security_alert",
                        title: "Contact details removed",
                        message: "External contact info was stripped from your message. Keep conversations on-platform.",
                        href: hrefForRole(senderRole, "security_alert"),
                        metadata: {
                            conversationId: event.conversation.id
                        }
                    },
                    ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["listUserIdsByRole"])("admin").map((userId)=>({
                            userId,
                            type: "security_alert",
                            title: "Flagged chat message",
                            message: `${event.senderName} tried to share off-platform contact details on “${event.conversation.projectTitle}”.`,
                            href: hrefForRole("admin", "security_alert"),
                            priority: "high",
                            metadata: {
                                conversationId: event.conversation.id,
                                senderId: event.senderId,
                                recipientId
                            }
                        }))
                ];
            }
        case "complaint_filed":
            {
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["listUserIdsByRole"])("admin").map((userId)=>({
                        userId,
                        type: "complaint",
                        title: "New complaint",
                        message: event.complaint.subject,
                        href: hrefForRole("admin", "complaint"),
                        priority: "high",
                        metadata: {
                            complaintId: event.complaint.id
                        }
                    }));
            }
        case "contact_form":
            {
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["listUserIdsByRole"])("admin").map((userId)=>({
                        userId,
                        type: "general",
                        title: "Contact form message",
                        message: `${event.name} (${event.email}) sent a public contact request.`,
                        href: hrefForRole("admin", "general"),
                        metadata: {
                            email: event.email
                        }
                    }));
            }
        case "role_changed":
            {
                const href = event.role === "admin" ? __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ROUTES"].ADMIN_DASHBOARD : event.role === "project_owner" ? __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ROUTES"].OWNER_DASHBOARD : __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ROUTES"].INVESTOR_DASHBOARD;
                return [
                    {
                        userId: event.userId,
                        type: "user_update",
                        title: "Account role updated",
                        message: `Your account role is now ${event.role.replace("_", " ")}. Sign in again if workspace links look stale.`,
                        href,
                        priority: "high",
                        metadata: {
                            role: event.role
                        }
                    }
                ];
            }
    }
}
function dispatchNotificationEvent(event) {
    return draftsForEvent(event).map(push);
}
}),
"[project]/lib/server/jwt.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createTokenPair",
    ()=>createTokenPair,
    "payloadToUser",
    ()=>payloadToUser,
    "signAccessToken",
    ()=>signAccessToken,
    "signRefreshToken",
    ()=>signRefreshToken,
    "userToPayload",
    ()=>userToPayload,
    "verifyAccessToken",
    ()=>verifyAccessToken,
    "verifyRefreshToken",
    ()=>verifyRefreshToken
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$sign$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/webapi/jwt/sign.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$verify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/webapi/jwt/verify.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$rbac$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/rbac.ts [app-route] (ecmascript)");
;
;
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "investpro-dev-secret-change-in-production");
async function signAccessToken(payload) {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$sign$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SignJWT"]({
        ...payload
    }).setProtectedHeader({
        alg: "HS256"
    }).setIssuedAt().setExpirationTime("7d").sign(JWT_SECRET);
}
async function signRefreshToken(payload) {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$sign$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SignJWT"]({
        ...payload,
        type: "refresh"
    }).setProtectedHeader({
        alg: "HS256"
    }).setIssuedAt().setExpirationTime("30d").sign(JWT_SECRET);
}
function normalizePayload(raw) {
    if (!raw.sub || typeof raw.email !== "string") return null;
    return {
        sub: String(raw.sub),
        email: raw.email,
        firstName: typeof raw.firstName === "string" ? raw.firstName : "",
        lastName: typeof raw.lastName === "string" ? raw.lastName : "",
        role: raw.role,
        membershipTier: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$rbac$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeMembershipTier"])(typeof raw.membershipTier === "string" ? raw.membershipTier : "none"),
        membershipExpiresAt: typeof raw.membershipExpiresAt === "string" ? raw.membershipExpiresAt : undefined,
        phone: typeof raw.phone === "string" ? raw.phone : undefined,
        isEmailVerified: Boolean(raw.isEmailVerified),
        is2faEnabled: Boolean(raw.is2faEnabled),
        kycStatus: raw.kycStatus || "not_submitted",
        companyName: typeof raw.companyName === "string" ? raw.companyName : undefined
    };
}
async function verifyAccessToken(token) {
    try {
        const { payload } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$verify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jwtVerify"])(token, JWT_SECRET);
        return normalizePayload(payload);
    } catch  {
        return null;
    }
}
async function verifyRefreshToken(token) {
    try {
        const { payload } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$verify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jwtVerify"])(token, JWT_SECRET);
        if (payload.type !== "refresh") return null;
        return normalizePayload(payload);
    } catch  {
        return null;
    }
}
function payloadToUser(payload) {
    const now = new Date().toISOString();
    return {
        id: payload.sub,
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
        phone: payload.phone,
        role: payload.role,
        membershipTier: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$rbac$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeMembershipTier"])(payload.membershipTier),
        membershipExpiresAt: payload.membershipExpiresAt,
        isEmailVerified: payload.isEmailVerified,
        is2faEnabled: payload.is2faEnabled,
        kycStatus: payload.kycStatus,
        companyName: payload.companyName,
        createdAt: now,
        updatedAt: now
    };
}
function userToPayload(user) {
    return {
        sub: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
        membershipTier: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$rbac$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeMembershipTier"])(user.membershipTier),
        membershipExpiresAt: user.membershipExpiresAt,
        isEmailVerified: user.isEmailVerified,
        is2faEnabled: user.is2faEnabled,
        kycStatus: user.kycStatus,
        companyName: user.companyName
    };
}
async function createTokenPair(user) {
    const payload = userToPayload(user);
    const [accessToken, refreshToken] = await Promise.all([
        signAccessToken(payload),
        signRefreshToken(payload)
    ]);
    return {
        accessToken,
        refreshToken
    };
}
}),
"[project]/lib/server/api-router.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "handleApiRequest",
    ()=>handleApiRequest
]);
(()=>{
    const e = new Error("Cannot find module 'next/server'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/store.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$notifications$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/notifications.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$notification$2d$hub$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/notification-hub.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$jwt$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/jwt.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$rbac$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/rbac.ts [app-route] (ecmascript)");
;
;
;
;
;
;
function authUserObj(auth) {
    if (!auth) return null;
    return {
        role: auth.role,
        membershipTier: auth.membershipTier,
        membershipExpiresAt: auth.membershipExpiresAt
    };
}
function ok(data, message, status = 200) {
    const body = {
        success: true,
        data,
        message
    };
    return NextResponse.json(body, {
        status
    });
}
function fail(message, status = 400) {
    return NextResponse.json({
        success: false,
        message
    }, {
        status
    });
}
async function parseBody(req) {
    try {
        return await req.json();
    } catch  {
        return {};
    }
}
async function getAuth(req) {
    const header = req.headers.get("authorization");
    if (header?.startsWith("Bearer ")) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$jwt$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyAccessToken"])(header.slice(7));
    }
    const cookie = req.cookies.get("access_token")?.value;
    if (cookie) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$jwt$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyAccessToken"])(cookie);
    const token = new URL(req.url).searchParams.get("token");
    if (token) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$jwt$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyAccessToken"])(token);
    return null;
}
function findUserByEmail(email) {
    for (const user of (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().users.values()){
        if (user.email.toLowerCase() === email.toLowerCase()) return user;
    }
    return undefined;
}
function requireAuth(auth) {
    if (!auth) return fail("Unauthorized", 401);
    return null;
}
function requireRole(auth, roles) {
    const err = requireAuth(auth);
    if (err) return err;
    if (!roles.includes(auth.role)) return fail("Forbidden", 403);
    return null;
}
function publicProjectCard(project) {
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
        ownerKycStatus: project.ownerKycStatus
    };
}
function gatedProject(project, auth) {
    const userObj = authUserObj(auth);
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$rbac$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["canAccessFullProject"])(userObj)) return project;
    if (auth?.role === "project_owner" && auth.sub === project.ownerId) return project;
    const teaserPhases = (project.phases || []).map((ph)=>({
            id: ph.id,
            title: ph.title,
            titleHy: ph.titleHy,
            description: "",
            descriptionHy: undefined,
            budgetAsk: 0,
            durationWeeks: undefined,
            deliverables: [],
            sortOrder: ph.sortOrder,
            status: ph.status
        }));
    return {
        ...project,
        limited: true,
        documents: [],
        team: [],
        teamCount: project.team?.length ?? 0,
        financialProjections: project.financialProjections ? `${project.financialProjections.slice(0, 80)}…` : "",
        financialProjectionsHy: project.financialProjectionsHy ? `${project.financialProjectionsHy.slice(0, 80)}…` : undefined,
        investmentPlan: project.investmentPlan ? `${project.investmentPlan.slice(0, 80)}…` : "",
        investmentPlanHy: project.investmentPlanHy ? `${project.investmentPlanHy.slice(0, 80)}…` : undefined,
        fullDescription: project.fullDescription.slice(0, 200) + (project.fullDescription.length > 200 ? "…" : ""),
        fullDescriptionHy: project.fullDescriptionHy ? project.fullDescriptionHy.slice(0, 200) + (project.fullDescriptionHy.length > 200 ? "…" : "") : undefined,
        budgetBreakdown: undefined,
        phases: teaserPhases,
        updates: []
    };
}
const handlers = {
    "POST /auth/login": async (req)=>{
        const { email, password } = await parseBody(req);
        const user = findUserByEmail(email);
        if (!user || user.password !== password) return fail("Invalid email or password", 401);
        const tokens = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$jwt$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createTokenPair"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sanitizeUser"])(user));
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logActivity"])(user.id, "login", "auth");
        return ok({
            user: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sanitizeUser"])(user),
            tokens
        });
    },
    "POST /auth/register": async (req)=>{
        const body = await parseBody(req);
        if (findUserByEmail(body.email)) return fail("Email already registered", 409);
        const role = body.role === "project_owner" ? "project_owner" : "investor";
        if (body.role === "admin") return fail("Cannot self-register as admin", 403);
        const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])();
        const user = {
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
            updatedAt: new Date().toISOString()
        };
        store.users.set(user.id, user);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logActivity"])(user.id, "register", "auth", undefined, {
            role
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$notifications$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["dispatchNotificationEvent"])({
            kind: "user_registered",
            userId: user.id,
            role,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email
        });
        const tokens = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$jwt$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createTokenPair"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sanitizeUser"])(user));
        return ok({
            user: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sanitizeUser"])(user),
            tokens
        }, "Account created", 201);
    },
    "POST /auth/logout": async ()=>ok(null, "Logged out"),
    "POST /auth/forgot-password": async ()=>ok(null, "If the email exists, a reset link was sent"),
    "POST /auth/verify-email": async ()=>ok(null, "Email verified"),
    "POST /auth/refresh": async (req)=>{
        const { refreshToken } = await parseBody(req);
        const payload = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$jwt$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyRefreshToken"])(refreshToken);
        if (!payload) return fail("Invalid refresh token", 401);
        const stored = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().users.get(payload.sub);
        const user = stored ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sanitizeUser"])(stored) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$jwt$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["payloadToUser"])(payload);
        return ok(await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$jwt$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createTokenPair"])(user));
    },
    "GET /auth/me": async (_req, _p, auth)=>{
        if (!auth) return fail("Unauthorized", 401);
        const stored = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().users.get(auth.sub);
        if (stored) return ok((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sanitizeUser"])(stored));
        return ok((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$jwt$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["payloadToUser"])(auth));
    },
    "GET /membership/plans": async ()=>ok(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MEMBERSHIP_PLANS"]),
    "GET /membership/me": async (_req, _p, auth)=>{
        if (!auth) return fail("Unauthorized", 401);
        const sub = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().subscriptions.get(auth.sub) || null;
        const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().users.get(auth.sub);
        return ok({
            tier: user?.membershipTier || "none",
            expiresAt: user?.membershipExpiresAt,
            subscription: sub
        });
    },
    "POST /membership/subscribe": async (req, _p, auth)=>{
        const err = requireRole(auth, [
            "investor"
        ]);
        if (err) return err;
        const body = await parseBody(req);
        const planId = body.planId || "service";
        const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["upgradeMembership"])(auth.sub, planId);
        if (!result) return fail("Invalid plan", 400);
        const tokens = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$jwt$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createTokenPair"])(result.user);
        try {
            const { sendServiceFeeReceipt } = await __turbopack_context__.A("[project]/lib/server/email.ts [app-route] (ecmascript, async loader)");
            await sendServiceFeeReceipt(result.user.email, result.subscription.amount);
        } catch  {
        /* non-blocking */ }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$notifications$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["dispatchNotificationEvent"])({
            kind: "membership_activated",
            userId: auth.sub,
            amount: result.subscription.amount
        });
        return ok({
            ...result,
            tokens
        }, "Membership activated");
    },
    "POST /membership/checkout": async (req, _p, auth)=>{
        const err = requireRole(auth, [
            "investor"
        ]);
        if (err) return err;
        const body = await parseBody(req);
        const planId = body.planId || "service";
        if (planId !== "service") return fail("Invalid plan", 400);
        const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().users.get(auth.sub);
        const { createServiceFeeCheckoutSession } = await __turbopack_context__.A("[project]/lib/server/stripe.ts [app-route] (ecmascript, async loader)");
        const session = await createServiceFeeCheckoutSession({
            userId: auth.sub,
            email: user?.email || "",
            successUrl: "/investor/membership?checkout=mock",
            cancelUrl: "/investor/membership"
        });
        return ok({
            checkoutUrl: session.checkoutUrl,
            sessionId: session.sessionId,
            planId
        });
    },
    "GET /projects": async (req)=>{
        const { searchParams } = new URL(req.url);
        const search = searchParams.get("search")?.toLowerCase();
        const category = searchParams.get("category");
        const industry = searchParams.get("industry");
        const location = searchParams.get("location")?.toLowerCase();
        const stage = searchParams.get("stage");
        const minInvestment = searchParams.get("minInvestment") ? Number(searchParams.get("minInvestment")) : undefined;
        const fundingStatus = searchParams.get("fundingStatus");
        const riskLevel = searchParams.get("riskLevel");
        const sortBy = searchParams.get("sortBy") || "newest";
        const sortOrder = searchParams.get("sortOrder") || "desc";
        let projects = Array.from((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().projects.values()).filter((p)=>p.status === "published" || p.status === "funded");
        if (search) {
            projects = projects.filter((p)=>p.title.toLowerCase().includes(search) || p.category.toLowerCase().includes(search) || p.description.toLowerCase().includes(search));
        }
        if (category) projects = projects.filter((p)=>p.category === category);
        if (industry) projects = projects.filter((p)=>p.industry === industry);
        if (stage) projects = projects.filter((p)=>p.stage === stage);
        if (location) projects = projects.filter((p)=>p.location.toLowerCase().includes(location));
        if (typeof minInvestment === "number" && !Number.isNaN(minInvestment)) {
            // Investor budget filter: include projects where the investor can meet the minimum ticket.
            projects = projects.filter((p)=>p.minInvestment <= minInvestment);
        }
        if (riskLevel) projects = projects.filter((p)=>p.riskLevel === riskLevel);
        if (fundingStatus) {
            if (fundingStatus === "open") projects = projects.filter((p)=>p.status === "published");
            if (fundingStatus === "funded") projects = projects.filter((p)=>p.status === "funded");
        }
        projects = projects.sort((a, b)=>{
            const dir = sortOrder === "asc" ? 1 : -1;
            if (sortBy === "most_viewed") return dir * ((b.views || 0) - (a.views || 0));
            if (sortBy === "funding_progress") {
                const ap = a.currentFunding / Math.max(a.requiredInvestment, 1);
                const bp = b.currentFunding / Math.max(b.requiredInvestment, 1);
                return dir * (bp - ap);
            }
            // newest: recently published/updated first (not only original create date)
            const recency = (p)=>new Date(p.approvedAt || p.updatedAt || p.submittedAt || p.createdAt).getTime();
            return dir * (recency(b) - recency(a));
        });
        const page = Number(searchParams.get("page") || 1);
        const limit = Number(searchParams.get("limit") || 12);
        const cards = projects.map(publicProjectCard);
        return ok((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["paginate"])(cards, page, limit));
    },
    "GET /projects/:id": async (_req, params, auth)=>{
        const project = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().projects.get(params.id);
        if (!project) return fail("Project not found", 404);
        if (project.status !== "published" && project.status !== "funded" && auth?.sub !== project.ownerId && auth?.role !== "admin") {
            return fail("Project not available", 404);
        }
        return ok(gatedProject(project, auth));
    },
    "GET /projects/:id/risk-analysis": async (_req, params, auth)=>{
        const err = requireAuth(auth);
        if (err) return err;
        const project = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().projects.get(params.id);
        if (!project) return fail("Project not found", 404);
        const analysis = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["analyzeProjectRisk"])(project);
        if (auth.role !== "admin" && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$rbac$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["hasActiveServiceAccess"])(authUserObj(auth))) {
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
                limited: true
            });
        }
        return ok(analysis);
    },
    "POST /projects/:id/save": async (_req, params, auth)=>{
        const err = requireRole(auth, [
            "investor"
        ]);
        if (err) return err;
        const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])();
        if (!store.projects.get(params.id)) return fail("Project not found", 404);
        const list = store.savedProjects.get(auth.sub) || [];
        if (!list.includes(params.id)) list.push(params.id);
        store.savedProjects.set(auth.sub, list);
        return ok({
            saved: true
        });
    },
    "DELETE /projects/:id/save": async (_req, params, auth)=>{
        const err = requireRole(auth, [
            "investor"
        ]);
        if (err) return err;
        const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])();
        const list = (store.savedProjects.get(auth.sub) || []).filter((id)=>id !== params.id);
        store.savedProjects.set(auth.sub, list);
        return ok({
            saved: false
        });
    },
    "GET /investor/dashboard": async (_req, _p, auth)=>{
        const err = requireRole(auth, [
            "investor",
            "admin"
        ]);
        if (err) return err;
        return ok((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getInvestorStats"])(auth.sub));
    },
    "GET /investor/saved": async (_req, _p, auth)=>{
        const err = requireRole(auth, [
            "investor"
        ]);
        if (err) return err;
        const ids = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().savedProjects.get(auth.sub) || [];
        const projects = ids.map((id)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().projects.get(id)).filter(Boolean).map((p)=>publicProjectCard(p));
        return ok(projects);
    },
    "GET /investor/investments": async (_req, _p, auth)=>{
        const err = requireRole(auth, [
            "investor"
        ]);
        if (err) return err;
        const list = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().investments.get(auth.sub) || [];
        const enriched = list.map((inv)=>({
                ...inv,
                project: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().projects.get(inv.projectId)
            }));
        return ok(enriched);
    },
    "POST /offers": async (req, _p, auth)=>{
        const err = requireRole(auth, [
            "investor"
        ]);
        if (err) return err;
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$rbac$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["canSendOffers"])(authUserObj(auth))) {
            return fail("Platform service access required to send offers", 403);
        }
        const body = await parseBody(req);
        const project = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().projects.get(body.projectId);
        if (!project || project.status !== "published") return fail("Project not available", 404);
        if (body.amount < project.minInvestment) {
            return fail(`Minimum investment is ${project.minInvestment}`, 400);
        }
        const investor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().users.get(auth.sub);
        const offer = {
            id: crypto.randomUUID(),
            projectId: project.id,
            projectTitle: project.title,
            investorId: auth.sub,
            investorName: `${investor.firstName} ${investor.lastName}`,
            ownerId: project.ownerId,
            amount: body.amount,
            conditions: body.conditions || "",
            questions: body.questions || "",
            notes: body.notes || "",
            status: "pending",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().offers.set(offer.id, offer);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logActivity"])(auth.sub, "offer_created", "offer", offer.id);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$notifications$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["dispatchNotificationEvent"])({
            kind: "offer_created",
            offer
        });
        return ok(offer, "Offer submitted", 201);
    },
    "GET /offers": async (req, _p, auth)=>{
        const err = requireAuth(auth);
        if (err) return err;
        const { searchParams } = new URL(req.url);
        let offers = Array.from((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().offers.values());
        if (auth.role === "investor") offers = offers.filter((o)=>o.investorId === auth.sub);
        else if (auth.role === "project_owner") offers = offers.filter((o)=>o.ownerId === auth.sub);
        const status = searchParams.get("status");
        if (status) offers = offers.filter((o)=>o.status === status);
        return ok((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["paginate"])(offers, Number(searchParams.get("page") || 1), Number(searchParams.get("limit") || 20)));
    },
    "PATCH /offers/:id": async (req, params, auth)=>{
        const err = requireRole(auth, [
            "project_owner",
            "admin"
        ]);
        if (err) return err;
        const offer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().offers.get(params.id);
        if (!offer) return fail("Offer not found", 404);
        if (auth.role === "project_owner" && offer.ownerId !== auth.sub) return fail("Forbidden", 403);
        const body = await parseBody(req);
        if (![
            "accepted",
            "rejected",
            "negotiating"
        ].includes(body.status)) {
            return fail("Invalid status", 400);
        }
        offer.status = body.status;
        offer.ownerResponse = body.ownerResponse;
        offer.updatedAt = new Date().toISOString();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().offers.set(offer.id, offer);
        if (body.status === "accepted") {
            const investments = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().investments.get(offer.investorId) || [];
            investments.push({
                id: crypto.randomUUID(),
                offerId: offer.id,
                projectId: offer.projectId,
                amount: offer.amount,
                status: "active",
                expectedReturn: offer.amount * 1.15,
                createdAt: new Date().toISOString()
            });
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().investments.set(offer.investorId, investments);
            const project = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().projects.get(offer.projectId);
            if (project) {
                project.currentFunding += offer.amount;
                project.investorCount += 1;
                if (project.currentFunding >= project.requiredInvestment && project.status === "published") {
                    project.status = "funded";
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$notifications$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["dispatchNotificationEvent"])({
                        kind: "project_status_changed",
                        project,
                        status: "funded"
                    });
                }
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().projects.set(project.id, project);
            }
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logActivity"])(auth.sub, `offer_${body.status}`, "offer", offer.id);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$notifications$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["dispatchNotificationEvent"])({
            kind: "offer_updated",
            offer
        });
        return ok(offer);
    },
    "GET /owner/dashboard": async (_req, _p, auth)=>{
        const err = requireRole(auth, [
            "project_owner",
            "admin"
        ]);
        if (err) return err;
        return ok((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getOwnerStats"])(auth.sub));
    },
    "GET /owner/projects": async (_req, _p, auth)=>{
        const err = requireRole(auth, [
            "project_owner",
            "admin"
        ]);
        if (err) return err;
        const projects = Array.from((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().projects.values()).filter((p)=>p.ownerId === auth.sub || auth.role === "admin");
        const statusRank = (status)=>{
            if (status === "pending_review") return 0;
            if (status === "published" || status === "funded") return 1;
            if (status === "draft") return 2;
            if (status === "rejected") return 3;
            return 4;
        };
        const activityTime = (p)=>{
            if (p.status === "pending_review") {
                return new Date(p.submittedAt || p.updatedAt || p.createdAt).getTime();
            }
            if (p.status === "published" || p.status === "funded") {
                return new Date(p.approvedAt || p.updatedAt || p.createdAt).getTime();
            }
            return new Date(p.updatedAt || p.createdAt).getTime();
        };
        projects.sort((a, b)=>{
            const rank = statusRank(a.status) - statusRank(b.status);
            if (rank !== 0) return rank;
            return activityTime(b) - activityTime(a);
        });
        return ok(projects);
    },
    "POST /owner/projects": async (req, _p, auth)=>{
        const err = requireRole(auth, [
            "project_owner"
        ]);
        if (err) return err;
        const body = await parseBody(req);
        if (!body.title) return fail("Title is required", 400);
        const owner = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().users.get(auth.sub);
        const id = crypto.randomUUID();
        const now = new Date().toISOString();
        const project = {
            id,
            ownerId: auth.sub,
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
            image: body.image || "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=1200&q=80",
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
            updatedAt: now
        };
        const { markSubmitted } = await __turbopack_context__.A("[project]/lib/server/project-review.ts [app-route] (ecmascript, async loader)");
        markSubmitted(project, auth.sub, "submitted");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logActivity"])(auth.sub, "project_created", "project", id);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$notifications$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["dispatchNotificationEvent"])({
            kind: "project_created",
            project
        });
        return ok(project, "Project submitted for review", 201);
    },
    "PATCH /owner/projects/:id": async (req, params, auth)=>{
        const err = requireRole(auth, [
            "project_owner",
            "admin"
        ]);
        if (err) return err;
        const project = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().projects.get(params.id);
        if (!project) return fail("Project not found", 404);
        if (auth.role === "project_owner" && project.ownerId !== auth.sub) return fail("Forbidden", 403);
        const body = await parseBody(req);
        const { status: _status, approvedAt: _a, approvedBy: _b, rejectedAt: _c, rejectedBy: _d, rejectionReason: _e, reviewHistory: _f, ownerId: _o, id: _id, ...safe } = body;
        const updated = {
            ...project,
            ...safe,
            id: project.id,
            ownerId: project.ownerId,
            status: project.status,
            reviewHistory: project.reviewHistory,
            updatedAt: new Date().toISOString()
        };
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().projects.set(params.id, updated);
        return ok(updated);
    },
    "POST /owner/projects/:id/documents": async (req, params, auth)=>{
        const err = requireRole(auth, [
            "project_owner"
        ]);
        if (err) return err;
        const project = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().projects.get(params.id);
        if (!project || project.ownerId !== auth.sub) return fail("Not found", 404);
        const body = await parseBody(req);
        const doc = {
            id: crypto.randomUUID(),
            name: body.name,
            category: body.category || "other",
            url: body.url || `#upload-${crypto.randomUUID()}`,
            uploadedAt: new Date().toISOString()
        };
        project.documents.push(doc);
        project.updatedAt = new Date().toISOString();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().projects.set(project.id, project);
        return ok(doc, "Document uploaded", 201);
    },
    "POST /owner/projects/:id/team": async (req, params, auth)=>{
        const err = requireRole(auth, [
            "project_owner"
        ]);
        if (err) return err;
        const project = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().projects.get(params.id);
        if (!project || project.ownerId !== auth.sub) return fail("Not found", 404);
        const body = await parseBody(req);
        const member = {
            ...body,
            id: crypto.randomUUID()
        };
        project.team.push(member);
        project.updatedAt = new Date().toISOString();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().projects.set(project.id, project);
        return ok(member, "Team member added", 201);
    },
    "GET /owner/documents": async (_req, _p, auth)=>{
        const err = requireRole(auth, [
            "project_owner"
        ]);
        if (err) return err;
        const docs = Array.from((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().projects.values()).filter((p)=>p.ownerId === auth.sub).flatMap((p)=>p.documents.map((d, index)=>({
                    ...d,
                    id: `${p.id}:${d.id || index}`,
                    projectId: p.id,
                    projectTitle: p.title
                })));
        return ok(docs);
    },
    "GET /conversations": async (_req, _p, auth)=>{
        const err = requireAuth(auth);
        if (err) return err;
        let list = Array.from((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().conversations.values());
        if (auth.role === "investor") list = list.filter((c)=>c.investorId === auth.sub);
        else if (auth.role === "project_owner") list = list.filter((c)=>c.ownerId === auth.sub);
        list.sort((a, b)=>(b.lastMessageAt || "").localeCompare(a.lastMessageAt || ""));
        return ok(list);
    },
    "POST /conversations": async (req, _p, auth)=>{
        const err = requireRole(auth, [
            "investor",
            "project_owner"
        ]);
        if (err) return err;
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$rbac$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["canMessage"])(authUserObj(auth))) {
            return fail("Platform service access required to message", 403);
        }
        const { projectId, investorId } = await parseBody(req);
        const project = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().projects.get(projectId);
        if (!project) return fail("Project not found", 404);
        const invId = auth.role === "investor" ? auth.sub : investorId;
        if (!invId) return fail("investorId required", 400);
        const existing = Array.from((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().conversations.values()).find((c)=>c.projectId === projectId && c.investorId === invId);
        if (existing) return ok(existing);
        const investor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().users.get(invId);
        const owner = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().users.get(project.ownerId);
        if (!investor || !owner) return fail("Participants not found", 404);
        const conversation = {
            id: crypto.randomUUID(),
            projectId,
            projectTitle: project.title,
            investorId: invId,
            investorName: `${investor.firstName} ${investor.lastName}`,
            ownerId: project.ownerId,
            ownerName: `${owner.firstName} ${owner.lastName}`,
            unreadCount: 0,
            createdAt: new Date().toISOString()
        };
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().conversations.set(conversation.id, conversation);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().messages.set(conversation.id, []);
        return ok(conversation, undefined, 201);
    },
    "GET /conversations/:id/messages": async (_req, params, auth)=>{
        const err = requireAuth(auth);
        if (err) return err;
        const conversation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().conversations.get(params.id);
        if (!conversation) return fail("Conversation not found", 404);
        const allowed = auth.role === "admin" || auth.sub === conversation.investorId || auth.sub === conversation.ownerId;
        if (!allowed) return fail("Forbidden", 403);
        return ok((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().messages.get(params.id) || []);
    },
    "POST /conversations/:id/messages": async (req, params, auth)=>{
        const err = requireAuth(auth);
        if (err) return err;
        const conversation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().conversations.get(params.id);
        if (!conversation) return fail("Conversation not found", 404);
        const isAdminParticipant = auth.role === "admin" && (conversation.isAdminThread || conversation.investorId === auth.sub);
        const allowed = auth.sub === conversation.investorId || auth.sub === conversation.ownerId || isAdminParticipant;
        if (!allowed) return fail("Forbidden", 403);
        if (!isAdminParticipant && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$rbac$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["canMessage"])(authUserObj(auth))) {
            return fail("Platform service access required", 403);
        }
        const body = await parseBody(req);
        const { text, blocked } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["redactContactInfo"])(body.content || "");
        if (!text.trim() && !body.attachmentUrl) return fail("Message required", 400);
        const sender = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().users.get(auth.sub);
        const message = {
            id: crypto.randomUUID(),
            conversationId: params.id,
            senderId: auth.sub,
            senderName: `${sender.firstName} ${sender.lastName}`,
            senderRole: sender.role,
            content: text,
            attachmentUrl: body.attachmentUrl,
            attachmentName: body.attachmentName,
            isFlagged: blocked,
            createdAt: new Date().toISOString()
        };
        const msgs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().messages.get(params.id) || [];
        msgs.push(message);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().messages.set(params.id, msgs);
        conversation.lastMessage = text.slice(0, 120);
        conversation.lastMessageAt = message.createdAt;
        conversation.unreadCount += 1;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().conversations.set(params.id, conversation);
        if (blocked) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logActivity"])(auth.sub, "contact_info_blocked", "message", message.id);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$notifications$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["dispatchNotificationEvent"])({
                kind: "contact_blocked",
                conversation,
                senderId: auth.sub,
                senderName: message.senderName
            });
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$notifications$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["dispatchNotificationEvent"])({
            kind: "message_sent",
            conversation,
            message
        });
        const recipientId = auth.sub === conversation.investorId ? conversation.ownerId : conversation.investorId;
        const recipient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().users.get(recipientId);
        if (recipient?.email) {
            void __turbopack_context__.A("[project]/lib/server/email.ts [app-route] (ecmascript, async loader)").then(({ sendNewMessageNotice })=>sendNewMessageNotice(recipient.email, conversation.projectTitle));
        }
        return ok(message, blocked ? "Message sent. External contact details were removed for security." : undefined, 201);
    },
    "GET /users/profile": async (_req, _p, auth)=>{
        if (!auth) return fail("Unauthorized", 401);
        const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().users.get(auth.sub);
        if (!user) return fail("User not found", 404);
        return ok((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sanitizeUser"])(user));
    },
    "PATCH /users/profile": async (req, _p, auth)=>{
        if (!auth) return fail("Unauthorized", 401);
        const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().users.get(auth.sub);
        if (!user) return fail("User not found", 404);
        const body = await parseBody(req);
        Object.assign(user, {
            firstName: body.firstName ?? user.firstName,
            lastName: body.lastName ?? user.lastName,
            phone: body.phone ?? user.phone,
            bio: body.bio ?? user.bio,
            companyName: body.companyName ?? user.companyName,
            updatedAt: new Date().toISOString()
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().users.set(user.id, user);
        return ok((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sanitizeUser"])(user));
    },
    "GET /notifications": async (_req, _p, auth)=>{
        if (!auth) return fail("Unauthorized", 401);
        return ok((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["listNotifications"])(auth.sub));
    },
    "GET /notifications/unread-count": async (_req, _p, auth)=>{
        if (!auth) return fail("Unauthorized", 401);
        return ok({
            unreadCount: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getUnreadNotificationCount"])(auth.sub)
        });
    },
    "PATCH /notifications/:id/read": async (_req, params, auth)=>{
        if (!auth) return fail("Unauthorized", 401);
        const item = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["markNotificationRead"])(auth.sub, params.id);
        if (!item) return fail("Notification not found", 404);
        return ok({
            notification: item,
            unreadCount: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getUnreadNotificationCount"])(auth.sub)
        });
    },
    "POST /notifications/read-all": async (_req, _p, auth)=>{
        if (!auth) return fail("Unauthorized", 401);
        const updated = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["markAllNotificationsRead"])(auth.sub);
        return ok({
            updated,
            unreadCount: 0
        });
    },
    "GET /notifications/stream": async (req, _p, auth)=>{
        if (!auth) return fail("Unauthorized", 401);
        const userId = auth.sub;
        const encoder = new TextEncoder();
        let heartbeat;
        let unsubscribe;
        const stream = new ReadableStream({
            start (controller) {
                const send = (event, data)=>{
                    controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
                };
                send("connected", {
                    ok: true,
                    unreadCount: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getUnreadNotificationCount"])(userId)
                });
                unsubscribe = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$notification$2d$hub$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["subscribeNotifications"])(userId, (event, data)=>{
                    try {
                        send(event, data);
                    } catch  {
                        unsubscribe?.();
                        if (heartbeat) clearInterval(heartbeat);
                    }
                });
                heartbeat = setInterval(()=>{
                    try {
                        controller.enqueue(encoder.encode(`: ping\n\n`));
                    } catch  {
                        if (heartbeat) clearInterval(heartbeat);
                    }
                }, 25000);
                req.signal.addEventListener("abort", ()=>{
                    if (heartbeat) clearInterval(heartbeat);
                    unsubscribe?.();
                    try {
                        controller.close();
                    } catch  {
                    /* already closed */ }
                });
            },
            cancel () {
                if (heartbeat) clearInterval(heartbeat);
                unsubscribe?.();
            }
        });
        return new NextResponse(stream, {
            headers: {
                "Content-Type": "text/event-stream; charset=utf-8",
                "Cache-Control": "no-cache, no-transform",
                Connection: "keep-alive",
                "X-Accel-Buffering": "no"
            }
        });
    },
    "GET /kyc": async (_req, _p, auth)=>{
        if (!auth) return fail("Unauthorized", 401);
        return ok((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().kyc.get(auth.sub) || null);
    },
    "POST /kyc": async (req, _p, auth)=>{
        if (!auth) return fail("Unauthorized", 401);
        const body = await parseBody(req);
        const submission = {
            id: crypto.randomUUID(),
            userId: auth.sub,
            status: "pending",
            idDocumentUrl: body.idDocumentUrl || "#id",
            selfieUrl: body.selfieUrl || "#selfie",
            addressProofUrl: body.addressProofUrl || "#address",
            submittedAt: new Date().toISOString()
        };
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().kyc.set(auth.sub, submission);
        const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().users.get(auth.sub);
        if (user) {
            user.kycStatus = "pending";
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().users.set(user.id, user);
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logActivity"])(auth.sub, "kyc_submitted", "kyc", submission.id);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$notifications$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["dispatchNotificationEvent"])({
            kind: "kyc_submitted",
            userId: auth.sub,
            name: user ? `${user.firstName} ${user.lastName}` : "A user"
        });
        return ok(submission, "KYC submitted", 201);
    },
    "GET /admin/stats": async (_req, _p, auth)=>{
        const err = requireRole(auth, [
            "admin"
        ]);
        if (err) return err;
        return ok((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAdminStats"])());
    },
    "GET /admin/users": async (req, _p, auth)=>{
        const err = requireRole(auth, [
            "admin"
        ]);
        if (err) return err;
        const { searchParams } = new URL(req.url);
        let users = Array.from((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().users.values()).map(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sanitizeUser"]);
        const role = searchParams.get("role");
        const search = searchParams.get("search")?.toLowerCase();
        if (role) users = users.filter((u)=>u.role === role);
        if (search) {
            users = users.filter((u)=>u.email.includes(search) || u.firstName.toLowerCase().includes(search) || u.lastName.toLowerCase().includes(search));
        }
        return ok((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["paginate"])(users, Number(searchParams.get("page") || 1), Number(searchParams.get("limit") || 20)));
    },
    "PATCH /admin/users/:id/role": async (req, params, auth)=>{
        const err = requireRole(auth, [
            "admin"
        ]);
        if (err) return err;
        const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().users.get(params.id);
        if (!user) return fail("User not found", 404);
        const { role } = await parseBody(req);
        if (![
            "investor",
            "project_owner",
            "admin"
        ].includes(role)) return fail("Invalid role", 400);
        user.role = role;
        user.updatedAt = new Date().toISOString();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().users.set(user.id, user);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$notifications$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["dispatchNotificationEvent"])({
            kind: "role_changed",
            userId: user.id,
            role
        });
        return ok((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sanitizeUser"])(user));
    },
    "GET /admin/projects": async (req, _p, auth)=>{
        const err = requireRole(auth, [
            "admin"
        ]);
        if (err) return err;
        const { searchParams } = new URL(req.url);
        let projects = Array.from((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().projects.values());
        const status = searchParams.get("status");
        if (status) projects = projects.filter((p)=>p.status === status);
        projects.sort((a, b)=>{
            const pendingRank = (s)=>s === "pending_review" ? 0 : 1;
            const rank = pendingRank(a.status) - pendingRank(b.status);
            if (rank !== 0) return rank;
            const aTime = new Date(a.submittedAt || a.createdAt).getTime();
            const bTime = new Date(b.submittedAt || b.createdAt).getTime();
            return bTime - aTime;
        });
        return ok((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["paginate"])(projects, Number(searchParams.get("page") || 1), Number(searchParams.get("limit") || 20)));
    },
    "GET /admin/projects/pending": async (_req, _p, auth)=>{
        const err = requireRole(auth, [
            "admin"
        ]);
        if (err) return err;
        const projects = Array.from((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().projects.values()).filter((p)=>p.status === "pending_review").sort((a, b)=>new Date(b.submittedAt || b.createdAt).getTime() - new Date(a.submittedAt || a.createdAt).getTime());
        return ok(projects);
    },
    "GET /admin/projects/:id": async (_req, params, auth)=>{
        const err = requireRole(auth, [
            "admin"
        ]);
        if (err) return err;
        const project = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().projects.get(params.id);
        if (!project) return fail("Project not found", 404);
        const owner = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().users.get(project.ownerId);
        const ownerProjects = Array.from((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().projects.values()).filter((p)=>p.ownerId === project.ownerId);
        return ok({
            project,
            owner: owner ? {
                id: owner.id,
                email: owner.email,
                firstName: owner.firstName,
                lastName: owner.lastName,
                companyName: owner.companyName,
                bio: owner.bio,
                kycStatus: owner.kycStatus,
                createdAt: owner.createdAt,
                previousProjects: ownerProjects.length
            } : null,
            riskAnalysis: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["analyzeProjectRisk"])(project),
            reviewHistory: project.reviewHistory || []
        });
    },
    "GET /admin/projects/:id/review-history": async (_req, params, auth)=>{
        const err = requireRole(auth, [
            "admin"
        ]);
        if (err) return err;
        const project = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().projects.get(params.id);
        if (!project) return fail("Project not found", 404);
        return ok(project.reviewHistory || []);
    },
    "POST /admin/projects/:id/approve": async (_req, params, auth)=>{
        const err = requireRole(auth, [
            "admin"
        ]);
        if (err) return err;
        const project = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().projects.get(params.id);
        if (!project) return fail("Project not found", 404);
        if (project.status !== "pending_review" && project.status !== "draft") {
            return fail("Only projects awaiting review can be approved", 400);
        }
        const admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().users.get(auth.sub);
        if (!admin) return fail("Admin not found", 404);
        const { approveProject } = await __turbopack_context__.A("[project]/lib/server/project-review.ts [app-route] (ecmascript, async loader)");
        return ok(approveProject(project, admin), "Project approved and published");
    },
    "POST /admin/projects/:id/reject": async (req, params, auth)=>{
        const err = requireRole(auth, [
            "admin"
        ]);
        if (err) return err;
        const project = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().projects.get(params.id);
        if (!project) return fail("Project not found", 404);
        if (project.status !== "pending_review" && project.status !== "draft") {
            return fail("Only projects awaiting review can be rejected", 400);
        }
        const { reason } = await parseBody(req);
        const trimmed = (reason || "").trim();
        if (trimmed.length < 20) {
            return fail("Rejection reason must be at least 20 characters", 400);
        }
        const admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().users.get(auth.sub);
        if (!admin) return fail("Admin not found", 404);
        const { rejectProject } = await __turbopack_context__.A("[project]/lib/server/project-review.ts [app-route] (ecmascript, async loader)");
        return ok(rejectProject(project, admin, trimmed), "Project rejected");
    },
    "POST /owner/projects/:id/resubmit": async (_req, params, auth)=>{
        const err = requireRole(auth, [
            "project_owner"
        ]);
        if (err) return err;
        const project = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().projects.get(params.id);
        if (!project) return fail("Project not found", 404);
        if (project.ownerId !== auth.sub) return fail("Forbidden", 403);
        if (project.status !== "rejected" && project.status !== "draft") {
            return fail("Only rejected or draft projects can be resubmitted", 400);
        }
        const { markSubmitted } = await __turbopack_context__.A("[project]/lib/server/project-review.ts [app-route] (ecmascript, async loader)");
        const updated = markSubmitted(project, auth.sub, "resubmitted");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logActivity"])(auth.sub, "project_resubmitted", "project", project.id);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$notifications$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["dispatchNotificationEvent"])({
            kind: "project_status_changed",
            project: updated,
            status: "pending_review"
        });
        return ok(updated, "Project resubmitted for review");
    },
    "PATCH /admin/projects/:id/status": async (req, params, auth)=>{
        const err = requireRole(auth, [
            "admin"
        ]);
        if (err) return err;
        const project = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().projects.get(params.id);
        if (!project) return fail("Project not found", 404);
        const { status, reason } = await parseBody(req);
        const admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().users.get(auth.sub);
        if (!admin) return fail("Admin not found", 404);
        if (status === "published" || status === "rejected") {
            const { approveProject, rejectProject } = await __turbopack_context__.A("[project]/lib/server/project-review.ts [app-route] (ecmascript, async loader)");
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
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().projects.set(project.id, project);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logActivity"])(auth.sub, "project_status_updated", "project", project.id, {
            status
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$notifications$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["dispatchNotificationEvent"])({
            kind: "project_status_changed",
            project,
            status
        });
        return ok(project);
    },
    "GET /admin/payments": async (_req, _p, auth)=>{
        const err = requireRole(auth, [
            "admin"
        ]);
        if (err) return err;
        return ok(Array.from((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().subscriptions.values()));
    },
    "GET /admin/security": async (_req, _p, auth)=>{
        const err = requireRole(auth, [
            "admin"
        ]);
        if (err) return err;
        return ok({
            activityLogs: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().activityLogs.slice(0, 100),
            flaggedMessages: Array.from((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().messages.values()).flat().filter((m)=>m.isFlagged).slice(0, 50),
            pendingKyc: Array.from((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().kyc.values()).filter((k)=>k?.status === "pending")
        });
    },
    "GET /admin/complaints": async (_req, _p, auth)=>{
        const err = requireRole(auth, [
            "admin"
        ]);
        if (err) return err;
        return ok((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().complaints);
    },
    "POST /admin/complaints": async (req, _p, auth)=>{
        const err = requireAuth(auth);
        if (err) return err;
        const body = await parseBody(req);
        const complaint = {
            id: crypto.randomUUID(),
            reporterId: auth.sub,
            againstUserId: body.againstUserId,
            projectId: body.projectId,
            subject: body.subject,
            description: body.description,
            status: "open",
            createdAt: new Date().toISOString()
        };
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().complaints.push(complaint);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$notifications$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["dispatchNotificationEvent"])({
            kind: "complaint_filed",
            complaint
        });
        return ok(complaint, undefined, 201);
    },
    "GET /milestones": async (req, _p, auth)=>{
        const err = requireAuth(auth);
        if (err) return err;
        const { searchParams } = new URL(req.url);
        let list = Array.from((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().milestonePlans.values());
        if (auth.role === "investor") list = list.filter((m)=>m.investorId === auth.sub);
        else if (auth.role === "project_owner") list = list.filter((m)=>m.ownerId === auth.sub);
        const projectId = searchParams.get("projectId");
        if (projectId) list = list.filter((m)=>m.projectId === projectId);
        const status = searchParams.get("status");
        if (status) list = list.filter((m)=>m.status === status);
        list.sort((a, b)=>b.updatedAt.localeCompare(a.updatedAt));
        return ok(list);
    },
    "GET /milestones/:id": async (_req, params, auth)=>{
        const err = requireAuth(auth);
        if (err) return err;
        const plan = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().milestonePlans.get(params.id);
        if (!plan) return fail("Milestone plan not found", 404);
        const allowed = auth.role === "admin" || auth.sub === plan.investorId || auth.sub === plan.ownerId;
        if (!allowed) return fail("Forbidden", 403);
        return ok(plan);
    },
    "POST /milestones": async (req, _p, auth)=>{
        const err = requireRole(auth, [
            "investor"
        ]);
        if (err) return err;
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$rbac$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["hasActiveServiceAccess"])(authUserObj(auth))) {
            return fail("Platform service access required", 403);
        }
        const body = await parseBody(req);
        const project = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().projects.get(body.projectId);
        if (!project || project.status !== "published" && project.status !== "funded") {
            return fail("Project not available", 404);
        }
        const investor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().users.get(auth.sub);
        const owner = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().users.get(project.ownerId);
        const now = new Date().toISOString();
        const items = (body.items || []).map((item, idx)=>({
                id: crypto.randomUUID(),
                title: item.title,
                titleHy: item.titleHy,
                description: item.description,
                descriptionHy: item.descriptionHy,
                amount: Number(item.amount) || 0,
                dueDate: item.dueDate,
                status: "proposed",
                sortOrder: idx
            }));
        if (items.length === 0) return fail("At least one milestone item is required", 400);
        const plan = {
            id: crypto.randomUUID(),
            projectId: project.id,
            projectTitle: project.title,
            investorId: auth.sub,
            investorName: `${investor.firstName} ${investor.lastName}`,
            ownerId: project.ownerId,
            ownerName: owner ? `${owner.firstName} ${owner.lastName}` : project.ownerName || "",
            items,
            status: "proposed",
            notes: body.notes,
            createdAt: now,
            updatedAt: now
        };
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().milestonePlans.set(plan.id, plan);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logActivity"])(auth.sub, "milestone_created", "milestone", plan.id);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$notifications$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["dispatchNotificationEvent"])({
            kind: "milestone_created",
            plan
        });
        return ok(plan, "Milestone plan created", 201);
    },
    "PATCH /milestones/:id": async (req, params, auth)=>{
        const err = requireRole(auth, [
            "investor",
            "project_owner",
            "admin"
        ]);
        if (err) return err;
        const plan = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().milestonePlans.get(params.id);
        if (!plan) return fail("Milestone plan not found", 404);
        const isOwner = auth.sub === plan.ownerId;
        const isInvestor = auth.sub === plan.investorId;
        if (auth.role !== "admin" && !isOwner && !isInvestor) return fail("Forbidden", 403);
        const body = await parseBody(req);
        if (body.status) plan.status = body.status;
        if (body.items) plan.items = body.items;
        if (typeof body.notes === "string") plan.notes = body.notes;
        if (typeof body.ownerResponse === "string" && (isOwner || auth.role === "admin")) {
            plan.ownerResponse = body.ownerResponse;
        }
        plan.updatedAt = new Date().toISOString();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStore"])().milestonePlans.set(plan.id, plan);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logActivity"])(auth.sub, "milestone_updated", "milestone", plan.id, {
            status: plan.status
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$notifications$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["dispatchNotificationEvent"])({
            kind: "milestone_updated",
            plan,
            actorId: auth.sub
        });
        return ok(plan);
    },
    "POST /uploads": async (req, _p, auth)=>{
        const err = requireAuth(auth);
        if (err) return err;
        const body = await parseBody(req);
        const name = body.name || `upload-${Date.now()}.bin`;
        const size = typeof body.size === "number" ? body.size : 0;
        const { storeUploadedFile } = await __turbopack_context__.A("[project]/lib/server/storage.ts [app-route] (ecmascript, async loader)");
        const stored = await storeUploadedFile({
            name,
            size,
            category: body.category,
            userId: auth.sub
        });
        return ok(stored, "Upload accepted", 201);
    },
    "POST /contact": async (req)=>{
        const body = await parseBody(req);
        if (!body.email || !body.message) return fail("Email and message required", 400);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$notifications$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["dispatchNotificationEvent"])({
            kind: "contact_form",
            name: body.name || "Visitor",
            email: body.email
        });
        return ok(null, "Message received. Our team will respond shortly.");
    }
};
function matchRoute(method, path) {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    const key = `${method} ${normalizedPath}`;
    if (handlers[key]) return {
        handler: handlers[key],
        params: {}
    };
    for (const pattern of Object.keys(handlers)){
        const spaceIdx = pattern.indexOf(" ");
        const m = pattern.slice(0, spaceIdx);
        const p = pattern.slice(spaceIdx + 1);
        if (m !== method) continue;
        const patternParts = p.split("/").filter(Boolean);
        const pathParts = normalizedPath.split("/").filter(Boolean);
        if (patternParts.length !== pathParts.length) continue;
        const params = {};
        let match = true;
        for(let i = 0; i < patternParts.length; i++){
            if (patternParts[i].startsWith(":")) {
                params[patternParts[i].slice(1)] = pathParts[i];
            } else if (patternParts[i] !== pathParts[i]) {
                match = false;
                break;
            }
        }
        if (match) return {
            handler: handlers[pattern],
            params
        };
    }
    return null;
}
async function handleApiRequest(req, pathSegments) {
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
}),
"[project]/app/api/v1/[...path]/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DELETE",
    ()=>DELETE,
    "GET",
    ()=>GET,
    "PATCH",
    ()=>PATCH,
    "POST",
    ()=>POST,
    "PUT",
    ()=>PUT,
    "dynamic",
    ()=>dynamic,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$api$2d$router$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/api-router.ts [app-route] (ecmascript)");
;
const runtime = "nodejs";
const dynamic = "force-dynamic";
async function handler(req, context) {
    const { path } = await context.params;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$api$2d$router$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["handleApiRequest"])(req, path);
}
const GET = handler;
const POST = handler;
const PATCH = handler;
const PUT = handler;
const DELETE = handler;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__c9748be1._.js.map