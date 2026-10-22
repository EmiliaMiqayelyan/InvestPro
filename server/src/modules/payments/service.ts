import { v4 as uuidv4 } from "uuid";
import { Op } from "sequelize";
import {
  LedgerTransactionModel,
  PaymentModel,
  UserModel,
  WalletModel,
} from "../../shared/database/associations";
import { sequelize } from "../../shared/database/sequelize";
import { env, publicWebOrigin } from "../../app/config/env";
import { AppError } from "../../shared/errors/AppError";
import {
  createBinanceOrder,
  isBinanceConfigured,
  payoutToBinanceId,
  queryBinanceOrder,
  quoteUsdt,
  verifyBinanceWebhook,
} from "../../shared/integrations/binance-pay";
import { getOrCreateWallet, recordLedgerEntry } from "../../shared/financial/ledger";
import { logger } from "../../shared/logger";

const QUOTE_MS = 15 * 60 * 1000;
const AMOUNT_TOLERANCE = 0.01;

export type PaymentReportRow = {
  id: string;
  userId: string;
  userEmail: string | null;
  type: string;
  status: string;
  usdAmount: number;
  paidAsset: string | null;
  paidAmount: number | null;
  fxRate: number | null;
  provider: string;
  providerTransactionId: string | null;
  referenceType: string | null;
  referenceId: string | null;
  balanceAfter: number | null;
  exceptionReason: string | null;
  createdAt: string;
  completedAt: string | null;
};

type Meta = Record<string, unknown>;

function metaOf(payment: PaymentModel): Meta {
  return (payment.providerMeta && typeof payment.providerMeta === "object"
    ? payment.providerMeta
    : {}) as Meta;
}

function publicOrigin() {
  return publicWebOrigin();
}

function webhookUrl() {
  return `${publicOrigin()}/api/v1/payments/binance/webhook`;
}

export async function assertBinanceReady() {
  if (!isBinanceConfigured()) {
    throw new AppError("Binance Pay is not configured", 503, { code: "BINANCE_NOT_CONFIGURED" });
  }
}

async function assertDepositKyc(userId: string, usdAmount: number) {
  if (usdAmount < env.BINANCE_KYC_DEPOSIT_USD) return;
  const user = await UserModel.findByPk(userId);
  if (!user || user.kycStatus !== "approved") {
    throw AppError.forbidden("Verify your identity before a deposit of this size");
  }
}

async function openOrder(input: {
  userId: string;
  usdAmount: number;
  type: "deposit" | "service_fee";
  goodsName: string;
  returnPath: string;
  cancelPath: string;
  referenceType: string;
  referenceId: string;
}) {
  await assertBinanceReady();
  if (input.usdAmount <= 0) throw AppError.badRequest("Amount must be positive");

  const id = uuidv4();
  const merchantTradeNo = id.replace(/-/g, "");
  const quote = await quoteUsdt(input.usdAmount);
  const wallet = await getOrCreateWallet(input.userId);
  const payment = await PaymentModel.create({
    id,
    userId: input.userId,
    walletId: wallet.id,
    amount: input.usdAmount,
    currency: "USD",
    provider: "binance_pay",
    providerTransactionId: null,
    type: input.type,
    status: "pending",
    merchantTradeNo,
    paidAsset: "USDT",
    paidAmount: quote.paidAmount,
    fxRate: quote.fxRate,
    quoteExpiresAt: new Date(Date.now() + QUOTE_MS),
    referenceType: input.referenceType,
    referenceId: input.referenceId,
    providerMeta: { quoteSource: quote.source },
    completedAt: null,
  });

  try {
    const order = await createBinanceOrder({
      merchantTradeNo,
      orderAmount: quote.paidAmount,
      goodsName: input.goodsName,
      returnUrl: `${publicOrigin()}${input.returnPath}${input.returnPath.includes("?") ? "&" : "?"}paymentId=${id}`,
      cancelUrl: `${publicOrigin()}${input.cancelPath}`,
      webhookUrl: webhookUrl(),
    });
    payment.providerTransactionId = order.prepayId;
    payment.providerMeta = { ...metaOf(payment), checkoutUrl: order.checkoutUrl, prepayId: order.prepayId };
    payment.changed("providerMeta", true);
    await payment.save();
    return { payment, checkoutUrl: order.checkoutUrl };
  } catch (err) {
    payment.status = "failed";
    payment.providerMeta = {
      ...metaOf(payment),
      exceptionReason: err instanceof Error ? err.message : "Binance Pay order failed",
    };
    payment.changed("providerMeta", true);
    await payment.save();
    throw err;
  }
}

export async function createServiceFeeCheckout(userId: string) {
  const { MEMBERSHIP_PLANS } = await import("../membership/service");
  const price = MEMBERSHIP_PLANS.find((plan) => plan.id === "service")?.price ?? 99;
  return openOrder({
    userId,
    usdAmount: price,
    type: "service_fee",
    goodsName: "XS Invest platform service fee",
    returnPath: "/investor/membership?checkout=return",
    cancelPath: "/investor/membership",
    referenceType: "membership",
    referenceId: "service",
  });
}

export async function createBinanceDeposit(userId: string, usdAmount: number) {
  await assertDepositKyc(userId, usdAmount);
  const opened = await openOrder({
    userId,
    usdAmount,
    type: "deposit",
    goodsName: "XS Invest wallet deposit",
    returnPath: "/investor/wallet?checkout=return",
    cancelPath: "/investor/wallet",
    referenceType: "wallet",
    referenceId: userId,
  });
  const wallet = await getOrCreateWallet(userId);
  return {
    checkoutUrl: opened.checkoutUrl,
    payment: toReportRow(opened.payment, null, null),
    wallet: {
      id: wallet.id,
      availableBalance: wallet.availableBalance,
      pendingBalance: wallet.pendingBalance,
      investedBalance: wallet.investedBalance,
    },
  };
}

function amountsMatch(expected: number | null, actual: number | undefined) {
  if (expected == null || actual == null || Number.isNaN(actual)) return false;
  const diff = Math.abs(expected - actual);
  return diff <= Math.max(0.01, expected * AMOUNT_TOLERANCE);
}

export async function settlePayment(paymentId: string, observed?: { currency?: string; amount?: number; transactionId?: string }) {
  const existing = await PaymentModel.findByPk(paymentId);
  if (!existing) throw AppError.notFound("Payment not found");
  if (existing.status === "completed" || existing.status === "refunded") return existing;
  if (!existing.merchantTradeNo) throw AppError.badRequest("Payment has no Binance trade number");

  const query = await queryBinanceOrder(existing.merchantTradeNo);
  const paid = query.status === "PAID" || query.status === "PAY_SUCCESS";
  const observedAmount = observed?.amount ?? query.orderAmount;
  const observedCurrency = observed?.currency ?? query.currency;
  const currencyOk = !observedCurrency || observedCurrency === "USDT" || observedCurrency === "USD";
  const expected = observedCurrency === "USD" ? existing.amount : existing.paidAmount;
  const matches = paid && currencyOk && amountsMatch(expected, observedAmount);

  if (!paid && (query.status === "INITIAL" || query.status === "PENDING" || query.status === "")) {
    return existing;
  }

  if (!matches) {
    existing.status = "review";
    existing.providerMeta = {
      ...metaOf(existing),
      exceptionReason: paid
        ? `Paid amount ${observedAmount ?? "unknown"} ${observedCurrency ?? ""} does not match the locked quote`
        : `Binance order status is ${query.status || "unknown"}`,
      webhook: observed ?? null,
    };
    existing.changed("providerMeta", true);
    await existing.save();
    return existing;
  }

  await sequelize.transaction(async (t) => {
    const payment = await PaymentModel.findByPk(paymentId, { transaction: t, lock: t.LOCK.UPDATE });
    if (!payment || payment.status === "completed") return;
    if (payment.type === "deposit") {
      await recordLedgerEntry(
        {
          walletId: payment.walletId,
          type: "credit",
          amount: payment.amount,
          referenceType: "payment",
          referenceId: payment.id,
          description: "Deposit via Binance Pay",
        },
        t
      );
    } else if (payment.type === "service_fee") {
      await recordLedgerEntry(
        {
          walletId: payment.walletId,
          type: "credit",
          amount: payment.amount,
          referenceType: "payment",
          referenceId: payment.id,
          description: "Binance Pay received for service fee",
        },
        t
      );
      await recordLedgerEntry(
        {
          walletId: payment.walletId,
          type: "debit",
          amount: payment.amount,
          referenceType: "payment",
          referenceId: payment.id,
          description: "Platform service fee",
        },
        t
      );
    }
    payment.status = "completed";
    payment.completedAt = new Date();
    if (query.transactionId || observed?.transactionId) {
      payment.providerTransactionId = query.transactionId || observed?.transactionId || payment.providerTransactionId;
    }
    await payment.save({ transaction: t });
  });

  const settled = await PaymentModel.findByPk(paymentId);
  if (settled?.type === "service_fee" && settled.status === "completed") {
    const membership = await import("../membership/service");
    await membership.activateMembershipFromPayment(settled.userId, settled.amount, settled.id);
  }
  return settled;
}

export async function handleBinanceWebhook(
  rawBody: string,
  headers: Record<string, string | string[] | undefined>
) {
  await verifyBinanceWebhook(rawBody, headers);
  const body = JSON.parse(rawBody) as {
    bizStatus?: string;
    data?: string | Record<string, unknown>;
  };
  const data =
    typeof body.data === "string"
      ? (JSON.parse(body.data) as Record<string, unknown>)
      : (body.data ?? {});
  const merchantTradeNo = String(data.merchantTradeNo || "");
  const payment = merchantTradeNo
    ? await PaymentModel.findOne({ where: { merchantTradeNo } })
    : null;
  if (!payment) {
    logger.warn({ merchantTradeNo }, "Binance webhook for unknown trade");
    return;
  }

  const bizStatus = body.bizStatus || "";
  if (bizStatus === "PAY_SUCCESS") {
    await settlePayment(payment.id, {
      currency: typeof data.currency === "string" ? data.currency : undefined,
      amount: data.totalFee == null ? undefined : Number(data.totalFee),
      transactionId: typeof data.transactionId === "string" ? data.transactionId : undefined,
    });
    return;
  }
  if (payment.status === "pending" && (bizStatus === "PAY_CLOSED" || bizStatus === "PAY_FAIL")) {
    payment.status = bizStatus === "PAY_FAIL" ? "failed" : "expired";
    await payment.save();
  }
}

export async function reconcilePendingPayments() {
  if (!isBinanceConfigured()) return { checked: 0 };
  const pending = await PaymentModel.findAll({
    where: { provider: "binance_pay", status: "pending" },
    limit: 50,
  });
  let checked = 0;
  for (const payment of pending) {
    checked += 1;
    try {
      if (!payment.merchantTradeNo) continue;
      const query = await queryBinanceOrder(payment.merchantTradeNo);
      if (query.status === "PAID" || query.status === "PAY_SUCCESS") {
        await settlePayment(payment.id);
      } else if (
        query.status === "EXPIRED" ||
        query.status === "CANCELED" ||
        query.status === "ERROR" ||
        (payment.quoteExpiresAt && payment.quoteExpiresAt.getTime() < Date.now() && query.status !== "PENDING" && query.status !== "INITIAL")
      ) {
        payment.status = "expired";
        await payment.save();
      }
    } catch (err) {
      logger.error({ err, paymentId: payment.id }, "Payment reconciliation failed");
    }
  }
  return { checked };
}

export async function payoutWithdrawal(input: {
  withdrawalId: string;
  usdAmount: number;
  binanceId: string;
}) {
  await assertBinanceReady();
  const quote = await quoteUsdt(input.usdAmount);
  const requestId = await payoutToBinanceId({
    requestId: input.withdrawalId,
    binanceId: input.binanceId,
    usdtAmount: quote.paidAmount,
  });
  return { requestId, paidAsset: "USDT", paidAmount: quote.paidAmount, fxRate: quote.fxRate };
}

export async function getPaymentForUser(userId: string, paymentId: string) {
  const payment = await PaymentModel.findByPk(paymentId);
  if (!payment || payment.userId !== userId) throw AppError.notFound("Payment not found");
  const user = await UserModel.findByPk(userId);
  const balanceAfter = await latestBalance(payment.id);
  return toReportRow(payment, user?.email ?? null, balanceAfter);
}

export async function listPaymentReport(opts: { userId?: string; status?: string } = {}) {
  const where: Record<string, unknown> = {};
  if (opts.userId) where.userId = opts.userId;
  if (opts.status) where.status = opts.status;

  const payments = await PaymentModel.findAll({
    where,
    order: [["createdAt", "DESC"]],
    limit: 200,
  });
  const users = await UserModel.findAll({
    where: { id: { [Op.in]: [...new Set(payments.map((p) => p.userId))] } },
  });
  const emailById = new Map(users.map((user) => [user.id, user.email]));

  const paymentRows: PaymentReportRow[] = [];
  for (const payment of payments) {
    paymentRows.push(
      toReportRow(payment, emailById.get(payment.userId) ?? null, await latestBalance(payment.id))
    );
  }

  const walletWhere = opts.userId ? { userId: opts.userId } : {};
  const wallets = await WalletModel.findAll({ where: walletWhere });
  const walletIds = wallets.map((wallet) => wallet.id);
  const ledger = walletIds.length
    ? await LedgerTransactionModel.findAll({
        where: {
          walletId: { [Op.in]: walletIds },
          referenceType: { [Op.in]: ["investment", "return", "withdrawal"] },
        },
        order: [["createdAt", "DESC"]],
        limit: 200,
      })
    : [];
  const walletUser = new Map(wallets.map((wallet) => [wallet.id, wallet.userId]));
  const ledgerRows = ledger.flatMap((tx) =>
    ledgerRowsFor(tx, walletUser.get(tx.walletId) || "", emailById.get(walletUser.get(tx.walletId) || "") ?? null)
  );

  return [...paymentRows, ...ledgerRows].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

async function latestBalance(paymentId: string) {
  const row = await LedgerTransactionModel.findOne({
    where: { referenceType: "payment", referenceId: paymentId },
    order: [["createdAt", "DESC"]],
  });
  return row?.balanceAfter ?? null;
}

function toReportRow(payment: PaymentModel, email: string | null, balanceAfter: number | null): PaymentReportRow {
  const meta = metaOf(payment);
  return {
    id: payment.id,
    userId: payment.userId,
    userEmail: email,
    type: payment.type,
    status: payment.status,
    usdAmount: payment.amount,
    paidAsset: payment.paidAsset,
    paidAmount: payment.paidAmount,
    fxRate: payment.fxRate,
    provider: payment.provider,
    providerTransactionId: payment.providerTransactionId,
    referenceType: payment.referenceType,
    referenceId: payment.referenceId,
    balanceAfter,
    exceptionReason: typeof meta.exceptionReason === "string" ? meta.exceptionReason : null,
    createdAt: payment.createdAt.toISOString(),
    completedAt: payment.completedAt?.toISOString() ?? null,
  };
}

function ledgerRowsFor(
  tx: LedgerTransactionModel,
  userId: string,
  email: string | null
): PaymentReportRow[] {
  const base = {
    userId,
    userEmail: email,
    status: tx.status,
    paidAsset: null,
    paidAmount: null,
    fxRate: null,
    provider: "ledger",
    providerTransactionId: null,
    referenceType: tx.referenceType,
    referenceId: tx.referenceId,
    exceptionReason: null,
    createdAt: tx.createdAt.toISOString(),
    completedAt: tx.createdAt.toISOString(),
  };
  const principal = tx.description?.match(/principal: \$([0-9.]+), fee: \$([0-9.]+)/);
  if (tx.referenceType === "investment" && principal) {
    return [
      {
        ...base,
        id: tx.id,
        type: "investment",
        usdAmount: Number(principal[1]),
        balanceAfter: null,
      },
      {
        ...base,
        id: `${tx.id}:fee`,
        type: "platform_fee",
        usdAmount: Number(principal[2]),
        balanceAfter: tx.balanceAfter,
      },
    ];
  }
  return [
    {
      ...base,
      id: tx.id,
      type: tx.referenceType || tx.type,
      usdAmount: tx.amount,
      balanceAfter: tx.balanceAfter,
    },
  ];
}
