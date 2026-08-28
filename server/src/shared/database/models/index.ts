import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { sequelize, JsonColumn } from "../sequelize";
import type {
  UserRole,
  MembershipTier,
  KycStatus,
  ProjectStatus,
  ProjectStage,
  RiskLevel,
  OfferStatus,
  MilestonePlanStatus,
  NotificationType,
  NotificationPriority,
  ProjectPhase,
  TeamMember,
  ProjectDocument,
  ProjectUpdate,
  ProjectReviewEntry,
  MilestoneItem,
} from "../../types";

export class UserModel extends Model<
  InferAttributes<UserModel>,
  InferCreationAttributes<UserModel>
> {
  declare id: string;
  declare email: string;
  declare passwordHash: string;
  declare firstName: string;
  declare lastName: string;
  declare avatar: string | null;
  declare phone: string | null;
  declare role: UserRole;
  declare membershipTier: MembershipTier;
  declare membershipExpiresAt: Date | null;
  declare isEmailVerified: boolean;
  declare is2faEnabled: boolean;
  declare kycStatus: KycStatus;
  declare companyName: string | null;
  declare bio: string | null;
  declare isActive: boolean;
  declare status: string;
  declare emailVerifiedAt: Date | null;
  declare lastLoginAt: Date | null;
  declare isSuperAdmin: boolean;
  declare totpSecret: string | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

UserModel.init(
  {
    id: { type: DataTypes.STRING(36), primaryKey: true },
    email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    passwordHash: { type: DataTypes.STRING(255), allowNull: false },
    firstName: { type: DataTypes.STRING(100), allowNull: false },
    lastName: { type: DataTypes.STRING(100), allowNull: false },
    avatar: { type: DataTypes.STRING(500), allowNull: true },
    phone: { type: DataTypes.STRING(50), allowNull: true },
    role: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: "investor",
    },
    membershipTier: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: "none",
    },
    membershipExpiresAt: { type: DataTypes.DATE, allowNull: true },
    isEmailVerified: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    is2faEnabled: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    kycStatus: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: "not_submitted",
    },
    companyName: { type: DataTypes.STRING(255), allowNull: true },
    bio: { type: DataTypes.TEXT, allowNull: true },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    status: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "registered" },
    emailVerifiedAt: { type: DataTypes.DATE, allowNull: true },
    lastLoginAt: { type: DataTypes.DATE, allowNull: true },
    isSuperAdmin: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    totpSecret: { type: DataTypes.STRING(255), allowNull: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "users",
    indexes: [{ fields: ["email"] }, { fields: ["role"] }],
  }
);

export class ProjectModel extends Model<
  InferAttributes<ProjectModel>,
  InferCreationAttributes<ProjectModel>
> {
  declare id: string;
  declare ownerId: string;
  declare ownerName: string | null;
  declare ownerKycStatus: KycStatus | null;
  declare title: string;
  declare titleHy: string | null;
  declare slug: string;
  declare description: string;
  declare descriptionHy: string | null;
  declare fullDescription: string;
  declare fullDescriptionHy: string | null;
  declare category: string;
  declare categoryHy: string | null;
  declare industry: string;
  declare industryHy: string | null;
  declare location: string;
  declare locationHy: string | null;
  declare stage: ProjectStage;
  declare timeline: string;
  declare timelineHy: string | null;
  declare image: string;
  declare requiredInvestment: number;
  declare minInvestment: number;
  declare currentFunding: number;
  declare views: number;
  declare expectedRoi: number;
  declare revenueModel: string;
  declare revenueModelHy: string | null;
  declare financialProjections: string;
  declare financialProjectionsHy: string | null;
  declare investmentPlan: string;
  declare investmentPlanHy: string | null;
  declare businessModel: string;
  declare businessModelHy: string | null;
  declare budgetBreakdown: { label: string; labelHy?: string; percent: number }[] | null;
  declare phases: ProjectPhase[];
  declare riskLevel: RiskLevel;
  declare status: ProjectStatus;
  declare investorCount: number;
  declare savedCount: number;
  declare team: TeamMember[];
  declare documents: ProjectDocument[];
  declare updates: ProjectUpdate[];
  declare startDate: string | null;
  declare endDate: string | null;
  declare submittedAt: Date | null;
  declare approvedAt: Date | null;
  declare approvedBy: string | null;
  declare rejectedAt: Date | null;
  declare rejectedBy: string | null;
  declare rejectionReason: string | null;
  declare reviewHistory: ProjectReviewEntry[] | null;
  declare country: string | null;
  declare maximumInvestment: number | null;
  declare investmentTerm: string | null;
  declare publishedAt: Date | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

ProjectModel.init(
  {
    id: { type: DataTypes.STRING(36), primaryKey: true },
    ownerId: { type: DataTypes.STRING(36), allowNull: false },
    ownerName: { type: DataTypes.STRING(200), allowNull: true },
    ownerKycStatus: { type: DataTypes.STRING(32), allowNull: true },
    title: { type: DataTypes.STRING(255), allowNull: false },
    titleHy: { type: DataTypes.STRING(255), allowNull: true },
    slug: { type: DataTypes.STRING(255), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false, defaultValue: "" },
    descriptionHy: { type: DataTypes.TEXT, allowNull: true },
    fullDescription: { type: DataTypes.TEXT, allowNull: false, defaultValue: "" },
    fullDescriptionHy: { type: DataTypes.TEXT, allowNull: true },
    category: { type: DataTypes.STRING(100), allowNull: false, defaultValue: "Other" },
    categoryHy: { type: DataTypes.STRING(100), allowNull: true },
    industry: { type: DataTypes.STRING(100), allowNull: false, defaultValue: "Other" },
    industryHy: { type: DataTypes.STRING(100), allowNull: true },
    location: { type: DataTypes.STRING(200), allowNull: false, defaultValue: "" },
    locationHy: { type: DataTypes.STRING(200), allowNull: true },
    stage: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "idea" },
    timeline: { type: DataTypes.STRING(255), allowNull: false, defaultValue: "" },
    timelineHy: { type: DataTypes.STRING(255), allowNull: true },
    image: { type: DataTypes.STRING(500), allowNull: false },
    requiredInvestment: { type: DataTypes.DOUBLE, allowNull: false, defaultValue: 0 },
    minInvestment: { type: DataTypes.DOUBLE, allowNull: false, defaultValue: 0 },
    currentFunding: { type: DataTypes.DOUBLE, allowNull: false, defaultValue: 0 },
    views: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    expectedRoi: { type: DataTypes.DOUBLE, allowNull: false, defaultValue: 0 },
    revenueModel: { type: DataTypes.TEXT, allowNull: false, defaultValue: "" },
    revenueModelHy: { type: DataTypes.TEXT, allowNull: true },
    financialProjections: { type: DataTypes.TEXT, allowNull: false, defaultValue: "" },
    financialProjectionsHy: { type: DataTypes.TEXT, allowNull: true },
    investmentPlan: { type: DataTypes.TEXT, allowNull: false, defaultValue: "" },
    investmentPlanHy: { type: DataTypes.TEXT, allowNull: true },
    businessModel: { type: DataTypes.TEXT, allowNull: false, defaultValue: "" },
    businessModelHy: { type: DataTypes.TEXT, allowNull: true },
    budgetBreakdown: { type: JsonColumn, allowNull: true },
    phases: { type: JsonColumn, allowNull: false, defaultValue: [] },
    riskLevel: { type: DataTypes.STRING(16), allowNull: false, defaultValue: "medium" },
    status: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "draft" },
    investorCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    savedCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    team: { type: JsonColumn, allowNull: false, defaultValue: [] },
    documents: { type: JsonColumn, allowNull: false, defaultValue: [] },
    updates: { type: JsonColumn, allowNull: false, defaultValue: [] },
    startDate: { type: DataTypes.STRING(32), allowNull: true },
    endDate: { type: DataTypes.STRING(32), allowNull: true },
    submittedAt: { type: DataTypes.DATE, allowNull: true },
    approvedAt: { type: DataTypes.DATE, allowNull: true },
    approvedBy: { type: DataTypes.STRING(36), allowNull: true },
    rejectedAt: { type: DataTypes.DATE, allowNull: true },
    rejectedBy: { type: DataTypes.STRING(36), allowNull: true },
    rejectionReason: { type: DataTypes.TEXT, allowNull: true },
    reviewHistory: { type: JsonColumn, allowNull: true, defaultValue: [] },
    country: { type: DataTypes.STRING(100), allowNull: true },
    maximumInvestment: { type: DataTypes.DOUBLE, allowNull: true },
    investmentTerm: { type: DataTypes.STRING(100), allowNull: true },
    publishedAt: { type: DataTypes.DATE, allowNull: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "projects",
    indexes: [
      { fields: ["ownerId"] },
      { fields: ["status"] },
      { fields: ["slug"] },
      { fields: ["category"] },
      { fields: ["industry"] },
    ],
  }
);

export class SubscriptionModel extends Model<
  InferAttributes<SubscriptionModel>,
  InferCreationAttributes<SubscriptionModel>
> {
  declare id: string;
  declare userId: string;
  declare planId: string;
  declare status: "active" | "cancelled" | "expired" | "pending";
  declare startedAt: Date;
  declare expiresAt: Date;
  declare amount: number;
  declare stripeSessionId: string | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

SubscriptionModel.init(
  {
    id: { type: DataTypes.STRING(36), primaryKey: true },
    userId: { type: DataTypes.STRING(36), allowNull: false },
    planId: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "service" },
    status: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "active" },
    startedAt: { type: DataTypes.DATE, allowNull: false },
    expiresAt: { type: DataTypes.DATE, allowNull: false },
    amount: { type: DataTypes.DOUBLE, allowNull: false },
    stripeSessionId: { type: DataTypes.STRING(255), allowNull: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "subscriptions",
    indexes: [{ fields: ["userId"] }, { fields: ["status"] }],
  }
);

export class OfferModel extends Model<
  InferAttributes<OfferModel>,
  InferCreationAttributes<OfferModel>
> {
  declare id: string;
  declare projectId: string;
  declare projectTitle: string | null;
  declare investorId: string;
  declare investorName: string | null;
  declare ownerId: string;
  declare amount: number;
  declare conditions: string;
  declare questions: string;
  declare notes: string;
  declare status: OfferStatus;
  declare ownerResponse: string | null;
  declare expiresAt: Date | null;
  declare proposedTerms: Record<string, unknown> | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

OfferModel.init(
  {
    id: { type: DataTypes.STRING(36), primaryKey: true },
    projectId: { type: DataTypes.STRING(36), allowNull: false },
    projectTitle: { type: DataTypes.STRING(255), allowNull: true },
    investorId: { type: DataTypes.STRING(36), allowNull: false },
    investorName: { type: DataTypes.STRING(200), allowNull: true },
    ownerId: { type: DataTypes.STRING(36), allowNull: false },
    amount: { type: DataTypes.DOUBLE, allowNull: false },
    conditions: { type: DataTypes.TEXT, allowNull: false, defaultValue: "" },
    questions: { type: DataTypes.TEXT, allowNull: false, defaultValue: "" },
    notes: { type: DataTypes.TEXT, allowNull: false, defaultValue: "" },
    status: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "pending" },
    ownerResponse: { type: DataTypes.TEXT, allowNull: true },
    expiresAt: { type: DataTypes.DATE, allowNull: true },
    proposedTerms: { type: JsonColumn, allowNull: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "offers",
    indexes: [
      { fields: ["projectId"] },
      { fields: ["investorId"] },
      { fields: ["ownerId"] },
      { fields: ["status"] },
    ],
  }
);

export class InvestmentModel extends Model<
  InferAttributes<InvestmentModel>,
  InferCreationAttributes<InvestmentModel>
> {
  declare id: string;
  declare offerId: string;
  declare projectId: string;
  declare investorId: string;
  declare amount: number;
  declare status: "active" | "completed" | "cancelled" | string;
  declare expectedReturn: number;
  declare platformFee: number;
  declare totalAmount: number | null;
  declare investmentTerm: string | null;
  declare agreementId: string | null;
  declare fundedAt: Date | null;
  declare completedAt: Date | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

InvestmentModel.init(
  {
    id: { type: DataTypes.STRING(36), primaryKey: true },
    offerId: { type: DataTypes.STRING(36), allowNull: false },
    projectId: { type: DataTypes.STRING(36), allowNull: false },
    investorId: { type: DataTypes.STRING(36), allowNull: false },
    amount: { type: DataTypes.DOUBLE, allowNull: false },
    status: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "active" },
    expectedReturn: { type: DataTypes.DOUBLE, allowNull: false },
    platformFee: { type: DataTypes.DOUBLE, allowNull: false, defaultValue: 0 },
    totalAmount: { type: DataTypes.DOUBLE, allowNull: true },
    investmentTerm: { type: DataTypes.STRING(100), allowNull: true },
    agreementId: { type: DataTypes.STRING(36), allowNull: true },
    fundedAt: { type: DataTypes.DATE, allowNull: true },
    completedAt: { type: DataTypes.DATE, allowNull: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "investments",
    indexes: [{ fields: ["investorId"] }, { fields: ["projectId"] }, { fields: ["offerId"] }],
  }
);

export class SavedProjectModel extends Model<
  InferAttributes<SavedProjectModel>,
  InferCreationAttributes<SavedProjectModel>
> {
  declare id: CreationOptional<number>;
  declare userId: string;
  declare projectId: string;
  declare savedAt: Date;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

SavedProjectModel.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.STRING(36), allowNull: false },
    projectId: { type: DataTypes.STRING(36), allowNull: false },
    savedAt: { type: DataTypes.DATE, allowNull: false },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "saved_projects",
    indexes: [{ unique: true, fields: ["userId", "projectId"] }],
  }
);

export class ConversationModel extends Model<
  InferAttributes<ConversationModel>,
  InferCreationAttributes<ConversationModel>
> {
  declare id: string;
  declare projectId: string;
  declare projectTitle: string;
  declare investorId: string;
  declare investorName: string;
  declare ownerId: string;
  declare ownerName: string;
  declare isAdminThread: boolean;
  declare lastMessage: string | null;
  declare lastMessageAt: Date | null;
  declare unreadCount: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

ConversationModel.init(
  {
    id: { type: DataTypes.STRING(36), primaryKey: true },
    projectId: { type: DataTypes.STRING(36), allowNull: false },
    projectTitle: { type: DataTypes.STRING(255), allowNull: false },
    investorId: { type: DataTypes.STRING(36), allowNull: false },
    investorName: { type: DataTypes.STRING(200), allowNull: false },
    ownerId: { type: DataTypes.STRING(36), allowNull: false },
    ownerName: { type: DataTypes.STRING(200), allowNull: false },
    isAdminThread: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    lastMessage: { type: DataTypes.STRING(500), allowNull: true },
    lastMessageAt: { type: DataTypes.DATE, allowNull: true },
    unreadCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "conversations",
    indexes: [
      { fields: ["projectId"] },
      { fields: ["investorId"] },
      { fields: ["ownerId"] },
    ],
  }
);

export class MessageModel extends Model<
  InferAttributes<MessageModel>,
  InferCreationAttributes<MessageModel>
> {
  declare id: string;
  declare conversationId: string;
  declare senderId: string;
  declare senderName: string;
  declare senderRole: UserRole;
  declare content: string;
  declare attachmentUrl: string | null;
  declare attachmentName: string | null;
  declare isFlagged: boolean;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

MessageModel.init(
  {
    id: { type: DataTypes.STRING(36), primaryKey: true },
    conversationId: { type: DataTypes.STRING(36), allowNull: false },
    senderId: { type: DataTypes.STRING(36), allowNull: false },
    senderName: { type: DataTypes.STRING(200), allowNull: false },
    senderRole: { type: DataTypes.STRING(32), allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    attachmentUrl: { type: DataTypes.STRING(500), allowNull: true },
    attachmentName: { type: DataTypes.STRING(255), allowNull: true },
    isFlagged: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "messages",
    indexes: [{ fields: ["conversationId"] }, { fields: ["senderId"] }, { fields: ["isFlagged"] }],
  }
);

export class NotificationModel extends Model<
  InferAttributes<NotificationModel>,
  InferCreationAttributes<NotificationModel>
> {
  declare id: string;
  declare userId: string;
  declare type: NotificationType;
  declare title: string;
  declare message: string;
  declare isRead: boolean;
  declare href: string | null;
  declare priority: NotificationPriority;
  declare metadata: Record<string, unknown> | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

NotificationModel.init(
  {
    id: { type: DataTypes.STRING(36), primaryKey: true },
    userId: { type: DataTypes.STRING(36), allowNull: false },
    type: { type: DataTypes.STRING(32), allowNull: false },
    title: { type: DataTypes.STRING(255), allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    isRead: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    href: { type: DataTypes.STRING(500), allowNull: true },
    priority: { type: DataTypes.STRING(16), allowNull: false, defaultValue: "normal" },
    metadata: { type: JsonColumn, allowNull: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "notifications",
    indexes: [{ fields: ["userId"] }, { fields: ["isRead"] }],
  }
);

export class KycSubmissionModel extends Model<
  InferAttributes<KycSubmissionModel>,
  InferCreationAttributes<KycSubmissionModel>
> {
  declare id: string;
  declare userId: string;
  declare status: KycStatus;
  declare idDocumentUrl: string;
  declare selfieUrl: string;
  declare addressProofUrl: string;
  declare rejectionReason: string | null;
  declare submittedAt: Date;
  declare reviewedAt: Date | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

KycSubmissionModel.init(
  {
    id: { type: DataTypes.STRING(36), primaryKey: true },
    userId: { type: DataTypes.STRING(36), allowNull: false },
    status: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "pending" },
    idDocumentUrl: { type: DataTypes.STRING(500), allowNull: false },
    selfieUrl: { type: DataTypes.STRING(500), allowNull: false },
    addressProofUrl: { type: DataTypes.STRING(500), allowNull: false },
    rejectionReason: { type: DataTypes.TEXT, allowNull: true },
    submittedAt: { type: DataTypes.DATE, allowNull: false },
    reviewedAt: { type: DataTypes.DATE, allowNull: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "kyc_submissions",
    indexes: [{ fields: ["userId"] }, { fields: ["status"] }],
  }
);

export class ActivityLogModel extends Model<
  InferAttributes<ActivityLogModel>,
  InferCreationAttributes<ActivityLogModel>
> {
  declare id: string;
  declare userId: string;
  declare action: string;
  declare entityType: string;
  declare entityId: string | null;
  declare metadata: Record<string, unknown> | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

ActivityLogModel.init(
  {
    id: { type: DataTypes.STRING(36), primaryKey: true },
    userId: { type: DataTypes.STRING(36), allowNull: false },
    action: { type: DataTypes.STRING(100), allowNull: false },
    entityType: { type: DataTypes.STRING(50), allowNull: false },
    entityId: { type: DataTypes.STRING(36), allowNull: true },
    metadata: { type: JsonColumn, allowNull: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "activity_logs",
    indexes: [{ fields: ["userId"] }, { fields: ["createdAt"] }],
  }
);

export class ComplaintModel extends Model<
  InferAttributes<ComplaintModel>,
  InferCreationAttributes<ComplaintModel>
> {
  declare id: string;
  declare reporterId: string;
  declare againstUserId: string | null;
  declare projectId: string | null;
  declare subject: string;
  declare description: string;
  declare status: "open" | "reviewing" | "resolved" | "dismissed";
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

ComplaintModel.init(
  {
    id: { type: DataTypes.STRING(36), primaryKey: true },
    reporterId: { type: DataTypes.STRING(36), allowNull: false },
    againstUserId: { type: DataTypes.STRING(36), allowNull: true },
    projectId: { type: DataTypes.STRING(36), allowNull: true },
    subject: { type: DataTypes.STRING(255), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    status: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "open" },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "complaints",
    indexes: [{ fields: ["status"] }, { fields: ["reporterId"] }],
  }
);

export class MilestonePlanModel extends Model<
  InferAttributes<MilestonePlanModel>,
  InferCreationAttributes<MilestonePlanModel>
> {
  declare id: string;
  declare projectId: string;
  declare projectTitle: string | null;
  declare investorId: string;
  declare investorName: string | null;
  declare ownerId: string;
  declare ownerName: string | null;
  declare items: MilestoneItem[];
  declare status: MilestonePlanStatus;
  declare notes: string | null;
  declare ownerResponse: string | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

MilestonePlanModel.init(
  {
    id: { type: DataTypes.STRING(36), primaryKey: true },
    projectId: { type: DataTypes.STRING(36), allowNull: false },
    projectTitle: { type: DataTypes.STRING(255), allowNull: true },
    investorId: { type: DataTypes.STRING(36), allowNull: false },
    investorName: { type: DataTypes.STRING(200), allowNull: true },
    ownerId: { type: DataTypes.STRING(36), allowNull: false },
    ownerName: { type: DataTypes.STRING(200), allowNull: true },
    items: { type: JsonColumn, allowNull: false, defaultValue: [] },
    status: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "proposed" },
    notes: { type: DataTypes.TEXT, allowNull: true },
    ownerResponse: { type: DataTypes.TEXT, allowNull: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "milestone_plans",
    indexes: [
      { fields: ["projectId"] },
      { fields: ["investorId"] },
      { fields: ["ownerId"] },
      { fields: ["status"] },
    ],
  }
);

export class UploadedFileModel extends Model<
  InferAttributes<UploadedFileModel>,
  InferCreationAttributes<UploadedFileModel>
> {
  declare id: string;
  declare userId: string;
  declare name: string;
  declare url: string;
  declare size: number;
  declare category: string | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

UploadedFileModel.init(
  {
    id: { type: DataTypes.STRING(36), primaryKey: true },
    userId: { type: DataTypes.STRING(36), allowNull: false },
    name: { type: DataTypes.STRING(255), allowNull: false },
    url: { type: DataTypes.STRING(500), allowNull: false },
    size: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    category: { type: DataTypes.STRING(64), allowNull: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "uploaded_files",
    indexes: [{ fields: ["userId"] }],
  }
);
