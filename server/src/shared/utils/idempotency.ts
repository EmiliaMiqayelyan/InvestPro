import { v4 as uuidv4 } from "uuid";
import { Request, Response, NextFunction } from "express";
import { IdempotencyKeyModel } from "../database/associations";
import { AppError } from "../errors/AppError";
import type { AuthedRequest } from "../../app/middleware";

const TTL_HOURS = 24;

export async function checkIdempotency(
  userId: string,
  key: string,
  operation: string
): Promise<{ cached: boolean; response?: unknown; statusCode?: number }> {
  const existing = await IdempotencyKeyModel.findOne({ where: { key } });
  if (!existing) return { cached: false };
  if (existing.userId !== userId) {
    throw AppError.conflict("Idempotency key belongs to another user");
  }
  if (existing.response) {
    return { cached: true, response: existing.response, statusCode: existing.statusCode ?? 200 };
  }
  return { cached: false };
}

export async function storeIdempotency(
  userId: string,
  key: string,
  operation: string,
  response: unknown,
  statusCode: number
) {
  const expiresAt = new Date(Date.now() + TTL_HOURS * 60 * 60 * 1000);
  await IdempotencyKeyModel.create({
    id: uuidv4(),
    key,
    userId,
    operation,
    response: response as Record<string, unknown>,
    statusCode,
    expiresAt,
  });
}

/** Middleware for financial endpoints requiring Idempotency-Key header. */
export function requireIdempotencyKey(operation: string) {
  return async (req: AuthedRequest, res: Response, next: NextFunction) => {
    const key = req.headers["idempotency-key"] as string | undefined;
    if (!key) return next(AppError.badRequest("Idempotency-Key header is required"));
    if (!req.auth) return next(AppError.unauthorized());

    try {
      const result = await checkIdempotency(req.auth.sub, key, operation);
      if (result.cached) {
        return res.status(result.statusCode ?? 200).json(result.response);
      }
      (req as Request & { idempotencyKey: string; idempotencyOperation: string }).idempotencyKey =
        key;
      (req as Request & { idempotencyOperation: string }).idempotencyOperation = operation;
      next();
    } catch (err) {
      next(err);
    }
  };
}
