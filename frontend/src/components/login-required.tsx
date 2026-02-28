import Link from 'next/link';
import { AppShell } from './app-shell';

export function LoginRequired() {
  return (
    <AppShell title="E-waste Console">
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center">
        <h2 className="text-lg font-semibold text-slate-900">Login required</h2>
        <p className="mt-2 text-sm text-slate-600">
          This page requires authentication. Sign in to continue.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-lg bg-brand px-6 py-3 font-medium text-white hover:bg-brand-light transition-colors"
        >
          Go to login
        </Link>
      </div>
    </AppShell>
  );
}
