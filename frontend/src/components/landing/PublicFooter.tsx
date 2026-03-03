'use client';

import Link from 'next/link';

const FOOTER_COLS = [
  {
    title: 'Company',
    links: [
      { href: '#why-trust-us', label: 'About us' },
      { href: '#contact', label: 'Contact' },
    ],
  },
  {
    title: 'Solutions',
    links: [
      { href: '/signup', label: 'For citizens' },
      { href: '#pricing', label: 'For hubs' },
      { href: '#pricing', label: 'For recyclers' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { href: '#how-it-works', label: 'How it works' },
      { href: '/login', label: 'Sign in' },
    ],
  },
];

const SOCIAL = [
  { href: '#', label: 'LinkedIn', icon: 'in' },
  { href: '#', label: 'Twitter', icon: '𝕏' },
];

export function PublicFooter() {
  return (
    <footer id="contact" className="relative border-t border-white/10 bg-[#071018]">
      {/* Top fade overlay: transparent → footer bg for smooth transition */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-24 -translate-y-px"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, #071018 100%)',
        }}
        aria-hidden
      />
      <div className="section-inner relative py-12">
        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
          <div>
            <Link href="/" className="flex items-center gap-2 font-semibold text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-eco text-[#0B1220] text-sm font-bold">
                E
              </span>
              Trash2Tech
            </Link>
            <p className="mt-3 max-w-xs text-sm text-white/60">
              E-waste traceability and recycling compliance. From pickup to verified recycling.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {FOOTER_COLS.map((col) => (
              <div key={col.title}>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white/80">
                  {col.title}
                </h3>
                <ul className="mt-4 space-y-2">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-white/60 transition-colors hover:text-white focus-visible:outline focus-visible:ring-2 focus-visible:ring-eco focus-visible:ring-offset-2 focus-visible:ring-offset-[#071018] rounded"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} Trash2Tech. Built for responsible e-waste recycling.
          </p>
          <div className="flex items-center gap-4">
            {SOCIAL.map((s) => (
              <a
                key={s.label}
                href={s.href}
                className="text-white/50 transition-colors hover:text-white focus-visible:outline focus-visible:ring-2 focus-visible:ring-eco rounded"
                aria-label={s.label}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
