'use client';

const TESTIMONIALS = [
  {
    quote: 'Selling e-waste was never this simple. I got a pickup slot the same week and could track my request till it reached the recycler.',
    name: 'Priya S.',
    role: 'Resident, Bangalore',
  },
  {
    quote: 'As a hub we needed one place to log weight, assign captains and generate reports. This platform gives us exactly that with full audit trail.',
    name: 'Rajesh M.',
    role: 'Hub operator, Mumbai',
  },
];

export function TestimonialsSection() {
  return (
    <section className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 section-block">
      <div className="section-inner">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl text-center">
          What citizens &amp; partners say
        </h2>
        <p className="mt-2 text-lg text-slate-600 dark:text-slate-300 text-center max-w-2xl mx-auto">
          Real feedback from people using the traceability network.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl border border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800 p-6 shadow-sm transition-all hover:shadow-md"
            >
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-4 flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand/15 dark:bg-brand/25 text-brand font-semibold">
                  {t.name.charAt(0)}
                </span>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{t.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
