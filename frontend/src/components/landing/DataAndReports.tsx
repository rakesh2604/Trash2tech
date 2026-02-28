export function DataAndReports() {
  return (
    <section className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 section-block">
      <div className="section-inner">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
              Compliance analytics
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl">
              Built for operations teams, recyclers and EPR brands that need defence-ready numbers, not vanity dashboards.
            </p>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs shrink-0">
            Based on CPCB / PIB disclosures. Figures below are illustrative and meant to mirror how the live console can be configured.
          </p>
        </div>

        <div className="mt-12 grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <div className="card-raise min-w-0 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  India&apos;s formal e‑waste gap
                </p>
                <p className="mt-2 text-3xl font-semibold shine-text">
                  ≈0.4M tonnes / year
                </p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 max-w-sm">
                  In FY 2024–25, India generated about 13.97 lakh tonnes of e‑waste. Only 70.71% entered the formal system — leaving roughly{' '}
                  <span className="font-semibold text-slate-800 dark:text-slate-200">29.29% unprocessed</span>.
                </p>
              </div>
              <div className="hidden sm:flex h-20 w-20 shrink-0 flex-col justify-end rounded-full bg-slate-100 dark:bg-slate-700 p-3">
                <div className="h-2 flex-1 rounded-full bg-brand/90" />
                <div className="mt-1 h-[22%] rounded-full bg-red-400/80" />
              </div>
            </div>
            <p className="mt-4 text-[11px] text-slate-500 dark:text-slate-400">
              Source: CPCB / Press Information Bureau, FY 2024–25. Gap refers to e‑waste not collected and processed through registered recyclers.
            </p>
          </div>

          <div className="card-raise min-w-0 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Network today (sample week)
            </p>
            <div className="mt-4 space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <div>
                <div className="flex justify-between">
                  <span>Citizen pickups</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">312</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-slate-100 dark:bg-slate-700">
                  <div className="h-2 w-3/4 rounded-full bg-brand" />
                </div>
              </div>
              <div>
                <div className="flex justify-between">
                  <span>Hub lots created</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">54</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-slate-100 dark:bg-slate-700">
                  <div className="h-2 w-2/3 rounded-full bg-emerald-500" />
                </div>
              </div>
              <div>
                <div className="flex justify-between">
                  <span>Recycler confirmations</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">47</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-slate-100 dark:bg-slate-700">
                  <div className="h-2 w-[55%] rounded-full bg-amber-500" />
                </div>
              </div>
            </div>
            <p className="mt-4 text-[11px] text-slate-500 dark:text-slate-400">
              Every bar is backed by pickup IDs, lot codes and recycler intake records — ready for export into EPR reports.
            </p>
          </div>

          <div className="card-raise min-w-0 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              WhatsApp booking, structured
            </p>
            <div className="mt-4 space-y-2 rounded-lg bg-slate-50 dark:bg-slate-700/50 p-3 text-xs text-slate-800 dark:text-slate-200">
              <div className="flex flex-col gap-1">
                <div className="self-start max-w-[85%] rounded-2xl rounded-bl-sm bg-white dark:bg-slate-700 px-3 py-2 shadow-sm">
                  <p className="font-semibold text-[11px] text-slate-500 dark:text-slate-400">Citizen · WhatsApp</p>
                  <p className="mt-0.5">
                    Namaste, I have 2 old laptops and some cables. Can you pick up from 560076?
                  </p>
                </div>
                <div className="self-end max-w-[85%] rounded-2xl rounded-br-sm bg-emerald-600 px-3 py-2 text-white shadow-sm">
                  <p className="font-semibold text-[11px] text-emerald-100">System · Booking bot</p>
                  <p className="mt-0.5">
                    Pickup request created · <span className="font-semibold">PKP-24-0317-102</span>. Field Captain will confirm your slot shortly.
                  </p>
                </div>
              </div>
              <div className="rounded-lg border border-dashed border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-[11px] text-slate-600 dark:text-slate-300">
                <p className="font-semibold text-slate-700 dark:text-slate-200">Booking-Requests → Pickups</p>
                <p className="mt-0.5">
                  Chat is normalised into a booking request, then converted into a traceable pickup with hub, category and weight.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
