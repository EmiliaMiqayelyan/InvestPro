export type UserRole = "investor" | "project_owner" | "admin";

/** Single platform service fee access (not investment capital). */
export type MembershipPlanId = "service";
export type MembershipTier = "none" | MembershipPlanId;

export type ProjectStatus =
  | "draft"
  | "pending_review"
  | "published"
  | "funded"
  | "closed"
  | "rejected";

export type ProjectStage =
  | "idea"
  | "mvp"
  | "early_revenue"
  | "growth"
  | "expansion";

export type RiskLevel = "low" | "medium" | "high";
export type OfferStatus = "pending" | "accepted" | "rejected" | "negotiating";
export type KycStatus =
  | "not_submitted"
  | "pending"
  | "approved"
  | "rejected"
  | "resubmission_requested";

export type DocumentCategory =
  | "business_plan"
  | "pitch_deck"
  | "technical"
  | "legal"
  | "certificate"
  | "contract"
  | "finance_plan"
  | "image"
  | "video"
  | "other";

export type TeamRole =
  | "engineer"
  | "developer"
  | "designer"
  | "advisor"
  | "member";

export type NotificationType =
  | "offer_received"
  | "offer_updated"
  | "message"
  | "membership"
  | "kyc_update"
  | "project_update"
  | "security_alert"
  | "milestone_update"
  | "complaint"
  | "user_update"
  | "general";

export type NotificationPriority = "normal" | "high";

export type PhaseStatus = "planned" | "active" | "completed";

export type MilestoneItemStatus =
  | "proposed"
  | "agreed"
  | "in_progress"
  | "done"
  | "cancelled";

export type MilestonePlanStatus =
  | "draft"
  | "proposed"
  | "negotiating"
  | "agreed"
  | "active"
  | "completed"
  | "cancelled";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  phone?: string;
  role: UserRole;
  membershipTier: MembershipTier;
  membershipExpiresAt?: string;
  isEmailVerified: boolean;
  is2faEnabled: boolean;
  kycStatus: KycStatus;
  companyName?: string;
  bio?: string;
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

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  positionHy?: string;
  role: TeamRole;
  experience: string;
  experienceHy?: string;
  biography: string;
  biographyHy?: string;
  portfolio?: string;
  avatar?: string;
}

export interface ProjectDocument {
  id: string;
  name: string;
  nameHy?: string;
  url: string;
  category: DocumentCategory;
  size?: number;
  uploadedAt: string;
}

export interface ProjectUpdate {
  id: string;
  title: string;
  titleHy?: string;
  content: string;
  contentHy?: string;
  createdAt: string;
}

export interface ProjectPhase {
  id: string;
  title: string;
  titleHy?: string;
  description: string;
  descriptionHy?: string;
  budgetAsk: number;
  durationWeeks?: number;
  deliverables: string[];
  deliverablesHy?: string[];
  sortOrder: number;
  status: PhaseStatus;
}

export interface Project {
  id: string;
  ownerId: string;
  ownerName?: string;
  ownerKycStatus?: KycStatus;
  title: string;
  titleHy?: string;
  slug: string;
  description: string;
  descriptionHy?: string;
  fullDescription: string;
  fullDescriptionHy?: string;
  category: string;
  categoryHy?: string;
  industry: string;
  industryHy?: string;
  location: string;
  locationHy?: string;
  stage: ProjectStage;
  timeline: string;
  timelineHy?: string;
  image: string;
  requiredInvestment: number;
  minInvestment: number;
  currentFunding: number;
  views: number;
  expectedRoi: number;
  revenueModel: string;
  revenueModelHy?: string;
  financialProjections: string;
  financialProjectionsHy?: string;
  investmentPlan: string;
  investmentPlanHy?: string;
  businessModel: string;
  businessModelHy?: string;
  budgetBreakdown?: { label: string; labelHy?: string; percent: number }[];
  phases: ProjectPhase[];
  riskLevel: RiskLevel;
  status: ProjectStatus;
  investorCount: number;
  savedCount: number;
  team: TeamMember[];
  documents: ProjectDocument[];
  updates: ProjectUpdate[];
  startDate?: string;
  endDate?: string;
  /** When the owner submitted (or resubmitted) for admin review */
  submittedAt?: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectedAt?: string;
  rejectedBy?: string;
  rejectionReason?: string;
  reviewHistory?: ProjectReviewEntry[];
  createdAt: string;
  updatedAt: string;
  /** Present when API returns a teaser for non-subscribers */
  limited?: boolean;
}

export type ProjectReviewDecision = "submitted" | "approved" | "rejected" | "resubmitted";

export interface ProjectReviewEntry {
  id: string;
  projectId: string;
  reviewerId?: string;
  reviewerName?: string;
  decision: ProjectReviewDecision;
  reason?: string;
  createdAt: string;
}

export interface RiskIndicator {
  label: string;
  labelHy?: string;
  detail: string;
  detailHy?: string;
}

export interface RiskAnalysis {
  projectId: string;
  score: number;
  level: RiskLevel;
  completeness: number;
  positiveIndicators: RiskIndicator[];
  warningIndicators: RiskIndicator[];
  missingDocuments: string[];
  missingDocumentsHy?: string[];
  questionsToAsk: string[];
  questionsToAskHy?: string[];
  summary: string;
  summaryHy?: string;
  phaseBudgetTotal?: number;
  phaseBudgetGap?: number;
  generatedAt: string;
  limited?: boolean;
}

export interface MembershipPlan {
  id: MembershipPlanId;
  name: string;
  nameHy?: string;
  price: number;
  billingPeriod: "monthly" | "yearly";
  description: string;
  descriptionHy?: string;
  features: string[];
  featuresHy?: string[];
  highlighted?: boolean;
}

export interface MembershipSubscription {
  id: string;
  userId: string;
  planId: MembershipPlanId;
  status: "active" | "cancelled" | "expired" | "pending";
  startedAt: string;
  expiresAt: string;
  amount: number;
  stripeSessionId?: string;
}

export interface InvestmentOffer {
  id: string;
  projectId: string;
  projectTitle?: string;
  investorId: string;
  investorName?: string;
  ownerId: string;
  amount: number;
  conditions: string;
  questions: string;
  notes: string;
  status: OfferStatus;
  ownerResponse?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MilestoneItem {
  id: string;
  title: string;
  titleHy?: string;
  description?: string;
  descriptionHy?: string;
  amount: number;
  dueDate?: string;
  status: MilestoneItemStatus;
  sortOrder: number;
}

export interface MilestonePlan {
  id: string;
  projectId: string;
  projectTitle?: string;
  investorId: string;
  investorName?: string;
  ownerId: string;
  ownerName?: string;
  items: MilestoneItem[];
  status: MilestonePlanStatus;
  notes?: string;
  ownerResponse?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  content: string;
  attachmentUrl?: string;
  attachmentName?: string;
  isFlagged?: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  projectId: string;
  projectTitle: string;
  investorId: string;
  investorName: string;
  ownerId: string;
  ownerName: string;
  /** Admin ↔ owner review thread (investorId holds the admin user id) */
  isAdminThread?: boolean;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
  createdAt: string;
}

export interface SavedProject {
  projectId: string;
  savedAt: string;
}

export interface InvestorInvestment {
  id: string;
  offerId: string;
  projectId: string;
  project?: Project;
  amount: number;
  status: "active" | "completed" | "cancelled";
  expectedReturn: number;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface Complaint {
  id: string;
  reporterId: string;
  againstUserId?: string;
  projectId?: string;
  subject: string;
  description: string;
  status: "open" | "reviewing" | "resolved" | "dismissed";
  createdAt: string;
}

export interface Dispute {
  id: string;
  reporterId: string;
  againstUserId?: string;
  projectId?: string;
  investmentId?: string;
  subject: string;
  description: string;
  status: string;
  resolution?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  createdAt: string;
}

export interface Wallet {
  id: string;
  userId: string;
  currency: string;
  availableBalance: number;
  pendingBalance: number;
  investedBalance: number;
  totalBalance: number;
  createdAt: string;
  updatedAt: string;
}

export interface WalletTransaction {
  id: string;
  walletId: string;
  type: string;
  amount: number;
  currency: string;
  referenceType?: string;
  referenceId?: string;
  balanceBefore: number;
  balanceAfter: number;
  status: string;
  description?: string;
  createdAt: string;
}

export interface PortfolioSummary {
  totalInvested: number;
  currentValue: number;
  totalReturns: number;
  realizedReturns: number;
  unrealizedReturns: number;
  activeInvestments: number;
  completedInvestments: number;
  roi: number;
}

export interface InvestmentReturn {
  id: string;
  investmentId: string;
  investorId: string;
  projectId: string;
  principalAmount: number;
  returnAmount: number;
  feeAmount: number;
  netAmount: number;
  periodStart?: string;
  periodEnd?: string;
  status: string;
  paidAt?: string;
  createdAt: string;
}

export interface KybSubmission {
  id: string;
  status: string;
  rejectionReason?: string;
  submittedAt: string;
  reviewedAt?: string;
}

export interface SystemSettings {
  platformName: string;
  supportEmail: string;
  maintenanceMode: boolean;
  kycRequired: boolean;
  contactBlocking: boolean;
  announcement: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  href?: string;
  priority?: NotificationPriority;
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

export interface InvestorDashboardStats {
  availableProjects: number;
  myInvestments: number;
  savedProjects: number;
  unreadMessages: number;
  membershipTier: MembershipTier;
  hasPlatformAccess: boolean;
  portfolioValue: number;
  activeOffers: number;
  activeMilestones: number;
}

export interface OwnerDashboardStats {
  myProjects: number;
  publishedProjects: number;
  investorRequests: number;
  unreadMessages: number;
  totalFundingRaised: number;
  teamMembers: number;
  pendingOffers: number;
  pendingMilestones: number;
}

export interface AdminStats {
  totalInvestors: number;
  totalOwners: number;
  totalProjects: number;
  publishedProjects: number;
  pendingProjects: number;
  activeMemberships: number;
  pendingKyc: number;
  openComplaints: number;
  totalOffers: number;
  totalFunding: number;
}

export interface FilterParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  category?: string;
  industry?: string;
  location?: string;
  stage?: string;
  minInvestment?: number;
  fundingStatus?: string;
  riskLevel?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/** @deprecated kept for transitional imports during refactor */
export type TransactionStatus = OfferStatus;
export type DashboardStats = InvestorDashboardStats;
export type MembershipTierAlias = MembershipTier;
export type MembershipTierPlan = MembershipTier;
