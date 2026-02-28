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
    <footer id="contact" className="border-t border-slate-700 bg-slate-900">
      <div className="section-inner py-12">
        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
          <div>
            <Link href="/" className="flex items-center gap-2 font-semibold text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-sm font-bold">
                E
              </span>
              E-Waste Traceability
            </Link>
            <p className="mt-3 text-sm text-slate-400 max-w-xs">
              Compliance-grade collection &amp; traceability for citizens, hubs, recyclers and EPR brands.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {FOOTER_COLS.map((col) => (
              <div key={col.title}>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
                  {col.title}
                </h3>
                <ul className="mt-4 space-y-2">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-slate-400 transition-colors hover:text-white focus-visible:outline focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded"
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
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-8 border-t border-slate-700">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} E-Waste Traceability. Built for Indian ground realities.
          </p>
          <div className="flex items-center gap-4">
            {SOCIAL.map((s) => (
              <a
                key={s.label}
                href={s.href}
                className="text-slate-400 hover:text-white transition-colors focus-visible:outline focus-visible:ring-2 focus-visible:ring-brand rounded"
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
