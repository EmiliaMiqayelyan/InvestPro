export type UserRole = "investor" | "project_owner" | "admin";

export type MembershipTier = "none" | "basic" | "premium" | "enterprise";
export type MembershipTierAlias = MembershipTier;
export type MembershipTierPlan = MembershipTier;

export type MembershipPlanId = "basic" | "premium" | "enterprise";

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
  | "general";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  phone?: string;
  role: UserRole;
  membershipTier: MembershipPlanId | "none";
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

export interface Project {
  id: string;
  ownerId: string;
  ownerName?: string;
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
  expectedRoi: number;
  revenueModel: string;
  revenueModelHy?: string;
  financialProjections: string;
  financialProjectionsHy?: string;
  investmentPlan: string;
  investmentPlanHy?: string;
  businessModel: string;
  businessModelHy?: string;
  riskLevel: RiskLevel;
  status: ProjectStatus;
  investorCount: number;
  savedCount: number;
  team: TeamMember[];
  documents: ProjectDocument[];
  updates: ProjectUpdate[];
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RiskIndicator {
  label: string;
  detail: string;
}

export interface RiskAnalysis {
  projectId: string;
  score: number;
  level: RiskLevel;
  completeness: number;
  positiveIndicators: RiskIndicator[];
  warningIndicators: RiskIndicator[];
  missingDocuments: string[];
  questionsToAsk: string[];
  summary: string;
  generatedAt: string;
}

export interface MembershipPlan {
  id: MembershipPlanId;
  name: string;
  price: number;
  billingPeriod: "monthly" | "yearly";
  description: string;
  features: string[];
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

export interface InvestorDashboardStats {
  availableProjects: number;
  myInvestments: number;
  savedProjects: number;
  unreadMessages: number;
  membershipTier: MembershipPlanId | "none";
  portfolioValue: number;
  activeOffers: number;
}

export interface OwnerDashboardStats {
  myProjects: number;
  publishedProjects: number;
  investorRequests: number;
  unreadMessages: number;
  totalFundingRaised: number;
  teamMembers: number;
  pendingOffers: number;
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
  riskLevel?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/** @deprecated kept for transitional imports during refactor */
export type TransactionStatus = OfferStatus;
export type DashboardStats = InvestorDashboardStats;
