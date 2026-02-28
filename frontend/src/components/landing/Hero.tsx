'use client';

import Link from 'next/link';
import { ImageCarousel } from './ImageCarousel';

/* Animated background: light blue stars/dots that float (PlacedAI-style) */
function HeroBackground() {
  const dots = Array.from({ length: 40 }, (_, i) => (
    <span
      key={i}
      className="hero-bg-dot absolute rounded-full bg-sky-300/40 dark:bg-sky-400/30"
      style={{
        left: `${(i * 7 + 3) % 98}%`,
        top: `${(i * 11 + 5) % 95}%`,
        width: i % 3 === 0 ? 4 : i % 3 === 1 ? 6 : 3,
        height: i % 3 === 0 ? 4 : i % 3 === 1 ? 6 : 3,
        animationDelay: `${(i % 8) * 0.5}s`,
        animationDuration: `${4 + (i % 5)}s`,
      }}
      aria-hidden
    />
  ));
  const pluses = Array.from({ length: 12 }, (_, i) => (
    <span
      key={`p-${i}`}
      className="hero-bg-plus absolute text-sky-300/30 dark:text-sky-400/25 text-[10px] font-light"
      style={{
        left: `${(i * 13 + 2) % 96}%`,
        top: `${(i * 17 + 8) % 92}%`,
        animationDelay: `${(i % 6) * 0.6}s`,
        animationDuration: `${5 + (i % 4)}s`,
      }}
      aria-hidden
    >
      +
    </span>
  ));
  return (
    <>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {dots}
        {pluses}
      </div>
      {/* Subtle vertical beams */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.15] dark:opacity-[0.08]">
        <div className="absolute left-[10%] top-0 w-px h-full bg-sky-400" />
        <div className="absolute left-[25%] top-0 w-px h-full bg-sky-400" />
        <div className="absolute left-[45%] top-0 w-px h-full bg-sky-400" />
        <div className="absolute left-[70%] top-0 w-px h-full bg-sky-400" />
        <div className="absolute left-[88%] top-0 w-px h-full bg-sky-400" />
      </div>
    </>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50/30 to-white dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-900">
      {/* Glow blobs */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-80 w-80 rounded-full bg-brand/10 dark:bg-brand/20 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute top-1/2 -left-32 h-72 w-72 rounded-full bg-brand-light/10 dark:bg-brand-light/15 blur-3xl" aria-hidden />
      <HeroBackground />
      <div className="section-inner section-block relative flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-16 lg:py-20">
        <div className="max-w-xl">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl lg:text-6xl lg:leading-tight">
            E-waste recycling made{' '}
            <span className="shine-text">traceable</span>
            .
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-slate-600 dark:text-slate-300 sm:text-xl">
            Empowering citizens, hubs and recyclers with a compliance-grade network. One pickup ID, full chain-of-custody from collection to EPR.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link
              href="/signup"
              className="btn-primary inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl px-6 py-3 text-base font-semibold shadow-lg"
            >
              Sign up Free
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex min-h-[48px] items-center justify-center rounded-xl px-6 py-3 text-base font-semibold text-slate-700 dark:text-slate-300 border-2 border-slate-300 dark:border-slate-600 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:outline focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
            >
              Learn more
            </Link>
          </div>
          <p className="mt-8 text-xs font-medium uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Trusted by citizens &amp; hubs across India
          </p>
        </div>
        <div className="w-full max-w-xl shrink-0 lg:max-w-md lg:flex-1">
          <ImageCarousel />
        </div>
      </div>
    </section>
  );
}
