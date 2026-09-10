#!/usr/bin/env bash
# Redeploy InvestPro on the production host (run on the server).
# Usage: /var/www/InvestPro/scripts/redeploy.sh
set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/InvestPro}"
BRANCH="${DEPLOY_BRANCH:-master}"
LOCK_FILE="/tmp/investpro-redeploy.lock"

cd "$APP_DIR"

if command -v flock >/dev/null 2>&1; then
  exec 9>"$LOCK_FILE"
  if ! flock -n 9; then
    echo "Another redeploy is already running."
    exit 1
  fi
fi

echo "==> $(date -u +%Y-%m-%dT%H:%M:%SZ) redeploy start (branch=$BRANCH)"

if [[ ! -d .git ]]; then
  echo "ERROR: $APP_DIR is not a git repository"
  exit 1
fi

# Keep production env files (never overwritten by git).
echo "==> syncing git"
git fetch --prune origin
git checkout "$BRANCH"
git reset --hard "origin/$BRANCH"
git clean -fd -e .env -e 'server/.env' -e '.next' -e 'node_modules' -e 'server/node_modules' -e 'server/dist'

# Ensure Next.js can verify API JWTs (middleware).
if [[ -f server/.env ]]; then
  API_JWT=$(grep -E '^JWT_SECRET=' server/.env | head -1 | cut -d= -f2- || true)
  if [[ -n "${API_JWT:-}" ]]; then
    touch .env
    if grep -qE '^JWT_SECRET=' .env; then
      sed -i "s|^JWT_SECRET=.*|JWT_SECRET=$API_JWT|" .env
    else
      printf '\nJWT_SECRET=%s\n' "$API_JWT" >> .env
    fi
    # Keep web proxy defaults if missing.
    grep -qE '^BACKEND_URL=' .env || echo 'BACKEND_URL=http://127.0.0.1:4926' >> .env
    grep -qE '^NEXT_PUBLIC_API_URL=' .env || echo 'NEXT_PUBLIC_API_URL=/api/v1' >> .env
    grep -qE '^NODE_ENV=' .env || echo 'NODE_ENV=production' >> .env
  fi
fi

echo "==> installing root deps"
if [[ -f package-lock.json ]]; then
  npm ci || npm install
else
  npm install
fi

echo "==> installing server deps"
pushd server >/dev/null
if [[ -f package-lock.json ]]; then
  npm ci || npm install
else
  npm install
fi
echo "==> building API"
npm run build
popd >/dev/null

echo "==> building Next.js"
npm run build

echo "==> restarting PM2"
if [[ -f ecosystem.config.cjs ]]; then
  pm2 startOrReload ecosystem.config.cjs --update-env
else
  pm2 restart investpro investpro-api --update-env
fi
pm2 save

echo "==> health checks"
sleep 2
curl -fsS "http://127.0.0.1:4926/health" >/dev/null
curl -fsS -o /dev/null -w "web:%{http_code}\n" "http://127.0.0.1:3926/"
curl -fsS -X POST "http://127.0.0.1:3926/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@investpro.com","password":"admin123"}' \
  | grep -q '"success":true'

echo "==> $(date -u +%Y-%m-%dT%H:%M:%SZ) redeploy OK"
pm2 list | grep -E 'investpro|name' || pm2 list
