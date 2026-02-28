# E-Waste Traceability

A **compliance-grade digital e-waste collection and traceability** system for India. Citizens, hubs, field captains, recyclers, and EPR brands use a single platform for pickups, lot management, recycler intake, audit trails, and EPR reporting.

---

## Table of contents

- [Overview](#overview)
- [Tech stack](#tech-stack)
- [Repository structure](#repository-structure)
- [Prerequisites](#prerequisites)
- [Quick start (local)](#quick-start-local)
- [Environment variables](#environment-variables)
- [Scripts](#scripts)
- [Roles and features](#roles-and-features)
- [API overview](#api-overview)
- [Deployment](#deployment)
- [Documentation](#documentation)

---

## Overview

- **Backend**: NestJS API on Node.js (PostgreSQL, optional Redis). REST at `/api/v1`. JWT auth, role-based access, migrations on startup.
- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS. Landing page, login/signup, role-specific dashboards (admin, citizen, field captain, recycler, brand).
- **Integrations**: WhatsApp (optional), Exotel IVR (optional) for booking and missed-call flows.
- **Deployment**: Backend → [Render](https://render.com); Frontend → [Vercel](https://vercel.com). Docker Compose for local or self-hosted.

---

## Tech stack

| Layer | Technology |
|-------|------------|
| **Monorepo** | npm workspaces (`backend`, `frontend`) |
| **Backend** | Node.js ≥20, NestJS 10, TypeORM, PostgreSQL, Redis (optional) |
| **Frontend** | Next.js 14, React 18, Tailwind CSS, Zustand |
| **Auth** | JWT (Passport), role-based guards |
| **Production** | Helmet, compression, CORS from env |

---

## Repository structure

```
E-Waste/
├── backend/                 # NestJS API
│   ├── src/
│   │   ├── auth/            # Login, register, JWT, guards
│   │   ├── citizen/         # Sell requests, campaigns, admin convert/payment
│   │   ├── pickups/         # Pickups, status transitions
│   │   ├── lots/            # Hub intake, lots, dispatch, recycler intake
│   │   ├── reference/       # Hubs, categories, recyclers, brands
│   │   ├── audit/           # Audit verify
│   │   ├── epr/             # EPR credits, export
│   │   ├── incentives/      # Incentives list
│   │   ├── anomalies/       # Anomalies list
│   │   ├── booking/         # Booking requests
│   │   ├── recycler/        # Recycler intakes
│   │   ├── health/          # Health, root
│   │   ├── integrations/   # WhatsApp, Exotel
│   │   ├── entities/       # TypeORM entities
│   │   ├── migrations/
│   │   └── scripts/         # seed.ts
│   ├── Dockerfile
│   ├── .env.example
│   └── README.md
├── frontend/                # Next.js app
│   ├── src/
│   │   ├── app/             # App Router pages (login, signup, admin, citizen, captain, recycler, brand, audit)
│   │   ├── components/      # Landing, citizen, shared (tables, filters, shell)
│   │   └── lib/             # api.ts, auth-server, roles
│   ├── public/
│   ├── Dockerfile
│   ├── .env.example
│   └── README.md
├── assets/                  # Images for landing (copy to frontend/public if needed)
├── Docs/                    # Production deployment, architecture docs
├── docker-compose.yml       # Postgres, Redis, API, Web
├── render.yaml              # Render blueprint (backend + Postgres)
├── vercel.json              # Vercel config; set Root Directory to frontend in dashboard
├── package.json             # Workspace root scripts
└── README.md                # This file
```

---

## Prerequisites

- **Node.js** ≥ 20
- **PostgreSQL** (e.g. 16)
- **Redis** (optional, for cache)
- **npm** (v10+ recommended)

---

## Quick start (local)

### 1. Install dependencies

```bash
npm install
```

### 2. Backend environment

```bash
cp backend/.env.example backend/.env
# Edit backend/.env: set DB_* (or DATABASE_URL), JWT_SECRET, CORS_ORIGIN for local frontend
# Example CORS for frontend on 3000 and 3002: CORS_ORIGIN=http://localhost:3000,http://localhost:3002
```

### 3. Database

Ensure PostgreSQL is running. Migrations run automatically when the backend starts. To run them manually:

```bash
npm run typeorm:migrate
```

Optional demo data:

```bash
npm run seed
# Demo login: admin@demo.local / Password123
```

### 4. Frontend environment

```bash
cp frontend/.env.example frontend/.env.local
# Default in .env.example points to http://localhost:3001/api/v1
```

### 5. Run everything

**Option A — Both from root**

```bash
npm run dev
# API: http://localhost:3001
# Web: http://localhost:3000 (or next available port, e.g. 3002)
```

**Option B — Separate terminals**

```bash
# Terminal 1 – backend
cd backend && npm run dev

# Terminal 2 – frontend
cd frontend && npm run dev
```

Then open the frontend URL (e.g. `http://localhost:3000` or `http://localhost:3002`), go to **Login**, and sign in (e.g. `admin@demo.local` / `Password123` if you ran the seed).

---

## Environment variables

### Root / monorepo

No env at root. All env is in `backend/.env` and `frontend/.env.local` (or `.env`).

### Backend (`backend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `NODE_ENV` | Yes | `development` or `production` |
| `PORT` | Yes | Server port (default `3001`) |
| `DATABASE_URL` | Yes* | Full Postgres URL (e.g. Render). *Or use `DB_*` below. |
| `DB_HOST` | If no URL | Postgres host |
| `DB_PORT` | If no URL | Postgres port |
| `DB_USER` / `DB_USERNAME` | If no URL | Postgres user |
| `DB_PASSWORD` | If no URL | Postgres password |
| `DB_NAME` | If no URL | Postgres database name |
| `JWT_SECRET` | Yes | Secret for JWT (min 32 chars in prod). Backend also accepts `JWT_ACCESS_TOKEN_SECRET`. |
| `JWT_EXPIRES_IN` | No | e.g. `1d` (default) |
| `CORS_ORIGIN` | Recommended | Allowed frontend origin(s), comma-separated. Local: `http://localhost:3000,http://localhost:3002` |
| `RUN_MIGRATIONS` | No | `true` (default) or `false` |
| `REDIS_URL` / `REDIS_HOST`+`REDIS_PORT` | No | Redis if used |
| `WHATSAPP_*` / `EXOTEL_*` | No | Integrations |
| `DEFAULT_HUB_ID` | No | Default hub for certain flows |

See `backend/.env.example` for the full list.

### Frontend (`frontend/.env.local`)

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_BASE_URL` | Yes | Backend API base, e.g. `http://localhost:3001/api/v1` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | No | Landing page WhatsApp CTA |
| `NEXT_PUBLIC_MISSED_CALL_NUMBER` | No | Landing page missed-call CTA |

See `frontend/.env.example`.

---

## Scripts

From **repository root**:

| Script | Description |
|--------|-------------|
| `npm run dev` | Start backend and frontend in parallel |
| `npm run dev:api` | Start backend only (watch) |
| `npm run dev:web` | Start frontend only |
| `npm run build` | Build backend and frontend |
| `npm run build:api` | Build backend only |
| `npm run build:web` | Build frontend only |
| `npm run lint` | Lint both |
| `npm run test` | Backend tests |
| `npm run seed` | Seed demo data (backend) |
| `npm run typeorm:migrate` | Run DB migrations |

From **backend/**:

| Script | Description |
|--------|-------------|
| `npm run dev` | Start API in watch mode |
| `npm run build` | Production build → `dist/` |
| `npm run start` / `npm run start:prod` | Run `node dist/main.js` |
| `npm run typeorm:migrate` | Run migrations |
| `npm run migration:revert` | Revert last migration |
| `npm run db:reset` | Revert then run migrations |
| `npm run seed` | Seed demo data |

From **frontend/**:

| Script | Description |
|--------|-------------|
| `npm run dev` | Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Run production server |

---

## Roles and features

| Role | Description | Main flows |
|------|-------------|------------|
| **Admin / Coordinator** | Operations, convert sell requests to pickups, record payment, manage pickups/lots/booking requests/incentives/anomalies | Sell requests → convert to pickup; pickups status; create pickup; booking requests; lots; incentives; anomalies |
| **Citizen** | Submit sell requests, view traceability | Sell request form (address, campaign, items); view request and traceability |
| **Field Captain** | Hub intake, weigh, create lots, dispatch | Hub intake; lots list and dispatch |
| **Recycler** | Confirm intake of lots | Recycler intake form |
| **Brand** | EPR export | EPR export by quarter and brand |
| **Audit** | Verify audit trail | Audit verify |

Landing page: public (no login). Login/signup at `/login`, `/signup`. Role-based redirect after login (see `getDashboardPathForRole` in `frontend/src/lib/api.ts`).

---

## API overview

Base path: **`/api/v1`**. All endpoints except health and auth require `Authorization: Bearer <token>` unless marked public.

| Area | Method | Path | Description |
|------|--------|------|-------------|
| **Health** | GET | `/health` | App ok (public) |
| **Health** | GET | `/health/db` | DB connected (public) |
| **Auth** | POST | `/auth/login` | Login (public) |
| **Auth** | POST | `/auth/register` | Register (public) |
| **Auth** | GET | `/auth/me` | Current user |
| **Citizen** | GET | `/citizen/campaigns` | Active campaigns (auth) |
| **Citizen** | GET | `/citizen/material-categories` | Categories (auth) |
| **Citizen** | POST | `/citizen/sell-requests` | Create sell request (auth) |
| **Citizen** | GET | `/citizen/sell-requests` | List my requests (auth) |
| **Citizen admin** | GET | `/citizen-admin/sell-requests` | List all (admin/coordinator) |
| **Citizen admin** | POST | `/citizen-admin/sell-requests/:id/convert-to-pickup` | Convert to pickup |
| **Citizen admin** | PATCH | `/citizen-admin/sell-requests/:id/payment` | Record payment |
| **Pickups** | GET/POST | `/pickups` | List, create |
| **Pickups** | PATCH | `/pickups/:id/status` | Update status |
| **Lots** | POST | `/hub-intake` | Record hub intake |
| **Lots** | POST | `/lots` | Create lot |
| **Lots** | POST | `/lots/:id/dispatch` | Dispatch lot |
| **Lots** | GET | `/lots`, `/lots/:id`, `/hub-intake-records` | List, get |
| **Recycler** | POST | `/recycler/intakes` | Confirm intake |
| **EPR** | POST | `/epr/credits` | Generate credit |
| **EPR** | GET | `/epr/export` | Export (CSV) |
| **Reference** | GET | `/hubs`, `/material-categories`, `/recyclers`, `/brands` | Reference data |
| **Audit** | GET | `/audit/verify` | Verify audit |
| **Incentives** | GET | `/incentives` | List incentives |
| **Anomalies** | GET | `/anomalies` | List anomalies |
| **Booking** | GET | `/booking/requests` | Booking requests |
| **WhatsApp** | GET/POST | `/integrations/whatsapp/webhook` | Webhook (public) |
| **Exotel** | POST | `/integrations/exotel/missed-call` | Missed-call (public) |

---

## Deployment

- **Backend**: Deploy to **Render** (Postgres, web service). See `render.yaml` and [Docs/PRODUCTION_DEPLOYMENT.md](Docs/PRODUCTION_DEPLOYMENT.md).
- **Frontend**: Deploy to **Vercel**; in project settings set **Root Directory** to `frontend`. Set `NEXT_PUBLIC_API_BASE_URL` to the backend API URL.
- **Docker**: `docker compose up -d --build` (Postgres, Redis, API, Web). See `docker-compose.yml`.

Details, env tables, and step-by-step instructions: **[Docs/PRODUCTION_DEPLOYMENT.md](Docs/PRODUCTION_DEPLOYMENT.md)**.

---

## Documentation

| Document | Description |
|----------|-------------|
| [README.md](README.md) | This file — project overview, setup, scripts, API summary |
| [backend/README.md](backend/README.md) | Backend modules, migrations, env, scripts |
| [frontend/README.md](frontend/README.md) | Frontend pages, components, env, scripts |
| [Docs/PRODUCTION_DEPLOYMENT.md](Docs/PRODUCTION_DEPLOYMENT.md) | Production deployment (Render, Vercel, Docker), env reference |

---

## License

Private. Compliance-grade infrastructure for e-waste traceability in India.
