import argon2 from "argon2";
import bcrypt from "bcryptjs";

const ARGON2_OPTIONS = {
  type: argon2.argon2id,
  memoryCost: 65536,
  timeCost: 3,
  parallelism: 4,
} as const;

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, ARGON2_OPTIONS);
}

/** Verify password against Argon2id or legacy bcrypt hash. */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  if (hash.startsWith("$argon2")) {
    return argon2.verify(hash, password);
  }
  return bcrypt.compare(password, hash);
}

/** Re-hash bcrypt passwords to Argon2id on successful login. */
export function needsRehash(hash: string): boolean {
  return !hash.startsWith("$argon2");
}
