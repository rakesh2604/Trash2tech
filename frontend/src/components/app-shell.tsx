'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Home,
  LogIn,
  LogOut,
  Package,
  Layers,
  Truck,
  CalendarCheck,
  ShoppingBag,
  AlertTriangle,
  Gift,
  PackageCheck,
  FileDown,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';
import { api } from '../lib/api';
import { getRoleDisplayName } from '../lib/roles';

type NavItem = { href: string; label: string; roles: string[]; icon: LucideIcon };

function NavLink(props: { href: string; label: string; icon: LucideIcon }) {
  const pathname = usePathname();
  const active = pathname === props.href || pathname?.startsWith(`${props.href}/`);
  const Icon = props.icon;
  return (
    <Link
      href={props.href}
      className={[
        'flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all duration-200',
        active
          ? 'bg-eco/15 text-eco font-medium shadow-[0_0_20px_rgba(34,197,94,0.12)]'
          : 'text-white/80 hover:bg-white/10 hover:text-white',
      ].join(' ')}
    >
      <Icon className="w-4 h-4 shrink-0" aria-hidden />
      {props.label}
    </Link>
  );
}

/** Sidebar nav: each item lists roles that may access it. Matches backend @Roles(). */
const NAV_ITEMS: NavItem[] = [
  { href: '/citizen', label: 'Dashboard', roles: ['CITIZEN'], icon: LayoutDashboard },
  { href: '/', label: 'Home', roles: ['ADMIN', 'FIELD_CAPTAIN', 'RECYCLER', 'BRAND', 'COORDINATOR', 'CITIZEN'], icon: Home },
  { href: '/login', label: 'Sign in', roles: ['ADMIN', 'FIELD_CAPTAIN', 'RECYCLER', 'BRAND', 'COORDINATOR', 'CITIZEN'], icon: LogIn },
  { href: '/captain/intake', label: 'Hub intake', roles: ['ADMIN', 'FIELD_CAPTAIN', 'COORDINATOR'], icon: Package },
  { href: '/captain/lots', label: 'Create lot', roles: ['ADMIN', 'FIELD_CAPTAIN', 'COORDINATOR'], icon: Layers },
  { href: '/admin/pickups', label: 'Pickups', roles: ['ADMIN', 'COORDINATOR'], icon: Truck },
  { href: '/admin/lots', label: 'Lots', roles: ['ADMIN', 'COORDINATOR'], icon: Layers },
  { href: '/admin/booking-requests', label: 'Booking requests', roles: ['ADMIN', 'COORDINATOR'], icon: CalendarCheck },
  { href: '/admin/sell-requests', label: 'Sell requests (citizen)', roles: ['ADMIN', 'COORDINATOR'], icon: ShoppingBag },
  { href: '/admin/anomalies', label: 'Anomalies', roles: ['ADMIN', 'COORDINATOR'], icon: AlertTriangle },
  { href: '/admin/incentives', label: 'Incentives', roles: ['ADMIN', 'COORDINATOR'], icon: Gift },
  { href: '/recycler/intake', label: 'Confirm intake', roles: ['ADMIN', 'RECYCLER'], icon: PackageCheck },
  { href: '/brand/epr-export', label: 'EPR export', roles: ['ADMIN', 'BRAND'], icon: FileDown },
  { href: '/audit/verify', label: 'Audit verify', roles: ['ADMIN', 'COORDINATOR', 'RECYCLER', 'BRAND'], icon: ShieldCheck },
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
    <div className="min-h-screen bg-[var(--app-bg)] text-white">
      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] min-h-screen">
        {/* Glass sidebar */}
        <aside
          className="p-4 md:p-5 border-r border-white/10"
          style={{
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        >
          <div className="text-sm font-semibold text-eco mb-4">
            {props.title}
          </div>
          {user && !loading && (
            <p className="text-xs text-white/60 mb-3 truncate" title={user.email}>
              {user.email} · {getRoleDisplayName(user.role)}
            </p>
          )}
          <nav className="space-y-0.5">
            {showAll ? (
              <>
                <NavLink href="/" label="Home" icon={Home} />
                <NavLink href="/login" label="Sign in" icon={LogIn} />
                <div className="text-xs uppercase tracking-wide text-white/50 mt-4 mb-1 px-3">Collection & hub</div>
                <NavLink href="/captain/intake" label="Hub intake" icon={Package} />
                <NavLink href="/captain/lots" label="Create lot" icon={Layers} />
                <div className="text-xs uppercase tracking-wide text-white/50 mt-4 mb-1 px-3">Operations</div>
                <NavLink href="/admin/pickups" label="Pickups" icon={Truck} />
                <NavLink href="/admin/lots" label="Lots" icon={Layers} />
                <NavLink href="/admin/booking-requests" label="Booking requests" icon={CalendarCheck} />
                <NavLink href="/admin/sell-requests" label="Sell requests (citizen)" icon={ShoppingBag} />
                <NavLink href="/admin/anomalies" label="Anomalies" icon={AlertTriangle} />
                <NavLink href="/admin/incentives" label="Incentives" icon={Gift} />
                <div className="text-xs uppercase tracking-wide text-white/50 mt-4 mb-1 px-3">Recycling & EPR</div>
                <NavLink href="/recycler/intake" label="Confirm intake" icon={PackageCheck} />
                <NavLink href="/brand/epr-export" label="EPR export" icon={FileDown} />
                <div className="text-xs uppercase tracking-wide text-white/50 mt-4 mb-1 px-3">Audit & compliance</div>
                <NavLink href="/audit/verify" label="Audit verify" icon={ShieldCheck} />
              </>
            ) : (
              sections.map((section, i) => (
                <div key={section.title ?? i}>
                  {section.title && (
                    <div className="text-xs uppercase tracking-wide text-white/50 mt-4 mb-1 px-3">
                      {section.title}
                    </div>
                  )}
                  {section.items.map((item) => {
                    const isSignIn = item.href === '/login';
                    const link = isSignIn && user
                      ? { href: '/signout', label: 'Sign out', icon: LogOut as LucideIcon }
                      : { href: item.href, label: item.label, icon: item.icon };
                    return <NavLink key={link.href} href={link.href} label={link.label} icon={link.icon} />;
                  })}
                </div>
              ))
            )}
          </nav>
        </aside>

        {/* Main: top bar + content */}
        <div className="flex flex-col min-h-0">
          {/* Top bar */}
          <header
            className="shrink-0 border-b border-white/10 px-4 md:px-6 py-3 flex items-center justify-between"
            style={{
              background: 'rgba(255,255,255,0.03)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}
          >
            <h1 className="text-base font-semibold text-white truncate">
              {props.title}
            </h1>
            {user && !loading && (
              <span className="text-xs text-white/60 truncate max-w-[140px] md:max-w-[200px]" title={user.email}>
                {user.email}
              </span>
            )}
          </header>

          {/* Content area - slightly darker, no white card */}
          <section className="flex-1 overflow-auto p-4 md:p-6 bg-[var(--app-bg)]">
            {props.children}
          </section>
        </div>
      </div>
    </div>
  );
}
