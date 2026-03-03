'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

const spring = { type: 'spring' as const, stiffness: 120, damping: 18 };

type GlassVariant = 'strong' | 'medium' | 'solid' | 'light';

type GlassCardProps = {
  children: ReactNode;
  className?: string;
  variant?: GlassVariant;
  /** Optional hover lift in px (default -6) */
  hoverY?: number;
};

const variantClass: Record<GlassVariant, string> = {
  strong: 'glass-card--strong',
  medium: 'glass-card--medium',
  solid: 'glass-card--solid',
  light: 'glass-card--light',
};

export function GlassCard({ children, className = '', variant, hoverY = -6 }: GlassCardProps) {
  const variantCn = variant ? variantClass[variant] : '';
  return (
    <motion.div
      className={`glass-card rounded-2xl p-6 ${variantCn} ${className}`.trim()}
      whileHover={{ y: hoverY }}
      transition={spring}
    >
      {children}
    </motion.div>
  );
}
