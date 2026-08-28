import { v4 as uuidv4 } from "uuid";
import { Transaction } from "sequelize";
import {
  WalletModel,
  LedgerTransactionModel,
  PaymentModel,
} from "../database/associations";
import { sequelize } from "../database/sequelize";
import { AppError } from "../errors/AppError";

export type LedgerType = "credit" | "debit";

export interface LedgerEntry {
  walletId: string;
  type: LedgerType;
  amount: number;
  referenceType?: string;
  referenceId?: string;
  description?: string;
}

const PLATFORM_FEE_RATE = 0.02;

export function calculatePlatformFee(amount: number): number {
  return Math.round(amount * PLATFORM_FEE_RATE * 100) / 100;
}

export async function getOrCreateWallet(
  userId: string,
  currency = "USD",
  t?: Transaction
): Promise<WalletModel> {
  const opts = t ? { transaction: t } : {};
  let wallet = await WalletModel.findOne({ where: { userId, currency }, ...opts });
  if (!wallet) {
    wallet = await WalletModel.create(
      {
        id: uuidv4(),
        userId,
        currency,
        availableBalance: 0,
        pendingBalance: 0,
        investedBalance: 0,
      },
      opts
    );
  }
  return wallet;
}

/** Record a ledger entry and update wallet balance atomically. */
export async function recordLedgerEntry(
  entry: LedgerEntry,
  t: Transaction
): Promise<LedgerTransactionModel> {
  const wallet = await WalletModel.findByPk(entry.walletId, {
    transaction: t,
    lock: t.LOCK.UPDATE,
  });
  if (!wallet) throw AppError.notFound("Wallet not found");

  const balanceBefore = wallet.availableBalance;
  const delta = entry.type === "credit" ? entry.amount : -entry.amount;
  const balanceAfter = Math.round((balanceBefore + delta) * 100) / 100;

  if (balanceAfter < 0) {
    throw AppError.badRequest("Insufficient wallet balance");
  }

  wallet.availableBalance = balanceAfter;
  await wallet.save({ transaction: t });

  return LedgerTransactionModel.create(
    {
      id: uuidv4(),
      walletId: wallet.id,
      type: entry.type,
      amount: entry.amount,
      currency: wallet.currency,
      referenceType: entry.referenceType ?? null,
      referenceId: entry.referenceId ?? null,
      balanceBefore,
      balanceAfter,
      status: "completed",
      description: entry.description ?? null,
    },
    { transaction: t }
  );
}

export async function deposit(
  userId: string,
  amount: number,
  provider = "internal",
  providerTransactionId?: string
) {
  if (amount <= 0) throw AppError.badRequest("Amount must be positive");

  return sequelize.transaction(async (t) => {
    const wallet = await getOrCreateWallet(userId, "USD", t);
    const payment = await PaymentModel.create(
      {
        id: uuidv4(),
        userId,
        walletId: wallet.id,
        amount,
        currency: "USD",
        provider,
        providerTransactionId: providerTransactionId ?? null,
        type: "deposit",
        status: "completed",
        completedAt: new Date(),
      },
      { transaction: t }
    );

    await recordLedgerEntry(
      {
        walletId: wallet.id,
        type: "credit",
        amount,
        referenceType: "payment",
        referenceId: payment.id,
        description: `Deposit via ${provider}`,
      },
      t
    );

    await wallet.reload({ transaction: t });
    return { payment, wallet };
  });
}

export async function fundInvestment(
  investorId: string,
  investmentId: string,
  amount: number,
  platformFee?: number
) {
  const fee = platformFee ?? calculatePlatformFee(amount);
  const total = amount + fee;

  return sequelize.transaction(async (t) => {
    const wallet = await getOrCreateWallet(investorId, "USD", t);
    if (wallet.availableBalance < total) {
      throw AppError.badRequest("Insufficient funds for investment");
    }

    await recordLedgerEntry(
      {
        walletId: wallet.id,
        type: "debit",
        amount: total,
        referenceType: "investment",
        referenceId: investmentId,
        description: `Investment funding (principal: $${amount}, fee: $${fee})`,
      },
      t
    );

    wallet.investedBalance = Math.round((wallet.investedBalance + amount) * 100) / 100;
    await wallet.save({ transaction: t });

    await wallet.reload({ transaction: t });
    return { wallet, platformFee: fee, totalAmount: total };
  });
}

export async function payoutReturn(
  investorId: string,
  returnId: string,
  netAmount: number
) {
  return sequelize.transaction(async (t) => {
    const wallet = await getOrCreateWallet(investorId, "USD", t);

    await recordLedgerEntry(
      {
        walletId: wallet.id,
        type: "credit",
        amount: netAmount,
        referenceType: "return",
        referenceId: returnId,
        description: `Return payout`,
      },
      t
    );

    wallet.investedBalance = Math.max(
      0,
      Math.round((wallet.investedBalance - netAmount) * 100) / 100
    );
    await wallet.save({ transaction: t });
    await wallet.reload({ transaction: t });
    return wallet;
  });
}

export async function reserveWithdrawal(
  userId: string,
  withdrawalId: string,
  amount: number
) {
  return sequelize.transaction(async (t) => {
    const wallet = await getOrCreateWallet(userId, "USD", t);
    if (wallet.availableBalance < amount) {
      throw AppError.badRequest("Insufficient balance for withdrawal");
    }

    await recordLedgerEntry(
      {
        walletId: wallet.id,
        type: "debit",
        amount,
        referenceType: "withdrawal",
        referenceId: withdrawalId,
        description: "Withdrawal reserved",
      },
      t
    );

    wallet.pendingBalance = Math.round((wallet.pendingBalance + amount) * 100) / 100;
    await wallet.save({ transaction: t });
    await wallet.reload({ transaction: t });
    return wallet;
  });
}

export async function listTransactions(
  walletId: string,
  opts: { page?: number; limit?: number } = {}
) {
  const page = opts.page || 1;
  const limit = Math.min(opts.limit || 20, 100);
  const offset = (page - 1) * limit;

  const { count, rows } = await LedgerTransactionModel.findAndCountAll({
    where: { walletId },
    order: [["createdAt", "DESC"]],
    limit,
    offset,
  });

  return {
    data: rows,
    total: count,
    page,
    limit,
    totalPages: Math.ceil(count / limit),
  };
}
