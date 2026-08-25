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
};
