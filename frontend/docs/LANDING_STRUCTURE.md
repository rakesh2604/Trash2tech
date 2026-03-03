# Trash2Tech Landing Page — Premium Dark Eco-Tech

This document describes the landing page layout and components.

## Page order (top to bottom)

1. **PublicHeader** — Sticky nav: logo (Trash2Tech), Home | About | Features | Pricing | Contact, Login (outline glass), Sign up (glow green)
2. **HeroNew** — Headline “E-Waste Recycling Made Transparent & Traceable”, subheading, Get started + Learn more, right: dashboard mockup with float animation
3. **StatsSectionNew** — 4 metrics: Kg recycled, Cities active, Verified recyclers, Compliance reports (animated counters, GlassCards)
4. **FeaturesGrid** — “Core Capabilities”, 6 feature cards (Digital Chain of Custody, Verified Recycler Network, etc.)
5. **HowItWorksStepper** — 4 steps: Book Pickup, Collection & Weighing, Verified Recycling, Impact & Compliance Report
6. **TechStackSection** — React, Node, PostgreSQL, Blockchain, Analytics (glass cards, hover rise)
7. **ImpactIndiaSection** — “Impact & Transparency Gap in India”, big numbers + animated progress bars
8. **FinalCTA** — “Start Responsible Recycling Today”, Book a Pickup (WhatsApp), optional missed-call link
9. **PublicFooter** — Dark footer: logo, Company | Solutions | Resources, copyright, social

## Section IDs (for anchor links)

- `#main-content` — Skip link target
- `#why-trust-us` — Features / Core Capabilities
- `#how-it-works` — How it works
- `#pricing` — Final CTA (Pricing nav scrolls here)
- `#contact` — Footer
- `#stats` — Stats section
- `#impact` — Impact India section

## Design system (landing)

- **Theme:** Dark eco-tech; gradient `#0B1220` → `#0F1A2B` → `#071018`
- **Primary:** `#22C55E` (eco green); **Secondary:** `#3B82F6` (electric blue)
- **Glass cards:** `rgba(255,255,255,0.05)`, `backdrop-blur: 12px`, border `rgba(255,255,255,0.1)`, hover lift + green glow
- **Font:** Inter (via `next/font`)

## Reusable primitives

- **AnimatedBackground** — Faint rotating recycling-arrows SVG (Option A)
- **GlassCard** — Glassmorphism card with hover lift
- **SectionWrapper** — Section + section-inner wrapper, optional id
- **GlowButton** — Primary (green gradient + glow) / Secondary (outline glass)

## Components location

All under `src/components/landing/`:

- PublicHeader.tsx, PublicFooter.tsx
- AnimatedBackground.tsx, GlassCard.tsx, SectionWrapper.tsx, GlowButton.tsx
- HeroNew.tsx, StatsSectionNew.tsx, FeaturesGrid.tsx, HowItWorksStepper.tsx
- TechStackSection.tsx, ImpactIndiaSection.tsx, FinalCTA.tsx

## Env vars (landing)

- **FinalCTA / Book a Pickup:** `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_MISSED_CALL_NUMBER` (default `919876543210`)

## Legacy components (not used on home)

Kept in folder but not imported on `/`: Hero.tsx, StatsSection.tsx, MeetPartnerSection.tsx, HowItWorks.tsx, VideoSection.tsx, TestimonialsSection.tsx, WhyIndiaSection.tsx, PricingSection.tsx, BookPickupCTA.tsx, DataAndReports.tsx, ImpactSection.tsx, ImageCarousel.tsx, WhyTrustUs.tsx.
