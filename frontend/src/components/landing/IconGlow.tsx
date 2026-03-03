'use client';

import type { ReactNode } from 'react';

type IconGlowProps = {
  children: ReactNode;
  className?: string;
};

export function IconGlow({ children, className = '' }: IconGlowProps) {
  return (
    <div className={`icon-glow-ring flex-shrink-0 text-eco ${className}`}>
      {children}
    </div>
  );
}
