# E-Waste Backend (NestJS)

API for e-waste traceability MVP.

## Database & migrations

### Required env (PostgreSQL)

Set in `.env` (see `.env.example`):

- `DB_HOST` — default `localhost`
- `DB_PORT` — default `5432`
- `DB_USER` or `DB_USERNAME`
- `DB_PASSWORD`
- `DB_NAME`

Optional: `DATABASE_URL` (overrides host/port/user/password/database if set).

### Migration workflow

- **On app start:** Migrations run automatically before the server listens. If the DB is missing or env is invalid, the process exits with a clear error.
- **Run migrations manually (e.g. CI):**
  ```bash
  npm run typeorm:migrate
  ```
  or `npm run migration:run`.
- **Revert last migration:**
  ```bash
  npm run typeorm:migrate:revert
  ```
  or `npm run migration:revert`.
- **Reset (revert all then run again):**
  ```bash
  npm run db:reset
  ```
  Use with care (drops migration history for reverted migrations).

### Scripts

| Script                | Description                          |
|-----------------------|--------------------------------------|
| `npm run typeorm`     | TypeORM CLI with app data source     |
| `npm run typeorm:migrate` | Run pending migrations           |
| `npm run migration:run`   | Alias for typeorm:migrate         |
| `npm run typeorm:migrate:revert` | Revert last migration        |
| `npm run migration:revert` | Alias for typeorm:migrate:revert |
| `npm run db:reset`    | Revert then run (dev only, careful)  |

### Health

- `GET /api/v1/health` — app ok
- `GET /api/v1/health/db` — `{ status: "ok", db: "connected" }` if DB is reachable

## Run

```bash
npm install
# Ensure PostgreSQL is running and .env is set
npm run dev
```

Seed demo data (optional): `npm run seed`.
