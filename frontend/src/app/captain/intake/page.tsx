'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '../../../components/app-shell';
import { LoginRequired } from '../../../components/login-required';
import { api } from '../../../lib/api';
import { getRoleDisplayName } from '../../../lib/roles';
import { offlineQueue } from '../../../lib/offline-queue';

function uid() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export default function CaptainIntakePage() {
  const [form, setForm] = useState({
    pickupId: '',
    hubId: '',
    fieldCaptainUserId: '',
    kabadiId: '',
    materialCategoryId: '',
    hubWeightKg: '',
    photoUrl: '',
    geoPoint: '',
    remarks: '',
  });
  const [hubs, setHubs] = useState<{ id: string; name: string; city: string; pincode: string }[]>([]);
  const [categories, setCategories] = useState<{ id: string; code: string; description: string }[]>([]);
  const [users, setUsers] = useState<{ id: string; name: string; phone: string; role: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [authFailed, setAuthFailed] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const weighedAt = new Date().toISOString();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [hubsRes, catsRes, usersRes] = await Promise.all([
          api.reference.hubs(),
          api.reference.materialCategories(),
          api.reference.users(),
        ]);
        if (cancelled) return;
        setHubs(hubsRes);
        setCategories(catsRes);
        setUsers(usersRes);
        setForm((f) => ({
          ...f,
          ...(hubsRes.length && !f.hubId && { hubId: hubsRes[0].id }),
          ...(catsRes.length && !f.materialCategoryId && { materialCategoryId: catsRes[0].id }),
          ...(usersRes.length && !f.fieldCaptainUserId && { fieldCaptainUserId: usersRes[0].id }),
        }));
      } catch (err: unknown) {
        if (!cancelled) {
          const msg = err instanceof Error ? err.message : String(err);
          if (msg.includes('401') || msg.includes('403')) setAuthFailed(true);
          else setStatus('Failed to load hubs/categories/users.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  async function submit() {
    setStatus(null);
    const body = {
      pickupId: form.pickupId,
      hubId: form.hubId,
      fieldCaptainUserId: form.fieldCaptainUserId,
      kabadiId: form.kabadiId || undefined,
      materialCategoryId: form.materialCategoryId,
      hubWeightKg: form.hubWeightKg,
      photoUrl: form.photoUrl || 'https://example.com/photo.jpg',
      geoPoint: form.geoPoint || undefined,
      remarks: form.remarks || undefined,
      weighedAt,
    };

    try {
      await api.hubIntake.record(body);
      setStatus('Recorded hub intake. Use the returned intake record ID when creating a lot.');
    } catch (e: unknown) {
      offlineQueue.add({
        id: uid(),
        createdAt: new Date().toISOString(),
        request: { method: 'POST', path: '/hub-intake', body },
      });
      setStatus('Offline or API unreachable. Saved to offline queue.');
    }
  }

  if (authFailed) return <LoginRequired />;
  if (loading) {
    return (
      <AppShell title="E-waste Console">
        <h2 className="text-lg font-semibold mb-1">Hub intake</h2>
        <p className="text-sm text-slate-600">Loading options…</p>
      </AppShell>
    );
  }

  return (
    <AppShell title="E-waste Console">
      <h2 className="text-lg font-semibold mb-1">Hub intake</h2>
      <p className="text-sm text-slate-600 mb-6">
        Record weight + category + photo proof at the hub. If offline, it queues locally.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Pickup ID (UUID) *</label>
          <input
            required
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 min-h-[44px] focus:border-brand focus:ring-1 focus:ring-brand"
            placeholder="From Create pickup response"
            value={form.pickupId}
            onChange={(e) => setForm((f) => ({ ...f, pickupId: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Hub *</label>
          <select
            required
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 min-h-[44px] focus:border-brand focus:ring-1 focus:ring-brand"
            value={form.hubId}
            onChange={(e) => setForm((f) => ({ ...f, hubId: e.target.value }))}
          >
            <option value="">Select hub</option>
            {hubs.map((h) => (
              <option key={h.id} value={h.id}>{h.name} — {h.city}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Officer (who is recording) *</label>
          <select
            required
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 min-h-[44px] focus:border-brand focus:ring-1 focus:ring-brand"
            value={form.fieldCaptainUserId}
            onChange={(e) => setForm((f) => ({ ...f, fieldCaptainUserId: e.target.value }))}
          >
            <option value="">Select user</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.name} ({getRoleDisplayName(u.role)})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Material category *</label>
          <select
            required
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 min-h-[44px] focus:border-brand focus:ring-1 focus:ring-brand"
            value={form.materialCategoryId}
            onChange={(e) => setForm((f) => ({ ...f, materialCategoryId: e.target.value }))}
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.code} — {c.description}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Hub weight (kg) *</label>
          <input
            required
            type="text"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 min-h-[44px] focus:border-brand focus:ring-1 focus:ring-brand"
            placeholder="e.g. 12.500"
            value={form.hubWeightKg}
            onChange={(e) => setForm((f) => ({ ...f, hubWeightKg: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Photo URL *</label>
          <input
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 min-h-[44px] focus:border-brand focus:ring-1 focus:ring-brand"
            placeholder="https://..."
            value={form.photoUrl}
            onChange={(e) => setForm((f) => ({ ...f, photoUrl: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Kabadi ID (optional)</label>
          <input
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-brand focus:ring-1 focus:ring-brand"
            value={form.kabadiId}
            onChange={(e) => setForm((f) => ({ ...f, kabadiId: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Remarks (optional)</label>
          <input
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-brand focus:ring-1 focus:ring-brand"
            value={form.remarks}
            onChange={(e) => setForm((f) => ({ ...f, remarks: e.target.value }))}
          />
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={submit}
          className="min-h-[44px] rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-light"
        >
          Submit intake
        </button>
        <span className="text-sm text-slate-500">Weighed at: {weighedAt.slice(0, 19)}Z</span>
      </div>

      {status ? <div className="mt-4 text-sm text-slate-700">{status}</div> : null}
    </AppShell>
  );
}
