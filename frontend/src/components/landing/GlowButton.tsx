'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

type GlowButtonProps = {
  variant: 'primary' | 'secondary';
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit';
};

export function GlowButton({
  variant,
  href,
  onClick,
  children,
  className = '',
  type = 'button',
}: GlowButtonProps) {
  const base =
    'inline-flex min-h-[var(--touch-min-h)] items-center justify-center gap-2 rounded-xl px-6 py-3 text-base font-semibold transition-all duration-300 focus-visible:outline focus-visible:ring-2 focus-visible:ring-eco focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1220]';

  const primaryClass =
    'bg-gradient-to-r from-eco to-emerald-600 text-white shadow-[0_0_30px_rgba(34,197,94,0.35)] hover:shadow-[0_0_50px_rgba(34,197,94,0.45)] hover:scale-[1.02]';

  const secondaryClass =
    'border border-white/20 bg-white/5 text-white backdrop-blur-sm hover:bg-white/10 hover:border-white/30';

  const combined = `${base} ${variant === 'primary' ? primaryClass : secondaryClass} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combined}>
        {children}
      </Link>
    );
  }

  const spring = { type: 'spring' as const, stiffness: 120, damping: 18 };
  return (
    <motion.button
      type={type}
      className={combined}
      onClick={onClick}
      whileHover={variant === 'primary' ? { scale: 1.02 } : undefined}
      whileTap={variant === 'primary' ? { scale: 0.98 } : undefined}
      transition={spring}
    >
      {children}
    </motion.button>
  );
}
