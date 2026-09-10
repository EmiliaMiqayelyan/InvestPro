/**
 * PM2 process file for InvestPro (web + API).
 * Env files are loaded explicitly so JWT_SECRET stays in sync across both apps.
 */
const fs = require("fs");
const path = require("path");

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const env = {};
  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

const root = __dirname;
const webEnv = loadEnvFile(path.join(root, ".env"));
const apiEnv = loadEnvFile(path.join(root, "server", ".env"));

// Next middleware must verify tokens signed by the API — always prefer API secret.
const jwtSecret = apiEnv.JWT_SECRET || webEnv.JWT_SECRET;
if (!jwtSecret) {
  console.warn("[ecosystem] JWT_SECRET missing from server/.env — auth redirects will fail");
}

module.exports = {
  apps: [
    {
      name: "investpro",
      cwd: root,
      script: "node_modules/next/dist/bin/next",
      args: "start -H 127.0.0.1 -p 3926",
      interpreter: "node",
      instances: 1,
      exec_mode: "fork",
      max_memory_restart: "700M",
      env: {
        ...webEnv,
        NODE_ENV: "production",
        PORT: "3926",
        HOSTNAME: "127.0.0.1",
        BACKEND_URL: webEnv.BACKEND_URL || "http://127.0.0.1:4926",
        NEXT_PUBLIC_API_URL: webEnv.NEXT_PUBLIC_API_URL || "/api/v1",
        JWT_SECRET: jwtSecret,
      },
    },
    {
      name: "investpro-api",
      cwd: path.join(root, "server"),
      script: "dist/main.js",
      interpreter: "node",
      instances: 1,
      exec_mode: "fork",
      max_memory_restart: "400M",
      env: {
        ...apiEnv,
        NODE_ENV: "production",
        PORT: apiEnv.PORT || "4926",
        JWT_SECRET: jwtSecret,
      },
    },
  ],
};
