'use client';

import { useEffect, useState, Fragment } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const springReveal = { type: 'spring' as const, stiffness: 110, damping: 20 };
const LOOP_DURATION_MS = 11000;

const FLOW_STEPS = [
  'Home',
  'Collection',
  'Sorting',
  'Verified Recycler',
  'Impact Certificate',
];

const CENTER_NODE_INDEX = 3; // Verified Recycler — turning point

function useFlowProgress(reducedMotion: boolean) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (reducedMotion) return;
    const start = Date.now();
    let raf = 0;
    const tick = () => {
      const elapsed = Date.now() - start;
      const p = (elapsed % LOOP_DURATION_MS) / LOOP_DURATION_MS;
      setProgress(p);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reducedMotion]);
  return progress;
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

export function EWasteFlowSection() {
  const reducedMotion = useReducedMotion();
  const progress = useFlowProgress(reducedMotion);

  const activeNode =
    progress < 0.1 ? 0 : progress < 0.32 ? 1 : progress < 0.55 ? 2 : progress < 0.78 ? 3 : 4;

  const dotPastCenter = progress >= 0.5;
  const dotNearCenter = progress >= 0.46 && progress <= 0.54;

  return (
    <section
      id="ewaste-flow"
      className="relative w-full overflow-hidden"
      style={{
        minHeight: 750,
        backgroundColor: '#111d2e',
      }}
    >
      {/* Split background: stronger red left, stronger eco right, blend at center */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            'linear-gradient(90deg, rgba(127,29,29,0.18) 0%, rgba(127,29,29,0.06) 42%, rgba(5,46,22,0.06) 58%, rgba(5,46,22,0.14) 100%)',
        }}
      />
      {/* Subtle vertical glow line at center */}
      <div
        className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2"
        aria-hidden
        style={{
          background:
            'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.06) 20%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.06) 80%, transparent 100%)',
          boxShadow: '0 0 40px rgba(255,255,255,0.08)',
        }}
      />
      {/* Very faint diagonal gradient divider */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        aria-hidden
        style={{
          background:
            'linear-gradient(135deg, transparent 45%, rgba(255,255,255,0.03) 50%, transparent 55%)',
        }}
      />

      <div className="section-inner relative flex min-h-[750px] flex-col items-center justify-center gap-16 py-20 lg:flex-row lg:gap-12 lg:py-28">
        {/* 1. Left — Emotional hook */}
        <motion.div
          className="flex max-w-xs flex-shrink-0 flex-col lg:max-w-[280px]"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={springReveal}
        >
          <h2 className="text-[2rem] font-bold leading-[1.1] tracking-tight sm:text-4xl lg:text-[2.75rem] xl:text-[3.25rem]">
            <span className="uppercase tracking-wide text-white/70">Most E-Waste</span>
            <br />
            <span className="relative inline-block text-white">
              Disappears.
              <span
                className="absolute -bottom-1 left-0 h-1 rounded-full bg-red-500/90"
                style={{
                  width: '100%',
                  animation: reducedMotion ? 'none' : 'flow-underline 2.5s ease-in-out infinite',
                }}
              />
            </span>
          </h2>
          <p className="mt-5 max-w-[260px] text-base font-medium leading-snug text-white/85 sm:text-lg">
            Without traceability, it enters informal channels.
          </p>
        </motion.div>

        {/* 2. Center — Flow with gradient line, light sweep, center pulse */}
        <motion.div
          className="relative flex flex-1 basis-0 items-center justify-center px-4"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={springReveal}
        >
          {/* Light sweep across flow (12s) */}
          {!reducedMotion && (
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
              <div
                className="flow-light-sweep absolute inset-y-0 w-1/2 opacity-[0.07]"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
                }}
              />
            </div>
          )}
          {/* Large soft radial glow following dot; intensifies when past center */}
          {!reducedMotion && (
            <div
              className="pointer-events-none absolute inset-0 top-1/2 h-40 -translate-y-1/2 blur-[80px]"
              aria-hidden
            >
              <motion.div
                className="absolute h-full w-64 -translate-x-1/2 rounded-full"
                style={{
                  left: `${progress * 100}%`,
                  background:
                    dotPastCenter
                      ? 'radial-gradient(circle, rgba(34,197,94,0.2) 0%, rgba(34,197,94,0.06) 40%, transparent 70%)'
                      : 'radial-gradient(circle, rgba(34,197,94,0.12) 0%, rgba(34,197,94,0.04) 40%, transparent 70%)',
                }}
              />
            </div>
          )}
          {/* Pulse wave when dot crosses center */}
          {!reducedMotion && dotNearCenter && (
            <motion.div
              className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-eco/40"
              initial={{ scale: 0.5, opacity: 0.25 }}
              animate={{ scale: 2.5, opacity: 0 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              aria-hidden
            />
          )}
          <div className="relative flex w-[80%] min-w-0 max-w-5xl items-center">
            <div className="relative flex w-full items-end">
              {FLOW_STEPS.map((label, i) => {
                const isLeftSide = i <= 1;
                const isRightSide = i >= 2;
                const isCenterNode = i === CENTER_NODE_INDEX;
                const baseScale = isCenterNode ? 1.06 : 1;
                const activeScale = isCenterNode ? 1.16 : 1.12;
                return (
                  <Fragment key={label}>
                    <div className="flex flex-col items-center gap-3">
                      <span className="relative flex h-16 w-16 flex-shrink-0 overflow-visible">
                        {!reducedMotion && (
                          <motion.span
                            className="absolute inset-0 rounded-full border-2 border-eco/40"
                            animate={{
                              scale: [1, 1.4, 1],
                              opacity: [0.35, 0.08, 0.35],
                            }}
                            transition={{
                              duration: 2.5,
                              repeat: Infinity,
                              ease: 'easeInOut',
                              delay: i * 0.2,
                            }}
                            aria-hidden
                          />
                        )}
                        <motion.span
                          className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-full border-2 text-sm font-bold ${
                            isLeftSide
                              ? 'border-eco/50 bg-eco/10 text-eco/90'
                              : isRightSide
                                ? 'border-eco/80 bg-eco/25 text-eco'
                                : 'border-eco/70 bg-eco/20 text-eco'
                          }`}
                          animate={{
                            scale: activeNode === i ? activeScale : baseScale,
                            boxShadow:
                              activeNode === i
                                ? '0 0 44px rgba(34,197,94,0.55), 0 0 0 3px rgba(34,197,94,0.3)'
                                : isRightSide
                                  ? [
                                      '0 0 28px rgba(34,197,94,0.35), 0 0 0 2px rgba(34,197,94,0.18)',
                                      '0 0 40px rgba(34,197,94,0.5), 0 0 0 2px rgba(34,197,94,0.22)',
                                      '0 0 28px rgba(34,197,94,0.35), 0 0 0 2px rgba(34,197,94,0.18)',
                                    ]
                                  : [
                                      '0 0 20px rgba(34,197,94,0.25), 0 0 0 2px rgba(34,197,94,0.12)',
                                      '0 0 30px rgba(34,197,94,0.35), 0 0 0 2px rgba(34,197,94,0.15)',
                                      '0 0 20px rgba(34,197,94,0.25), 0 0 0 2px rgba(34,197,94,0.12)',
                                    ],
                          }}
                          transition={{
                            scale: { duration: 0.2 },
                            boxShadow: reducedMotion
                              ? {}
                              : activeNode === i
                                ? { duration: 0.2 }
                                : { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
                          }}
                        >
                          {i + 1}
                        </motion.span>
                      </span>
                      <span className="max-w-[5rem] text-center text-xs font-medium text-white/90 sm:max-w-[5.5rem] sm:text-sm">
                        {label}
                      </span>
                    </div>
                    {i < FLOW_STEPS.length - 1 && (
                      <div className="relative h-[3px] min-w-[16px] flex-1 shrink-0 sm:min-w-[28px]">
                        <div
                          className="absolute inset-0 rounded-full"
                          style={{
                            background: `linear-gradient(90deg, rgba(220,38,38,0.35) 0%, rgba(34,197,94,0.35) 100%)`,
                          }}
                        />
                      </div>
                    )}
                  </Fragment>
                );
              })}
            </div>
            {!reducedMotion && (
              <motion.span
                className="pointer-events-none absolute left-0 top-8 z-20 h-3 w-3 -translate-x-1/2 rounded-full bg-eco"
                style={{
                  left: `${progress * 100}%`,
                  boxShadow: dotPastCenter
                    ? '0 0 28px rgba(34,197,94,1), 0 0 12px rgba(34,197,94,0.8)'
                    : '0 0 20px rgba(34,197,94,0.95)',
                }}
                aria-hidden
              />
            )}
          </div>
        </motion.div>

        {/* 3. Right — Resolution */}
        <motion.div
          className="flex max-w-xs flex-shrink-0 flex-col lg:max-w-[280px]"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={springReveal}
        >
          <h2 className="text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl lg:text-[2rem] xl:text-[2.25rem]">
            Traceability Changes That.
            <span className="ml-1 inline-block h-2 w-2 rounded-full bg-eco shadow-[0_0_8px_rgba(34,197,94,0.7)]" />
          </h2>
          <p className="mt-5 flex items-start gap-3 text-base font-semibold leading-snug text-white/90 sm:text-lg">
            <span className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-eco/25 text-eco shadow-[0_0_16px_rgba(34,197,94,0.4)]">
              <Check className="h-4 w-4" strokeWidth={2.5} />
            </span>
            <span>Every step verified. Proof you can trust.</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
