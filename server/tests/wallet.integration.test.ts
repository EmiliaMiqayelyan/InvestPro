import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import { createApp } from "../src/app/create-app";
import { connectDatabase } from "../src/shared/database/sequelize";
import { seedIfEmpty } from "../src/shared/database/seed";

describe("wallet & financial API", () => {
  let app: ReturnType<typeof createApp>;
  let investorToken: string;

  beforeAll(async () => {
    process.env.DB_DIALECT = "sqlite";
    process.env.DB_STORAGE = ":memory:";
    process.env.DB_SYNC = "true";
    process.env.JWT_SECRET = "test-secret-key-min-8-chars";
    await connectDatabase();
    await seedIfEmpty();
    app = createApp();

    const login = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "investor@investpro.com", password: "investor123" });
    investorToken = login.body.data.tokens.accessToken;
  });

  it("returns wallet with zero balance initially", async () => {
    const res = await request(app)
      .get("/api/v1/wallet")
      .set("Authorization", `Bearer ${investorToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.availableBalance).toBe(0);
  });

  it("deposits with idempotency key", async () => {
    const key = `deposit-test-${Date.now()}`;
    const res = await request(app)
      .post("/api/v1/wallet/deposit")
      .set("Authorization", `Bearer ${investorToken}`)
      .set("Idempotency-Key", key)
      .send({ amount: 10000 });
    expect(res.status).toBe(201);
    expect(res.body.data.wallet.availableBalance).toBe(10000);

    const dup = await request(app)
      .post("/api/v1/wallet/deposit")
      .set("Authorization", `Bearer ${investorToken}`)
      .set("Idempotency-Key", key)
      .send({ amount: 10000 });
    expect(dup.status).toBe(201);
    expect(dup.body.data.wallet.availableBalance).toBe(10000);
  });

  it("returns portfolio summary", async () => {
    const res = await request(app)
      .get("/api/v1/me/portfolio")
      .set("Authorization", `Bearer ${investorToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("totalInvested");
    expect(res.body.data).toHaveProperty("roi");
  });
});
