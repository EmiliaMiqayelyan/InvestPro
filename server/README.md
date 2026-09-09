# InvestIN API Server

Standalone Express + Sequelize backend implementing the **Investment Marketplace Backend Technical Specification v1.0**.

## Quick start (SQLite — no MySQL required)

```bash
cd server
cp .env.example .env
# edit .env:
#   DB_DIALECT=sqlite
#   DB_STORAGE=./dev.sqlite
#   DB_SYNC=true

npm install
npm run migrate
npm run dev
```

API listens on `http://127.0.0.1:4000`. Health: `GET /health`. Docs: `GET /docs`.

## MySQL (Docker)

```bash
docker compose up -d
cp .env.example .env
npm install
npm run migrate
npm run seed
npm run dev
```

## Spec modules implemented

| Module | Routes |
|--------|--------|
| Auth | JWT + refresh rotation, Argon2id, email verify, password reset, 2FA |
| Profiles | `GET/PATCH /me/profile`, investor & company profiles |
| Projects | Marketplace search, submit/publish lifecycle, nested offers |
| Investments | Confirm, fund with ledger, investment deals |
| Wallet | Immutable ledger, deposit/withdraw with `Idempotency-Key` |
| Returns | Portfolio (`/me/portfolio`), return scheduling & payout |
| KYC/KYB | `/kyc`, `/kyb` + admin review |
| Reviews | `/reviews` |
| Disputes | `/disputes` + admin resolution |
| Admin | Users, projects, payments, withdrawals, audit, reports |
| Notifications | Event-driven (email queue + in-app + SSE) |
| Background jobs | DB-backed job queue with worker |

Legacy routes (`/investor`, `/owner`, `/offers`, etc.) remain for frontend compatibility.

## Key spec endpoints

```
POST /api/v1/auth/register|login|refresh|verify-email|reset-password
GET  /api/v1/me|/me/profile|/me/investments|/me/portfolio
GET  /api/v1/wallet|/wallet/transactions
POST /api/v1/wallet/deposit|/wallet/withdraw   (Idempotency-Key required)
POST /api/v1/projects/{id}/offers|/submit|/publish
POST /api/v1/investments/{id}/confirm|/fund    (Idempotency-Key on fund)
GET  /api/v1/admin/users|/projects/pending|/audit|/disputes
```

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | TSX watch mode |
| `npm run build` | Compile to `dist/` |
| `npm start` | Run compiled server |
| `npm test` | Vitest (auth, wallet, RBAC, financial) |
| `npm run migrate` | Run Sequelize migrations |
| `npm run seed` | Seed demo users/projects |

## Seed accounts

| Email | Password | Role |
|-------|----------|------|
| admin@investpro.com | admin123 | admin |
| investor@investpro.com | investor123 | investor (service membership) |
| owner@investpro.com | owner123 | project_owner |

## Frontend proxy

The Next.js catch-all at `app/api/v1/[...path]/route.ts` proxies to `BACKEND_URL` (default `http://127.0.0.1:4000`).

## Financial integrity

- Wallet balances change **only** via immutable `ledger_transactions`
- Deposits, withdrawals, and investment funding require `Idempotency-Key` header
- All financial actions write to `audit_logs`

## Env

See `.env.example`. Important:

- `JWT_SECRET` — must be strong in production
- `CORS_ORIGIN` — Next.js origin (`http://localhost:3000`)
- `DB_DIALECT=sqlite` + `DB_STORAGE` for local dev
- `SMTP_*` — optional; emails queued via job worker
