'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppShell } from '../../../components/app-shell';
import { LoginRequired } from '../../../components/login-required';
import { api } from '../../../lib/api';

const SOURCE_CHANNELS = ['ADMIN', 'WHATSAPP', 'IVR', 'WEB_FORM'] as const;
const CITIZEN_TYPES = ['INDIVIDUAL', 'SOCIETY_REP', 'COLLEGE', 'SME', 'CORPORATE'] as const;

type FormState = {
  hubId: string;
  sourceChannel: string;
  citizenType: string;
  citizenName: string;
  citizenPhone: string;
  line1: string;
  line2: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  primaryCategoryId: string;
  notes: string;
};

const initialForm: FormState = {
  hubId: '',
  sourceChannel: 'ADMIN',
  citizenType: 'INDIVIDUAL',
  citizenName: '',
  citizenPhone: '',
  line1: '',
  line2: '',
  landmark: '',
  city: 'Mumbai',
  state: 'Maharashtra',
  pincode: '',
  primaryCategoryId: '',
  notes: '',
};

export default function AdminCreatePickupPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [hubs, setHubs] = useState<{ id: string; name: string; city: string; pincode: string }[]>([]);
  const [categories, setCategories] = useState<{ id: string; code: string; description: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [authFailed, setAuthFailed] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'idle' | 'success' | 'error'; message?: string }>({ type: 'idle' });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [hubsRes, catsRes] = await Promise.all([
          api.reference.hubs(),
          api.reference.materialCategories(),
        ]);
        if (cancelled) return;
        setHubs(hubsRes);
        setCategories(catsRes);
        setForm((f) => ({
          ...f,
          ...(hubsRes.length && !f.hubId && { hubId: hubsRes[0].id }),
          ...(catsRes.length && !f.primaryCategoryId && { primaryCategoryId: catsRes[0].id }),
        }));
      } catch (err: unknown) {
        if (!cancelled) {
          const msg = err instanceof Error ? err.message : String(err);
          if (msg.includes('401') || msg.includes('403')) setAuthFailed(true);
          else setSubmitStatus({ type: 'error', message: 'Failed to load hubs/categories.' });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitStatus({ type: 'idle' });
    if (!form.hubId || !form.line1.trim() || !form.city.trim() || !form.state.trim() || !form.pincode.trim()) {
      setSubmitStatus({ type: 'error', message: 'Hub and address (line1, city, state, pincode) are required.' });
      return;
    }
    try {
      const result = await api.pickups.create({
        hubId: form.hubId,
        sourceChannel: form.sourceChannel,
        citizenType: form.citizenType,
        citizenName: form.citizenName || undefined,
        citizenPhone: form.citizenPhone || undefined,
        address: {
          line1: form.line1.trim(),
          line2: form.line2.trim() || undefined,
          landmark: form.landmark.trim() || undefined,
          city: form.city.trim(),
          state: form.state.trim(),
          pincode: form.pincode.trim(),
        },
        primaryCategoryId: form.primaryCategoryId || undefined,
        notes: form.notes.trim() || undefined,
      });
      setSubmitStatus({
        type: 'success',
        message: `Pickup created: ${(result as { pickupCode?: string }).pickupCode ?? result.id}. Use this ID for hub intake.`,
      });
      setForm({ ...initialForm, hubId: form.hubId, primaryCategoryId: form.primaryCategoryId });
    } catch (err: unknown) {
      setSubmitStatus({
        type: 'error',
        message: err instanceof Error ? err.message : 'Create pickup failed.',
      });
    }
  }

  if (authFailed) return <LoginRequired />;
  if (loading) {
    return (
      <AppShell title="E-waste Console">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">Create pickup</h2>
        <p className="text-sm text-slate-600 mt-1">Loading hubs and categories…</p>
      </AppShell>
    );
  }

  return (
    <AppShell title="E-waste Console">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/admin/pickups"
          className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          ← Pickups
        </Link>
      </div>
      <h2 className="text-xl font-bold tracking-tight text-slate-900">Create pickup</h2>
      <p className="text-sm text-slate-600 mt-1 mb-6">
        Create a new pickup (admin). Then use Field Captain hub intake with the returned pickup code.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Hub *</label>
          <select
            required
            className="input-base min-h-[44px]"
            value={form.hubId}
            onChange={(e) => setForm((f) => ({ ...f, hubId: e.target.value }))}
          >
            <option value="">Select hub</option>
            {hubs.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name} — {h.city} {h.pincode}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Source channel</label>
            <select
              className="input-base min-h-[44px]"
              value={form.sourceChannel}
              onChange={(e) => setForm((f) => ({ ...f, sourceChannel: e.target.value }))}
            >
              {SOURCE_CHANNELS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Citizen type</label>
            <select
              className="input-base min-h-[44px]"
              value={form.citizenType}
              onChange={(e) => setForm((f) => ({ ...f, citizenType: e.target.value }))}
            >
              {CITIZEN_TYPES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Citizen name</label>
            <input
              className="input-base"
              value={form.citizenName}
              onChange={(e) => setForm((f) => ({ ...f, citizenName: e.target.value }))}
              placeholder="Optional"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Citizen phone</label>
            <input
              className="input-base"
              value={form.citizenPhone}
              onChange={(e) => setForm((f) => ({ ...f, citizenPhone: e.target.value }))}
              placeholder="Optional"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Address line 1 *</label>
          <input
            required
            className="input-base"
            value={form.line1}
            onChange={(e) => setForm((f) => ({ ...f, line1: e.target.value }))}
            placeholder="Street / building"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Line 2</label>
            <input
              className="input-base"
              value={form.line2}
              onChange={(e) => setForm((f) => ({ ...f, line2: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Landmark</label>
            <input
              className="input-base"
              value={form.landmark}
              onChange={(e) => setForm((f) => ({ ...f, landmark: e.target.value }))}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">City *</label>
            <input
              required
              className="input-base"
              value={form.city}
              onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">State *</label>
            <input
              required
              className="input-base"
              value={form.state}
              onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Pincode *</label>
            <input
              required
              className="input-base"
              value={form.pincode}
              onChange={(e) => setForm((f) => ({ ...f, pincode: e.target.value }))}
              placeholder="e.g. 400069"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Material category</label>
          <select
            className="input-base min-h-[44px]"
            value={form.primaryCategoryId}
            onChange={(e) => setForm((f) => ({ ...f, primaryCategoryId: e.target.value }))}
          >
            <option value="">None</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code} — {c.description}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
          <textarea
            className="input-base min-h-[80px]"
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
          />
        </div>
        {submitStatus.type === 'success' && (
          <p className="text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2 border border-green-200">{submitStatus.message}</p>
        )}
        {submitStatus.type === 'error' && (
          <p className="text-sm text-red-700 bg-red-50 rounded-lg px-3 py-2 border border-red-200">{submitStatus.message}</p>
        )}
        <div className="flex flex-wrap gap-3 pt-2">
          <button type="submit" className="btn-primary">
            Create pickup
          </button>
          <Link href="/admin/pickups" className="btn-secondary">
            Back to Pickups
          </Link>
        </div>
      </form>
    </AppShell>
  );
}
