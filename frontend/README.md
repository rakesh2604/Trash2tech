# E-Waste Frontend (Next.js)

Web application for the E-Waste Traceability platform: public landing page, login/signup, and role-based dashboards for admin, citizen, field captain, recycler, brand, and audit.

---

## Table of contents

- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Environment variables](#environment-variables)
- [Scripts](#scripts)
- [Pages and routes](#pages-and-routes)
- [Components](#components)
- [API client and auth](#api-client-and-auth)
- [Production and deployment](#production-and-deployment)

---

## Tech stack

- **Framework**: Next.js 14 (App Router)
- **UI**: React 18, Tailwind CSS
- **State**: Zustand (optional), React state
- **PWA**: next-pwa (production only; disabled in dev)
- **Build**: Standalone output for Docker/self-hosted

---

## Project structure

```
frontend/src/
├── app/
│   ├── layout.tsx              # Root layout (html, body, skip link)
│   ├── page.tsx                # Home (landing)
│   ├── loading.tsx             # Root loading UI
│   ├── error.tsx               # Root error boundary
│   ├── global-error.tsx        # Global error (full document fallback)
│   ├── login/page.tsx          # Sign in
│   ├── signup/page.tsx         # Register
│   ├── signout/page.tsx        # Sign out
│   ├── citizen/
│   │   ├── page.tsx            # Citizen dashboard (sell request form, my requests)
│   │   └── requests/[id]/page.tsx  # Request detail & traceability
│   ├── admin/
│   │   ├── sell-requests/page.tsx   # Convert to pickup, record payment
│   │   ├── pickups/page.tsx         # Pickups list, status update
│   │   ├── create-pickup/page.tsx   # Create pickup
│   │   ├── booking-requests/page.tsx
│   │   ├── lots/page.tsx
│   │   ├── incentives/page.tsx
│   │   └── anomalies/page.tsx
│   ├── captain/
│   │   ├── intake/page.tsx     # Hub intake
│   │   └── lots/page.tsx      # Lots, dispatch
│   ├── recycler/
│   │   └── intake/page.tsx    # Recycler intake
│   ├── brand/
│   │   └── epr-export/page.tsx # EPR export
│   └── audit/
│       └── verify/page.tsx    # Audit verify
├── components/
│   ├── landing/                # Public landing sections
│   │   ├── PublicHeader.tsx
│   │   ├── PublicFooter.tsx
│   │   ├── Hero.tsx
│   │   ├── StatsSection.tsx
│   │   ├── MeetPartnerSection.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── VideoSection.tsx
│   │   ├── TestimonialsSection.tsx
│   │   ├── WhyIndiaSection.tsx
│   │   ├── PricingSection.tsx
│   │   ├── BookPickupCTA.tsx
│   │   ├── DataAndReports.tsx
│   │   ├── ImpactSection.tsx
│   │   ├── ImageCarousel.tsx
│   │   └── WhyTrustUs.tsx
│   ├── citizen/
│   │   └── CitizenDashboardClient.tsx  # Sell request form, my requests list
│   ├── app-shell.tsx          # Authenticated layout (sidebar, role-based nav)
│   ├── pickups-table-client.tsx
│   ├── lots-table-with-dispatch.tsx
│   ├── *-filters.tsx          # Table filters (pickups, booking, incentives, lots, anomalies)
│   ├── empty-state.tsx
│   ├── table-skeleton.tsx
│   ├── access-denied.tsx
│   └── login-required.tsx
├── lib/
│   ├── api.ts                 # API client, getBaseUrl, getDashboardPathForRole, auth helpers
│   ├── auth-server.ts         # Server-side auth (cookies, redirect)
│   ├── roles.ts               # Role constants, SIGNUP_ROLES
│   └── offline-queue.ts      # Optional offline queue
└── styles/
    └── globals.css            # Tailwind, design tokens, utilities (btn-primary, section-inner, etc.)
```

---

## Environment variables

Copy `.env.example` to `.env.local` (or set in Vercel). All client-visible vars must be prefixed with `NEXT_PUBLIC_`.

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_BASE_URL` | Yes | Backend API base URL (no trailing slash). Local: `http://localhost:3001/api/v1` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | No | WhatsApp number for landing page CTA (e.g. 919876543210) |
| `NEXT_PUBLIC_MISSED_CALL_NUMBER` | No | Missed-call number for landing page CTA |

If `NEXT_PUBLIC_API_BASE_URL` is not set, the app falls back to `http://localhost:3001/api/v1` (see `next.config.mjs` and `lib/api.ts`). For production, always set it to your deployed backend URL.

---

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Next.js dev server (default port 3000; may use 3002 if 3000/3001 in use) |
| `npm run build` | Production build (standalone output for Docker) |
| `npm run start` | Run production server |
| `npm run lint` | Next.js ESLint |

---

## Pages and routes

| Path | Access | Description |
|------|--------|-------------|
| `/` | Public | Landing page (hero, stats, how it works, video, testimonials, pricing, CTA, etc.) |
| `/login` | Public | Sign in (email, password). Redirects to role dashboard on success. |
| `/signup` | Public | Register (name, email, password, phone, role). |
| `/signout` | Auth | Sign out and redirect to home. |
| `/citizen` | Citizen | Citizen dashboard: sell request form (address, campaign, items), my requests list. |
| `/citizen/requests/[id]` | Citizen | Request detail and traceability. |
| `/admin/sell-requests` | Admin/Coordinator | List sell requests, convert to pickup, record payment. |
| `/admin/pickups` | Admin/Coordinator | List pickups, update status. |
| `/admin/create-pickup` | Admin | Create pickup manually. |
| `/admin/booking-requests` | Admin | Booking requests list. |
| `/admin/lots` | Admin | Lots list, dispatch. |
| `/admin/incentives` | Admin | Incentives list. |
| `/admin/anomalies` | Admin | Anomalies list. |
| `/captain/intake` | Field Captain | Hub intake form. |
| `/captain/lots` | Field Captain | Lots list, dispatch. |
| `/recycler/intake` | Recycler | Recycler intake form. |
| `/brand/epr-export` | Brand | EPR export (quarter, brand, CSV). |
| `/audit/verify` | Audit | Audit verify. |

Role-based redirect after login is defined in `lib/api.ts` (`getDashboardPathForRole`). Protected pages use server-side auth in layout or page to redirect unauthenticated or unauthorized users.

---

## Components

- **Landing**: All sections used in `app/page.tsx` (Hero, Stats, HowItWorks, VideoSection, Testimonials, Pricing, BookPickupCTA, DataAndReports, ImpactSection, etc.). Header and footer are in `PublicHeader`, `PublicFooter`.
- **Citizen**: `CitizenDashboardClient` — address (with “Use current location”), campaign dropdown, material categories and items, preferred dates, notes; and list of citizen’s sell requests with links to traceability.
- **Shared**: `app-shell` (sidebar + content), `pickups-table-client`, `lots-table-with-dispatch`, filter components, `empty-state`, `table-skeleton`, `access-denied`, `login-required`.

Design system (Tailwind + globals.css): `section-inner`, `section-block`, `btn-primary`, `btn-secondary`, `input-base`, `card-raise`, `shine-text`, badges (e.g. `badge-requested`). Brand colours: `brand`, `brand-light`, `brand-dark`.

---

## API client and auth

- **`lib/api.ts`**: Central API client. `getBaseUrl()` uses `NEXT_PUBLIC_API_BASE_URL` or default. All API calls use this base, JWT from localStorage (and optional explicit token). Exports: `api` (namespaced by area: auth, citizen, pickups, lots, etc.), `getDashboardPathForRole`, `AUTH_TOKEN_KEY`.
- **Auth**: Login/signup store JWT in localStorage and set a cookie. Server-side auth (`lib/auth-server.ts`) reads cookie and can redirect or return user for protected pages.
- **Roles**: Defined in `lib/roles.ts` and used for signup options and server-side checks.

---

## Production and deployment

- **Vercel**: In project settings set **Root Directory** to `frontend`. Set `NEXT_PUBLIC_API_BASE_URL` to the production backend URL (e.g. `https://your-api.onrender.com/api/v1`).
- **Docker**: Use root `docker-compose.yml` and `frontend/Dockerfile`. Build uses standalone output; run with `node frontend/server.js`. Pass `NEXT_PUBLIC_API_BASE_URL` as build-arg if needed.
- **Assets**: Landing page expects images under `public/images/` (e.g. for ImageCarousel) and video under `public/video/`. Copy from repo root `assets/` if not already in `public/`.

See [Docs/PRODUCTION_DEPLOYMENT.md](../Docs/PRODUCTION_DEPLOYMENT.md) for full deployment steps and env reference.
