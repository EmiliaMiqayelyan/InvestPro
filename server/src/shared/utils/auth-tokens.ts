import { createHash, randomBytes } from "crypto";
import { v4 as uuidv4 } from "uuid";
import { AuthTokenModel, RefreshTokenModel } from "../database/associations";

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function generateToken(): string {
  return randomBytes(32).toString("hex");
}

export async function createAuthToken(
  userId: string,
  type: "email_verify" | "password_reset",
  ttlHours = 24
) {
  const token = generateToken();
  const expiresAt = new Date(Date.now() + ttlHours * 60 * 60 * 1000);
  await AuthTokenModel.create({
    id: uuidv4(),
    userId,
    type,
    tokenHash: hashToken(token),
    expiresAt,
    usedAt: null,
  });
  return token;
}

export async function consumeAuthToken(
  token: string,
  type: "email_verify" | "password_reset"
): Promise<string | null> {
  const row = await AuthTokenModel.findOne({
    where: { tokenHash: hashToken(token), type },
    order: [["createdAt", "DESC"]],
  });
  if (!row || row.usedAt || row.expiresAt < new Date()) return null;
  row.usedAt = new Date();
  await row.save();
  return row.userId;
}

export async function storeRefreshToken(userId: string, refreshToken: string, days = 30) {
  const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  await RefreshTokenModel.create({
    id: uuidv4(),
    userId,
    tokenHash: hashToken(refreshToken),
    expiresAt,
    revokedAt: null,
  });
}

export async function revokeRefreshToken(refreshToken: string) {
  const hash = hashToken(refreshToken);
  const row = await RefreshTokenModel.findOne({ where: { tokenHash: hash } });
  if (row && !row.revokedAt) {
    row.revokedAt = new Date();
    await row.save();
  }
}

export async function isRefreshTokenValid(refreshToken: string): Promise<boolean> {
  const hash = hashToken(refreshToken);
  const row = await RefreshTokenModel.findOne({ where: { tokenHash: hash } });
  if (!row || row.revokedAt || row.expiresAt < new Date()) return false;
  return true;
}

export async function revokeAllRefreshTokens(userId: string) {
  const rows = await RefreshTokenModel.findAll({
    where: { userId, revokedAt: null },
  });
  for (const row of rows) {
    row.revokedAt = new Date();
    await row.save();
  }
}
