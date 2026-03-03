import Link from 'next/link';
import { AppShell } from './app-shell';

export function LoginRequired() {
  return (
    <AppShell title="E-waste Console">
      <div className="glass-card rounded-2xl p-8 text-center">
        <h2 className="text-lg font-semibold text-white">Login required</h2>
        <p className="mt-2 text-sm text-white/70">
          This page requires authentication. Sign in to continue.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-xl bg-gradient-to-r from-eco to-emerald-600 px-6 py-3 font-semibold text-white shadow-[0_0_25px_rgba(34,197,94,0.25)] transition-all hover:scale-[1.02] hover:shadow-[0_0_35px_rgba(34,197,94,0.35)] focus-visible:outline focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--app-bg)]"
        >
          Go to login
        </Link>
      </div>
    </AppShell>
  );
}
