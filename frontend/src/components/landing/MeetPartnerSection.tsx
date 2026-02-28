'use client';

const FEATURES = [
  {
    title: 'Digital chain-of-custody',
    desc: 'Every pickup has a unique ID and status through the chain: requested → collected → hub logged → recycler verified → completed.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: 'Verified recyclers',
    desc: 'Only authorized recyclers confirm intake. No informal dumping; full accountability and EPR alignment.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Audit-ready reports',
    desc: 'Tamper-evident audit trail and exports by brand, period and category for defence-ready compliance.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
];

export function MeetPartnerSection() {
  return (
    <section id="why-trust-us" className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 section-block">
      <div className="section-inner text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
          Meet E-Waste Traceability
        </h2>
        <p className="mt-2 text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Your compliance partner for traceable e-waste from collection to recycling.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 p-6 text-left shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand text-white shadow-md">
                {f.icon}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
