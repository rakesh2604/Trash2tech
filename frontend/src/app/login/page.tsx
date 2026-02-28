'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PublicHeader } from '../../components/landing/PublicHeader';
import { api, AUTH_TOKEN_KEY, getDashboardPathForRole } from '../../lib/api';

const COOKIE_MAX_AGE_DAYS = 1;

function setAuthCookie(token: string) {
  const maxAge = COOKIE_MAX_AGE_DAYS * 24 * 60 * 60;
  document.cookie = `${AUTH_TOKEN_KEY}=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function getErrorMessage(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);
  if (msg === 'Failed to fetch' || /network|connection refused|ERR_CONNECTION_REFUSED/i.test(msg)) {
    return 'Cannot reach the API. Start the backend first: open a terminal, run cd backend && npm run dev (it should listen on port 3001). Then refresh this page.';
  }
  if (msg.includes('404')) {
    return 'API not found. Check that the backend URL is correct.';
  }
  if (err instanceof Error && msg.includes('401')) {
    try {
      const json = msg.replace(/^[^:]*:\s*/, '');
      const body = JSON.parse(json);
      if (body?.message) return body.message;
    } catch {
      // ignore
    }
    return 'Invalid email or password.';
  }
  return msg || 'Login failed';
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    try {
      const res = await api.auth.login({ email: trimmedEmail, password: trimmedPassword });
      localStorage.setItem(AUTH_TOKEN_KEY, res.accessToken);
      setAuthCookie(res.accessToken);
      const dashboardPath = getDashboardPathForRole(res.user.role);
      window.location.href = dashboardPath;
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <PublicHeader />
      <main id="main-content" className="flex-1 flex items-center justify-center px-4 py-12 sm:py-16" tabIndex={-1}>
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Sign in
            </h1>
            <p className="mt-2 text-slate-600">
              Access the operations dashboard, field console, or EPR portal.
            </p>
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  maxLength={255}
                  autoComplete="email"
                  className="input-base mt-1"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                  Password
                </label>
                <div className="mt-1 flex rounded-lg border border-slate-300 bg-white focus-within:ring-1 focus-within:ring-brand focus-within:border-brand">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    maxLength={128}
                    autoComplete="current-password"
                    className="min-w-0 flex-1 rounded-lg border-0 bg-transparent px-3 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="px-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 focus:outline-none rounded-r-lg"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
              {error && (
                <p className="text-sm text-red-700 bg-red-50 rounded-lg px-3 py-2 border border-red-100" role="alert">
                  {error}
                </p>
              )}
              <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
            </form>
            <p className="mt-6 text-center text-sm text-slate-600">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="font-medium text-brand hover:text-brand-light">
                Sign up
              </Link>
              {' '}(or contact your administrator for an invite).
            </p>
          </div>
          <p className="mt-6 text-center">
            <Link href="/" className="text-sm text-slate-500 hover:text-slate-700 focus-visible:outline focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 rounded">
              ← Back to home
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
