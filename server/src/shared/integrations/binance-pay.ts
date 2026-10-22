import crypto from "crypto";
import { env } from "../../app/config/env";
import { AppError } from "../errors/AppError";

const DEFAULT_BASE = "https://bpay.binanceapi.com";

export function isBinanceConfigured(): boolean {
  return Boolean(env.BINANCE_PAY_API_KEY && env.BINANCE_PAY_API_SECRET);
}

function baseUrl() {
  return (env.BINANCE_PAY_BASE_URL || DEFAULT_BASE).replace(/\/$/, "");
}

export type BinanceOrder = {
  prepayId: string;
  checkoutUrl: string;
};

export type BinanceOrderQuery = {
  status: string;
  currency?: string;
  orderAmount?: number;
  transactionId?: string;
};

type Cert = { certSerial: string; certPublic: string };

let certCache: { at: number; certs: Cert[] } | null = null;

async function signedPost<T>(path: string, payload: unknown): Promise<T> {
  if (!isBinanceConfigured()) {
    throw new AppError("Binance Pay is not configured", 503, { code: "BINANCE_NOT_CONFIGURED" });
  }
  const body = JSON.stringify(payload);
  const timestamp = Date.now().toString();
  const nonce = crypto.randomBytes(16).toString("hex");
  const signature = crypto
    .createHmac("sha512", env.BINANCE_PAY_API_SECRET as string)
    .update(`${timestamp}\n${nonce}\n${body}\n`)
    .digest("hex")
    .toUpperCase();

  const res = await fetch(`${baseUrl()}${path}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "BinancePay-Timestamp": timestamp,
      "BinancePay-Nonce": nonce,
      "BinancePay-Certificate-SN": env.BINANCE_PAY_API_KEY as string,
      "BinancePay-Signature": signature,
    },
    body,
  });
  const json = (await res.json()) as {
    status?: string;
    code?: string;
    errorMessage?: string;
    data?: T;
  };
  if (!res.ok || json.status !== "SUCCESS") {
    throw new AppError(json.errorMessage || "Binance Pay request failed", 502, {
      code: json.code || "BINANCE_PAY_ERROR",
    });
  }
  return json.data as T;
}

/** USDT charged for a USD amount. Falls back to a 1:1 peg if the ticker is down. */
export async function quoteUsdt(usdAmount: number): Promise<{
  fxRate: number;
  paidAmount: number;
  source: "ticker" | "peg";
}> {
  let fxRate = 1;
  let source: "ticker" | "peg" = "peg";
  try {
    const res = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=USDCUSDT");
    const data = (await res.json()) as { price?: string };
    const price = Number(data.price);
    if (res.ok && price > 0) {
      fxRate = price;
      source = "ticker";
    }
  } catch {
    /* peg */
  }
  const paidAmount = Math.round(usdAmount * fxRate * 100) / 100;
  return { fxRate, paidAmount, source };
}

export async function createBinanceOrder(input: {
  merchantTradeNo: string;
  orderAmount: number;
  goodsName: string;
  returnUrl: string;
  cancelUrl: string;
  webhookUrl: string;
}): Promise<BinanceOrder> {
  const data = await signedPost<{
    prepayId: string;
    checkoutUrl: string;
    universalUrl?: string;
  }>("/binancepay/openapi/v3/order", {
    env: { terminalType: "WEB" },
    merchantTradeNo: input.merchantTradeNo,
    orderAmount: input.orderAmount,
    currency: "USDT",
    goods: {
      goodsType: "02",
      goodsCategory: "Z000",
      referenceGoodsId: input.merchantTradeNo,
      goodsName: input.goodsName,
    },
    returnUrl: input.returnUrl,
    cancelUrl: input.cancelUrl,
    webhookUrl: input.webhookUrl,
  });
  return {
    prepayId: data.prepayId,
    checkoutUrl: data.checkoutUrl || data.universalUrl || "",
  };
}

export async function queryBinanceOrder(merchantTradeNo: string): Promise<BinanceOrderQuery> {
  const data = await signedPost<{
    status?: string;
    orderStatus?: string;
    currency?: string;
    orderAmount?: string | number;
    transactionId?: string;
  }>("/binancepay/openapi/v2/order/query", { merchantTradeNo });
  return {
    status: data.status || data.orderStatus || "",
    currency: data.currency,
    orderAmount: data.orderAmount == null ? undefined : Number(data.orderAmount),
    transactionId: data.transactionId,
  };
}

async function loadCertificates(): Promise<Cert[]> {
  if (certCache && Date.now() - certCache.at < 60 * 60 * 1000) return certCache.certs;
  const data = await signedPost<{ certSerial: string; certPublic: string }[] | { certSerial: string; certPublic: string }>(
    "/binancepay/openapi/certificates",
    {}
  );
  const certs = Array.isArray(data) ? data : [data];
  certCache = { at: Date.now(), certs };
  return certs;
}

export async function verifyBinanceWebhook(
  rawBody: string,
  headers: Record<string, string | string[] | undefined>
): Promise<void> {
  const timestamp = header(headers, "binancepay-timestamp");
  const nonce = header(headers, "binancepay-nonce");
  const signature = header(headers, "binancepay-signature");
  const serial = header(headers, "binancepay-certificate-sn");
  if (!timestamp || !nonce || !signature || !serial) {
    throw new AppError("Missing Binance Pay signature", 401, { code: "BINANCE_SIGNATURE" });
  }
  const certs = await loadCertificates();
  const cert = certs.find((item) => item.certSerial === serial);
  if (!cert) {
    certCache = null;
    throw new AppError("Unknown Binance Pay certificate", 401, { code: "BINANCE_SIGNATURE" });
  }
  const verifier = crypto.createVerify("RSA-SHA256");
  verifier.update(`${timestamp}\n${nonce}\n${rawBody}\n`);
  const valid = verifier.verify(cert.certPublic, signature, "base64");
  if (!valid) {
    throw new AppError("Invalid Binance Pay signature", 401, { code: "BINANCE_SIGNATURE" });
  }
}

export async function payoutToBinanceId(input: {
  requestId: string;
  binanceId: string;
  usdtAmount: number;
}): Promise<string> {
  const data = await signedPost<{ requestId?: string; status?: string }>(
    "/binancepay/openapi/payout/transfer",
    {
      requestId: input.requestId,
      batchName: "XS Invest withdrawal",
      currency: "USDT",
      totalAmount: input.usdtAmount,
      totalNumber: 1,
      transferDetailList: [
        {
          merchantSendId: input.requestId.replace(/-/g, "").slice(0, 32),
          receiveType: "BINANCE_ID",
          receiver: input.binanceId,
          transferAmount: input.usdtAmount,
          transferMethod: "FUNDING_WALLET",
          remark: "XS Invest withdrawal",
        },
      ],
    }
  );
  return data.requestId || input.requestId;
}

function header(headers: Record<string, string | string[] | undefined>, name: string) {
  const value = headers[name];
  return Array.isArray(value) ? value[0] : value;
}
