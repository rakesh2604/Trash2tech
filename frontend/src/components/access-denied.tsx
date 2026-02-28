import Link from 'next/link';
import { AppShell } from './app-shell';

export function AccessDenied() {
  return (
    <AppShell title="E-waste Console">
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-8 text-center">
        <h2 className="text-lg font-semibold text-slate-900">Access denied</h2>
        <p className="mt-2 text-sm text-slate-600">
          You don&apos;t have permission to view this page. Use the menu to open a page for your role, or sign in with a different account.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex min-h-[44px] items-center justify-center rounded-lg border-2 border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/login"
            className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-brand px-6 py-3 font-medium text-white hover:bg-brand-light transition-colors"
          >
            Sign in again
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
