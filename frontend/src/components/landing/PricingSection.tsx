'use client';

import Link from 'next/link';

const PLANS = [
  {
    name: 'Citizen',
    price: 'Free',
    desc: 'Book pickups via WhatsApp or missed call',
    features: ['One-tap booking', 'Pickup tracking', 'Weight & payment visibility'],
    cta: 'Book pickup',
    href: '/signup',
    highlighted: false,
  },
  {
    name: 'Hub / Recycler',
    price: 'Contact us',
    desc: 'For aggregation hubs and authorized recyclers',
    features: ['Hub intake & lots', 'Recycler verification', 'EPR-ready exports'],
    cta: 'Get started',
    href: '/signup',
    highlighted: true,
  },
  {
    name: 'EPR brand',
    price: 'Contact us',
    desc: 'Compliance reporting and credit tracking',
    features: ['Export by brand & period', 'Audit trail', 'Gap analytics'],
    cta: 'Contact',
    href: '#contact',
    highlighted: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 section-block">
      <div className="section-inner">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl text-center">
          Simple, transparent access
        </h2>
        <p className="mt-2 text-lg text-slate-600 dark:text-slate-300 text-center max-w-2xl mx-auto">
          Choose how you participate in the traceability network.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl border p-6 shadow-sm transition-all hover:shadow-md ${
                plan.highlighted
                  ? 'border-brand bg-slate-50/50 dark:bg-slate-800 ring-2 ring-brand/30'
                  : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800'
              }`}
            >
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{plan.name}</h3>
              <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">{plan.price}</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{plan.desc}</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={`mt-6 inline-flex w-full justify-center rounded-xl px-4 py-3 text-sm font-semibold transition-all focus-visible:outline focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-800 ${
                  plan.highlighted
                    ? 'bg-gradient-to-r from-brand to-brand-light text-white shadow-md hover:shadow-lg'
                    : 'border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
