'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';

type Slide = {
  src: string;
  alt: string;
  label: string;
  caption: string;
};

const SLIDES: Slide[] = [
  {
    src: '/images/e-waste-informal-wires.jpg',
    alt: 'Informal workers stripping electrical wires by hand on the floor',
    label: 'Informal stripping',
    caption: 'Hazardous, untracked cable burning and manual stripping.',
  },
  {
    src: '/images/e-waste-formal-recycler.jpg',
    alt: 'Workers in a formal facility sorting circuit boards into bags',
    label: 'Authorized recycler',
    caption: 'Authorized facility with inventory, PPE and audit trail.',
  },
  {
    src: '/images/e-waste-cable-yard.jpg',
    alt: 'Men handling thick cables in a dense scrap yard',
    label: 'Cable yards',
    caption: 'Hundreds of kilos move daily without digital trace.',
  },
  {
    src: '/images/e-waste-market-stack.jpg',
    alt: 'Street-side shop stacked with discarded electronics and wires',
    label: 'Street e-waste markets',
    caption: 'Citizen devices flow into informal stacks instead of recyclers.',
  },
];

const AUTO_ADVANCE_MS = 6000;
const FALLBACK_CAPTION = 'E-waste collection and traceability network.';

export function ImageCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageError, setImageError] = useState<Record<number, boolean>>({});

  const safeIndex = SLIDES.length > 0 ? Math.min(activeIndex, SLIDES.length - 1) : 0;
  const activeSlide = SLIDES[safeIndex];
  const currentImageFailed = activeSlide ? Boolean(imageError[safeIndex]) : true;

  const handleImageError = useCallback((idx: number) => {
    setImageError((prev) => ({ ...prev, [idx]: true }));
  }, []);

  useEffect(() => {
    if (SLIDES.length === 0) return;
    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SLIDES.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, []);

  if (SLIDES.length === 0) {
    return (
      <section aria-label="E-waste imagery" className="relative">
        <div className="card-raise flex min-h-[18rem] items-center justify-center rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 p-8 text-center text-slate-500 dark:text-slate-400">
          <p className="text-sm">No images configured.</p>
        </div>
      </section>
    );
  }

  return (
    <section aria-label="E-waste field realities in India" className="relative">
      <div className="card-raise overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-600">
        <div className="relative h-64 w-full sm:h-80 lg:h-96 bg-slate-200 dark:bg-slate-700">
          {!currentImageFailed ? (
            <Image
              src={activeSlide.src}
              alt={activeSlide.alt}
              fill
              sizes="(min-width: 1024px) 480px, 100vw"
              className="object-cover transition-transform duration-300 ease-out hover:scale-[1.02]"
              priority={safeIndex === 0}
              onError={() => handleImageError(safeIndex)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-300 dark:bg-slate-600 text-slate-600 dark:text-slate-300" aria-hidden>
              <span className="text-sm font-medium">Image unavailable</span>
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
            <p className="text-sm font-bold uppercase tracking-wide text-white sm:text-base">
              India&apos;s largest e‑waste network
            </p>
            <p className="mt-1 text-xs sm:text-sm text-slate-200">
              Authorized aggregators with evening, day and night staff.
            </p>
            <p className="mt-2 max-w-md text-[11px] text-slate-300">
              {currentImageFailed ? FALLBACK_CAPTION : activeSlide.caption}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-xs text-slate-600 dark:text-slate-300">
          <span className="font-semibold text-slate-800 dark:text-slate-200">Traceable collection</span>
          <div className="flex items-center gap-1.5">
            {SLIDES.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                aria-label={`Show slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-200 ${
                  idx === activeIndex ? 'w-6 bg-brand' : 'w-2 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
