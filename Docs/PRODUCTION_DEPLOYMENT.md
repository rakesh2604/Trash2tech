# E-Waste Traceability — Production Deployment

Compliance-grade deployment for **Backend (Render)** and **Frontend (Vercel)**.

---

## 1. Cleanup & audit summary

### Safe deletion plan (optional; not executed)

- **Unused component**: `frontend/src/components/landing/WhyTrustUs.tsx` — not imported in `app/page.tsx` (landing uses `MeetPartnerSection`). Kept for now; safe to remove later if not needed.
- **Assets**: Root `/assets` contains images used by the frontend via `/images/` (ImageCarousel) and `/video/` (VideoSection). Ensure `frontend/public/images` and `frontend/public/video` are populated from these assets before production build, or copy assets into `frontend/public` as part of CI.

### Not removed

- All migrations, entities, services, controllers, and compliance/audit code.
- Seed script (for demo/staging only; do not run in production with sensitive data).
- Config files, tsconfig, Dockerfiles, lockfiles.

---

## 2. Security summary

- **Secrets**: No secrets committed. `.env` and `.env.local` / `.env.*.local` are in `.gitignore`.
- **CORS**: Backend uses `CORS_ORIGIN` env; set to frontend origin(s) in production.
- **Helmet**: Enabled on backend for security headers.
- **JWT**: Use a strong `JWT_SECRET` (min 32 chars) in production.
- **Database**: Use `DATABASE_URL` (e.g. Render Postgres); individual `DB_*` vars supported for local.
- **Dependencies**: Run `npm audit` in backend/frontend; fix non-breaking issues with `npm audit fix`. Breaking fixes require manual review.

---

## 3. Backend production readiness (Render)

| Item | Status |
|------|--------|
| Production build | `npm run build` |
| Start script | `start` / `start:prod`: `node dist/main.js` |
| PORT | From `process.env.PORT` |
| DATABASE_URL | Supported; `validate-env` accepts it |
| CORS | From `CORS_ORIGIN` env |
| Helmet | Enabled |
| Compression | Enabled (gzip) |
| Global validation pipe | Enabled |
| Domain exception filter | Enabled |
| Health endpoint | `GET /api/v1/health` and `GET /api/v1/health/db` |
| Migrations | Run on startup unless `RUN_MIGRATIONS=false` |
| No hardcoded localhost in runtime | Yes |

### Backend env vars (see `backend/.env.example`)

- **Required**: `DATABASE_URL` (or `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`), `JWT_SECRET`, `NODE_ENV`, `PORT`.
- **Optional**: `CORS_ORIGIN`, `REDIS_URL` (or `REDIS_HOST`/`REDIS_PORT`), `RUN_MIGRATIONS`, `JWT_EXPIRES_IN`, `WHATSAPP_*`, `EXOTEL_*`, `DEFAULT_HUB_ID`, `WEIGHT_VARIANCE_THRESHOLD_PCT`.

---

## 4. Frontend production readiness (Vercel)

| Item | Status |
|------|--------|
| Build | `npm run build` |
| API URL | From `NEXT_PUBLIC_API_BASE_URL` |
| No hardcoded localhost in user-facing messages | Yes (login/signup errors generic) |
| .env.example | Created |
| vercel.json | Build config; set Root Directory to `frontend` in Vercel dashboard |

### Frontend env vars (see `frontend/.env.example`)

- **Required for production**: `NEXT_PUBLIC_API_BASE_URL` (e.g. `https://ewaste-api.onrender.com/api/v1`).
- **Optional**: `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_MISSED_CALL_NUMBER`.

---

## 5. Deployment steps

### Backend (Render)

1. **Create Render account** and connect the repo.
2. **Option A — Blueprint**: In Render dashboard, use “New” → “Blueprint”; connect repo and select `render.yaml`. Adjust `rootDir` to `backend` if repo root is monorepo. Create the Postgres database (or use existing) and ensure the service env var `DATABASE_URL` is linked to the database.
3. **Option B — Manual**:
   - New → Web Service; connect repo; set **Root Directory** to `backend`.
   - Build: `npm install && npm run build`.
   - Start: `npm run start:prod`.
   - Add env vars: `NODE_ENV=production`, `DATABASE_URL` (from Render Postgres), `JWT_SECRET` (generate strong secret), `CORS_ORIGIN=https://your-frontend.vercel.app`.
   - Health check path: `/api/v1/health`.
4. Set **CORS_ORIGIN** to the Vercel frontend URL (e.g. `https://your-app.vercel.app`).
5. After first deploy, run seed only if needed for demo data: `npm run seed` (from backend dir with env set); do not use in production with real data.

### Frontend (Vercel)

1. **Connect repo** to Vercel; in Project Settings set **Root Directory** to `frontend`.
2. **Environment variables** (Vercel project → Settings → Environment Variables):
   - `NEXT_PUBLIC_API_BASE_URL` = `https://your-ewaste-api.onrender.com/api/v1`
   - Optionally: `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_MISSED_CALL_NUMBER`.
3. Deploy; Vercel will run `npm install` and `npm run build` in the frontend directory.

### Docker (local / self-hosted)

- **Pull and run:** `docker compose pull && docker compose up -d` (uses pre-built images if pushed to a registry).
- **Build and run:** `docker compose up -d --build` (builds from Dockerfiles; context is repo root).
- **Backend:** `backend/Dockerfile` — Node 20 Alpine, multi-stage; health check on `/api/v1/health`.
- **Frontend:** `frontend/Dockerfile` — Next.js standalone output; set `NEXT_PUBLIC_API_BASE_URL` build-arg for API URL.
- **Compose:** `docker-compose.yml` — postgres, redis, api, web; optional env `JWT_SECRET`, `CORS_ORIGIN` in `.env`.

### Post-deploy

- Verify `https://your-api.onrender.com/api/v1/health` returns `{"status":"ok"}`.
- Verify frontend login and API calls work with the production API URL.
- Ensure `frontend/public/images` and `frontend/public/video` contain the expected assets (copy from repo root `assets` if needed).

---

## 6. Environment variables reference

### Backend (Render)

| Variable | Required | Description |
|----------|----------|-------------|
| NODE_ENV | Yes | `production` |
| PORT | Yes | Set by Render |
| DATABASE_URL | Yes* | Postgres connection string (* or DB_* vars) |
| JWT_SECRET | Yes | Min 32 chars |
| CORS_ORIGIN | Recommended | Frontend origin(s), comma-separated |
| RUN_MIGRATIONS | No | Default `true`; set `false` if running migrations separately |
| REDIS_URL | No | Redis connection string |
| JWT_EXPIRES_IN | No | Default `1d` |
| WHATSAPP_* / EXOTEL_* | No | For integrations |

### Frontend (Vercel)

| Variable | Required | Description |
|----------|----------|-------------|
| NEXT_PUBLIC_API_BASE_URL | Yes | Backend API base, e.g. `https://api.example.com/api/v1` |
| NEXT_PUBLIC_WHATSAPP_NUMBER | No | Landing page CTA |
| NEXT_PUBLIC_MISSED_CALL_NUMBER | No | Landing page CTA |

---

## 7. Files changed (production prep)

- **Backend**: `main.ts` (CORS, Helmet, compression, RUN_MIGRATIONS), `db/validate-env.ts` (DATABASE_URL), `package.json` (start:prod, helmet, compression, @types/compression), `.env.example`.
- **Frontend**: `app/login/page.tsx`, `app/signup/page.tsx` (generic error messages), `.env.example` (new).
- **Root**: `render.yaml` (new), `vercel.json` (new), `.gitignore` (env.*.local).
- **Docs**: `Docs/PRODUCTION_DEPLOYMENT.md` (this file).
