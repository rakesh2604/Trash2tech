'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

const springReveal = { type: 'spring' as const, stiffness: 100, damping: 20 };

type SectionWrapperProps = {
  children: ReactNode;
  id?: string;
  className?: string;
  as?: 'section' | 'div';
};

export function SectionWrapper({
  children,
  id,
  className = '',
  as: Component = 'section',
}: SectionWrapperProps) {
  return (
    <Component id={id} className={`section-block ${className}`}>
      <motion.div
        className="section-inner"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={springReveal}
      >
        {children}
      </motion.div>
    </Component>
  );
}
