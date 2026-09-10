#!/usr/bin/env bash
# From your laptop: push current branch, then redeploy production.
# Prerequisites: SSH key auth (see scripts/push-deploy.ps1 on Windows).
# Usage: ./scripts/push-deploy.sh
set -euo pipefail

REMOTE_HOST="${DEPLOY_HOST:-root@178.104.115.86}"
REMOTE_APP="${REMOTE_APP:-/var/www/InvestPro}"
SSH_KEY="${DEPLOY_SSH_KEY:-$HOME/.ssh/id_ed25519_investpro}"
BRANCH="$(git rev-parse --abbrev-ref HEAD)"

SSH_OPTS=(-o StrictHostKeyChecking=accept-new)
if [[ -f "$SSH_KEY" ]]; then
  SSH_OPTS+=(-i "$SSH_KEY")
fi

echo "==> pushing $BRANCH"
git push -u origin "$BRANCH"

echo "==> remote redeploy"
ssh "${SSH_OPTS[@]}" "$REMOTE_HOST" "bash $REMOTE_APP/scripts/redeploy.sh"

echo "==> done"
