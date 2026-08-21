export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined"
    ? "/api/v1"
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/api/v1`
      : "/api/v1");

export const PLATFORM_NAME = "InvestPro";

export const ROUTES = {
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
  INVESTMENTS: "/investor/investments",
} as const;

export const PROJECT_CATEGORIES = [
  "Technology",
  "FinTech",
  "Healthcare",
  "Clean Energy",
  "Real Estate",
  "Agriculture",
  "E-Commerce",
  "AI & ML",
  "Infrastructure",
  "Other",
] as const;

export const PROJECT_INDUSTRIES = [
  "Software",
  "Biotechnology",
  "Renewable Energy",
  "Financial Services",
  "Manufacturing",
  "Consumer Goods",
  "Education",
  "Logistics",
  "Media",
  "Other",
] as const;

export const PROJECT_STAGES = [
  { value: "idea", label: "Idea" },
  { value: "mvp", label: "MVP" },
  { value: "early_revenue", label: "Early Revenue" },
  { value: "growth", label: "Growth" },
  { value: "expansion", label: "Expansion" },
] as const;

export const DOCUMENT_CATEGORIES = [
  { value: "business_plan", label: "Business Plan" },
  { value: "pitch_deck", label: "Pitch Deck" },
  { value: "technical", label: "Technical Documentation" },
  { value: "legal", label: "Legal Documents" },
  { value: "certificate", label: "Certificates" },
  { value: "contract", label: "Contracts" },
  { value: "finance_plan", label: "Finance Plan" },
  { value: "image", label: "Images" },
  { value: "video", label: "Videos" },
  { value: "other", label: "Other" },
] as const;

export const TEAM_ROLES = [
  { value: "engineer", label: "Engineer" },
  { value: "developer", label: "Developer" },
  { value: "designer", label: "Designer" },
  { value: "advisor", label: "Advisor" },
  { value: "member", label: "Team Member" },
] as const;

export const RISK_LEVELS = [
  { value: "low", label: "Low Risk", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
  { value: "medium", label: "Medium Risk", color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
  { value: "high", label: "High Risk", color: "text-red-600", bg: "bg-red-50 border-red-200" },
] as const;

export const STATUS_COLORS: Record<string, string> = {
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
  dismissed: "bg-slate-100 text-slate-600 border-slate-200",
};

export const MEMBERSHIP_FEATURES = {
  none: ["Browse project titles", "Limited marketplace preview", "Risk score preview"],
  service: [
    "Full project materials & data room",
    "Documents, team, and financial detail",
    "Direct platform messaging",
    "Send investment offers",
    "Full risk analysis reports",
    "Milestone planning with owners",
  ],
} as const;

export const QUERY_KEYS = {
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
  ACTIVITY_LOGS: "activity-logs",
} as const;

export const DEFAULT_PAGE_SIZE = 10;

export const CONTACT_BLOCKED_PATTERNS = [
  /\b[\w.+-]+@[\w-]+\.[\w.]+\b/i,
  /\b(?:\+?\d[\d\s().-]{7,}\d)\b/,
  /https?:\/\/[^\s]+/i,
  /(?:www\.)[^\s]+/i,
  /(?:discord\.gg|discord\.com\/invite)\/\S+/i,
  /t\.me\/\S+/i,
  /wa\.me\/\S+|whatsapp\.me\/\S+/i,
  /(?:^|[\s])@[a-zA-Z0-9_]{3,}/,
  /\b(?:whatsapp|telegram|signal|skype|wechat|discord)\b/i,
  /\b(?:call me|email me|text me|dm me|contact me at|message me at)\b/i,
];
