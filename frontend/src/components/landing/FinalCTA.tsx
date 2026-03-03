'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Phone } from 'lucide-react';

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210';
const MISSED_CALL_NUMBER = process.env.NEXT_PUBLIC_MISSED_CALL_NUMBER || '919876543210';

function normalizePhone(value: string): string {
  const digits = value.replace(/\D/g, '');
  return digits.length >= 10 ? digits : '919876543210';
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(m.matches);
    const fn = () => setReduced(m.matches);
    m.addEventListener('change', fn);
    return () => m.removeEventListener('change', fn);
  }, []);
  return reduced;
}

const iconCircleClass =
  'flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-eco/15 text-eco shadow-[0_0_20px_rgba(34,197,94,0.25)] transition-all duration-200 hover:scale-110 hover:shadow-[0_0_28px_rgba(34,197,94,0.35)]';
const secondaryLinkClass =
  'group inline-flex items-center gap-3 text-sm text-eco transition-all duration-200 hover:underline hover:underline-offset-2 hover:decoration-eco focus-visible:outline focus-visible:ring-2 focus-visible:ring-eco focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1220]';

export function FinalCTA() {
  const reducedMotion = useReducedMotion();
  const whatsappDigits = normalizePhone(WHATSAPP_NUMBER);
  const telDigits = normalizePhone(MISSED_CALL_NUMBER);
  const whatsappUrl = `https://wa.me/${whatsappDigits}`;
  const telUrl = `tel:+${telDigits}`;
  const hasValidWhatsApp = whatsappDigits.length >= 10;
  const hasValidTel = telDigits.length >= 10;

  const springReveal = { type: 'spring' as const, stiffness: 100, damping: 20 };

  return (
    <motion.section
      id="pricing"
      className="section-block relative overflow-hidden"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={springReveal}
    >
      {/* Bottom radial glow behind card, extending downward for grounding */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 h-[420px] w-[520px] -translate-x-1/2 rounded-full blur-[120px]"
        style={{
          background:
            'radial-gradient(ellipse 80% 120% at 50% 30%, rgba(34,197,94,0.18) 0%, rgba(34,197,94,0.06) 45%, transparent 70%)',
        }}
        aria-hidden
      />
      {/* Very faint vertical fade into darker at bottom */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5"
        style={{
          background: 'linear-gradient(to top, rgba(7,16,24,0.4) 0%, transparent 100%)',
        }}
        aria-hidden
      />
      {/* Soft blurred backdrop shape behind CTA — fills space, <5% opacity */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[280px] w-[min(100%,720px)] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]"
        style={{
          background: 'radial-gradient(circle, rgba(34,197,94,0.04) 0%, transparent 65%)',
        }}
        aria-hidden
      />
      <div className="section-inner relative">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[320px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-50 blur-[100px]"
          style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.2) 0%, transparent 65%)' }}
          aria-hidden
        />
        <motion.div
          className="relative mx-auto max-w-3xl rounded-2xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-xl sm:p-12 lg:p-16"
          initial={reducedMotion ? { scale: 1 } : { scale: 0.98 }}
          whileInView={reducedMotion ? {} : { scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={springReveal}
          animate={reducedMotion ? {} : { y: [0, -4, 0] }}
          style={{ boxShadow: '0 0 80px rgba(34,197,94,0.15), 0 25px 50px -12px rgba(0,0,0,0.4)' }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Start Responsible Recycling Today
          </h2>
          <p className="mt-4 text-lg text-white/80">
            Book a pickup in minutes. We handle the rest — from collection to verified recycling.
          </p>
          <p className="mt-2 text-sm font-medium text-eco">
            Join the responsible recycling movement.
          </p>

          {/* Primary CTA — dominant */}
          <div className="relative mt-10 flex flex-col items-center gap-6">
            <div className="relative flex flex-col items-center sm:flex-row sm:justify-center">
              <div
                className="pointer-events-none absolute left-1/2 top-1/2 h-24 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
                style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.45) 0%, transparent 70%)' }}
                aria-hidden
              />
              <a
                href={hasValidWhatsApp ? whatsappUrl : '/signup'}
                target={hasValidWhatsApp ? '_blank' : undefined}
                rel={hasValidWhatsApp ? 'noopener noreferrer' : undefined}
                className="relative z-10 inline-flex min-h-[var(--touch-min-h)] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-eco to-emerald-600 px-8 py-4 text-lg font-semibold text-white shadow-[0_0_45px_rgba(34,197,94,0.45)] transition-all hover:scale-[1.02] hover:shadow-[0_0_70px_rgba(34,197,94,0.55)] focus-visible:outline focus-visible:ring-2 focus-visible:ring-eco focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1220]"
              >
                Book a Pickup
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>

            {/* Secondary action row — WhatsApp & Call */}
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6 sm:items-center">
              {hasValidWhatsApp && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={secondaryLinkClass}
                >
                  <span className={iconCircleClass}>
                    <MessageCircle className="h-4 w-4" strokeWidth={2} aria-hidden />
                  </span>
                  <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                    Chat on WhatsApp
                  </span>
                </a>
              )}
              {hasValidWhatsApp && hasValidTel && (
                <span className="h-4 w-px flex-shrink-0 bg-white/20" aria-hidden />
              )}
              {hasValidTel && (
                <a href={telUrl} className={secondaryLinkClass}>
                  <span className={iconCircleClass}>
                    <Phone className="h-4 w-4" strokeWidth={2} aria-hidden />
                  </span>
                  <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                    Request a Call
                  </span>
                </a>
              )}
            </div>
          </div>

          <p className="mt-6 text-sm text-white/50">
            No hidden fees. Verified recyclers only.
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
}
