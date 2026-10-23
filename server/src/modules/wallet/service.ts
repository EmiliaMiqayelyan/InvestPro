import { v4 as uuidv4 } from "uuid";
import { Op } from "sequelize";
import { z } from "zod";
import {
  WalletModel,
  WithdrawalModel,
  PaymentModel,
  UserModel,
} from "../../shared/database/associations";
import { sequelize } from "../../shared/database/sequelize";
import {
  getOrCreateWallet,
  deposit,
  reserveWithdrawal,
  listTransactions,
  finalizeWithdrawal,
  releaseWithdrawal,
  recordLedgerEntry,
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
  txId: z.string().trim().max(128).optional(),
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

export async function getDepositInstructions() {
  const { getSystemSettings } = await import("../admin/service");
  const settings = await getSystemSettings();
  return {
    address: String(settings.usdtDepositAddress || "").trim(),
    network: String(settings.usdtDepositNetwork || "TRC20").trim() || "TRC20",
    asset: "USDT",
    usdRate: 1,
  };
}

export async function createDeposit(
  userId: string,
  body: z.infer<typeof depositSchema>,
  idempotencyKey?: string,
  req?: AuthedRequest
) {
  const txId = body.txId?.trim();
  if (txId) {
    return createManualUsdtDeposit(userId, body.amount, txId, idempotencyKey, req);
  }
  if (!isBinanceConfigured()) {
    if (env.NODE_ENV === "test") {
      const { payment, wallet } = await deposit(userId, body.amount, body.provider);
      return finishInternalDeposit(userId, payment, wallet, body.amount, idempotencyKey, req);
    }
    throw new AppError("Enter the USDT transfer id after you send the payment", 400, {
      code: "USDT_TX_REQUIRED",
    });
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

async function assertManualDepositKyc(userId: string, amount: number) {
  if (amount < env.BINANCE_KYC_DEPOSIT_USD) return;
  const user = await UserModel.findByPk(userId);
  if (!user || user.kycStatus !== "approved") {
    throw AppError.forbidden("Verify your identity before a deposit of this size");
  }
}

export async function createManualUsdtDeposit(
  userId: string,
  amount: number,
  rawTxId: string,
  idempotencyKey?: string,
  req?: AuthedRequest
) {
  const txId = rawTxId.trim();
  if (txId.length < 6) throw AppError.badRequest("Enter the full transfer id");
  await assertManualDepositKyc(userId, amount);

  const instructions = await getDepositInstructions();
  if (!instructions.address) {
    throw new AppError("USDT deposit address is not set", 503, { code: "USDT_ADDRESS_MISSING" });
  }

  const duplicate = await PaymentModel.findOne({
    where: {
      provider: "manual_usdt",
      providerTransactionId: txId,
      status: { [Op.notIn]: ["rejected", "failed"] },
    },
  });
  if (duplicate) throw AppError.conflict("This transfer id was already submitted");

  const wallet = await getOrCreateWallet(userId);
  const payment = await PaymentModel.create({
    id: uuidv4(),
    userId,
    walletId: wallet.id,
    amount,
    currency: "USD",
    provider: "manual_usdt",
    providerTransactionId: txId,
    type: "deposit",
    status: "pending",
    paidAsset: "USDT",
    paidAmount: amount,
    fxRate: 1,
    referenceType: "wallet",
    referenceId: userId,
    providerMeta: { network: instructions.network, address: instructions.address },
    completedAt: null,
  });

  const response = {
    payment: {
      id: payment.id,
      amount: payment.amount,
      currency: payment.currency,
      provider: payment.provider,
      type: payment.type,
      status: payment.status,
      providerTransactionId: payment.providerTransactionId,
    },
    wallet: await getWallet(userId),
  };

  if (idempotencyKey) {
    await storeIdempotency(userId, idempotencyKey, "deposit", { success: true, data: response }, 201);
  }
  await writeAuditLog({
    actorId: userId,
    action: "wallet_deposit_submitted",
    entityType: "payment",
    entityId: payment.id,
    newData: { amount, txId, network: instructions.network },
    req,
  });
  return response;
}

export async function reviewManualDeposit(
  adminId: string,
  paymentId: string,
  decision: "approve" | "reject"
) {
  const reviewed = await sequelize.transaction(async (t) => {
    const payment = await PaymentModel.findByPk(paymentId, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    if (!payment || payment.provider !== "manual_usdt" || payment.type !== "deposit") {
      throw AppError.notFound("Manual deposit not found");
    }
    if (payment.status !== "pending") {
      throw AppError.badRequest("This deposit is already reviewed");
    }

    if (decision === "reject") {
      payment.status = "rejected";
      payment.providerMeta = { ...(payment.providerMeta || {}), reviewedBy: adminId };
      payment.changed("providerMeta", true);
      await payment.save({ transaction: t });
      return payment;
    }

    await recordLedgerEntry(
      {
        walletId: payment.walletId,
        type: "credit",
        amount: payment.amount,
        referenceType: "payment",
        referenceId: payment.id,
        description: `USDT deposit ${payment.providerTransactionId || payment.id}`,
      },
      t
    );
    payment.status = "completed";
    payment.completedAt = new Date();
    payment.providerMeta = { ...(payment.providerMeta || {}), reviewedBy: adminId };
    payment.changed("providerMeta", true);
    await payment.save({ transaction: t });
    return payment;
  });

  await writeAuditLog({
    actorId: adminId,
    action: decision === "approve" ? "wallet_deposit_approved" : "wallet_deposit_rejected",
    entityType: "payment",
    entityId: reviewed.id,
    newData: { amount: reviewed.amount, status: reviewed.status },
  });

  if (decision === "approve") {
    await dispatchNotificationEvent({
      kind: "wallet_deposit",
      userId: reviewed.userId,
      amount: reviewed.amount,
    });
  }

  return {
    id: reviewed.id,
    status: reviewed.status,
    amount: reviewed.amount,
    providerTransactionId: reviewed.providerTransactionId,
  };
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
