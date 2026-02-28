## E-waste Traceability MVP

Hybrid digital e-waste collection and traceability backbone for India, built around:

- **Backend**: Node + NestJS (`backend/`)
- **DB**: PostgreSQL
- **Cache**: Redis
- **Citizen interfaces**: WhatsApp + Exotel IVR
- **Field UI**: TypeScript PWA (`frontend/`)

This repository is structured as an npm workspace monorepo with separate apps for the API and web/PWA.

### Local development (high level)

- `npm install`
- Configure `backend/.env` from `backend/.env.example` (PostgreSQL, optional Redis).
- `npm run typeorm:migrate` (from repo root or `cd backend && npm run typeorm:migrate`).
- `npm run seed` to create demo hub, category, recycler, brand, and field-captain user.
- `npm run dev` to start API and web apps together (API: 3001, Web: 3000).


