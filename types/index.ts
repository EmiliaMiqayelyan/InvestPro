export type UserRole = "user" | "admin";

export type TransactionStatus = "pending" | "approved" | "rejected" | "completed" | "failed";
export type ProjectStatus = "active" | "completed" | "upcoming";
export type RiskLevel = "low" | "medium" | "high";
export type KycStatus = "not_submitted" | "pending" | "approved" | "rejected" | "resubmission_requested";
export type NotificationType =
  | "deposit_success"
  | "withdrawal_success"
  | "investment_success"
  | "admin_message"
  | "kyc_update"
  | "security_alert"
  | "general";

export type PaymentMethod = "mastercard" | "visa" | "cryptocurrency";
export type CryptoCurrency = "BTC" | "ETH" | "USDT_TRC20" | "USDT_ERC20" | "USDC";
export type TransactionType = "deposit" | "withdrawal" | "investment" | "profit" | "refund";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  phone?: string;
  role: UserRole;
  isEmailVerified: boolean;
  is2faEnabled: boolean;
  kycStatus: KycStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
  requires2fa?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
}

export interface Wallet {
  id: string;
  userId: string;
  availableBalance: number;
  pendingBalance: number;
  totalBalance: number;
  currency: string;
  updatedAt: string;
}

export interface Deposit {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  cryptoCurrency?: CryptoCurrency;
  cryptoAddress?: string;
  txHash?: string;
  status: TransactionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Withdrawal {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  cryptoCurrency?: CryptoCurrency;
  destinationAddress?: string;
  bankDetails?: Record<string, string>;
  status: TransactionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  currency: string;
  status: TransactionStatus;
  description: string;
  referenceId?: string;
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  fullDescription: string;
  image: string;
  fundingGoal: number;
  currentAmount: number;
  roiPercentage: number;
  investmentPeriod: number;
  riskLevel: RiskLevel;
  status: ProjectStatus;
  investorCount: number;
  minInvestment: number;
  maxInvestment: number;
  startDate: string;
  endDate: string;
  documents?: ProjectDocument[];
  faqs?: ProjectFaq[];
  createdAt: string;
}

export interface ProjectDocument {
  id: string;
  name: string;
  url: string;
  type: string;
}

export interface ProjectFaq {
  id: string;
  question: string;
  answer: string;
}

export interface InvestmentPlan {
  id: string;
  projectId: string;
  name: string;
  minAmount: number;
  maxAmount: number;
  roiPercentage: number;
  duration: number;
  description: string;
}

export interface Investment {
  id: string;
  userId: string;
  projectId: string;
  project?: Project;
  planId?: string;
  amount: number;
  expectedReturn: number;
  currentReturn: number;
  roiPercentage: number;
  status: "active" | "completed" | "cancelled";
  startDate: string;
  endDate: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface KycSubmission {
  id: string;
  userId: string;
  status: KycStatus;
  idDocumentUrl: string;
  selfieUrl: string;
  addressProofUrl: string;
  rejectionReason?: string;
  submittedAt: string;
  reviewedAt?: string;
}

export interface DashboardStats {
  totalBalance: number;
  activeInvestments: number;
  totalProfit: number;
  totalLoss: number;
  portfolioValue: number;
  pendingTransactions: number;
}

export interface PortfolioData {
  date: string;
  value: number;
  profit: number;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalDeposits: number;
  totalWithdrawals: number;
  pendingDeposits: number;
  pendingWithdrawals: number;
  totalInvestments: number;
  pendingKyc: number;
  totalProjects: number;
}

export interface CryptoWalletAddress {
  id: string;
  currency: CryptoCurrency;
  address: string;
  network: string;
  label?: string;
}

export interface FilterParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  type?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
