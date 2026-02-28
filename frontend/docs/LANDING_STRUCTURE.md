# E-Waste Traceability — Landing Page Structure (PlacedAI-style)

This document describes the landing page layout and components for quick reference and maintenance.

## Page order (top to bottom)

1. **PublicHeader** — Sticky nav: logo, Home | About | Features | Pricing | Contact, Sign in (purple), Get started
2. **Hero** — Headline with highlighted word “traceable”, subtext, Get started + Learn more, Trusted by bar
3. **StatsSection** — 3 metrics: Kg collected, Hub partners, Pickups completed (with icons)
4. **MeetPartnerSection** — “Meet E-Waste Traceability” + 3 feature cards (gradient icons)
5. **HowItWorks** — “How E-Waste Traceability works” + 4 steps with numbered gradient circles
6. **VideoSection** — “See how it works” + video from `public/video/How its works.mp4`
7. **TestimonialsSection** — “What citizens & partners say” + 2 testimonial cards
8. **WhyIndiaSection** — “Why E-Waste Traceability works in India” + 3 cards (Local expertise, Verified network, Compliance-ready)
9. **PricingSection** — “Simple, transparent access” + 3 plans (Citizen free, Hub/Recycler, EPR brand)
10. **BookPickupCTA** — Book a pickup (WhatsApp + missed call)
11. **DataAndReports** — Compliance analytics (gap, network, WhatsApp booking)
12. **ImpactSection** — Impact & gap metrics (dark blue)
13. **PublicFooter** — Dark footer: logo, Company | Solutions | Resources columns, copyright, social links

## Section IDs (for anchor links)

- `#main-content` — Skip link target
- `#why-trust-us` — About / Meet partner
- `#how-it-works` — How it works
- `#pricing` — Pricing
- `#contact` — Footer / contact

## Design tokens (Tailwind)

- **Accent (PlacedAI-style):** `accent-blue` (#3b82f6), `accent-purple` (#7c3aed), `accent-purple-light` (#8b5cf6), `accent-violet` (#6366f1)
- **Brand (existing):** `brand`, `brand-light`, `brand-dark`
- Use gradient for CTAs and step numbers: `from-accent-blue to-accent-purple` or `from-accent-purple to-accent-purple-light`

## Components location

All under `src/components/landing/`:

- PublicHeader.tsx
- Hero.tsx
- ImageCarousel.tsx
- StatsSection.tsx
- MeetPartnerSection.tsx
- HowItWorks.tsx
- VideoSection.tsx
- TestimonialsSection.tsx
- WhyIndiaSection.tsx
- PricingSection.tsx
- BookPickupCTA.tsx
- DataAndReports.tsx
- ImpactSection.tsx
- PublicFooter.tsx

## Video asset

Place the “How it works” video at:

`public/video/How its works.mp4`

If the file name changes, update `VideoSection.tsx` (`VIDEO_SRC`).
