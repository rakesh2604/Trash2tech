'use client';

import { useEffect } from 'react';
import { AUTH_TOKEN_KEY } from '../../lib/api';

export default function SignOutPage() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(AUTH_TOKEN_KEY);
    document.cookie = `${AUTH_TOKEN_KEY}=; path=/; max-age=0`;
    window.location.href = '/';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--app-bg)]">
      <p className="text-white/70">Signing out…</p>
    </div>
  );
}
