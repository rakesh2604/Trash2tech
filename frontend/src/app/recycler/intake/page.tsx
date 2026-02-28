'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '../../../components/app-shell';
import { LoginRequired } from '../../../components/login-required';
import { api } from '../../../lib/api';
import { getRoleDisplayName } from '../../../lib/roles';

const VARIANCE_REASONS = ['NORMAL_LOSS', 'SCALE_DIFF', 'SUSPECTED_FRAUD', 'OTHER'] as const;

export default function RecyclerIntakePage() {
  const [form, setForm] = useState({
    lotId: '',
    recyclerId: '',
    receivedWeightKg: '',
    receivedTime: new Date().toISOString().slice(0, 23),
    varianceReason: 'NORMAL_LOSS' as (typeof VARIANCE_REASONS)[number],
    confirmedByUserId: '',
    assayReportUrl: '',
  });
  const [lots, setLots] = useState<{ id: string; lotCode: string; status: string }[]>([]);
  const [recyclers, setRecyclers] = useState<{ id: string; name: string; city: string }[]>([]);
  const [users, setUsers] = useState<{ id: string; name: string; phone: string; role: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [authFailed, setAuthFailed] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [lotsRes, recyclersRes, usersRes] = await Promise.all([
          api.lots.list({ status: 'IN_TRANSIT', limit: 100 }).catch(() => []),
          api.reference.recyclers(),
          api.reference.users(),
        ]);
        if (cancelled) return;
        setLots(Array.isArray(lotsRes) ? (lotsRes as { id: string; lotCode: string; status: string }[]) : []);
        setRecyclers(recyclersRes);
        setUsers(usersRes);
        setForm((f) => ({
          ...f,
          ...(recyclersRes.length && !f.recyclerId && { recyclerId: recyclersRes[0].id }),
          ...(usersRes.length && !f.confirmedByUserId && { confirmedByUserId: usersRes[0].id }),
        }));
      } catch (err: unknown) {
        if (!cancelled) {
          const msg = err instanceof Error ? err.message : String(err);
          if (msg.includes('401') || msg.includes('403')) setAuthFailed(true);
          else setError('Failed to load lots/recyclers/users.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  async function submit() {
    setResult(null);
    setError(null);
    try {
      const receivedTimeIso = form.receivedTime.includes('Z')
          ? form.receivedTime
          : `${form.receivedTime.slice(0, 16)}:00.000Z`;
      const intake = await api.recycler.confirmIntake({
        lotId: form.lotId,
        recyclerId: form.recyclerId,
        receivedWeightKg: form.receivedWeightKg,
        receivedTime: receivedTimeIso,
        varianceReason: form.varianceReason,
        confirmedByUserId: form.confirmedByUserId,
        assayReportUrl: form.assayReportUrl || undefined,
      });
      setResult(`Recorded recycler intake. ${(intake as { id?: string }).id ?? 'Done'}`);
      setForm((f) => ({ ...f, receivedWeightKg: '', receivedTime: new Date().toISOString().slice(0, 23) }));
      const lotsRes = await api.lots.list({ status: 'IN_TRANSIT', limit: 100 });
      setLots(lotsRes as { id: string; lotCode: string; status: string }[]);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Confirm intake failed.');
    }
  }

  if (authFailed) return <LoginRequired />;
  if (loading) {
    return (
      <AppShell title="E-waste Console">
        <h2 className="text-lg font-semibold mb-1">Recycler intake</h2>
        <p className="text-sm text-slate-600">Loading options…</p>
      </AppShell>
    );
  }

  return (
    <AppShell title="E-waste Console">
      <h2 className="text-lg font-semibold mb-1">Recycler intake</h2>
      <p className="text-sm text-slate-700 mb-6">
        Confirm received weight at recycler for lots that are IN_TRANSIT.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Lot *</label>
          <select
            required
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-brand focus:ring-1 focus:ring-brand min-h-[44px]"
            value={form.lotId}
            onChange={(e) => setForm((f) => ({ ...f, lotId: e.target.value }))}
          >
            <option value="">Select lot (IN_TRANSIT)</option>
            {lots.map((l) => (
              <option key={l.id} value={l.id}>{l.lotCode ?? l.id}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Recycler *</label>
          <select
            required
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-brand focus:ring-1 focus:ring-brand min-h-[44px]"
            value={form.recyclerId}
            onChange={(e) => setForm((f) => ({ ...f, recyclerId: e.target.value }))}
          >
            <option value="">Select recycler</option>
            {recyclers.map((r) => (
              <option key={r.id} value={r.id}>{r.name} — {r.city}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Received weight (kg) *</label>
          <input
            required
            type="text"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-brand focus:ring-1 focus:ring-brand min-h-[44px]"
            placeholder="e.g. 120.000"
            value={form.receivedWeightKg}
            onChange={(e) => setForm((f) => ({ ...f, receivedWeightKg: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Received time *</label>
          <input
            type="datetime-local"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-brand focus:ring-1 focus:ring-brand min-h-[44px]"
            value={form.receivedTime.slice(0, 16)}
            onChange={(e) => setForm((f) => ({ ...f, receivedTime: e.target.value ? `${e.target.value}:00.000` : new Date().toISOString() }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Variance reason *</label>
          <select
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-brand focus:ring-1 focus:ring-brand min-h-[44px]"
            value={form.varianceReason}
            onChange={(e) => setForm((f) => ({ ...f, varianceReason: e.target.value as (typeof VARIANCE_REASONS)[number] }))}
          >
            {VARIANCE_REASONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Confirmed by (user) *</label>
          <select
            required
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-brand focus:ring-1 focus:ring-brand min-h-[44px]"
            value={form.confirmedByUserId}
            onChange={(e) => setForm((f) => ({ ...f, confirmedByUserId: e.target.value }))}
          >
            <option value="">Select user</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.name} ({getRoleDisplayName(u.role)})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Assay report URL (optional)</label>
          <input
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-brand focus:ring-1 focus:ring-brand"
            value={form.assayReportUrl}
            onChange={(e) => setForm((f) => ({ ...f, assayReportUrl: e.target.value }))}
          />
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={submit}
          className="min-h-[44px] rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-light"
        >
          Confirm intake
        </button>
      </div>

      {error ? <div className="mt-4 text-sm text-red-400">{error}</div> : null}
      {result ? <div className="mt-4 text-sm text-green-400">{result}</div> : null}
    </AppShell>
  );
}
