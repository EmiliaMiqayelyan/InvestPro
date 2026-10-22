import { Sequelize, DataTypes, Dialect } from "sequelize";
import { env } from "../../app/config/env";
import { logger } from "../logger";

function createSequelize(): Sequelize {
  if (env.DB_DIALECT === "sqlite") {
    const storage = env.DB_STORAGE || ":memory:";
    return new Sequelize({
      dialect: "sqlite",
      storage,
      logging: env.NODE_ENV === "development" ? (msg) => logger.debug(msg) : false,
      pool: { max: 1, min: 0, idle: 10000 },
      retry: { max: 5 },
      dialectOptions: {
        // Reduce SQLITE_BUSY during concurrent writes (transactions + activity logs)
        timeout: 15000,
      },
    });
  }

  return new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
    host: env.DB_HOST,
    port: env.DB_PORT,
    dialect: "mysql" as Dialect,
    logging: env.NODE_ENV === "development" ? (msg) => logger.debug(msg) : false,
    dialectOptions: {
      charset: "utf8mb4",
    },
    define: {
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
    },
  });
}

export const sequelize = createSequelize();

/** JSON that serializes as TEXT on sqlite when needed */
export const JsonColumn = DataTypes.JSON;

export async function connectDatabase(): Promise<void> {
  await sequelize.authenticate();
  if (env.DB_DIALECT === "sqlite") {
    await sequelize.query("PRAGMA journal_mode=WAL;");
    await sequelize.query("PRAGMA busy_timeout=15000;");
  }
  logger.info({ dialect: env.DB_DIALECT }, "Database connected");
  if (env.DB_SYNC || env.DB_DIALECT === "sqlite") {
    await sequelize.sync();
    logger.info("Database schema synced");
  }
  await ensurePaymentColumns();
  await ensureConversationProjectIdLength();
}

/** Add Binance payment columns on databases created before this integration. */
export async function ensurePaymentColumns(): Promise<void> {
  const qi = sequelize.getQueryInterface();
  let desc: Record<string, unknown>;
  try {
    desc = await qi.describeTable("payments");
  } catch {
    return;
  }
  const columns: Record<string, object> = {
    merchantTradeNo: { type: DataTypes.STRING(32), allowNull: true },
    paidAsset: { type: DataTypes.STRING(16), allowNull: true },
    paidAmount: { type: DataTypes.DOUBLE, allowNull: true },
    fxRate: { type: DataTypes.DOUBLE, allowNull: true },
    quoteExpiresAt: { type: DataTypes.DATE, allowNull: true },
    referenceType: { type: DataTypes.STRING(32), allowNull: true },
    referenceId: { type: DataTypes.STRING(36), allowNull: true },
    providerMeta: { type: DataTypes.JSON, allowNull: true },
  };
  for (const [name, spec] of Object.entries(columns)) {
    if (!desc[name]) {
      await qi.addColumn("payments", name, spec as Parameters<typeof qi.addColumn>[2]);
    }
  }
}

/**
 * Admin support threads use ids like `support:investor:<uuid>` (53 chars).
 * The original column is VARCHAR(36), so MySQL rejects the insert.
 */
export async function ensureConversationProjectIdLength(): Promise<void> {
  // SQLite does not enforce VARCHAR length. Sequelize's changeColumn rebuilds
  // the table and can fail, so only MySQL needs this alter.
  if (env.DB_DIALECT !== "mysql") return;
  const qi = sequelize.getQueryInterface();
  let desc: Record<string, { type?: string }>;
  try {
    desc = (await qi.describeTable("conversations")) as Record<string, { type?: string }>;
  } catch {
    return;
  }
  const type = String(desc.projectId?.type || "");
  const match = type.match(/\((\d+)\)/);
  const length = match ? Number(match[1]) : 0;
  if (!desc.projectId || length >= 64) return;
  await sequelize.query(
    "ALTER TABLE `conversations` MODIFY `projectId` VARCHAR(64) NOT NULL"
  );
  logger.info("Widened conversations.projectId to VARCHAR(64)");
}
