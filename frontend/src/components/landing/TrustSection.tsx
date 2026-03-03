'use client';

import { motion } from 'framer-motion';
import { FileCheck, ShieldCheck, Lock } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { SectionWrapper } from './SectionWrapper';
import { IconGlow } from './IconGlow';

const spring = { type: 'spring' as const, stiffness: 120, damping: 18 };

const ITEMS = [
  {
    title: 'Audit-ready logs',
    description: 'Every handoff and status change is timestamped and immutable for regulators and EPR audits.',
    icon: FileCheck,
  },
  {
    title: 'Verified recycler verification',
    description: 'Only vetted, compliance-ready recyclers and hubs are part of the network.',
    icon: ShieldCheck,
  },
  {
    title: 'Tamper-proof tracking',
    description: 'Blockchain-backed chain of custody so evidence cannot be altered after the fact.',
    icon: Lock,
  },
];

export function TrustSection() {
  return (
    <SectionWrapper id="trust" className="trust-section-compliance relative">
      {/* Very faint eco gradient behind center card */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-80"
        style={{
          background: 'radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)',
        }}
        aria-hidden
      />
      <motion.h2
        className="relative text-center text-3xl font-bold tracking-tight text-white sm:text-4xl"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={spring}
      >
        Built for Compliance &amp; Accountability
      </motion.h2>
      <motion.div
        className="relative mt-12 grid gap-6 sm:grid-cols-3"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ ...spring, staggerChildren: 0.08 }}
      >
        {ITEMS.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...spring, delay: i * 0.06 }}
          >
            <GlassCard
              variant="light"
              hoverY={-8}
              className="transition-shadow duration-300 hover:shadow-[0_0_40px_rgba(34,197,94,0.12),0_20px_40px_-12px_rgba(0,0,0,0.35)]"
            >
              <IconGlow>
                <item.icon className="h-6 w-6" aria-hidden />
              </IconGlow>
              <h3 className="mt-4 text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/70">{item.description}</p>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrapper>
  );
}
