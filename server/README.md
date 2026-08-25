# InvestPro API Server

Standalone Express + Sequelize backend that preserves the `/api/v1` contract used by the Next.js frontend.

## Quick start (SQLite — no MySQL required)

```bash
cd server
cp .env.example .env
# edit .env:
#   DB_DIALECT=sqlite
#   DB_STORAGE=./dev.sqlite
#   DB_SYNC=true

npm install
npm run dev
```

API listens on `http://127.0.0.1:4000`. Health: `GET /health`. Docs: `GET /docs`.

## MySQL (Docker)

```bash
docker compose up -d
cp .env.example .env   # defaults already point at local MySQL
npm install
npm run migrate
npm run seed
npm run dev
```

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | TSX watch mode |
| `npm run build` | Compile to `dist/` |
| `npm start` | Run compiled server |
| `npm test` | Vitest |
| `npm run migrate` | Run Sequelize migrations |
| `npm run seed` | Seed demo users/projects |

## Seed accounts

| Email | Password | Role |
|-------|----------|------|
| admin@investpro.com | admin123 | admin |
| investor@investpro.com | investor123 | investor (service membership) |
| owner@investpro.com | owner123 | project_owner |

## Frontend proxy

The Next.js catch-all at `app/api/v1/[...path]/route.ts` proxies to `BACKEND_URL` (default `http://127.0.0.1:4000`). From the repo root:

```bash
npm run server:dev
# or
npm run dev:all
```

## Env

See `.env.example`. Important:

- `JWT_SECRET` — must match any shared-auth expectations
- `CORS_ORIGIN` — Next.js origin (`http://localhost:3000`)
- `DB_DIALECT=sqlite` + `DB_STORAGE` for local verification
- `DB_SYNC=true` auto-creates tables (dev/sqlite); prefer migrations for MySQL production
