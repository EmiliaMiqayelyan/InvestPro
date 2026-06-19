import type {
  AdminStats,
  CryptoWalletAddress,
  DashboardStats,
  Deposit,
  Investment,
  KycSubmission,
  Notification,
  PortfolioData,
  Project,
  Transaction,
  User,
  Wallet,
  Withdrawal,
} from "@/types";

export interface StoredUser extends User {
  password: string;
}

export interface DevStore {
  users: Map<string, StoredUser>;
  sessions: Map<string, string>;
  refreshTokens: Map<string, string>;
  wallets: Map<string, Wallet>;
  projects: Project[];
  transactions: Map<string, Transaction[]>;
  deposits: Map<string, Deposit[]>;
  withdrawals: Map<string, Withdrawal[]>;
  investments: Map<string, Investment[]>;
  notifications: Map<string, Notification[]>;
  kyc: Map<string, KycSubmission | null>;
  cryptoAddresses: Map<string, CryptoWalletAddress[]>;
}

function generateChartData(days = 30, base = 10000): PortfolioData[] {
  const data: PortfolioData[] = [];
  let value = base;
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    value += (Math.random() - 0.4) * 500;
    data.push({
      date: date.toISOString().split("T")[0],
      value: Math.round(value * 100) / 100,
      profit: Math.round((Math.random() * 200 - 50) * 100) / 100,
    });
  }
  return data;
}

function createId(): string {
  return crypto.randomUUID();
}

function seedProjects(): Project[] {
  return [
    {
      id: "proj-1",
      title: "Solar Energy Farm",
      slug: "solar-energy-farm",
      category: "Energy",
      description: "Large-scale solar farm generating clean renewable energy with stable returns.",
      fullDescription:
        "This project funds a 50MW solar energy farm in Nevada. Expected annual energy production will power 15,000 homes. Investors receive quarterly profit distributions based on energy sales.",
      image: "",
      fundingGoal: 500000,
      currentAmount: 325000,
      roiPercentage: 12.5,
      investmentPeriod: 365,
      riskLevel: "low",
      status: "active",
      investorCount: 142,
      minInvestment: 100,
      maxInvestment: 50000,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 365 * 86400000).toISOString(),
      faqs: [
        { id: "f1", question: "When do I receive returns?", answer: "Quarterly distributions." },
        { id: "f2", question: "Is my investment insured?", answer: "Project assets are insured." },
      ],
      createdAt: new Date().toISOString(),
    },
    {
      id: "proj-2",
      title: "Tech Startup Accelerator",
      slug: "tech-startup-accelerator",
      category: "Technology",
      description: "Invest in a portfolio of early-stage tech startups with high growth potential.",
      fullDescription:
        "Diversified portfolio of 10 vetted startups in AI, fintech, and healthtech sectors.",
      image: "",
      fundingGoal: 1000000,
      currentAmount: 680000,
      roiPercentage: 18,
      investmentPeriod: 180,
      riskLevel: "high",
      status: "active",
      investorCount: 89,
      minInvestment: 500,
      maxInvestment: 100000,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 180 * 86400000).toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: "proj-3",
      title: "Urban Real Estate Fund",
      slug: "urban-real-estate-fund",
      category: "Real Estate",
      description: "Premium commercial real estate in major metropolitan areas.",
      fullDescription: "Mixed-use commercial properties in NYC, LA, and Chicago with long-term tenants.",
      image: "",
      fundingGoal: 2000000,
      currentAmount: 2000000,
      roiPercentage: 9.5,
      investmentPeriod: 730,
      riskLevel: "medium",
      status: "completed",
      investorCount: 256,
      minInvestment: 1000,
      maxInvestment: 250000,
      startDate: new Date(Date.now() - 400 * 86400000).toISOString(),
      endDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
  ];
}

function createUser(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  role: "user" | "admin" = "user"
): StoredUser {
  const now = new Date().toISOString();
  return {
    id: createId(),
    email,
    password,
    firstName,
    lastName,
    role,
    isEmailVerified: true,
    is2faEnabled: false,
    kycStatus: "not_submitted",
    createdAt: now,
    updatedAt: now,
  };
}

function createWallet(userId: string): Wallet {
  return {
    id: createId(),
    userId,
    availableBalance: 10000,
    pendingBalance: 0,
    totalBalance: 10000,
    currency: "USD",
    updatedAt: new Date().toISOString(),
  };
}

function initStore(): DevStore {
  const users = new Map<string, StoredUser>();
  const admin = createUser("admin@investpro.com", "admin123", "Admin", "User", "admin");
  const demo = createUser("demo@investpro.com", "demo123", "Demo", "User", "user");
  users.set(admin.id, admin);
  users.set(demo.id, demo);

  const wallets = new Map<string, Wallet>();
  wallets.set(admin.id, createWallet(admin.id));
  wallets.set(demo.id, createWallet(demo.id));

  return {
    users,
    sessions: new Map(),
    refreshTokens: new Map(),
    wallets,
    projects: seedProjects(),
    transactions: new Map(),
    deposits: new Map(),
    withdrawals: new Map(),
    investments: new Map(),
    notifications: new Map(),
    kyc: new Map(),
    cryptoAddresses: new Map(),
  };
}

const globalForStore = globalThis as unknown as { __devStore?: DevStore };

export function getStore(): DevStore {
  if (!globalForStore.__devStore) {
    globalForStore.__devStore = initStore();
  }
  return globalForStore.__devStore;
}

export function getChartData(base = 10000): PortfolioData[] {
  return generateChartData(30, base);
}

export function sanitizeUser(user: StoredUser): User {
  const { password: _, ...safe } = user;
  return safe;
}

export function paginate<T>(items: T[], page = 1, limit = 10) {
  const p = Math.max(1, Number(page) || 1);
  const l = Math.max(1, Number(limit) || 10);
  const start = (p - 1) * l;
  return {
    data: items.slice(start, start + l),
    total: items.length,
    page: p,
    limit: l,
    totalPages: Math.max(1, Math.ceil(items.length / l)),
  };
}

export function getAdminStats(): AdminStats {
  const store = getStore();
  return {
    totalUsers: store.users.size,
    activeUsers: store.users.size,
    totalDeposits: 125000,
    totalWithdrawals: 45000,
    pendingDeposits: 3,
    pendingWithdrawals: 2,
    totalInvestments: 89000,
    pendingKyc: 1,
    totalProjects: store.projects.length,
  };
}

export function getDashboardStats(userId: string): DashboardStats {
  const wallet = getStore().wallets.get(userId);
  return {
    totalBalance: wallet?.totalBalance ?? 0,
    activeInvestments: 2,
    totalProfit: 2450.75,
    totalLoss: 120.5,
    portfolioValue: wallet?.totalBalance ?? 0,
    pendingTransactions: 1,
  };
}
