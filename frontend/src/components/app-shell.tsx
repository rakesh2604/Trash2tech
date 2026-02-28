'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { getRoleDisplayName } from '../lib/roles';

function NavLink(props: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === props.href || pathname?.startsWith(`${props.href}/`);
  return (
    <Link
      href={props.href}
      className={[
        'block px-3 py-2 rounded-lg text-sm',
        active ? 'bg-brand/15 text-brand font-medium' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      ].join(' ')}
    >
      {props.label}
    </Link>
  );
}

type NavItem = { href: string; label: string; roles: string[] };

/** Sidebar nav: each item lists roles that may access it. Matches backend @Roles() (pickups/lots/booking/anomalies/incentives=ADMIN; reference/brands=ADMIN|BRAND; epr/export=BRAND; recycler=RECYCLER). */
const NAV_ITEMS: NavItem[] = [
  { href: '/citizen', label: 'Dashboard', roles: ['CITIZEN'] },
  { href: '/', label: 'Home', roles: ['ADMIN', 'FIELD_CAPTAIN', 'RECYCLER', 'BRAND', 'COORDINATOR', 'CITIZEN'] },
  { href: '/login', label: 'Sign in', roles: ['ADMIN', 'FIELD_CAPTAIN', 'RECYCLER', 'BRAND', 'COORDINATOR', 'CITIZEN'] },
  // Field
  { href: '/captain/intake', label: 'Hub intake', roles: ['ADMIN', 'FIELD_CAPTAIN', 'COORDINATOR'] },
  { href: '/captain/lots', label: 'Create lot', roles: ['ADMIN', 'FIELD_CAPTAIN', 'COORDINATOR'] },
  // Admin
  { href: '/admin/pickups', label: 'Pickups', roles: ['ADMIN', 'COORDINATOR'] },
  { href: '/admin/lots', label: 'Lots', roles: ['ADMIN', 'COORDINATOR'] },
  { href: '/admin/booking-requests', label: 'Booking requests', roles: ['ADMIN', 'COORDINATOR'] },
  { href: '/admin/sell-requests', label: 'Sell requests (citizen)', roles: ['ADMIN', 'COORDINATOR'] },
  { href: '/admin/anomalies', label: 'Anomalies', roles: ['ADMIN', 'COORDINATOR'] },
  { href: '/admin/incentives', label: 'Incentives', roles: ['ADMIN', 'COORDINATOR'] },
  // Recycler / Brand
  { href: '/recycler/intake', label: 'Confirm intake', roles: ['ADMIN', 'RECYCLER'] },
  { href: '/brand/epr-export', label: 'EPR export', roles: ['ADMIN', 'BRAND'] },
  { href: '/audit/verify', label: 'Audit verify', roles: ['ADMIN', 'COORDINATOR', 'RECYCLER', 'BRAND'] },
];

function getSectionTitle(href: string): string | null {
  if (href === '/' || href === '/login') return null;
  if (href.startsWith('/captain')) return 'Collection & hub';
  if (href.startsWith('/admin')) return 'Operations';
  if (href.startsWith('/recycler') || href.startsWith('/brand')) return 'Recycling & EPR';
  if (href.startsWith('/audit')) return 'Audit & compliance';
  return null;
}

function groupBySection(role: string) {
  const allowed = NAV_ITEMS.filter((item) => item.roles.includes(role));
  const sections: { title?: string; items: NavItem[] }[] = [];
  let current: { title?: string; items: NavItem[] } = { items: [] };
  let lastTitle: string | null = null;

  allowed.forEach((item) => {
    const title = getSectionTitle(item.href);
    if (title !== lastTitle) {
      if (current.items.length) sections.push(current);
      current = { title: title ?? undefined, items: [] };
      lastTitle = title;
    }
    current.items.push(item);
  });
  if (current.items.length) sections.push(current);
  return sections;
}

export function AppShell(props: { title: string; children: React.ReactNode }) {
  const [user, setUser] = useState<{ id: string; email: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    api.auth
      .me()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [pathname]);

  const sections = user ? groupBySection(user.role) : [];
  const showAll = !user || loading;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6 p-4 md:p-8">
        <aside className="rounded-xl border border-slate-200 bg-white shadow-sm p-4">
          <div className="text-sm font-semibold text-brand mb-4">
            {props.title}
          </div>
          {user && !loading && (
            <p className="text-xs text-slate-500 mb-3 truncate" title={user.email}>
              {user.email} · {getRoleDisplayName(user.role)}
            </p>
          )}
          <nav className="space-y-1">
            {showAll ? (
              <>
                <NavLink href="/" label="Home" />
                <NavLink href="/login" label="Sign in" />
                <div className="text-xs uppercase tracking-wide text-slate-400 mt-2 mb-1">Collection & hub</div>
                <NavLink href="/captain/intake" label="Hub intake" />
                <NavLink href="/captain/lots" label="Create lot" />
                <div className="text-xs uppercase tracking-wide text-slate-400 mt-4 mb-1">Operations</div>
                <NavLink href="/admin/pickups" label="Pickups" />
                <NavLink href="/admin/lots" label="Lots" />
                <NavLink href="/admin/booking-requests" label="Booking requests" />
                <NavLink href="/admin/anomalies" label="Anomalies" />
                <NavLink href="/admin/incentives" label="Incentives" />
                <div className="text-xs uppercase tracking-wide text-slate-400 mt-4 mb-1">Recycling & EPR</div>
                <NavLink href="/recycler/intake" label="Confirm intake" />
                <NavLink href="/brand/epr-export" label="EPR export" />
                <div className="text-xs uppercase tracking-wide text-slate-400 mt-4 mb-1">Audit & compliance</div>
                <NavLink href="/audit/verify" label="Audit verify" />
              </>
            ) : (
              sections.map((section, i) => (
                <div key={section.title ?? i}>
                  {section.title && (
                    <div className="text-xs uppercase tracking-wide text-slate-400 mt-4 mb-1">
                      {section.title}
                    </div>
                  )}
                  {section.items.map((item) => {
                    const isSignIn = item.href === '/login';
                    const link = isSignIn && user ? { href: '/signout', label: 'Sign out' } : { href: item.href, label: item.label };
                    return <NavLink key={link.href} href={link.href} label={link.label} />;
                  })}
                </div>
              ))
            )}
          </nav>
        </aside>
        <section className="rounded-xl border border-slate-200 bg-white shadow-sm p-6">
          {props.children}
        </section>
      </div>
    </div>
  );
}
