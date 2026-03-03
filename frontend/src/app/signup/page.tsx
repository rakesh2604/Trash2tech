'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PublicHeader } from '../../components/landing/PublicHeader';
import { api, AUTH_TOKEN_KEY, getDashboardPathForRole } from '../../lib/api';
import { SIGNUP_ROLES } from '../../lib/roles';

const COOKIE_MAX_AGE_DAYS = 1;
const spring = { type: 'spring' as const, stiffness: 120, damping: 18 };

function setAuthCookie(token: string) {
  const maxAge = COOKIE_MAX_AGE_DAYS * 24 * 60 * 60;
  document.cookie = `${AUTH_TOKEN_KEY}=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function getErrorMessage(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);
  if (msg === 'Failed to fetch' || /network|connection refused|ERR_CONNECTION_REFUSED/i.test(msg)) {
    return 'Cannot reach the API. Check that the backend is running and NEXT_PUBLIC_API_BASE_URL is set correctly.';
  }
  if (msg.includes('404')) {
    return 'API not found. Check that the backend URL is correct.';
  }
  if (err instanceof Error) {
    if (msg.includes('401')) return 'Registration request was rejected. Make sure the backend allows public signup and try again.';
    if (msg.includes('403')) return 'Registration is by invitation only. Only administrators can create new accounts. Please contact your operations manager.';
    if (msg.includes('409')) {
      try {
        const json = msg.replace(/^[^:]*:\s*/, '');
        const body = JSON.parse(json);
        if (body?.message) return body.message;
      } catch {
        // ignore
      }
      return 'Email or phone already registered.';
    }
    return msg;
  }
  return msg || 'Registration failed';
}

export default function SignUpPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'CITIZEN',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.auth.register({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
        role: form.role,
      });
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
              Create account
            </h1>
            <p className="mt-2 text-white/70">
              New accounts are typically created by your administrator. If you have an invite code or admin access, use this form.
            </p>
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white/80">
                  Full name
                </label>
                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                  autoComplete="name"
                  className="input-glass mt-1"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/80">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  required
                  autoComplete="email"
                  className="input-glass mt-1"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-white/80">
                  Phone
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  required
                  autoComplete="tel"
                  className="input-glass mt-1"
                  placeholder="10-digit mobile"
                />
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-white/80">
                  Role
                </label>
                <select
                  id="role"
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                  className="input-glass mt-1"
                >
                  {SIGNUP_ROLES.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white/80">
                  Password (min 8 characters)
                </label>
                <div className="mt-1 flex rounded-xl border border-white/10 bg-white/5 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-400/30 transition-all duration-200">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    required
                    minLength={8}
                    autoComplete="new-password"
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
                {loading ? 'Creating account…' : 'Create account'}
              </button>
            </form>
            <p className="mt-6 text-center text-sm text-white/70">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-eco hover:underline focus-visible:outline focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1220] rounded">
                Sign in
              </Link>
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
