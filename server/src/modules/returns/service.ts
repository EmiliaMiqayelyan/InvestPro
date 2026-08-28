import { v4 as uuidv4 } from "uuid";
import {
  ReturnModel,
  InvestmentModel,
  ProjectModel,
} from "../../shared/database/associations";
import { payoutReturn } from "../../shared/financial/ledger";
import { AppError } from "../../shared/errors/AppError";
import { storeIdempotency } from "../../shared/utils/idempotency";
import type { AuthedRequest } from "../../app/middleware";

export async function listMyReturns(userId: string) {
  const rows = await ReturnModel.findAll({
    where: { investorId: userId },
    order: [["createdAt", "DESC"]],
  });
  return rows.map(mapReturn);
}

export async function listInvestmentReturns(investmentId: string, userId: string) {
  const investment = await InvestmentModel.findByPk(investmentId);
  if (!investment) throw AppError.notFound("Investment not found");
  if (investment.investorId !== userId) throw AppError.forbidden();

  const rows = await ReturnModel.findAll({
    where: { investmentId },
    order: [["createdAt", "DESC"]],
  });
  return rows.map(mapReturn);
}

export async function getPortfolio(userId: string) {
  const investments = await InvestmentModel.findAll({ where: { investorId: userId } });
  const returns = await ReturnModel.findAll({ where: { investorId: userId } });

  const totalInvested = investments
    .filter((i) => ["funded", "active", "returning", "completed"].includes(i.status))
    .reduce((sum, i) => sum + i.amount, 0);

  const realizedReturns = returns
    .filter((r) => r.status === "paid")
    .reduce((sum, r) => sum + r.netAmount, 0);

  const unrealizedReturns = investments
    .filter((i) => ["funded", "active", "returning"].includes(i.status))
    .reduce((sum, i) => sum + (i.expectedReturn - i.amount), 0);

  const activeInvestments = investments.filter((i) =>
    ["funded", "active", "returning"].includes(i.status)
  ).length;

  const completedInvestments = investments.filter((i) => i.status === "completed").length;

  const currentValue = totalInvested + unrealizedReturns;
  const totalReturns = realizedReturns + unrealizedReturns;
  const roi = totalInvested > 0 ? ((totalReturns / totalInvested) * 100) : 0;

  return {
    totalInvested,
    currentValue,
    totalReturns,
    realizedReturns,
    unrealizedReturns,
    activeInvestments,
    completedInvestments,
    roi: Math.round(roi * 100) / 100,
  };
}

export async function createReturnPayout(
  returnId: string,
  adminId: string,
  idempotencyKey?: string,
  req?: AuthedRequest
) {
  const ret = await ReturnModel.findByPk(returnId);
  if (!ret) throw AppError.notFound("Return not found");
  if (ret.status === "paid") throw AppError.badRequest("Return already paid");

  await payoutReturn(ret.investorId, returnId, ret.netAmount);

  ret.status = "paid";
  ret.paidAt = new Date();
  await ret.save();

  const response = mapReturn(ret);
  if (idempotencyKey) {
    await storeIdempotency(adminId, idempotencyKey, "return_payout", { success: true, data: response }, 200);
  }
  return response;
}

function mapReturn(r: ReturnModel) {
  return {
    id: r.id,
    investmentId: r.investmentId,
    investorId: r.investorId,
    projectId: r.projectId,
    principalAmount: r.principalAmount,
    returnAmount: r.returnAmount,
    feeAmount: r.feeAmount,
    netAmount: r.netAmount,
    periodStart: r.periodStart?.toISOString(),
    periodEnd: r.periodEnd?.toISOString(),
    status: r.status,
    paidAt: r.paidAt?.toISOString(),
    createdAt: r.createdAt.toISOString(),
  };
}

export async function scheduleReturn(
  investmentId: string,
  returnAmount: number,
  periodStart?: Date,
  periodEnd?: Date
) {
  const investment = await InvestmentModel.findByPk(investmentId);
  if (!investment) throw AppError.notFound("Investment not found");

  const feeAmount = Math.round(returnAmount * 0.05 * 100) / 100;
  const netAmount = returnAmount - feeAmount;

  return ReturnModel.create({
    id: uuidv4(),
    investmentId,
    investorId: investment.investorId,
    projectId: investment.projectId,
    principalAmount: investment.amount,
    returnAmount,
    feeAmount,
    netAmount,
    periodStart: periodStart ?? null,
    periodEnd: periodEnd ?? null,
    status: "pending",
    paidAt: null,
  });
}
