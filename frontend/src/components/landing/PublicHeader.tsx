'use client';

import Link from 'next/link';

const NAV_LINKS = [
  { href: '#main-content', label: 'Home' },
  { href: '#why-trust-us', label: 'About' },
  { href: '#how-it-works', label: 'Features' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#contact', label: 'Contact' },
];

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 dark:border-slate-700/80 dark:bg-slate-900/95 backdrop-blur-md shadow-sm">
      <div className="section-inner flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-semibold text-slate-900 dark:text-slate-100 transition-opacity hover:opacity-90 focus-visible:outline focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 rounded-lg"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-white text-sm font-bold shadow-md">
            E
          </span>
          <span className="hidden sm:inline text-slate-800 dark:text-slate-200">E-Waste Traceability</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1" aria-label="Main">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-100 focus-visible:outline focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 border-2 border-slate-300 dark:border-slate-600 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:outline focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="btn-primary rounded-lg bg-brand hover:bg-brand-light text-white"
          >
            Sign up
          </Link>
        </div>
      </div>
    </header>
  );
}
