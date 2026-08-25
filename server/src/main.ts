import { createApp } from "./app/create-app";
import { env } from "./app/config/env";
import { connectDatabase } from "./shared/database/sequelize";
import { seedIfEmpty } from "./shared/database/seed";
import { logger } from "./shared/logger";

async function bootstrap() {
  await connectDatabase();
  await seedIfEmpty();
  const app = createApp();
  app.listen(env.PORT, () => {
    logger.info(`InvestPro API listening on http://127.0.0.1:${env.PORT}`);
  });
}

bootstrap().catch((err) => {
  logger.error({ err }, "Failed to start server");
  process.exit(1);
});
