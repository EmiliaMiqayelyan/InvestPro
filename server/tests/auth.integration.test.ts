import { beforeAll, afterAll, describe, it, expect } from "vitest";
import request from "supertest";
import { createApp } from "../src/app/create-app";
import { connectDatabase, sequelize } from "../src/shared/database/sequelize";
import { seedDatabase } from "../src/shared/database/seed";
import type { Express } from "express";

describe("auth integration", () => {
  let app: Express;

  beforeAll(async () => {
    await connectDatabase();
    await sequelize.sync({ force: true });
    await seedDatabase();
    app = createApp();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("rejects invalid login", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "admin@investpro.com", password: "wrong" });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("logs in seed admin", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "admin@investpro.com", password: "admin123" });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe("admin@investpro.com");
    expect(res.body.data.tokens.accessToken).toBeTruthy();
  });

  it("validates register payload", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({ email: "not-an-email", password: "x", firstName: "A", lastName: "B" });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("registers a new investor", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({
      email: "newinvestor@example.com",
      password: "secret12",
      firstName: "New",
      lastName: "Investor",
      role: "investor",
    });
    expect(res.status).toBe(201);
    expect(res.body.data.user.role).toBe("investor");
    expect(res.body.data.tokens.accessToken).toBeTruthy();
  });
});
