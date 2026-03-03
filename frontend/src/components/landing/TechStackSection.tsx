'use client';

import { motion } from 'framer-motion';
import { Database, Server, Blocks, BarChart2, Shield } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { SectionWrapper } from './SectionWrapper';
import { IconGlow } from './IconGlow';

const spring = { type: 'spring' as const, stiffness: 120, damping: 18 };

const TECH = [
  { name: 'React', desc: 'Fast, accessible frontends for dashboards and booking.', Icon: BarChart2 },
  { name: 'Node', desc: 'Scalable APIs and background jobs.', Icon: Server },
  { name: 'PostgreSQL', desc: 'Reliable data and audit trails.', Icon: Database },
  { name: 'Blockchain integration', desc: 'Tamper-evident logs and verification.', Icon: Blocks },
  { name: 'Analytics system', desc: 'Compliance and impact reporting.', Icon: Shield },
];

export function TechStackSection() {
  return (
    <SectionWrapper>
      <motion.h2
        className="text-center text-3xl font-bold tracking-tight text-white sm:text-4xl"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={spring}
      >
        Technology Stack
      </motion.h2>
      <motion.p
        className="mx-auto mt-3 max-w-2xl text-center text-lg text-white/70"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ ...spring, delay: 0.05 }}
      >
        Built for security, scale, and compliance.
      </motion.p>
      <motion.div
        className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ ...spring, staggerChildren: 0.06 }}
      >
        {TECH.map((item, i) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...spring, delay: i * 0.06 }}
          >
            <GlassCard variant="solid">
              <IconGlow>
                <item.Icon className="h-6 w-6" aria-hidden />
              </IconGlow>
              <h3 className="mt-4 text-lg font-semibold text-white">{item.name}</h3>
              <p className="mt-2 text-sm text-white/70">{item.desc}</p>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrapper>
  );
}
