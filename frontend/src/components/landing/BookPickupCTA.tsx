'use client';

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210';
const MISSED_CALL_NUMBER = process.env.NEXT_PUBLIC_MISSED_CALL_NUMBER || '919876543210';

function normalizePhone(value: string): string {
  const digits = value.replace(/\D/g, '');
  return digits.length >= 10 ? digits : '919876543210';
}

export function BookPickupCTA() {
  const whatsappDigits = normalizePhone(WHATSAPP_NUMBER);
  const telDigits = normalizePhone(MISSED_CALL_NUMBER);
  const whatsappUrl = `https://wa.me/${whatsappDigits}`;
  const telUrl = `tel:+${telDigits}`;
  const hasValidWhatsApp = whatsappDigits.length >= 10;
  const hasValidTel = telDigits.length >= 10;

  return (
    <section className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 section-block">
      <div className="section-inner">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
          Book a pickup
        </h2>
        <p className="mt-2 text-lg text-slate-600 dark:text-slate-300 max-w-2xl">
          Two options: WhatsApp (fast) or a free missed call. We&apos;ll get back to you.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <a
            href={hasValidWhatsApp ? whatsappUrl : '#'}
            target={hasValidWhatsApp ? '_blank' : undefined}
            rel={hasValidWhatsApp ? 'noopener noreferrer' : undefined}
            aria-disabled={!hasValidWhatsApp}
            className={`inline-flex min-h-[var(--touch-min-h)] items-center justify-center gap-2 rounded-xl px-6 py-3 text-base font-semibold text-white shadow-sm focus-visible:outline focus-visible:ring-2 focus-visible:ring-offset-2 ${
              hasValidWhatsApp
                ? 'bg-[#25D366] hover:bg-[#20bd5a] focus-visible:ring-[#25D366] transition-colors'
                : 'cursor-not-allowed bg-slate-400 pointer-events-none'
            }`}
            onClick={(e) => !hasValidWhatsApp && e.preventDefault()}
          >
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.865 9.865 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Book on WhatsApp
          </a>
          <a
            href={hasValidTel ? telUrl : '#'}
            aria-disabled={!hasValidTel}
            className={`inline-flex min-h-[var(--touch-min-h)] items-center justify-center gap-2 rounded-xl border-2 px-6 py-3 text-base font-semibold focus-visible:outline focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 ${
              hasValidTel
                ? 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors'
                : 'cursor-not-allowed border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 pointer-events-none'
            }`}
            onClick={(e) => !hasValidTel && e.preventDefault()}
          >
            <span className="text-xl" aria-hidden>📞</span>
            Give missed call for pickup
          </a>
        </div>
        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
          Elderly or prefer no app? Use the missed-call number. We&apos;ll call you back to schedule.
        </p>
      </div>
    </section>
  );
}
