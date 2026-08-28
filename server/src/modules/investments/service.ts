import { v4 as uuidv4 } from "uuid";
import { Transaction } from "sequelize";
import {
  InvestmentModel,
  OfferModel,
  ProjectModel,
  InvestmentDealModel,
  UserModel,
} from "../../shared/database/associations";
import { sequelize } from "../../shared/database/sequelize";
import { AppError } from "../../shared/errors/AppError";
import { toProject } from "../../shared/utils/mappers";
import {
  fundInvestment,
  calculatePlatformFee,
} from "../../shared/financial/ledger";
import { storeIdempotency } from "../../shared/utils/idempotency";
import { writeAuditLog } from "../../shared/utils/audit";
import { dispatchNotificationEvent } from "../notifications/service";
import type { AuthedRequest } from "../../app/middleware";

export async function getInvestment(investmentId: string, userId: string, role: string) {
  const investment = await InvestmentModel.findByPk(investmentId);
  if (!investment) throw AppError.notFound("Investment not found");
  if (role === "investor" && investment.investorId !== userId) {
    throw AppError.forbidden();
  }

  const project = await ProjectModel.findByPk(investment.projectId);
  const deal = await InvestmentDealModel.findOne({
    where: { offerId: investment.offerId },
  });

  return {
    id: investment.id,
    offerId: investment.offerId,
    projectId: investment.projectId,
    investorId: investment.investorId,
    amount: investment.amount,
    platformFee: investment.platformFee ?? 0,
    totalAmount: investment.totalAmount ?? investment.amount,
    expectedReturn: investment.expectedReturn,
    investmentTerm: investment.investmentTerm,
    status: investment.status,
    agreementId: investment.agreementId,
    fundedAt: investment.fundedAt?.toISOString(),
    completedAt: investment.completedAt?.toISOString(),
    project: project ? toProject(project) : undefined,
    deal: deal
      ? {
          id: deal.id,
          status: deal.status,
          principalAmount: deal.principalAmount,
          platformFee: deal.platformFee,
          totalAmount: deal.totalAmount,
        }
      : undefined,
    createdAt: investment.createdAt.toISOString(),
    updatedAt: investment.updatedAt.toISOString(),
  };
}

export async function listMyInvestments(userId: string) {
  const rows = await InvestmentModel.findAll({
    where: { investorId: userId },
    order: [["createdAt", "DESC"]],
  });

  const results = [];
  for (const inv of rows) {
    results.push(await getInvestment(inv.id, userId, "investor"));
  }
  return results;
}

export async function confirmInvestment(investmentId: string, userId: string, req?: AuthedRequest) {
  const investment = await InvestmentModel.findByPk(investmentId);
  if (!investment) throw AppError.notFound("Investment not found");
  if (investment.investorId !== userId) throw AppError.forbidden();
  if (!["draft", "submitted", "pending_approval", "approved"].includes(investment.status)) {
    throw AppError.badRequest("Investment cannot be confirmed in current status");
  }

  investment.status = "payment_pending";
  await investment.save();

  await writeAuditLog({
    actorId: userId,
    action: "investment_confirmed",
    entityType: "investment",
    entityId: investmentId,
    req,
  });

  return getInvestment(investmentId, userId, "investor");
}

export async function fundInvestmentById(
  investmentId: string,
  userId: string,
  idempotencyKey?: string,
  req?: AuthedRequest
) {
  const result = await sequelize.transaction(async (t: Transaction) => {
    const investment = await InvestmentModel.findByPk(investmentId, { transaction: t });
    if (!investment) throw AppError.notFound("Investment not found");
    if (investment.investorId !== userId) throw AppError.forbidden();
    if (!["payment_pending", "approved"].includes(investment.status)) {
      throw AppError.badRequest("Investment is not ready for funding");
    }

    const fee = investment.platformFee || calculatePlatformFee(investment.amount);
    const total = investment.totalAmount || investment.amount + fee;

    await fundInvestment(userId, investmentId, investment.amount, fee);

    investment.status = "funded";
    investment.platformFee = fee;
    investment.totalAmount = total;
    investment.fundedAt = new Date();
    await investment.save({ transaction: t });

    const deal = await InvestmentDealModel.create(
      {
        id: uuidv4(),
        projectId: investment.projectId,
        investorId: investment.investorId,
        offerId: investment.offerId,
        principalAmount: investment.amount,
        platformFee: fee,
        totalAmount: total,
        expectedReturn: investment.expectedReturn,
        investmentTerm: investment.investmentTerm,
        status: "funded",
        agreementId: investment.agreementId,
        fundedAt: new Date(),
        completedAt: null,
      },
      { transaction: t }
    );

    const project = await ProjectModel.findByPk(investment.projectId, { transaction: t });
    if (project) {
      project.currentFunding += investment.amount;
      project.investorCount += 1;
      if (
        project.currentFunding >= project.requiredInvestment &&
        ["published", "funding"].includes(project.status)
      ) {
        project.status = "funded";
      } else if (project.status === "published") {
        project.status = "funding";
      }
      await project.save({ transaction: t });
    }

    return { investment, deal, project };
  });

  const response = await getInvestment(investmentId, userId, "investor");

  if (idempotencyKey) {
    await storeIdempotency(userId, idempotencyKey, "fund", { success: true, data: response }, 200);
  }

  await writeAuditLog({
    actorId: userId,
    action: "investment_funded",
    entityType: "investment",
    entityId: investmentId,
    newData: { amount: result.investment.amount },
    req,
  });

  await dispatchNotificationEvent({
    kind: "investment_funded",
    userId,
    investmentId,
    amount: result.investment.amount,
    projectId: result.investment.projectId,
  });

  return response;
}

export async function createOfferOnProject(
  userId: string,
  projectId: string,
  body: { amount: number; proposedTerms?: Record<string, unknown>; conditions?: string }
) {
  const project = await ProjectModel.findByPk(projectId);
  if (!project || !["published", "funding"].includes(project.status)) {
    throw AppError.notFound("Project not available for investment");
  }
  if (body.amount < project.minInvestment) {
    throw AppError.badRequest(`Minimum investment is ${project.minInvestment}`);
  }
  if (project.maximumInvestment && body.amount > project.maximumInvestment) {
    throw AppError.badRequest(`Maximum investment is ${project.maximumInvestment}`);
  }

  const investor = await UserModel.findByPk(userId);
  if (!investor) throw AppError.notFound("User not found");

  const offer = await OfferModel.create({
    id: uuidv4(),
    projectId: project.id,
    projectTitle: project.title,
    investorId: userId,
    investorName: `${investor.firstName} ${investor.lastName}`,
    ownerId: project.ownerId,
    amount: body.amount,
    conditions: body.conditions || "",
    questions: "",
    notes: "",
    status: "pending",
    ownerResponse: null,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    proposedTerms: body.proposedTerms ?? null,
  });

  return {
    id: offer.id,
    projectId: offer.projectId,
    investorId: offer.investorId,
    amount: offer.amount,
    proposedTerms: offer.proposedTerms,
    status: offer.status,
    expiresAt: offer.expiresAt?.toISOString(),
    createdAt: offer.createdAt.toISOString(),
  };
}
