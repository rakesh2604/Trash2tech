import Link from 'next/link';
import { AppShell } from './app-shell';

export function AccessDenied() {
  return (
    <AppShell title="E-waste Console">
      <div className="glass-card rounded-2xl p-8 text-center">
        <h2 className="text-lg font-semibold text-white">Access denied</h2>
        <p className="mt-2 text-sm text-white/70">
          You don&apos;t have permission to view this page. Use the menu to open a page for your role, or sign in with a different account.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 py-3 font-medium text-white/90 hover:bg-white/10 transition-colors focus-visible:outline focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--app-bg)]"
          >
            Home
          </Link>
          <Link
            href="/login"
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-gradient-to-r from-eco to-emerald-600 px-6 py-3 font-semibold text-white shadow-[0_0_25px_rgba(34,197,94,0.25)] transition-all hover:scale-[1.02] hover:shadow-[0_0_35px_rgba(34,197,94,0.35)] focus-visible:outline focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--app-bg)]"
          >
            Sign in again
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
