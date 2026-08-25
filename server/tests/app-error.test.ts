import { describe, it, expect } from "vitest";
import { AppError } from "../src/shared/errors/AppError";

describe("AppError", () => {
  it("creates operational errors with status codes", () => {
    const err = AppError.unauthorized("Nope");
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(401);
    expect(err.message).toBe("Nope");
    expect(err.code).toBe("UNAUTHORIZED");
    expect(err.isOperational).toBe(true);
  });

  it("supports badRequest with details", () => {
    const err = AppError.badRequest("Invalid", { field: "email" });
    expect(err.statusCode).toBe(400);
    expect(err.details).toEqual({ field: "email" });
  });
});
