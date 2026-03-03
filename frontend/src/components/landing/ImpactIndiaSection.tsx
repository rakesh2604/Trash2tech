'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { SectionWrapper } from './SectionWrapper';

const spring = { type: 'spring' as const, stiffness: 120, damping: 18 };
const springReveal = { type: 'spring' as const, stiffness: 100, damping: 20 };
const IMPACT_IMAGE = '/images/impact-ewaste.jpg';

const TOTAL_EWASTE_MT = 1.397;
const PROPERLY_RECYCLED_PCT = 29.29;
const GAP_PCT = Math.round((100 - PROPERLY_RECYCLED_PCT) * 100) / 100;

const nf = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 0 });
const pctFmt = (n: number) => nf.format(n) + '%';

function AnimatedPct({ value, suffix = '%' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!isInView) return;
    const duration = 1200;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - t) * (1 - t);
      setDisplay(Math.round(eased * value * 100) / 100);
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [isInView, value]);
  return (
    <span ref={ref}>
      {nf.format(Math.round(display * 100) / 100)}
      {suffix}
    </span>
  );
}

export function ImpactIndiaSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [bgHide, setBgHide] = useState(false);

  return (
    <SectionWrapper id="impact" className="relative bg-[#060d14]">
      {/* Split background: left green tint, right red tint, diagonal divider */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden
      >
        <div className="absolute inset-0 bg-gradient-to-r from-eco/10 from-0% via-transparent via-45% to-transparent to-55% to-red-500/10 to-100%" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              'linear-gradient(135deg, transparent 45%, rgba(255,255,255,0.03) 50%, transparent 55%)',
          }}
        />
      </div>
      {!bgHide && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div className="absolute inset-0 opacity-[0.06] blur-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={IMPACT_IMAGE}
              alt=""
              className="h-full w-full object-cover"
              onError={() => setBgHide(true)}
            />
          </div>
        </div>
      )}
      {/* Very faint recycle watermark (this section only) */}
      <div
        className="eco-bg-recycle-spin pointer-events-none absolute right-0 top-1/2 hidden h-[50vmin] w-[50vmin] -translate-y-1/2 translate-x-1/4 text-eco lg:block"
        style={{ opacity: 0.03 }}
        aria-hidden
      >
        <svg viewBox="0 0 100 100" fill="none" className="h-full w-full">
          <path
            d="M50 18 L62 38 L50 34 L38 38 Z M50 34 L50 58 L28 58 L28 42 M28 58 L12 58 L24 72 L28 58 M24 72 L50 72 L50 88 L72 88 L72 72 M72 88 L88 88 L76 72 L72 88 M76 72 L50 72"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M50 18 L62 38 L50 34 L38 38 Z M50 34 L50 58 L28 58 L28 42 M28 58 L12 58 L24 72 L28 58 M24 72 L50 72 L50 88 L72 88 L72 72 M72 88 L88 88 L76 72 L72 88 M76 72 L50 72"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            transform="rotate(120 50 50)"
          />
          <path
            d="M50 18 L62 38 L50 34 L38 38 Z M50 34 L50 58 L28 58 L28 42 M28 58 L12 58 L24 72 L28 58 M24 72 L50 72 L50 88 L72 88 L72 72 M72 88 L88 88 L76 72 L72 88 M76 72 L50 72"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            transform="rotate(240 50 50)"
          />
        </svg>
      </div>
      <motion.div
        ref={ref}
        className="relative rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl sm:p-10 lg:p-12"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={springReveal}
        style={{ boxShadow: '0 0 60px rgba(34,197,94,0.06)' }}
      >
        <h2 className="text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Impact &amp; Transparency Gap in India
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-lg text-white/70">
          E-waste generated vs. formally recycled — and how traceability can close the gap.
        </p>
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          <div className="text-center">
            <p className="text-4xl font-bold text-white sm:text-5xl">
              {nf.format(TOTAL_EWASTE_MT)} lakh
            </p>
            <p className="mt-1 text-sm font-medium uppercase tracking-wider text-white/60">
              Tonnes e-waste generated (FY 2024–25)
            </p>
          </div>
          <div className="text-center">
            <p className="text-6xl font-bold text-eco sm:text-7xl">
              <AnimatedPct value={PROPERLY_RECYCLED_PCT} />
            </p>
            <p className="mt-1 text-sm font-medium uppercase tracking-wider text-white/60">
              Properly recycled (formal channel)
            </p>
          </div>
          <div className="text-center">
            <p className="text-6xl font-bold text-[#f87171] sm:text-7xl">
              <AnimatedPct value={GAP_PCT} />
            </p>
            <p className="mt-1 text-sm font-medium uppercase tracking-wider text-white/60">
              Gap — untraced / informal
            </p>
          </div>
        </div>
        <div className="mt-10 space-y-5">
          <div>
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-white/80">Formally recycled</span>
              <span className="text-eco">{pctFmt(PROPERLY_RECYCLED_PCT)}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-eco via-emerald-400 to-eco shadow-[0_0_20px_rgba(34,197,94,0.4)]"
                initial={{ width: 0 }}
                animate={{ width: isInView ? `${PROPERLY_RECYCLED_PCT}%` : 0 }}
                transition={{ ...spring, delay: 0.1 }}
              />
            </div>
          </div>
          {/* Divider bar sliding in from center */}
          <motion.div
            className="my-4 h-px bg-white/20"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ ...springReveal, delay: 0.2 }}
            style={{ originX: 0.5 }}
          />
          <div>
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-white/80">Gap (untraced)</span>
              <span className="text-red-400/90">{pctFmt(GAP_PCT)}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-red-900/60 to-red-500/70"
                initial={{ width: 0 }}
                animate={{ width: isInView ? `${GAP_PCT}%` : 0 }}
                transition={{ ...spring, delay: 0.2 }}
              />
            </div>
            <p className="mt-3 text-sm font-semibold text-white/90">
              Most e-waste disappears into informal channels.
            </p>
            <p className="mt-1 text-xs text-white/50">
              This gap represents e-waste that does not enter the formal recycling chain — our platform helps close it through traceability.
            </p>
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-white/50">
          Source: CPCB / Press Information Bureau (FY 2024–25). Our goal: move informal flows into traceable, auditable lots.
        </p>
      </motion.div>
    </SectionWrapper>
  );
}
