# E-Waste Backend (NestJS)

REST API for the E-Waste Traceability platform. Handles auth, citizen sell requests, pickups, lots, hub intake, recycler intake, EPR export, audit, incentives, anomalies, and optional WhatsApp/Exotel integrations.

---

## Table of contents

- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Environment variables](#environment-variables)
- [Database and migrations](#database-and-migrations)
- [Scripts](#scripts)
- [API reference](#api-reference)
- [Health and production](#health-and-production)

---

## Tech stack

- **Runtime**: Node.js ≥ 20
- **Framework**: NestJS 10
- **ORM**: TypeORM
- **Database**: PostgreSQL
- **Cache**: Redis (optional, via `ioredis`)
- **Auth**: JWT (Passport), role-based guards (`JwtAuthGuard`, `RolesGuard`)
- **Security**: Helmet, CORS from env, compression (gzip)
- **Validation**: `class-validator`, global `ValidationPipe` (whitelist, forbidNonWhitelisted, transform)

---

## Project structure

```
backend/src/
├── main.ts                    # Bootstrap, CORS, Helmet, compression, migrations on startup
├── app.module.ts              # Root module, TypeORM, all feature modules
├── typeorm-datasource.ts      # TypeORM DataSource for CLI and migrations
├── db/
│   └── validate-env.ts        # Validates DATABASE_URL or DB_* before migrations
├── common/
│   ├── domain-error.ts        # Domain errors
│   └── domain-exception.filter.ts  # Global exception filter
├── auth/
│   ├── auth.controller.ts     # POST /auth/login, /auth/register, GET /auth/me
│   ├── auth.service.ts
│   ├── jwt.strategy.ts
│   ├── guards/                # JwtAuthGuard, RolesGuard
│   └── decorators/            # CurrentUser, Roles, Public
├── health/
│   ├── health.controller.ts   # GET /health, /health/db
│   └── root.controller.ts     # GET / (api info)
├── citizen/
│   ├── citizen.controller.ts       # Campaigns, categories, sell-requests (citizen)
│   ├── citizen-admin.controller.ts # Sell requests list, convert-to-pickup, payment (admin)
│   ├── citizen.service.ts
│   └── dto/
├── pickups/
│   ├── pickup.controller.ts   # POST/GET /pickups, PATCH /pickups/:id/status
│   ├── pickup.service.ts
│   ├── pickup-state.ts        # Allowed status transitions
│   └── dto/
├── lots/
│   ├── lot.controller.ts      # hub-intake, lots, dispatch, hub-intake-records
│   ├── lot.service.ts
│   └── dto/
├── reference/
│   └── reference.controller.ts # hubs, material-categories, recyclers, brands
├── recycler/
│   └── recycler.controller.ts # POST /recycler/intakes
├── epr/
│   ├── epr.controller.ts      # credits, export
│   └── epr.service.ts
├── audit/
│   └── audit.controller.ts    # GET /audit/verify
├── incentives/
│   └── incentives.controller.ts
├── anomalies/
│   └── anomalies.controller.ts
├── booking/
│   └── booking.controller.ts
├── integrations/
│   ├── whatsapp/              # Webhook
│   └── exotel/                # Missed-call
├── cache/
│   └── redis.module.ts
├── entities/                  # User, Citizen, Address, Pickup, Lot, etc.
├── migrations/                # TypeORM migrations
└── scripts/
    └── seed.ts                # Demo data (admin, hub, categories, campaign, recycler, etc.)
```

---

## Environment variables

Copy `.env.example` to `.env` and set values. Required for local run:

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | `development` or `production` | `development` |
| `PORT` | Server port | `3001` |
| `DATABASE_URL` | Full Postgres URL (overrides DB_* if set) | `postgresql://user:pass@host:5432/dbname` |
| `DB_HOST` | Postgres host (if no DATABASE_URL) | `localhost` |
| `DB_PORT` | Postgres port | `5432` |
| `DB_USER` or `DB_USERNAME` | Postgres user | `ewaste` |
| `DB_PASSWORD` | Postgres password | (your password) |
| `DB_NAME` | Postgres database name | `ewaste_mvp` |
| `JWT_SECRET` or `JWT_ACCESS_TOKEN_SECRET` | JWT signing secret (min 32 chars in prod) | (strong secret) |
| `CORS_ORIGIN` | Allowed frontend origin(s), comma-separated | `http://localhost:3000,http://localhost:3002` |

Optional:

- `JWT_EXPIRES_IN` — e.g. `1d`
- `RUN_MIGRATIONS` — `true` (default) or `false`
- `REDIS_URL` or `REDIS_HOST` + `REDIS_PORT`
- `WHATSAPP_BSP_*`, `EXOTEL_*`, `DEFAULT_HUB_ID`, `WEIGHT_VARIANCE_THRESHOLD_PCT`

See **`.env.example`** in this directory for the full list and comments.

---

## Database and migrations

### Requirements

- PostgreSQL running and accessible with the credentials in `.env`.
- Either `DATABASE_URL` or all of `DB_HOST`, `DB_PORT`, `DB_USER` (or `DB_USERNAME`), `DB_PASSWORD`, `DB_NAME` must be set.

### Behaviour

- **On startup**: Migrations run automatically before the server listens, unless `RUN_MIGRATIONS=false`.
- **Manual run** (e.g. CI or one-off):
  ```bash
  npm run typeorm:migrate
  ```
  or `npm run migration:run`.
- **Revert last migration**:
  ```bash
  npm run typeorm:migrate:revert
  ```
  or `npm run migration:revert`.
- **Reset** (revert then run again; use with care):
  ```bash
  npm run db:reset
  ```

### Seed (demo data)

```bash
npm run seed
```

Creates (if missing): admin user (`admin@demo.local` / `Password123`), hub, material categories, campaign, recycler, brand, incentives. Use only for demo/staging; do not run in production with real data.

---

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start API in watch mode (default port 3001) |
| `npm run build` | Production build → `dist/` |
| `npm run start` | Run `node dist/main.js` |
| `npm run start:prod` | Same as `start` |
| `npm run typeorm:migrate` | Run pending migrations |
| `npm run migration:revert` | Revert last migration |
| `npm run db:reset` | Revert then run migrations |
| `npm run seed` | Seed demo data |
| `npm run lint` | ESLint on `src/**/*.{ts,tsx}` |
| `npm run test` | Jest |

---

## API reference

Base path: **`/api/v1`**. All routes except health and auth require `Authorization: Bearer <token>` unless marked public.

### Health (public)

- `GET /api/v1/health` — `{ status: "ok", timestamp }`
- `GET /api/v1/health/db` — `{ status: "ok", db: "connected" }` or `{ status: "error", db: "disconnected" }`

### Auth (public for login/register)

- `POST /api/v1/auth/login` — Body: `{ email, password }`. Returns `{ access_token, user }`.
- `POST /api/v1/auth/register` — Body: `{ name, email, password, phone?, role? }`. Returns user.
- `GET /api/v1/auth/me` — Returns current user (requires JWT).

### Citizen

- `GET /api/v1/citizen/campaigns` — Active campaigns.
- `GET /api/v1/citizen/material-categories` — Material categories.
- `POST /api/v1/citizen/sell-requests` — Create sell request (address, campaignId?, items, notes?, preferredDateFrom/To?, alternatePhone?).
- `GET /api/v1/citizen/sell-requests` — List current user’s sell requests.
- `GET /api/v1/citizen/sell-requests/:id` — Get one.
- `GET /api/v1/citizen/sell-requests/:id/traceability` — Traceability view.

### Citizen admin (admin/coordinator)

- `GET /api/v1/citizen-admin/sell-requests` — List all sell requests.
- `POST /api/v1/citizen-admin/sell-requests/:id/convert-to-pickup` — Convert to pickup (body: hubId).
- `PATCH /api/v1/citizen-admin/sell-requests/:id/payment` — Record payment (body: paymentAmountRs).

### Pickups

- `GET /api/v1/pickups` — List pickups (query params for filters).
- `POST /api/v1/pickups` — Create pickup (admin).
- `GET /api/v1/pickups/:id` — Get one.
- `PATCH /api/v1/pickups/:id/status` — Update status (body: `{ status }`). Valid transitions defined in `pickup-state.ts`.

### Lots and hub intake

- `POST /api/v1/hub-intake` — Record hub intake (pickupId, weight, etc.).
- `GET /api/v1/hub-intake-records` — List hub intake records.
- `POST /api/v1/lots` — Create lot.
- `GET /api/v1/lots` — List lots.
- `GET /api/v1/lots/:id` — Get one.
- `POST /api/v1/lots/:id/dispatch` — Dispatch lot to recycler.

### Recycler

- `POST /api/v1/recycler/intakes` — Confirm recycler intake (lotId, etc.).

### EPR

- `POST /api/v1/epr/credits` — Generate EPR credit.
- `GET /api/v1/epr/export` — Export (CSV) with query params.

### Reference

- `GET /api/v1/hubs` — List hubs.
- `GET /api/v1/material-categories` — List material categories.
- `GET /api/v1/recyclers` — List recyclers.
- `GET /api/v1/brands` — List brands.

### Audit, incentives, anomalies, booking

- `GET /api/v1/audit/verify` — Audit verify.
- `GET /api/v1/incentives` — List incentives.
- `GET /api/v1/anomalies` — List anomalies.
- `GET /api/v1/booking/requests` — List booking requests.

### Integrations (public webhooks)

- `GET /api/v1/integrations/whatsapp/webhook` — WhatsApp verify.
- `POST /api/v1/integrations/whatsapp/webhook` — WhatsApp webhook.
- `POST /api/v1/integrations/exotel/missed-call` — Exotel missed-call.

---

## Health and production

- **Health check URL**: `GET /api/v1/health` (and optionally `/api/v1/health/db` for DB).
- **Production**: Use `NODE_ENV=production`, `DATABASE_URL`, strong `JWT_SECRET`, and set `CORS_ORIGIN` to your frontend origin(s). Migrations run on startup unless `RUN_MIGRATIONS=false`.
- **Render**: See root `render.yaml` and [Docs/PRODUCTION_DEPLOYMENT.md](../Docs/PRODUCTION_DEPLOYMENT.md).
- **Docker**: See root `docker-compose.yml` and [backend/Dockerfile](Dockerfile).
