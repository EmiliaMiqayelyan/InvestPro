export class AppError extends Error {
  readonly statusCode: number;
  readonly code?: string;
  readonly details?: unknown;
  readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode = 400,
    options?: { code?: string; details?: unknown; isOperational?: boolean }
  ) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = options?.code;
    this.details = options?.details;
    this.isOperational = options?.isOperational ?? true;
    Error.captureStackTrace?.(this, this.constructor);
  }

  static unauthorized(message = "Unauthorized") {
    return new AppError(message, 401, { code: "UNAUTHORIZED" });
  }

  static forbidden(message = "Forbidden") {
    return new AppError(message, 403, { code: "FORBIDDEN" });
  }

  static notFound(message = "Not found") {
    return new AppError(message, 404, { code: "NOT_FOUND" });
  }

  static conflict(message: string) {
    return new AppError(message, 409, { code: "CONFLICT" });
  }

  static badRequest(message: string, details?: unknown) {
    return new AppError(message, 400, { code: "BAD_REQUEST", details });
  }

  static notImplemented(message = "Not implemented") {
    return new AppError(message, 501, { code: "NOT_IMPLEMENTED" });
  }
}
