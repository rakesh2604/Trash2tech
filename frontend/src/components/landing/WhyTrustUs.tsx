const reasons = [
  {
    title: 'Digital tracking',
    desc: 'Every pickup has a unique ID and status through the chain: requested → assigned → collected → hub logged → dispatched → recycler verified → completed.',
    icon: (
      <svg className="h-6 w-6 shrink-0 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: 'Verified recyclers',
    desc: 'Only authorized recyclers confirm intake. No informal dumping; full accountability.',
    icon: (
      <svg className="h-6 w-6 shrink-0 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Audit logs',
    desc: 'Tamper-evident audit trail. Verify chain integrity for any pickup or lot.',
    icon: (
      <svg className="h-6 w-6 shrink-0 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    title: 'EPR alignment',
    desc: 'Data structured for EPR reporting. Export by brand, period, category, and city.',
    icon: (
      <svg className="h-6 w-6 shrink-0 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export function WhyTrustUs() {
  return (
    <section className="border-t border-slate-200 bg-slate-50 section-block">
      <div className="section-inner">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Why trust us
        </h2>
        <p className="mt-2 text-lg text-slate-600 max-w-2xl">
          Compliance-grade infrastructure designed for transparency and accountability.
        </p>
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((r) => (
            <li
              key={r.title}
              className="card-raise flex flex-col rounded-xl border border-slate-200 bg-white p-6"
            >
              <div className="flex items-start gap-4">
                <span className="mt-0.5 shrink-0" aria-hidden>{r.icon}</span>
                <div className="min-w-0">
                  <h3 className="font-semibold text-slate-900">{r.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">{r.desc}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
