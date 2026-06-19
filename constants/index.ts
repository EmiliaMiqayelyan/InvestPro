export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined"
    ? "/api/v1"
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/api/v1`
      : "/api/v1");

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  VERIFY_EMAIL: "/verify-email",
  TWO_FACTOR: "/two-factor",
  DASHBOARD: "/dashboard",
  WALLET: "/wallet",
  DEPOSIT: "/deposit",
  WITHDRAW: "/withdraw",
  DEPOSIT_CRYPTO: "/deposit/crypto",
  WITHDRAW_CRYPTO: "/withdraw/crypto",
  WALLET_ADDRESSES: "/wallet/addresses",
  DEPOSIT_HISTORY: "/deposit/history",
  WITHDRAW_HISTORY: "/withdraw/history",
  PROJECTS: "/projects",
  INVESTMENTS: "/investments",
  TRANSACTIONS: "/transactions",
  NOTIFICATIONS: "/notifications",
  PROFILE: "/profile",
  SECURITY: "/security",
  KYC: "/kyc",
  ADMIN: "/admin",
  ADMIN_USERS: "/admin/users",
  ADMIN_PROJECTS: "/admin/projects",
  ADMIN_TRANSACTIONS: "/admin/transactions",
  ADMIN_DEPOSITS: "/admin/deposits",
  ADMIN_WITHDRAWALS: "/admin/withdrawals",
  ADMIN_KYC: "/admin/kyc",
  ADMIN_NOTIFICATIONS: "/admin/notifications",
  ADMIN_SETTINGS: "/admin/settings",
} as const;

export const CRYPTO_CURRENCIES = [
  { value: "BTC", label: "Bitcoin (BTC)", network: "Bitcoin" },
  { value: "ETH", label: "Ethereum (ETH)", network: "Ethereum" },
  { value: "USDT_TRC20", label: "USDT (TRC20)", network: "TRON" },
  { value: "USDT_ERC20", label: "USDT (ERC20)", network: "Ethereum" },
  { value: "USDC", label: "USDC", network: "Ethereum" },
] as const;

export const PAYMENT_METHODS = [
  { value: "mastercard", label: "MasterCard", icon: "credit-card" },
  { value: "visa", label: "Visa", icon: "credit-card" },
  { value: "cryptocurrency", label: "Cryptocurrency", icon: "bitcoin" },
] as const;

export const PROJECT_CATEGORIES = [
  "Real Estate",
  "Technology",
  "Energy",
  "Healthcare",
  "Agriculture",
  "Finance",
  "Infrastructure",
  "Other",
] as const;

export const RISK_LEVELS = [
  { value: "low", label: "Low Risk", color: "text-emerald-400" },
  { value: "medium", label: "Medium Risk", color: "text-yellow-400" },
  { value: "high", label: "High Risk", color: "text-red-400" },
] as const;

export const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  approved: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  completed: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  rejected: "bg-red-500/20 text-red-400 border-red-500/30",
  failed: "bg-red-500/20 text-red-400 border-red-500/30",
  active: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  upcoming: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  cancelled: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  not_submitted: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  resubmission_requested: "bg-orange-500/20 text-orange-400 border-orange-500/30",
};

export const QUERY_KEYS = {
  AUTH: "auth",
  USER: "user",
  WALLET: "wallet",
  DEPOSITS: "deposits",
  WITHDRAWALS: "withdrawals",
  TRANSACTIONS: "transactions",
  PROJECTS: "projects",
  INVESTMENTS: "investments",
  NOTIFICATIONS: "notifications",
  KYC: "kyc",
  DASHBOARD: "dashboard",
  ADMIN_STATS: "admin-stats",
  ADMIN_USERS: "admin-users",
  CRYPTO_ADDRESSES: "crypto-addresses",
} as const;

export const DEFAULT_PAGE_SIZE = 10;
