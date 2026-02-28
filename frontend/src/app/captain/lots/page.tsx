'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '../../../components/app-shell';
import { api } from '../../../lib/api';

export default function CaptainLotsPage() {
  const [form, setForm] = useState({
    hubId: '',
    recyclerId: '',
    materialCategoryId: '',
    hubIntakeRecordIds: [] as string[],
  });
  const [hubs, setHubs] = useState<{ id: string; name: string; city: string }[]>([]);
  const [recyclers, setRecyclers] = useState<{ id: string; name: string; city: string }[]>([]);
  const [categories, setCategories] = useState<{ id: string; code: string; description: string }[]>([]);
  const [availableIntakes, setAvailableIntakes] = useState<{ id: string; weighedAt: string; hubWeightKg: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [hubsRes, recyclersRes, catsRes] = await Promise.all([
          api.reference.hubs(),
          api.reference.recyclers(),
          api.reference.materialCategories(),
        ]);
        if (cancelled) return;
        setHubs(hubsRes);
        setRecyclers(recyclersRes);
        setCategories(catsRes);
        setForm((f) => ({
          ...f,
          ...(hubsRes.length && !f.hubId && { hubId: hubsRes[0].id }),
          ...(recyclersRes.length && !f.recyclerId && { recyclerId: recyclersRes[0].id }),
          ...(catsRes.length && !f.materialCategoryId && { materialCategoryId: catsRes[0].id }),
        }));
      } catch {
        if (!cancelled) setError('Failed to load hubs/recyclers/categories.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!form.hubId) {
      setAvailableIntakes([]);
      setForm((f) => ({ ...f, hubIntakeRecordIds: [] }));
      return;
    }
    api.hubIntakeRecords
      .listAvailable(form.hubId)
      .then(setAvailableIntakes)
      .catch(() => setAvailableIntakes([]));
    setForm((f) => ({ ...f, hubIntakeRecordIds: [] }));
  }, [form.hubId]);

  function toggleIntake(id: string) {
    setForm((f) =>
      f.hubIntakeRecordIds.includes(id)
        ? { ...f, hubIntakeRecordIds: f.hubIntakeRecordIds.filter((x) => x !== id) }
        : { ...f, hubIntakeRecordIds: [...f.hubIntakeRecordIds, id] },
    );
  }

  async function submit() {
    setResult(null);
    setError(null);
    if (form.hubIntakeRecordIds.length === 0) {
      setError('Select at least one hub intake record.');
      return;
    }
    try {
      const lot = await api.lots.create({
        hubId: form.hubId,
        recyclerId: form.recyclerId,
        materialCategoryId: form.materialCategoryId,
        status: 'CREATED',
        hubIntakeRecordIds: form.hubIntakeRecordIds,
      });
      setResult(`Created lot ${(lot as { lotCode?: string }).lotCode ?? lot.id}. Go to Ops: Lots to dispatch.`);
      setForm((f) => ({ ...f, hubIntakeRecordIds: [] }));
      const intakes = await api.hubIntakeRecords.listAvailable(form.hubId);
      setAvailableIntakes(intakes);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Create lot failed.');
    }
  }

  if (loading) {
    return (
      <AppShell title="E-waste Console">
        <h2 className="text-lg font-semibold mb-1">Create lot</h2>
        <p className="text-sm text-slate-600">Loading options…</p>
      </AppShell>
    );
  }

  return (
    <AppShell title="E-waste Console">
      <h2 className="text-lg font-semibold mb-1">Create lot</h2>
      <p className="text-sm text-slate-700 mb-6">
        Group hub intakes into a lot and link pickups for dispatch. Select a hub to see available intakes.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Hub *</label>
          <select
            required
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-brand focus:ring-1 focus:ring-brand min-h-[44px]"
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
          <label className="block text-sm font-medium text-slate-700 mb-1">Material category *</label>
          <select
            required
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-brand focus:ring-1 focus:ring-brand min-h-[44px]"
            value={form.materialCategoryId}
            onChange={(e) => setForm((f) => ({ ...f, materialCategoryId: e.target.value }))}
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.code} — {c.description}</option>
            ))}
          </select>
        </div>
      </div>

      {form.hubId && (
        <div className="mt-6 max-w-xl">
          <label className="block text-sm font-medium text-slate-700 mb-2">Hub intake records (select at least one) *</label>
          {availableIntakes.length === 0 ? (
            <p className="text-sm text-slate-600">No available intakes for this hub. Record hub intakes first.</p>
          ) : (
            <ul className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3 max-h-48 overflow-y-auto">
              {availableIntakes.map((i) => (
                <li key={i.id} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={form.hubIntakeRecordIds.includes(i.id)}
                    onChange={() => toggleIntake(i.id)}
                    className="rounded border-slate-600"
                  />
                  <span className="text-sm text-slate-800">
                    {i.id.slice(0, 8)}… — {i.hubWeightKg} kg — {new Date(i.weighedAt).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="mt-6">
        <button
          onClick={submit}
          className="min-h-[44px] rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-light"
        >
          Create lot
        </button>
      </div>

      {error ? <div className="mt-4 text-sm text-red-400">{error}</div> : null}
      {result ? <div className="mt-4 text-sm text-green-400">{result}</div> : null}
    </AppShell>
  );
}
