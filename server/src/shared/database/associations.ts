import {
  UserModel,
  ProjectModel,
  SubscriptionModel,
  OfferModel,
  InvestmentModel,
  SavedProjectModel,
  ConversationModel,
  MessageModel,
  NotificationModel,
  KycSubmissionModel,
  ActivityLogModel,
  ComplaintModel,
  MilestonePlanModel,
  UploadedFileModel,
} from "./models";
import {
  InvestorProfileModel,
  CompanyProfileModel,
  InvestmentDealModel,
  WalletModel,
  LedgerTransactionModel,
  PaymentModel,
  WithdrawalModel,
  ReturnModel,
  DocumentModel,
  ReviewModel,
  DisputeModel,
  AuditLogModel,
  IdempotencyKeyModel,
  RefreshTokenModel,
  AuthTokenModel,
  KybSubmissionModel,
  SystemSettingModel,
  JobQueueModel,
} from "./spec-models";

let associated = false;

export function registerAssociations(): void {
  if (associated) return;
  associated = true;

  UserModel.hasMany(ProjectModel, { foreignKey: "ownerId", as: "projects" });
  ProjectModel.belongsTo(UserModel, { foreignKey: "ownerId", as: "owner" });

  UserModel.hasMany(SubscriptionModel, { foreignKey: "userId", as: "subscriptions" });
  SubscriptionModel.belongsTo(UserModel, { foreignKey: "userId", as: "user" });

  UserModel.hasMany(OfferModel, { foreignKey: "investorId", as: "investorOffers" });
  OfferModel.belongsTo(UserModel, { foreignKey: "investorId", as: "investor" });
  OfferModel.belongsTo(ProjectModel, { foreignKey: "projectId", as: "project" });

  UserModel.hasMany(InvestmentModel, { foreignKey: "investorId", as: "investments" });
  InvestmentModel.belongsTo(UserModel, { foreignKey: "investorId", as: "investor" });
  InvestmentModel.belongsTo(ProjectModel, { foreignKey: "projectId", as: "project" });
  InvestmentModel.belongsTo(OfferModel, { foreignKey: "offerId", as: "offer" });

  UserModel.hasMany(SavedProjectModel, { foreignKey: "userId", as: "savedProjects" });
  SavedProjectModel.belongsTo(UserModel, { foreignKey: "userId", as: "user" });
  SavedProjectModel.belongsTo(ProjectModel, { foreignKey: "projectId", as: "project" });

  ConversationModel.hasMany(MessageModel, { foreignKey: "conversationId", as: "messages" });
  MessageModel.belongsTo(ConversationModel, { foreignKey: "conversationId", as: "conversation" });

  UserModel.hasMany(NotificationModel, { foreignKey: "userId", as: "notifications" });
  NotificationModel.belongsTo(UserModel, { foreignKey: "userId", as: "user" });

  UserModel.hasMany(KycSubmissionModel, { foreignKey: "userId", as: "kycSubmissions" });
  KycSubmissionModel.belongsTo(UserModel, { foreignKey: "userId", as: "user" });

  UserModel.hasMany(ActivityLogModel, { foreignKey: "userId", as: "activityLogs" });
  UserModel.hasMany(ComplaintModel, { foreignKey: "reporterId", as: "complaints" });
  UserModel.hasMany(UploadedFileModel, { foreignKey: "userId", as: "uploads" });

  ProjectModel.hasMany(MilestonePlanModel, { foreignKey: "projectId", as: "milestonePlans" });
  MilestonePlanModel.belongsTo(ProjectModel, { foreignKey: "projectId", as: "project" });

  // Spec entities
  UserModel.hasOne(InvestorProfileModel, { foreignKey: "userId", as: "investorProfile" });
  InvestorProfileModel.belongsTo(UserModel, { foreignKey: "userId", as: "user" });

  UserModel.hasOne(CompanyProfileModel, { foreignKey: "userId", as: "companyProfile" });
  CompanyProfileModel.belongsTo(UserModel, { foreignKey: "userId", as: "user" });

  UserModel.hasMany(WalletModel, { foreignKey: "userId", as: "wallets" });
  WalletModel.belongsTo(UserModel, { foreignKey: "userId", as: "user" });
  WalletModel.hasMany(LedgerTransactionModel, { foreignKey: "walletId", as: "transactions" });
  LedgerTransactionModel.belongsTo(WalletModel, { foreignKey: "walletId", as: "wallet" });

  UserModel.hasMany(PaymentModel, { foreignKey: "userId", as: "payments" });
  PaymentModel.belongsTo(WalletModel, { foreignKey: "walletId", as: "wallet" });

  UserModel.hasMany(WithdrawalModel, { foreignKey: "userId", as: "withdrawals" });
  WithdrawalModel.belongsTo(WalletModel, { foreignKey: "walletId", as: "wallet" });

  UserModel.hasMany(ReturnModel, { foreignKey: "investorId", as: "returns" });
  ReturnModel.belongsTo(InvestmentModel, { foreignKey: "investmentId", as: "investment" });
  ReturnModel.belongsTo(ProjectModel, { foreignKey: "projectId", as: "project" });

  UserModel.hasMany(InvestmentDealModel, { foreignKey: "investorId", as: "deals" });
  InvestmentDealModel.belongsTo(ProjectModel, { foreignKey: "projectId", as: "project" });
  InvestmentDealModel.belongsTo(OfferModel, { foreignKey: "offerId", as: "offer" });

  UserModel.hasMany(ReviewModel, { foreignKey: "investorId", as: "reviews" });
  ReviewModel.belongsTo(ProjectModel, { foreignKey: "projectId", as: "project" });

  UserModel.hasMany(DisputeModel, { foreignKey: "reporterId", as: "disputes" });
  UserModel.hasMany(KybSubmissionModel, { foreignKey: "userId", as: "kybSubmissions" });
  KybSubmissionModel.belongsTo(CompanyProfileModel, {
    foreignKey: "companyProfileId",
    as: "companyProfile",
  });

  UserModel.hasMany(RefreshTokenModel, { foreignKey: "userId", as: "refreshTokens" });
  UserModel.hasMany(AuthTokenModel, { foreignKey: "userId", as: "authTokens" });
}

export {
  UserModel,
  ProjectModel,
  SubscriptionModel,
  OfferModel,
  InvestmentModel,
  SavedProjectModel,
  ConversationModel,
  MessageModel,
  NotificationModel,
  KycSubmissionModel,
  ActivityLogModel,
  ComplaintModel,
  MilestonePlanModel,
  UploadedFileModel,
  InvestorProfileModel,
  CompanyProfileModel,
  InvestmentDealModel,
  WalletModel,
  LedgerTransactionModel,
  PaymentModel,
  WithdrawalModel,
  ReturnModel,
  DocumentModel,
  ReviewModel,
  DisputeModel,
  AuditLogModel,
  IdempotencyKeyModel,
  RefreshTokenModel,
  AuthTokenModel,
  KybSubmissionModel,
  SystemSettingModel,
  JobQueueModel,
};
