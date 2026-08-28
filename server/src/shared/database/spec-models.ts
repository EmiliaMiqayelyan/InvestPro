import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { sequelize, JsonColumn } from "./sequelize";

export class InvestorProfileModel extends Model<
  InferAttributes<InvestorProfileModel>,
  InferCreationAttributes<InvestorProfileModel>
> {
  declare id: string;
  declare userId: string;
  declare firstName: string | null;
  declare lastName: string | null;
  declare country: string | null;
  declare dateOfBirth: string | null;
  declare investmentExperience: string | null;
  declare riskLevel: string | null;
  declare verificationStatus: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

InvestorProfileModel.init(
  {
    id: { type: DataTypes.STRING(36), primaryKey: true },
    userId: { type: DataTypes.STRING(36), allowNull: false, unique: true },
    firstName: { type: DataTypes.STRING(100), allowNull: true },
    lastName: { type: DataTypes.STRING(100), allowNull: true },
    country: { type: DataTypes.STRING(100), allowNull: true },
    dateOfBirth: { type: DataTypes.DATEONLY, allowNull: true },
    investmentExperience: { type: DataTypes.STRING(50), allowNull: true },
    riskLevel: { type: DataTypes.STRING(16), allowNull: true },
    verificationStatus: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "pending" },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize, tableName: "investor_profiles" }
);

export class CompanyProfileModel extends Model<
  InferAttributes<CompanyProfileModel>,
  InferCreationAttributes<CompanyProfileModel>
> {
  declare id: string;
  declare userId: string;
  declare companyName: string;
  declare registrationNumber: string | null;
  declare country: string | null;
  declare legalAddress: string | null;
  declare website: string | null;
  declare description: string | null;
  declare verificationStatus: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

CompanyProfileModel.init(
  {
    id: { type: DataTypes.STRING(36), primaryKey: true },
    userId: { type: DataTypes.STRING(36), allowNull: false, unique: true },
    companyName: { type: DataTypes.STRING(255), allowNull: false },
    registrationNumber: { type: DataTypes.STRING(100), allowNull: true },
    country: { type: DataTypes.STRING(100), allowNull: true },
    legalAddress: { type: DataTypes.TEXT, allowNull: true },
    website: { type: DataTypes.STRING(500), allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    verificationStatus: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "pending" },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize, tableName: "company_profiles" }
);

export class InvestmentDealModel extends Model<
  InferAttributes<InvestmentDealModel>,
  InferCreationAttributes<InvestmentDealModel>
> {
  declare id: string;
  declare projectId: string;
  declare investorId: string;
  declare offerId: string | null;
  declare principalAmount: number;
  declare platformFee: number;
  declare totalAmount: number;
  declare expectedReturn: number;
  declare investmentTerm: string | null;
  declare status: string;
  declare agreementId: string | null;
  declare fundedAt: Date | null;
  declare completedAt: Date | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

InvestmentDealModel.init(
  {
    id: { type: DataTypes.STRING(36), primaryKey: true },
    projectId: { type: DataTypes.STRING(36), allowNull: false },
    investorId: { type: DataTypes.STRING(36), allowNull: false },
    offerId: { type: DataTypes.STRING(36), allowNull: true },
    principalAmount: { type: DataTypes.DOUBLE, allowNull: false },
    platformFee: { type: DataTypes.DOUBLE, allowNull: false, defaultValue: 0 },
    totalAmount: { type: DataTypes.DOUBLE, allowNull: false },
    expectedReturn: { type: DataTypes.DOUBLE, allowNull: false, defaultValue: 0 },
    investmentTerm: { type: DataTypes.STRING(100), allowNull: true },
    status: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "draft" },
    agreementId: { type: DataTypes.STRING(36), allowNull: true },
    fundedAt: { type: DataTypes.DATE, allowNull: true },
    completedAt: { type: DataTypes.DATE, allowNull: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize, tableName: "investment_deals" }
);

export class WalletModel extends Model<
  InferAttributes<WalletModel>,
  InferCreationAttributes<WalletModel>
> {
  declare id: string;
  declare userId: string;
  declare currency: string;
  declare availableBalance: number;
  declare pendingBalance: number;
  declare investedBalance: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

WalletModel.init(
  {
    id: { type: DataTypes.STRING(36), primaryKey: true },
    userId: { type: DataTypes.STRING(36), allowNull: false },
    currency: { type: DataTypes.STRING(8), allowNull: false, defaultValue: "USD" },
    availableBalance: { type: DataTypes.DOUBLE, allowNull: false, defaultValue: 0 },
    pendingBalance: { type: DataTypes.DOUBLE, allowNull: false, defaultValue: 0 },
    investedBalance: { type: DataTypes.DOUBLE, allowNull: false, defaultValue: 0 },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize, tableName: "wallets" }
);

export class LedgerTransactionModel extends Model<
  InferAttributes<LedgerTransactionModel>,
  InferCreationAttributes<LedgerTransactionModel>
> {
  declare id: string;
  declare walletId: string;
  declare type: string;
  declare amount: number;
  declare currency: string;
  declare referenceType: string | null;
  declare referenceId: string | null;
  declare balanceBefore: number;
  declare balanceAfter: number;
  declare status: string;
  declare description: string | null;
  declare createdAt: CreationOptional<Date>;
}

LedgerTransactionModel.init(
  {
    id: { type: DataTypes.STRING(36), primaryKey: true },
    walletId: { type: DataTypes.STRING(36), allowNull: false },
    type: { type: DataTypes.STRING(32), allowNull: false },
    amount: { type: DataTypes.DOUBLE, allowNull: false },
    currency: { type: DataTypes.STRING(8), allowNull: false, defaultValue: "USD" },
    referenceType: { type: DataTypes.STRING(50), allowNull: true },
    referenceId: { type: DataTypes.STRING(36), allowNull: true },
    balanceBefore: { type: DataTypes.DOUBLE, allowNull: false },
    balanceAfter: { type: DataTypes.DOUBLE, allowNull: false },
    status: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "completed" },
    description: { type: DataTypes.TEXT, allowNull: true },
    createdAt: DataTypes.DATE,
  },
  { sequelize, tableName: "ledger_transactions", updatedAt: false }
);

export class PaymentModel extends Model<
  InferAttributes<PaymentModel>,
  InferCreationAttributes<PaymentModel>
> {
  declare id: string;
  declare userId: string;
  declare walletId: string;
  declare amount: number;
  declare currency: string;
  declare provider: string;
  declare providerTransactionId: string | null;
  declare type: string;
  declare status: string;
  declare createdAt: CreationOptional<Date>;
  declare completedAt: Date | null;
}

PaymentModel.init(
  {
    id: { type: DataTypes.STRING(36), primaryKey: true },
    userId: { type: DataTypes.STRING(36), allowNull: false },
    walletId: { type: DataTypes.STRING(36), allowNull: false },
    amount: { type: DataTypes.DOUBLE, allowNull: false },
    currency: { type: DataTypes.STRING(8), allowNull: false, defaultValue: "USD" },
    provider: { type: DataTypes.STRING(50), allowNull: false, defaultValue: "internal" },
    providerTransactionId: { type: DataTypes.STRING(255), allowNull: true },
    type: { type: DataTypes.STRING(32), allowNull: false },
    status: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "pending" },
    createdAt: DataTypes.DATE,
    completedAt: { type: DataTypes.DATE, allowNull: true },
  },
  { sequelize, tableName: "payments", updatedAt: false }
);

export class WithdrawalModel extends Model<
  InferAttributes<WithdrawalModel>,
  InferCreationAttributes<WithdrawalModel>
> {
  declare id: string;
  declare userId: string;
  declare walletId: string;
  declare amount: number;
  declare currency: string;
  declare destination: Record<string, unknown>;
  declare status: string;
  declare approvedBy: string | null;
  declare processedAt: Date | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

WithdrawalModel.init(
  {
    id: { type: DataTypes.STRING(36), primaryKey: true },
    userId: { type: DataTypes.STRING(36), allowNull: false },
    walletId: { type: DataTypes.STRING(36), allowNull: false },
    amount: { type: DataTypes.DOUBLE, allowNull: false },
    currency: { type: DataTypes.STRING(8), allowNull: false, defaultValue: "USD" },
    destination: { type: JsonColumn, allowNull: false },
    status: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "pending" },
    approvedBy: { type: DataTypes.STRING(36), allowNull: true },
    processedAt: { type: DataTypes.DATE, allowNull: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize, tableName: "withdrawals" }
);

export class ReturnModel extends Model<
  InferAttributes<ReturnModel>,
  InferCreationAttributes<ReturnModel>
> {
  declare id: string;
  declare investmentId: string;
  declare investorId: string;
  declare projectId: string;
  declare principalAmount: number;
  declare returnAmount: number;
  declare feeAmount: number;
  declare netAmount: number;
  declare periodStart: Date | null;
  declare periodEnd: Date | null;
  declare status: string;
  declare paidAt: Date | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

ReturnModel.init(
  {
    id: { type: DataTypes.STRING(36), primaryKey: true },
    investmentId: { type: DataTypes.STRING(36), allowNull: false },
    investorId: { type: DataTypes.STRING(36), allowNull: false },
    projectId: { type: DataTypes.STRING(36), allowNull: false },
    principalAmount: { type: DataTypes.DOUBLE, allowNull: false },
    returnAmount: { type: DataTypes.DOUBLE, allowNull: false },
    feeAmount: { type: DataTypes.DOUBLE, allowNull: false, defaultValue: 0 },
    netAmount: { type: DataTypes.DOUBLE, allowNull: false },
    periodStart: { type: DataTypes.DATE, allowNull: true },
    periodEnd: { type: DataTypes.DATE, allowNull: true },
    status: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "pending" },
    paidAt: { type: DataTypes.DATE, allowNull: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize, tableName: "returns" }
);

export class DocumentModel extends Model<
  InferAttributes<DocumentModel>,
  InferCreationAttributes<DocumentModel>
> {
  declare id: string;
  declare ownerType: string;
  declare ownerId: string;
  declare documentType: string;
  declare fileUrl: string;
  declare status: string;
  declare verifiedBy: string | null;
  declare verifiedAt: Date | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

DocumentModel.init(
  {
    id: { type: DataTypes.STRING(36), primaryKey: true },
    ownerType: { type: DataTypes.STRING(50), allowNull: false },
    ownerId: { type: DataTypes.STRING(36), allowNull: false },
    documentType: { type: DataTypes.STRING(50), allowNull: false },
    fileUrl: { type: DataTypes.STRING(500), allowNull: false },
    status: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "pending" },
    verifiedBy: { type: DataTypes.STRING(36), allowNull: true },
    verifiedAt: { type: DataTypes.DATE, allowNull: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize, tableName: "documents" }
);

export class ReviewModel extends Model<
  InferAttributes<ReviewModel>,
  InferCreationAttributes<ReviewModel>
> {
  declare id: string;
  declare investorId: string;
  declare companyId: string;
  declare projectId: string;
  declare rating: number;
  declare comment: string | null;
  declare status: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

ReviewModel.init(
  {
    id: { type: DataTypes.STRING(36), primaryKey: true },
    investorId: { type: DataTypes.STRING(36), allowNull: false },
    companyId: { type: DataTypes.STRING(36), allowNull: false },
    projectId: { type: DataTypes.STRING(36), allowNull: false },
    rating: { type: DataTypes.INTEGER, allowNull: false },
    comment: { type: DataTypes.TEXT, allowNull: true },
    status: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "published" },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize, tableName: "reviews" }
);

export class DisputeModel extends Model<
  InferAttributes<DisputeModel>,
  InferCreationAttributes<DisputeModel>
> {
  declare id: string;
  declare reporterId: string;
  declare againstUserId: string | null;
  declare projectId: string | null;
  declare investmentId: string | null;
  declare subject: string;
  declare description: string;
  declare status: string;
  declare resolution: string | null;
  declare resolvedBy: string | null;
  declare resolvedAt: Date | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

DisputeModel.init(
  {
    id: { type: DataTypes.STRING(36), primaryKey: true },
    reporterId: { type: DataTypes.STRING(36), allowNull: false },
    againstUserId: { type: DataTypes.STRING(36), allowNull: true },
    projectId: { type: DataTypes.STRING(36), allowNull: true },
    investmentId: { type: DataTypes.STRING(36), allowNull: true },
    subject: { type: DataTypes.STRING(255), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    status: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "open" },
    resolution: { type: DataTypes.TEXT, allowNull: true },
    resolvedBy: { type: DataTypes.STRING(36), allowNull: true },
    resolvedAt: { type: DataTypes.DATE, allowNull: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize, tableName: "disputes" }
);

export class AuditLogModel extends Model<
  InferAttributes<AuditLogModel>,
  InferCreationAttributes<AuditLogModel>
> {
  declare id: string;
  declare actorId: string | null;
  declare action: string;
  declare entityType: string;
  declare entityId: string | null;
  declare oldData: Record<string, unknown> | null;
  declare newData: Record<string, unknown> | null;
  declare ipAddress: string | null;
  declare userAgent: string | null;
  declare createdAt: CreationOptional<Date>;
}

AuditLogModel.init(
  {
    id: { type: DataTypes.STRING(36), primaryKey: true },
    actorId: { type: DataTypes.STRING(36), allowNull: true },
    action: { type: DataTypes.STRING(100), allowNull: false },
    entityType: { type: DataTypes.STRING(50), allowNull: false },
    entityId: { type: DataTypes.STRING(36), allowNull: true },
    oldData: { type: JsonColumn, allowNull: true },
    newData: { type: JsonColumn, allowNull: true },
    ipAddress: { type: DataTypes.STRING(45), allowNull: true },
    userAgent: { type: DataTypes.STRING(500), allowNull: true },
    createdAt: DataTypes.DATE,
  },
  { sequelize, tableName: "audit_logs", updatedAt: false }
);

export class IdempotencyKeyModel extends Model<
  InferAttributes<IdempotencyKeyModel>,
  InferCreationAttributes<IdempotencyKeyModel>
> {
  declare id: string;
  declare key: string;
  declare userId: string;
  declare operation: string;
  declare response: Record<string, unknown> | null;
  declare statusCode: number | null;
  declare createdAt: CreationOptional<Date>;
  declare expiresAt: Date;
}

IdempotencyKeyModel.init(
  {
    id: { type: DataTypes.STRING(36), primaryKey: true },
    key: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    userId: { type: DataTypes.STRING(36), allowNull: false },
    operation: { type: DataTypes.STRING(50), allowNull: false },
    response: { type: JsonColumn, allowNull: true },
    statusCode: { type: DataTypes.INTEGER, allowNull: true },
    createdAt: DataTypes.DATE,
    expiresAt: { type: DataTypes.DATE, allowNull: false },
  },
  { sequelize, tableName: "idempotency_keys", updatedAt: false }
);

export class RefreshTokenModel extends Model<
  InferAttributes<RefreshTokenModel>,
  InferCreationAttributes<RefreshTokenModel>
> {
  declare id: string;
  declare userId: string;
  declare tokenHash: string;
  declare expiresAt: Date;
  declare revokedAt: Date | null;
  declare createdAt: CreationOptional<Date>;
}

RefreshTokenModel.init(
  {
    id: { type: DataTypes.STRING(36), primaryKey: true },
    userId: { type: DataTypes.STRING(36), allowNull: false },
    tokenHash: { type: DataTypes.STRING(255), allowNull: false },
    expiresAt: { type: DataTypes.DATE, allowNull: false },
    revokedAt: { type: DataTypes.DATE, allowNull: true },
    createdAt: DataTypes.DATE,
  },
  { sequelize, tableName: "refresh_tokens", updatedAt: false }
);

export class AuthTokenModel extends Model<
  InferAttributes<AuthTokenModel>,
  InferCreationAttributes<AuthTokenModel>
> {
  declare id: string;
  declare userId: string;
  declare type: string;
  declare tokenHash: string;
  declare expiresAt: Date;
  declare usedAt: Date | null;
  declare createdAt: CreationOptional<Date>;
}

AuthTokenModel.init(
  {
    id: { type: DataTypes.STRING(36), primaryKey: true },
    userId: { type: DataTypes.STRING(36), allowNull: false },
    type: { type: DataTypes.STRING(32), allowNull: false },
    tokenHash: { type: DataTypes.STRING(255), allowNull: false },
    expiresAt: { type: DataTypes.DATE, allowNull: false },
    usedAt: { type: DataTypes.DATE, allowNull: true },
    createdAt: DataTypes.DATE,
  },
  { sequelize, tableName: "auth_tokens", updatedAt: false }
);

export class KybSubmissionModel extends Model<
  InferAttributes<KybSubmissionModel>,
  InferCreationAttributes<KybSubmissionModel>
> {
  declare id: string;
  declare userId: string;
  declare companyProfileId: string | null;
  declare status: string;
  declare registrationDocumentUrl: string;
  declare taxDocumentUrl: string | null;
  declare bankStatementUrl: string | null;
  declare rejectionReason: string | null;
  declare submittedAt: Date;
  declare reviewedAt: Date | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

KybSubmissionModel.init(
  {
    id: { type: DataTypes.STRING(36), primaryKey: true },
    userId: { type: DataTypes.STRING(36), allowNull: false },
    companyProfileId: { type: DataTypes.STRING(36), allowNull: true },
    status: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "pending" },
    registrationDocumentUrl: { type: DataTypes.STRING(500), allowNull: false },
    taxDocumentUrl: { type: DataTypes.STRING(500), allowNull: true },
    bankStatementUrl: { type: DataTypes.STRING(500), allowNull: true },
    rejectionReason: { type: DataTypes.TEXT, allowNull: true },
    submittedAt: { type: DataTypes.DATE, allowNull: false },
    reviewedAt: { type: DataTypes.DATE, allowNull: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize, tableName: "kyb_submissions" }
);

export class SystemSettingModel extends Model<
  InferAttributes<SystemSettingModel>,
  InferCreationAttributes<SystemSettingModel>
> {
  declare id: string;
  declare key: string;
  declare value: Record<string, unknown>;
  declare updatedBy: string | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

SystemSettingModel.init(
  {
    id: { type: DataTypes.STRING(36), primaryKey: true },
    key: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    value: { type: JsonColumn, allowNull: false },
    updatedBy: { type: DataTypes.STRING(36), allowNull: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize, tableName: "system_settings" }
);

export class JobQueueModel extends Model<
  InferAttributes<JobQueueModel>,
  InferCreationAttributes<JobQueueModel>
> {
  declare id: string;
  declare queue: string;
  declare payload: Record<string, unknown>;
  declare status: string;
  declare attempts: number;
  declare maxAttempts: number;
  declare scheduledAt: Date;
  declare processedAt: Date | null;
  declare error: string | null;
  declare createdAt: CreationOptional<Date>;
}

JobQueueModel.init(
  {
    id: { type: DataTypes.STRING(36), primaryKey: true },
    queue: { type: DataTypes.STRING(50), allowNull: false },
    payload: { type: JsonColumn, allowNull: false },
    status: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "pending" },
    attempts: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    maxAttempts: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 3 },
    scheduledAt: { type: DataTypes.DATE, allowNull: false },
    processedAt: { type: DataTypes.DATE, allowNull: true },
    error: { type: DataTypes.TEXT, allowNull: true },
    createdAt: DataTypes.DATE,
  },
  { sequelize, tableName: "job_queue", updatedAt: false }
);
