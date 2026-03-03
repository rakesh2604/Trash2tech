'use client';

import Link from 'next/link';
import { useScroll, useTransform, motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const NAV_LINKS = [
  { href: '#main-content', label: 'Home' },
  { href: '#why-trust-us', label: 'About' },
  { href: '#how-it-works', label: 'Features' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#contact', label: 'Contact' },
];

function useScrolled(threshold = 60) {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  useEffect(() => {
    const unsub = scrollY.on('change', (v) => setScrolled(v > threshold));
    return () => unsub();
  }, [scrollY, threshold]);
  return scrolled;
}

export function PublicHeader() {
  const { scrollY } = useScroll();
  const scrolled = useScrolled(60);
  const headerBg = useTransform(
    scrollY,
    [0, 80],
    ['rgba(11,18,32,0.82)', 'rgba(11,18,32,0.5)']
  );
  const blurClass = scrolled ? 'backdrop-blur-2xl' : 'backdrop-blur-xl';
  return (
    <motion.header
      className={`sticky top-0 z-40 border-b border-white/10 ${blurClass}`}
      style={{ backgroundColor: headerBg }}
    >
      <div className="section-inner flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:ring-2 focus-visible:ring-eco focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1220] rounded-lg"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-eco text-[#0B1220] text-sm font-bold shadow-[0_0_20px_rgba(34,197,94,0.3)]">
            E
          </span>
          <span className="hidden sm:inline">Trash2Tech</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1" aria-label="Main">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-link group relative rounded-lg px-3 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:ring-2 focus-visible:ring-eco focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1220]"
            >
              {link.label}
              <span className="nav-link-underline absolute bottom-1 left-3 right-3 h-px scale-x-0 rounded-full bg-eco transition-transform duration-200 group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/10 hover:border-white/30 focus-visible:outline focus-visible:ring-2 focus-visible:ring-eco focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1220]"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="rounded-xl bg-gradient-to-r from-eco to-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_0_25px_rgba(34,197,94,0.35)] transition-all hover:scale-[1.02] hover:shadow-[0_0_35px_rgba(34,197,94,0.45)] focus-visible:outline focus-visible:ring-2 focus-visible:ring-eco focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1220]"
          >
            Sign up
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
