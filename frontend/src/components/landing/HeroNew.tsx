'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { GlowButton } from './GlowButton';

const spring = { type: 'spring' as const, stiffness: 120, damping: 18 };

const HERO_IMAGES = [
  { src: '/images/e-waste-cable-yard.jpg', caption: 'Live Collection' },
  { src: '/images/e-waste-formal-recycler.jpg', caption: 'Certified Recycler' },
  { src: '/images/e-waste-informal-wires.jpg', caption: 'Impact Verified' },
  { src: '/images/e-waste-market-stack.jpg', caption: 'Traceability Network' },
];

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

function HeroParticles({ reducedMotion }: { reducedMotion: boolean }) {
  const count = 12;
  if (reducedMotion) return null;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-1 w-1 rounded-full bg-eco/40"
          style={{
            left: `${10 + (i * 7) % 80}%`,
            top: `${15 + (i * 11) % 70}%`,
          }}
          animate={{
            y: [0, -12, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 3 + (i % 3),
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
}

const slideTransition = { duration: 1.2, ease: 'easeInOut' as const };

function HeroImageSlider({ reducedMotion }: { reducedMotion: boolean }) {
  const [index, setIndex] = useState(0);
  const [imgError, setImgError] = useState<Record<number, boolean>>({});
  const count = HERO_IMAGES.length;

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % count), 4000);
    return () => clearInterval(t);
  }, [count]);

  const currentSrc = HERO_IMAGES[index].src;
  const hasError = imgError[index];

  return (
    <div className="relative flex h-full min-h-[380px] w-full flex-col rounded-2xl md:min-h-[520px]">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={index}
          className="absolute inset-0 rounded-2xl"
          initial={{ opacity: 0, scale: reducedMotion ? 1 : 1 }}
          animate={{
            opacity: 1,
            scale: reducedMotion ? 1 : 1.05,
          }}
          exit={{
            opacity: 0,
            scale: reducedMotion ? 1 : 1.05,
          }}
          transition={slideTransition}
        >
          <div className="relative h-full w-full overflow-hidden rounded-2xl">
            {!hasError ? (
              <Image
                src={currentSrc}
                alt="E-waste recycling"
                fill
                priority={index === 0}
                loading={index === 0 ? undefined : 'lazy'}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                onError={() => setImgError((prev) => ({ ...prev, [index]: true }))}
              />
            ) : (
              <div
                className="absolute inset-0 bg-gradient-to-br from-[#0B1220] via-eco/10 to-eco/20"
                aria-hidden
              />
            )}
            {/* Cinematic overlay */}
            <div
              className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-black/70 via-black/40 to-eco/20"
              aria-hidden
            />
            {/* Subtle glass reflection on top */}
            <div
              className="absolute inset-x-0 top-0 h-1/3 rounded-t-2xl bg-gradient-to-b from-white/10 to-transparent"
              aria-hidden
            />
          </div>
        </motion.div>
      </AnimatePresence>
      {/* Caption bottom-left */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex items-end justify-between">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={slideTransition}
            className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 backdrop-blur-md"
          >
            <span className="text-sm font-semibold text-white">{HERO_IMAGES[index].caption}</span>
          </motion.div>
        </AnimatePresence>
        {/* Dot indicators */}
        <div className="flex gap-2">
          {HERO_IMAGES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={`h-2 w-2 rounded-full transition-colors focus-visible:outline focus-visible:ring-2 focus-visible:ring-eco focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1220] ${i === index ? 'bg-eco' : 'bg-white/20'}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function HeroNew() {
  const reducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 400], reducedMotion ? [0, 0] : [0, 60]);
  const opacity = useTransform(scrollY, [0, 300], reducedMotion ? [1, 1] : [1, 0.3]);
  const [ripple, setRipple] = useState<{ x: number; y: number } | null>(null);

  const handleCtaClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (reducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setRipple({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setTimeout(() => setRipple(null), 600);
  };

  return (
    <section className="relative min-h-[85vh] overflow-hidden pt-24 pb-16 lg:pt-28 lg:pb-24">
      {/* Brighter large radial glow behind headline */}
      <div
        className="pointer-events-none absolute left-0 top-1/3 h-[480px] w-[600px] -translate-y-1/2 rounded-full blur-[140px]"
        style={{
          background:
            'radial-gradient(circle, rgba(34,197,94,0.4) 0%, rgba(34,197,94,0.1) 40%, transparent 70%)',
          opacity: 0.9,
        }}
        aria-hidden
      />
      {/* Slow moving gradient sweep */}
      <div
        className="hero-gradient-sweep pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(105deg, transparent 0%, rgba(34,197,94,0.06) 35%, rgba(34,197,94,0.1) 50%, rgba(34,197,94,0.06) 65%, transparent 100%)',
          backgroundSize: '200% 100%',
        }}
        aria-hidden
      />
      <HeroParticles reducedMotion={reducedMotion} />

      <div className="section-inner relative flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-16">
        {/* Left: fixed text content */}
        <motion.div className="max-w-xl flex-1" style={{ opacity }}>
          <motion.p
            className="mb-4 inline-block rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-white/80 backdrop-blur-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={spring}
          >
            Blockchain-backed compliance
          </motion.p>
          <motion.h1
            className="text-[2.5rem] font-bold leading-[1.15] tracking-tight text-white sm:text-5xl lg:text-[3.5rem] xl:text-[4rem]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.1 }}
          >
            E-Waste Recycling Made{' '}
            <span className="bg-gradient-to-r from-eco via-emerald-400 to-eco bg-clip-text text-transparent">
              Transparent
            </span>{' '}
            &amp; Traceable
          </motion.h1>
          <motion.p
            className="mt-6 text-lg leading-relaxed text-white/80 sm:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.2 }}
          >
            From pickup to verified recycling — one chain of custody. Compliance-grade traceability
            for citizens, hubs, and recyclers across India.
          </motion.p>
          <motion.div
            className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.3 }}
          >
            <Link
              href="/signup"
              onClick={handleCtaClick}
              className="group relative inline-flex min-h-[52px] items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-eco to-emerald-600 px-8 py-4 text-lg font-semibold text-white shadow-[0_0_40px_rgba(34,197,94,0.4)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_70px_rgba(34,197,94,0.55)] focus-visible:outline focus-visible:ring-2 focus-visible:ring-eco focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1220]"
            >
              {ripple && (
                <span
                  className="cta-ripple"
                  style={{
                    left: ripple.x,
                    top: ripple.y,
                    width: 0,
                    height: 0,
                  }}
                >
                  <span
                    style={{
                      width: 20,
                      height: 20,
                      left: -10,
                      top: -10,
                    }}
                  />
                </span>
              )}
              Get started
              <span className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-2">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </span>
            </Link>
            <GlowButton variant="secondary" href="#how-it-works">
              Learn more
            </GlowButton>
          </motion.div>
          <p className="mt-3 text-xs text-white/50">Takes less than 30 seconds</p>
        </motion.div>

        {/* Right: large auto-sliding image panel */}
        <motion.div
          className="relative w-full lg:w-[50%]"
          style={{ y }}
        >
          {/* Radial eco glow behind slider */}
          <div
            className="pointer-events-none absolute -inset-4 rounded-3xl blur-2xl"
            style={{
              background: 'radial-gradient(circle at center, rgba(34,197,94,0.25) 0%, transparent 65%)',
            }}
            aria-hidden
          />
          <motion.div
            className="relative h-[380px] w-full overflow-hidden rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.4),0_25px_50px_-12px_rgba(0,0,0,0.5)] md:h-[520px]"
            animate={
              reducedMotion ? {} : { y: [0, -8, 0] }
            }
            transition={
              reducedMotion ? { duration: 0 } : { duration: 6, repeat: Infinity, ease: 'easeInOut' }
            }
          >
            <HeroImageSlider reducedMotion={reducedMotion} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
