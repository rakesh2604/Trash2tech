'use client';

import { useEffect, useState } from 'react';

const fallbackMetrics = {
  kgCollected: '12,450',
  citiesActive: '8',
  notRecycledIndia: '≈0.4M',
};

export function ImpactSection() {
  const [metrics, setMetrics] = useState(fallbackMetrics);

  useEffect(() => {
    setMetrics(fallbackMetrics);
  }, []);

  return (
    <section
      className="border-t border-slate-700/50 bg-[#243B53] section-block"
      aria-label="Impact and gap metrics"
    >
      <div className="section-inner">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Impact &amp; gap
        </h2>
        <p className="mt-2 text-lg text-blue-100 max-w-2xl">
          Snapshot of what is traceable on-network today — and the systemic gap we are working to close.
        </p>
        <dl className="mt-12 grid gap-6 sm:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-white/10 px-6 py-6 text-center backdrop-blur-sm transition-transform hover:-translate-y-0.5">
            <dt className="text-sm font-medium uppercase tracking-wide text-blue-200">
              Kg collected
            </dt>
            <dd className="mt-2 text-3xl font-bold text-white sm:text-4xl">
              {metrics?.kgCollected ?? '—'}
            </dd>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/10 px-6 py-6 text-center backdrop-blur-sm transition-transform hover:-translate-y-0.5">
            <dt className="text-sm font-medium uppercase tracking-wide text-blue-200">
              Cities active
            </dt>
            <dd className="mt-2 text-3xl font-bold text-white sm:text-4xl">
              {metrics?.citiesActive ?? '—'}
            </dd>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/10 px-6 py-6 text-center backdrop-blur-sm transition-transform hover:-translate-y-0.5">
            <dt className="text-sm font-medium uppercase tracking-wide text-blue-200">
              India not formally recycled
            </dt>
            <dd className="mt-2 text-3xl font-bold text-white sm:text-4xl">
              {metrics?.notRecycledIndia ?? '—'}
            </dd>
            <dd className="mt-2 text-xs text-blue-100/90 max-w-xs mx-auto">
              Tonnes of e‑waste per year that do not enter the formal recycling chain in India today (≈29.29% of 13.97 lakh tonnes, FY 2024–25).
            </dd>
          </div>
        </dl>
        <p className="mt-6 text-[11px] text-blue-100/80 max-w-2xl">
          Source: CPCB / Press Information Bureau (FY 2024–25). Platform goal is to move informal flows into traceable, auditable lots.
        </p>
      </div>
    </section>
  );
}
