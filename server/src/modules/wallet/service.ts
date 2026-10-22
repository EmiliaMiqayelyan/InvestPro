import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import {
  WalletModel,
  WithdrawalModel,
  PaymentModel,
} from "../../shared/database/associations";
import {
  getOrCreateWallet,
  deposit,
  reserveWithdrawal,
  listTransactions,
  finalizeWithdrawal,
  releaseWithdrawal,
} from "../../shared/financial/ledger";
import { AppError } from "../../shared/errors/AppError";
import { env } from "../../app/config/env";
import { isBinanceConfigured } from "../../shared/integrations/binance-pay";
import { storeIdempotency } from "../../shared/utils/idempotency";
import { writeAuditLog } from "../../shared/utils/audit";
import { dispatchNotificationEvent } from "../notifications/service";
import type { AuthedRequest } from "../../app/middleware";

export const depositSchema = z.object({
  amount: z.number().positive(),
  provider: z.string().optional(),
});

export const withdrawSchema = z.object({
  amount: z.number().positive(),
  destination: z.object({
    type: z.enum(["bank", "card", "crypto"]),
    accountNumber: z.string().optional(),
    bankName: z.string().optional(),
    routingNumber: z.string().optional(),
    walletAddress: z.string().optional(),
    binanceId: z.string().optional(),
  }),
});

export async function getWallet(userId: string) {
  const wallet = await getOrCreateWallet(userId);
  return {
    id: wallet.id,
    userId: wallet.userId,
    currency: wallet.currency,
    availableBalance: wallet.availableBalance,
    pendingBalance: wallet.pendingBalance,
    investedBalance: wallet.investedBalance,
    totalBalance: wallet.availableBalance + wallet.pendingBalance + wallet.investedBalance,
    createdAt: wallet.createdAt.toISOString(),
    updatedAt: wallet.updatedAt.toISOString(),
  };
}

export async function getTransactions(
  userId: string,
  opts: { page?: number; limit?: number }
) {
  const wallet = await getOrCreateWallet(userId);
  const result = await listTransactions(wallet.id, opts);
  return {
    ...result,
    data: result.data.map((tx) => ({
      id: tx.id,
      walletId: tx.walletId,
      type: tx.type,
      amount: tx.amount,
      currency: tx.currency,
      referenceType: tx.referenceType,
      referenceId: tx.referenceId,
      balanceBefore: tx.balanceBefore,
      balanceAfter: tx.balanceAfter,
      status: tx.status,
      description: tx.description,
      createdAt: tx.createdAt.toISOString(),
    })),
  };
}

export async function createDeposit(
  userId: string,
  body: z.infer<typeof depositSchema>,
  idempotencyKey?: string,
  req?: AuthedRequest
) {
  if (!isBinanceConfigured()) {
    if (env.NODE_ENV === "test") {
      const { payment, wallet } = await deposit(userId, body.amount, body.provider);
      return finishInternalDeposit(userId, payment, wallet, body.amount, idempotencyKey, req);
    }
    throw new AppError("Binance Pay is not configured", 503, { code: "BINANCE_NOT_CONFIGURED" });
  }
  const { createBinanceDeposit } = await import("../payments/service");
  const result = await createBinanceDeposit(userId, body.amount);
  if (idempotencyKey) {
    await storeIdempotency(userId, idempotencyKey, "deposit", { success: true, data: result }, 201);
  }
  await writeAuditLog({
    actorId: userId,
    action: "wallet_deposit_started",
    entityType: "payment",
    entityId: result.payment.id,
    newData: { amount: body.amount, provider: "binance_pay" },
    req,
  });
  return result;
}

async function finishInternalDeposit(
  userId: string,
  payment: { id: string; amount: number; currency: string; provider: string; type: string; status: string; completedAt: Date | null },
  wallet: { id: string },
  amount: number,
  idempotencyKey?: string,
  req?: AuthedRequest
) {
  void wallet;

  const response = {
    payment: {
      id: payment.id,
      amount: payment.amount,
      currency: payment.currency,
      provider: payment.provider,
      type: payment.type,
      status: payment.status,
      completedAt: payment.completedAt?.toISOString(),
    },
    wallet: await getWallet(userId),
  };

  if (idempotencyKey) {
    await storeIdempotency(userId, idempotencyKey, "deposit", { success: true, data: response }, 201);
  }

  await writeAuditLog({
    actorId: userId,
    action: "wallet_deposit",
    entityType: "payment",
    entityId: payment.id,
    newData: { amount },
    req,
  });

  await dispatchNotificationEvent({
    kind: "wallet_deposit",
    userId,
    amount,
  });

  return response;
}

export async function createWithdrawal(
  userId: string,
  body: z.infer<typeof withdrawSchema>,
  idempotencyKey?: string,
  req?: AuthedRequest
) {
  const wallet = await getOrCreateWallet(userId);
  if (wallet.availableBalance < body.amount) {
    throw AppError.badRequest("Insufficient available balance");
  }

  const withdrawal = await WithdrawalModel.create({
    id: uuidv4(),
    userId,
    walletId: wallet.id,
    amount: body.amount,
    currency: wallet.currency,
    destination: body.destination,
    status: "pending",
    approvedBy: null,
    processedAt: null,
  });

  await reserveWithdrawal(userId, withdrawal.id, body.amount);

  const response = {
    id: withdrawal.id,
    amount: withdrawal.amount,
    currency: withdrawal.currency,
    destination: withdrawal.destination,
    status: withdrawal.status,
    createdAt: withdrawal.createdAt.toISOString(),
  };

  if (idempotencyKey) {
    await storeIdempotency(userId, idempotencyKey, "withdraw", { success: true, data: response }, 201);
  }

  await writeAuditLog({
    actorId: userId,
    action: "withdrawal_created",
    entityType: "withdrawal",
    entityId: withdrawal.id,
    newData: { amount: body.amount },
    req,
  });

  await dispatchNotificationEvent({
    kind: "withdrawal_created",
    userId,
    amount: body.amount,
    withdrawalId: withdrawal.id,
  });

  return response;
}

export async function listWithdrawals(userId: string) {
  const rows = await WithdrawalModel.findAll({
    where: { userId },
    order: [["createdAt", "DESC"]],
  });
  return rows.map((w) => ({
    id: w.id,
    amount: w.amount,
    currency: w.currency,
    destination: w.destination,
    status: w.status,
    approvedBy: w.approvedBy,
    processedAt: w.processedAt?.toISOString(),
    createdAt: w.createdAt.toISOString(),
  }));
}

export async function listPayments(userId: string) {
  const rows = await PaymentModel.findAll({
    where: { userId },
    order: [["createdAt", "DESC"]],
  });
  return rows.map((p) => ({
    id: p.id,
    amount: p.amount,
    currency: p.currency,
    provider: p.provider,
    type: p.type,
    status: p.status,
    createdAt: p.createdAt.toISOString(),
    completedAt: p.completedAt?.toISOString(),
  }));
}

export async function approveWithdrawal(adminId: string, withdrawalId: string) {
  const withdrawal = await WithdrawalModel.findByPk(withdrawalId);
  if (!withdrawal) throw AppError.notFound("Withdrawal not found");
  if (withdrawal.status !== "pending" && withdrawal.status !== "approved") {
    throw AppError.badRequest("Withdrawal cannot be paid from this status");
  }

  const destination = withdrawal.destination || {};
  const binanceId = typeof destination.binanceId === "string" ? destination.binanceId : "";
  if (destination.type === "crypto") {
    if (!binanceId) throw AppError.badRequest("Crypto withdrawals need a Binance Pay ID");
    try {
      const { payoutWithdrawal } = await import("../payments/service");
      const payout = await payoutWithdrawal({
        withdrawalId: withdrawal.id,
        usdAmount: withdrawal.amount,
        binanceId,
      });
      withdrawal.destination = { ...destination, ...payout };
      withdrawal.status = "paid";
      withdrawal.approvedBy = adminId;
      withdrawal.processedAt = new Date();
      await withdrawal.save();
      await finalizeWithdrawal(withdrawal.userId, withdrawal.amount);
      return withdrawal;
    } catch (err) {
      if (withdrawal.status !== "paid") {
        await releaseWithdrawal(withdrawal.userId, withdrawal.id, withdrawal.amount);
        withdrawal.status = "failed";
        withdrawal.approvedBy = adminId;
        await withdrawal.save();
      }
      throw err;
    }
  }

  withdrawal.status = "approved";
  withdrawal.approvedBy = adminId;
  withdrawal.processedAt = new Date();
  await withdrawal.save();
  await finalizeWithdrawal(withdrawal.userId, withdrawal.amount);
  return withdrawal;
}
