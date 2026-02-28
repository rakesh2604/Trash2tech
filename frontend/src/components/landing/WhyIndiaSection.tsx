'use client';

const REASONS = [
  {
    title: 'Local expertise',
    desc: 'Built for Indian ground realities: WhatsApp-first booking, multi-language support and hub-centric operations.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: 'Verified network',
    desc: 'Hubs and recyclers are vetted. Every pickup links to an authorized facility with full chain-of-custody.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9a9 9 0 009 9m-9-9a9 9 0 009-9" />
      </svg>
    ),
  },
  {
    title: 'Compliance-ready',
    desc: 'Data structured for EPR reporting. Export by brand, period, category and city for regulators and brands.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
];

export function WhyIndiaSection() {
  return (
    <section className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 section-block">
      <div className="section-inner text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
          Why E-Waste Traceability works in India
        </h2>
        <p className="mt-2 text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Tailored for the Indian e-waste and EPR ecosystem.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {REASONS.map((r) => (
            <div
              key={r.title}
              className="rounded-2xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 p-6 text-left shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 dark:bg-brand/20 text-brand">
                {r.icon}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">{r.title}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
