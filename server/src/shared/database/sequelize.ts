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
}
