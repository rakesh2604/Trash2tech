'use client';

import {
  Link2,
  Network,
  FileBarChart,
  LayoutDashboard,
  CalendarCheck,
  BarChart3,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { GlassCard } from './GlassCard';
import { SectionWrapper } from './SectionWrapper';
import { IconGlow } from './IconGlow';

const spring = { type: 'spring' as const, stiffness: 120, damping: 18 };

const FEATURES = [
  {
    title: 'Digital Chain of Custody',
    description: 'Every pickup and handoff is logged and tamper-evident from collection to verified recycling.',
    icon: Link2,
  },
  {
    title: 'Verified Recycler Network',
    description: 'Partner hubs and recyclers are vetted and auditable for compliance and environmental standards.',
    icon: Network,
  },
  {
    title: 'Automated Compliance Reports',
    description: 'Generate EPR-ready reports and certificates with one click for brands and regulators.',
    icon: FileBarChart,
  },
  {
    title: 'Real-time Tracking Dashboard',
    description: 'Track status of pickups, lots, and recycling outcomes in a single dashboard.',
    icon: LayoutDashboard,
  },
  {
    title: 'Pickup Scheduling System',
    description: 'Book pickups via app, WhatsApp, or missed call — we coordinate the rest.',
    icon: CalendarCheck,
  },
  {
    title: 'Environmental Impact Analytics',
    description: 'See kg recycled, carbon impact, and material recovery metrics at a glance.',
    icon: BarChart3,
  },
];

export function FeaturesGrid() {
  return (
    <SectionWrapper id="why-trust-us">
      <motion.h2
        className="text-center text-3xl font-bold tracking-tight text-white sm:text-4xl"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={spring}
      >
        Core Capabilities
      </motion.h2>
      <motion.p
        className="mx-auto mt-3 max-w-2xl text-center text-lg text-white/70"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ ...spring, delay: 0.05 }}
      >
        Everything you need for transparent, compliant e-waste recycling.
      </motion.p>
      <motion.div
        className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ ...spring, staggerChildren: 0.06 }}
      >
        {FEATURES.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...spring, delay: i * 0.06 }}
          >
            <GlassCard variant="medium">
              <IconGlow>
                <feature.icon className="h-6 w-6" aria-hidden />
              </IconGlow>
              <h3 className="mt-4 text-lg font-semibold text-white">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/70">{feature.description}</p>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrapper>
  );
}
