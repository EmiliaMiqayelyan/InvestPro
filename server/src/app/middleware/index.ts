import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { v4 as uuidv4 } from "uuid";
import { AppError } from "../../shared/errors/AppError";
import { verifyAccessToken, type TokenPayload } from "../../shared/utils/jwt";
import type { UserRole } from "../../shared/types";
import { logger } from "../../shared/logger";

export interface AuthedRequest extends Request {
  auth?: TokenPayload | null;
  requestId?: string;
}

export function requestIdMiddleware(req: AuthedRequest, res: Response, next: NextFunction) {
  const id = (req.headers["x-request-id"] as string) || uuidv4();
  req.requestId = id;
  res.setHeader("x-request-id", id);
  next();
}

export function ok<T>(res: Response, data: T, message?: string, status = 200) {
  return res.status(status).json({ success: true, data, message });
}

export function fail(res: Response, message: string, status = 400, code?: string) {
  return res.status(status).json({ success: false, message, ...(code ? { code } : {}) });
}

export async function authMiddleware(req: AuthedRequest, _res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    let token: string | undefined;
    if (header?.startsWith("Bearer ")) token = header.slice(7);
    if (!token && req.cookies?.access_token) token = req.cookies.access_token;
    if (!token && typeof req.query.token === "string") token = req.query.token;
    req.auth = token ? await verifyAccessToken(token) : null;
    next();
  } catch (err) {
    next(err);
  }
}

export function requireAuth(req: AuthedRequest): TokenPayload {
  if (!req.auth) throw AppError.unauthorized();
  return req.auth;
}

export function requireRole(req: AuthedRequest, roles: UserRole[]): TokenPayload {
  const auth = requireAuth(req);
  if (!roles.includes(auth.role)) throw AppError.forbidden();
  return auth;
}

export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message || "Validation failed";
      return next(AppError.badRequest(message, parsed.error.flatten()));
    }
    req.body = parsed.data;
    next();
  };
}

export function errorHandler(err: unknown, req: AuthedRequest, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.code ? { code: err.code } : {}),
    });
  }

  logger.error({ err, requestId: req.requestId }, "Unhandled error");
  return res.status(500).json({
    success: false,
    message: "Internal server error",
    code: "INTERNAL_ERROR",
  });
}

export function asyncHandler(
  fn: (req: AuthedRequest, res: Response, next: NextFunction) => Promise<unknown>
) {
  return (req: AuthedRequest, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/** Express 5 types params as string | string[] — normalize to a single segment. */
export function param(req: Request, name: string): string {
  const value = req.params[name];
  return Array.isArray(value) ? value[0] : value;
}

/** Minimal cookie parser without cookie-parser dep */
export function parseCookies(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.cookie;
  const cookies: Record<string, string> = {};
  if (header) {
    for (const part of header.split(";")) {
      const idx = part.indexOf("=");
      if (idx === -1) continue;
      const key = part.slice(0, idx).trim();
      const val = decodeURIComponent(part.slice(idx + 1).trim());
      cookies[key] = val;
    }
  }
  (req as Request & { cookies: Record<string, string> }).cookies = cookies;
  next();
}
