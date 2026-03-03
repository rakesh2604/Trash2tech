'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PublicHeader } from '../../components/landing/PublicHeader';
import { api, AUTH_TOKEN_KEY, getDashboardPathForRole } from '../../lib/api';

const COOKIE_MAX_AGE_DAYS = 1;
const spring = { type: 'spring' as const, stiffness: 120, damping: 18 };

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
    <div className="min-h-screen flex flex-col bg-eco-gradient text-white">
      {/* Subtle eco radial glow behind card */}
      <div
        className="fixed inset-0 pointer-events-none"
        aria-hidden
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 40%, rgba(34,197,94,0.12) 0%, transparent 60%)',
        }}
      />
      <PublicHeader />
      <main id="main-content" className="relative flex-1 flex items-center justify-center px-4 py-12 sm:py-16" tabIndex={-1}>
        <div className="w-full max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={spring}
            className="glass-card rounded-2xl p-10 shadow-[0_0_25px_rgba(34,197,94,0.15)]"
          >
            <div className="relative z-10">
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Sign in
            </h1>
            <p className="mt-2 text-white/70">
              Access the operations dashboard, field console, or EPR portal.
            </p>
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/80">
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
                  className="input-glass mt-1"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white/80">
                  Password
                </label>
                <div className="mt-1 flex rounded-xl border border-white/10 bg-white/5 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-400/30 transition-all duration-200">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    maxLength={128}
                    autoComplete="current-password"
                    className="min-w-0 flex-1 rounded-xl border-0 bg-transparent px-3 py-2.5 text-white placeholder-white/40 focus:outline-none"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="px-3 py-2 text-sm font-medium text-white/60 hover:text-white/80 focus:outline-none rounded-r-xl focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-inset"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
              {error && (
                <p className="text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2" role="alert">
                  {error}
                </p>
              )}
              <button type="submit" disabled={loading} className="btn-glass-primary w-full py-3 text-base">
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
            </form>
            <p className="mt-6 text-center text-sm text-white/70">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="font-medium text-eco hover:underline focus-visible:outline focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1220] rounded">
                Sign up
              </Link>
              {' '}(or contact your administrator for an invite).
            </p>
            </div>
          </motion.div>
          <p className="mt-6 text-center">
            <Link href="/" className="text-sm text-white/70 hover:text-white focus-visible:outline focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1220] rounded">
              ← Back to home
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
