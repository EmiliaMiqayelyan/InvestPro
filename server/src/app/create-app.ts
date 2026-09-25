import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import fs from "fs";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import YAML from "yaml";
import { env } from "./config/env";
import {
  authMiddleware,
  errorHandler,
  parseCookies,
  requestIdMiddleware,
} from "./middleware";
import { createApiRouter } from "./routes";
import { registerAssociations } from "../shared/database/associations";

export function createApp() {
  registerAssociations();

  const app = express();
  app.disable("x-powered-by");
  // Next.js API proxy / nginx send X-Forwarded-For; required for express-rate-limit.
  app.set("trust proxy", 1);
  app.use(requestIdMiddleware);
  app.use(parseCookies);
  app.use(
    cors({
      origin: env.CORS_ORIGIN.split(",").map((s) => s.trim()),
      credentials: true,
    })
  );
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
  app.use(express.json({ limit: "20mb" }));
  app.use(express.urlencoded({ extended: true, limit: "20mb" }));

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: env.NODE_ENV === "test" ? 10000 : 300,
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use("/api/v1/auth", rateLimit({ windowMs: 15 * 60 * 1000, max: 50 }));
  app.use("/api/v1", limiter);

  app.use(authMiddleware);

  app.get("/health", (_req, res) => {
    res.json({ success: true, data: { status: "ok" } });
  });

  const openapiPath = path.resolve(process.cwd(), "docs/openapi.yaml");
  if (fs.existsSync(openapiPath)) {
    const doc = YAML.parse(fs.readFileSync(openapiPath, "utf8"));
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(doc));
  }

  app.use("/api/v1", createApiRouter());
  app.use(errorHandler);
  return app;
}
