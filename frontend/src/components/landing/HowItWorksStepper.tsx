'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SectionWrapper } from './SectionWrapper';

const spring = { type: 'spring' as const, stiffness: 120, damping: 18 };
const HOW_IT_WORKS_IMAGE = '/images/how-it-works-flow.jpg';
const HOW_IT_WORKS_VIDEO = '/video/How%20its%20works.mp4';

const STEPS = [
  { number: 1, title: 'Book Pickup', desc: 'Schedule via app, WhatsApp, or missed call.' },
  { number: 2, title: 'Collection & Weighing', desc: 'We collect and log weight at your door.' },
  { number: 3, title: 'Verified Recycling', desc: 'E-waste goes to audited recyclers only.' },
  { number: 4, title: 'Impact & Compliance Report', desc: 'Get your certificate and impact data.' },
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

export function HowItWorksStepper() {
  const [bgHide, setBgHide] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = useReducedMotion();

  const handleVideoMouseEnter = () => {
    if (reducedMotion || !videoRef.current) return;
    videoRef.current.muted = true;
    videoRef.current.play().catch(() => {});
  };
  const handleVideoMouseLeave = () => {
    if (!videoRef.current) return;
    videoRef.current.pause();
  };

  return (
    <SectionWrapper id="how-it-works" className="relative">
      {/* Faded background image (material flow) */}
      {!bgHide && (
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          style={{
            maskImage: 'radial-gradient(ellipse 90% 50% at 50% 50%, black 10%, transparent 65%)',
            WebkitMaskImage: 'radial-gradient(ellipse 90% 50% at 50% 50%, black 10%, transparent 65%)',
          }}
          aria-hidden
        >
          <div className="absolute inset-0 opacity-[0.05] blur-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={HOW_IT_WORKS_IMAGE}
              alt=""
              className="h-full w-full object-cover"
              onError={() => setBgHide(true)}
            />
          </div>
        </div>
      )}

      <motion.h2
        className="relative text-center text-3xl font-bold tracking-tight text-white sm:text-4xl"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={spring}
      >
        How it works
      </motion.h2>
      <motion.p
        className="relative mx-auto mt-3 max-w-2xl text-center text-lg text-white/70"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ ...spring, delay: 0.05 }}
      >
        Four simple steps from your door to verified recycling.
      </motion.p>
      <div className="relative mt-16 flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-0">
        {STEPS.map((step, i) => (
          <React.Fragment key={step.number}>
            <motion.div
              className="flex flex-1 flex-col items-center text-center"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...spring, delay: i * 0.08 }}
            >
              <div
                className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full border-2 border-eco/50 bg-eco/10 text-xl font-bold text-eco"
                style={{ boxShadow: '0 0 30px rgba(34,197,94,0.25)' }}
              >
                {step.number}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">{step.title}</h3>
              <p className="mt-1 max-w-[200px] text-sm text-white/70">{step.desc}</p>
            </motion.div>
            {i < STEPS.length - 1 && (
              <div className="relative hidden flex-1 items-center px-2 pt-8 lg:flex" aria-hidden>
                {/* Dashed line with flowing glow dot */}
                <div className="relative h-0.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="absolute inset-0 rounded-full border border-dashed border-eco/30"
                    style={{ borderWidth: 1 }}
                  />
                  <div className="bg-flow-dot absolute left-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-eco shadow-[0_0_12px_rgba(34,197,94,0.8)]" />
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Demo video — directly below step flow */}
      <div className="relative mt-20 flex flex-col items-center">
        <span
          className="mb-4 inline-block rounded-full border border-eco/40 bg-eco/10 px-4 py-1.5 text-sm font-medium text-eco"
          style={{ boxShadow: '0 0 20px rgba(34,197,94,0.2)' }}
        >
          See it in action
        </span>
        <motion.div
          className="relative mx-auto w-full max-w-[1100px]"
          onMouseEnter={handleVideoMouseEnter}
          onMouseLeave={handleVideoMouseLeave}
          whileHover={reducedMotion ? {} : { scale: 1.01 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {/* Eco glow behind container */}
          <div
            className="pointer-events-none absolute -inset-4 rounded-3xl blur-2xl"
            style={{
              background: 'radial-gradient(circle, rgba(34,197,94,0.2) 0%, transparent 65%)',
              opacity: 0.6,
            }}
            aria-hidden
          />
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-sm">
            <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black md:max-h-[520px] md:min-h-[400px]">
              <video
                ref={videoRef}
                src={HOW_IT_WORKS_VIDEO}
                controls
                preload="metadata"
                className="h-full w-full object-cover"
                playsInline
                aria-label="How it works demo"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </motion.div>

        {/* Narrative block — below video */}
        <motion.div
          className="mx-auto mt-12 max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={spring}
        >
          <h3 className="text-lg font-semibold text-white sm:text-xl">
            Full Transparency. Zero Guesswork.
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            From doorstep pickup to verified recycling,
            every step is logged, audited, and traceable in real time.
          </p>
          <a
            href="#ewaste-flow"
            className="group mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-eco transition-colors hover:underline hover:underline-offset-2 focus-visible:outline focus-visible:ring-2 focus-visible:ring-eco focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1220]"
          >
            Explore how traceability works
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden>
              →
            </span>
          </a>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
