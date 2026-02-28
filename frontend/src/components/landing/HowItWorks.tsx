'use client';

const STEPS = [
  { id: 1, title: 'Book & register', desc: 'Citizen books via WhatsApp or missed call; profile and pickup request created.' },
  { id: 2, title: 'Collect & weigh', desc: 'Field Captain collects; hub logs weight and category with full traceability.' },
  { id: 3, title: 'Hub to recycler', desc: 'Authorized hub creates lots; recycler confirms intake and verifies.' },
  { id: 4, title: 'Impact & EPR', desc: 'Auditable kg, cities and chain of custody; export-ready for EPR reporting.' },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 section-block">
      <div className="section-inner">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
            How E-Waste Traceability works
          </h2>
          <p className="mt-2 text-lg text-slate-600 dark:text-slate-300">
            Seamless steps from booking to verified recycling and compliance.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {STEPS.map((step) => (
            <div key={step.id} className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand text-white text-xl font-bold shadow-lg">
                {step.id}
              </div>
              <h3 className="mt-4 font-semibold text-slate-900 dark:text-slate-100">{step.title}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
