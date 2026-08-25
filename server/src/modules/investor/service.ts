import {
  ProjectModel,
  OfferModel,
  InvestmentModel,
  SavedProjectModel,
  ConversationModel,
  MilestonePlanModel,
  UserModel,
} from "../../shared/database/associations";
import { toProject, toInvestment, publicProjectCard } from "../../shared/utils/mappers";
import { hasActiveServiceAccess, normalizeMembershipTier } from "../../shared/utils/rbac";
import type { InvestorDashboardStats } from "../../shared/types";
import { Op } from "sequelize";

export async function getInvestorDashboard(userId: string): Promise<InvestorDashboardStats> {
  const user = await UserModel.findByPk(userId);
  const published = await ProjectModel.count({ where: { status: "published" } });
  const offers = await OfferModel.findAll({ where: { investorId: userId } });
  const investments = await InvestmentModel.findAll({ where: { investorId: userId } });
  const saved = await SavedProjectModel.count({ where: { userId } });
  const conversations = await ConversationModel.findAll({ where: { investorId: userId } });
  const unread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);
  const activeMilestones = await MilestonePlanModel.count({
    where: {
      investorId: userId,
      status: { [Op.in]: ["proposed", "negotiating", "agreed", "active"] },
    },
  });

  const safeUser = user
    ? {
        role: user.role,
        membershipTier: normalizeMembershipTier(user.membershipTier),
        membershipExpiresAt: user.membershipExpiresAt?.toISOString(),
      }
    : null;

  return {
    availableProjects: published,
    myInvestments: investments.length,
    savedProjects: saved,
    unreadMessages: unread,
    membershipTier: normalizeMembershipTier(user?.membershipTier),
    hasPlatformAccess: hasActiveServiceAccess(safeUser),
    portfolioValue: investments.reduce((s, i) => s + i.amount, 0),
    activeOffers: offers.filter((o) => o.status === "pending" || o.status === "negotiating")
      .length,
    activeMilestones,
  };
}

export async function getSavedProjects(userId: string) {
  const saved = await SavedProjectModel.findAll({ where: { userId } });
  const ids = saved.map((s) => s.projectId);
  if (!ids.length) return [];
  const projects = await ProjectModel.findAll({ where: { id: ids } });
  return projects.map((p) => publicProjectCard(toProject(p)));
}

export async function getInvestments(userId: string) {
  const list = await InvestmentModel.findAll({
    where: { investorId: userId },
    order: [["createdAt", "DESC"]],
  });
  const enriched = [];
  for (const inv of list) {
    const project = await ProjectModel.findByPk(inv.projectId);
    enriched.push({
      ...toInvestment(inv),
      project: project ? toProject(project) : undefined,
    });
  }
  return enriched;
}
