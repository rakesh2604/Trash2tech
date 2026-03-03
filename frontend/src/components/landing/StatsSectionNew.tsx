'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Recycle, MapPin, ShieldCheck, FileCheck } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { SectionWrapper } from './SectionWrapper';
import { IconGlow } from './IconGlow';

const spring = { type: 'spring' as const, stiffness: 120, damping: 18 };

const STATS = [
  { label: 'Kg recycled', value: 12450, suffix: '+', icon: Recycle },
  { label: 'Cities active', value: 8, suffix: '', icon: MapPin },
  { label: 'Verified recyclers', value: 24, suffix: '+', icon: ShieldCheck },
  { label: 'Compliance reports', value: 3200, suffix: '+', icon: FileCheck },
];

function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!isInView) return;
    const duration = 1500;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - t) * (1 - t);
      setDisplay(Math.round(eased * value));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [isInView, value]);
  return (
    <span ref={ref}>
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

export function StatsSectionNew() {
  return (
    <SectionWrapper id="stats">
      <motion.div
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ ...spring, staggerChildren: 0.08 }}
      >
        {STATS.map((stat) => (
          <GlassCard key={stat.label} className="text-center">
            <IconGlow className="mx-auto">
              <stat.icon className="h-6 w-6" aria-hidden />
            </IconGlow>
            <p className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
            </p>
            <p className="mt-1 text-sm font-medium uppercase tracking-wider text-white/60">
              {stat.label}
            </p>
          </GlassCard>
        ))}
      </motion.div>
    </SectionWrapper>
  );
}
