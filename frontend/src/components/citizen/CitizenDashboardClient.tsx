'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '../../lib/api';

type Campaign = { id: string; name: string; type: string; description?: string | null; startAt: string; endAt: string; bonusPerKgRs: string };
type Category = { id: string; code: string; description: string };
type SellRequest = {
  id: string;
  status: string;
  totalEstimatedKg: string;
  paymentAmountRs?: string | null;
  createdAt: string;
  preferredDateFrom?: string | null;
  preferredDateTo?: string | null;
  alternatePhone?: string | null;
  address?: { line1: string; city: string; pincode: string };
  campaign?: { name: string } | null;
  items?: { materialCategory: { code: string; description: string }; estimatedWeightKg: string; description?: string | null }[];
};

const STATUS_LABELS: Record<string, string> = {
  OPEN: 'Open',
  PICKUP_SCHEDULED: 'Pickup scheduled',
  COLLECTED: 'Collected',
  AT_HUB: 'At hub',
  WEIGHED: 'Weighed',
  PAID: 'Paid',
  IN_LOT: 'In lot',
  RECYCLED: 'Recycled',
  CANCELLED: 'Cancelled',
};

export function CitizenDashboardClient() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [requests, setRequests] = useState<SellRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [form, setForm] = useState({
    address: { line1: '', line2: '', landmark: '', city: '', state: '', pincode: '' },
    campaignId: '' as string,
    items: [{ materialCategoryId: '', estimatedWeightKg: 0.5, description: '' }] as { materialCategoryId: string; estimatedWeightKg: number; description: string }[],
    notes: '',
    preferredDateFrom: '',
    preferredDateTo: '',
    alternatePhone: '',
  });

  useEffect(() => {
    Promise.all([
      api.citizen.campaigns().then(setCampaigns).catch(() => setCampaigns([])),
      api.citizen.materialCategories().then(setCategories).catch(() => setCategories([])),
      api.citizen.sellRequests.list().then(setRequests).catch(() => setRequests([])),
    ]).finally(() => setLoading(false));
  }, []);

  const addItem = () => {
    setForm((f) => ({
      ...f,
      items: [...f.items, { materialCategoryId: '', estimatedWeightKg: 0.5, description: '' }],
    }));
  };
  const removeItem = (i: number) => {
    if (form.items.length <= 1) return;
    setForm((f) => ({ ...f, items: f.items.filter((_, j) => j !== i) }));
  };
  const updateItem = (i: number, field: 'materialCategoryId' | 'estimatedWeightKg' | 'description', value: string | number) => {
    setForm((f) => ({
      ...f,
      items: f.items.map((it, j) => (j === i ? { ...it, [field]: value } : it)),
    }));
  };

  const fillAddressFromLocation = () => {
    setLocationError(null);
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { 'Accept-Language': 'en', 'User-Agent': 'E-Waste-Traceability-Citizen-Form/1.0' } }
          );
          if (!res.ok) throw new Error('Address lookup failed');
          const data = (await res.json()) as {
            address?: {
              road?: string;
              house_number?: string;
              suburb?: string;
              village?: string;
              town?: string;
              city?: string;
              state?: string;
              postcode?: string;
              country?: string;
            };
            display_name?: string;
          };
          const addr = data?.address ?? {};
          const road = [addr.house_number, addr.road].filter(Boolean).join(' ') || addr.road || '';
          const city = addr.city || addr.town || addr.village || addr.suburb || '';
          const state = addr.state || '';
          const pincode = (addr.postcode ?? '').toString().replace(/\D/g, '').slice(0, 10);
          setForm((f) => ({
            ...f,
            address: {
              ...f.address,
              line1: road.trim() || (data.display_name ?? '').split(',')[0]?.trim() || '',
              line2: addr.suburb && addr.suburb !== city ? addr.suburb : f.address.line2,
              city: city.trim(),
              state: state.trim(),
              pincode,
            },
          }));
        } catch {
          setLocationError('Could not fetch address for this location. Please enter manually.');
        } finally {
          setLocationLoading(false);
        }
      },
      () => {
        setLocationError('Location access denied or unavailable. Please enter address manually.');
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const validItems = form.items.filter((i) => i.materialCategoryId && Number(i.estimatedWeightKg) > 0);
    if (!validItems.length) {
      setError('Add at least one material category with weight.');
      return;
    }
    if (!form.address.line1.trim() || !form.address.city.trim() || !form.address.state.trim() || !form.address.pincode.trim()) {
      setError('Please fill address (line 1, city, state, pincode).');
      return;
    }
    const pincode = form.address.pincode.trim().replace(/\D/g, '');
    if (pincode.length < 4 || pincode.length > 10) {
      setError('Pincode must be 4–10 digits.');
      return;
    }
    const from = form.preferredDateFrom.trim();
    const to = form.preferredDateTo.trim();
    if (from && to && new Date(from) > new Date(to)) {
      setError('Preferred date "from" must be before or equal to "to".');
      return;
    }
    const altPhone = form.alternatePhone.trim();
    if (altPhone && (altPhone.length < 5 || altPhone.length > 20)) {
      setError('Alternate phone must be 5–20 characters.');
      return;
    }
    setSubmitLoading(true);
    try {
      const body: {
        address: { line1: string; line2?: string; landmark?: string; city: string; state: string; pincode: string };
        campaignId?: string;
        items: { materialCategoryId: string; estimatedWeightKg: number; description?: string }[];
        notes?: string;
        preferredDateFrom?: string;
        preferredDateTo?: string;
        alternatePhone?: string;
      } = {
        address: {
          line1: form.address.line1.trim(),
          line2: form.address.line2.trim() || undefined,
          landmark: form.address.landmark.trim() || undefined,
          city: form.address.city.trim(),
          state: form.address.state.trim(),
          pincode,
        },
        campaignId: form.campaignId || undefined,
        items: validItems.map((i) => ({
          materialCategoryId: i.materialCategoryId,
          estimatedWeightKg: Number(i.estimatedWeightKg),
          description: i.description?.trim() || undefined,
        })),
        notes: form.notes.trim() || undefined,
        preferredDateFrom: from || undefined,
        preferredDateTo: to || undefined,
        alternatePhone: altPhone || undefined,
      };
      await api.citizen.sellRequests.create(body);
      setSuccess('Sell request submitted. Our pickup vendor will contact you.');
      setLocationError(null);
      setForm({
        address: { line1: '', line2: '', landmark: '', city: '', state: '', pincode: '' },
        campaignId: '',
        items: [{ materialCategoryId: '', estimatedWeightKg: 0.5, description: '' }],
        notes: '',
        preferredDateFrom: '',
        preferredDateTo: '',
        alternatePhone: '',
      });
      const list = await api.citizen.sellRequests.list();
      setRequests(list);
    } catch (err) {
      let msg = err instanceof Error ? err.message : String(err);
      try {
        const jsonMatch = msg.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const obj = JSON.parse(jsonMatch[0]) as { message?: string };
          if (obj.message) msg = obj.message;
        }
      } catch {
        // keep original msg
      }
      setError(msg || 'Failed to submit request.');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-slate-600 py-8">Loading...</div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">Sell your e-waste</h2>
        <p className="mt-1 text-slate-600">
          Select material categories and estimated weight. Our vendor will collect, weigh at hub, pay you, and ensure digital traceability to the recycler.
        </p>
      </div>

      {campaigns.length > 0 && (
        <section className="rounded-xl border border-amber-200 bg-amber-50/80 p-5">
          <h3 className="font-semibold text-amber-900">Active campaigns — better prices</h3>
          <div className="mt-3 space-y-4">
            {campaigns.map((c) => (
              <div key={c.id} className="rounded-lg border border-amber-200/80 bg-white/60 p-3">
                <p className="font-medium text-amber-900">{c.name} <span className="text-amber-700 font-normal">({c.type})</span></p>
                <p className="text-xs text-amber-800 mt-0.5">Bonus ₹{c.bonusPerKgRs}/kg · Valid until {new Date(c.endAt).toLocaleDateString()}</p>
                {c.description && <p className="text-sm text-amber-800 mt-2">{c.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-slate-200 bg-slate-50/50 p-6">
        <h3 className="font-semibold text-slate-900">Raise a sell request</h3>

        <div>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-sm font-medium text-slate-700">Address *</span>
            <button
              type="button"
              onClick={fillAddressFromLocation}
              disabled={locationLoading}
              className="inline-flex items-center gap-1.5 rounded-lg border border-brand bg-white px-3 py-1.5 text-sm font-medium text-brand hover:bg-brand/5 focus-visible:outline focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:opacity-60"
            >
              {locationLoading ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-brand border-t-transparent" aria-hidden />
                  Use current location…
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Use current location
                </>
              )}
            </button>
          </div>
          {locationError && (
            <p className="text-sm text-amber-700 bg-amber-50 rounded-lg px-3 py-2 border border-amber-100 mb-3" role="alert">
              {locationError}
            </p>
          )}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700">Address line 1 *</label>
            <input
              className="input-base mt-1"
              value={form.address.line1}
              onChange={(e) => setForm((f) => ({ ...f, address: { ...f.address, line1: e.target.value } }))}
              required
              placeholder="Street / building"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Line 2</label>
            <input
              className="input-base mt-1"
              value={form.address.line2}
              onChange={(e) => setForm((f) => ({ ...f, address: { ...f.address, line2: e.target.value } }))}
              placeholder="Area / landmark"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Landmark</label>
            <input
              className="input-base mt-1"
              value={form.address.landmark}
              onChange={(e) => setForm((f) => ({ ...f, address: { ...f.address, landmark: e.target.value } }))}
              placeholder="Near..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">City *</label>
            <input
              className="input-base mt-1"
              value={form.address.city}
              onChange={(e) => setForm((f) => ({ ...f, address: { ...f.address, city: e.target.value } }))}
              required
              placeholder="City"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">State *</label>
            <input
              className="input-base mt-1"
              value={form.address.state}
              onChange={(e) => setForm((f) => ({ ...f, address: { ...f.address, state: e.target.value } }))}
              required
              placeholder="State"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Pincode *</label>
            <input
              className="input-base mt-1"
              value={form.address.pincode}
              onChange={(e) => setForm((f) => ({ ...f, address: { ...f.address, pincode: e.target.value } }))}
              required
              placeholder="6-digit pincode"
              maxLength={10}
            />
          </div>
        </div>
        {categories.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Campaign (optional)</label>
            <select
              className="input-base max-w-xs"
              value={form.campaignId}
              onChange={(e) => setForm((f) => ({ ...f, campaignId: e.target.value }))}
            >
              <option value="">None</option>
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        )}
        <div>
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-slate-700">Material categories & weight (kg) *</label>
            <button type="button" onClick={addItem} className="text-sm text-brand font-medium hover:underline">
              + Add item
            </button>
          </div>
          <div className="mt-2 space-y-3">
            {form.items.map((item, i) => (
              <div key={i} className="rounded-lg border border-slate-200 bg-white p-3 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    className="input-base flex-1 min-w-[180px]"
                    value={item.materialCategoryId}
                    onChange={(e) => updateItem(i, 'materialCategoryId', e.target.value)}
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.code} — {cat.description}</option>
                    ))}
                  </select>
                <input
                  type="number"
                  min={0.01}
                  step={0.01}
                  className="input-base w-24"
                  value={item.estimatedWeightKg || ''}
                  onChange={(e) => updateItem(i, 'estimatedWeightKg', e.target.value ? Number(e.target.value) : 0)}
                  placeholder="kg"
                />
                  <button type="button" onClick={() => removeItem(i)} className="text-slate-500 hover:text-red-600 text-sm" aria-label="Remove item">
                    Remove
                  </button>
                </div>
                <input
                  type="text"
                  className="input-base text-sm"
                  value={item.description || ''}
                  onChange={(e) => updateItem(i, 'description', e.target.value)}
                  placeholder="Details (e.g. 2 laptops, 1 monitor, condition)"
                  maxLength={500}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700">Preferred pickup date from (optional)</label>
            <input
              type="date"
              className="input-base mt-1"
              value={form.preferredDateFrom}
              onChange={(e) => setForm((f) => ({ ...f, preferredDateFrom: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Preferred pickup date to (optional)</label>
            <input
              type="date"
              className="input-base mt-1"
              value={form.preferredDateTo}
              onChange={(e) => setForm((f) => ({ ...f, preferredDateTo: e.target.value }))}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Alternate phone for pickup (optional)</label>
          <input
            type="tel"
            className="input-base mt-1 max-w-xs"
            value={form.alternatePhone}
            onChange={(e) => setForm((f) => ({ ...f, alternatePhone: e.target.value }))}
            placeholder="10-digit mobile"
            maxLength={20}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Notes (optional)</label>
          <textarea
            className="input-base mt-1 min-h-[80px]"
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            placeholder="Any details for the collector"
          />
        </div>
        {error && <p className="text-sm text-red-700 bg-red-50 rounded-lg px-3 py-2 border border-red-100" role="alert">{error}</p>}
        {success && <p className="text-sm text-green-800 bg-green-50 rounded-lg px-3 py-2 border border-green-200" role="status">{success}</p>}
        <button type="submit" disabled={submitLoading} className="btn-primary">
          {submitLoading ? 'Submitting…' : 'Submit sell request'}
        </button>
      </form>

      <section>
        <h3 className="font-semibold text-slate-900 mb-3">My sell requests</h3>
        {requests.length === 0 ? (
          <p className="text-slate-600">No requests yet. Submit one above.</p>
        ) : (
          <ul className="space-y-3">
            {requests.map((r) => (
              <li key={r.id} className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="font-medium text-slate-900">
                      {r.address?.line1}, {r.address?.city} — {r.totalEstimatedKg} kg
                    </span>
                    {r.campaign?.name && (
                      <span className="ml-2 text-xs text-amber-700 bg-amber-100 px-2 py-0.5 rounded">Campaign: {r.campaign.name}</span>
                    )}
                  </div>
                  <span className={`badge ${r.status === 'OPEN' ? 'badge-requested' : r.status === 'PAID' || r.status === 'RECYCLED' ? 'bg-green-100 text-green-800' : 'badge-assigned'}`}>
                    {STATUS_LABELS[r.status] ?? r.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {new Date(r.createdAt).toLocaleString()}
                  {r.preferredDateFrom && r.preferredDateTo && ` · Preferred: ${new Date(r.preferredDateFrom).toLocaleDateString()} – ${new Date(r.preferredDateTo).toLocaleDateString()}`}
                  {r.alternatePhone && ` · Alt. phone: ${r.alternatePhone}`}
                  {r.paymentAmountRs && ` · ₹${r.paymentAmountRs} paid`}
                </p>
                {r.items && r.items.length > 0 && (
                  <ul className="text-xs text-slate-600 mt-1 list-disc list-inside">
                    {r.items.map((it, idx) => (
                      <li key={idx}>{it.materialCategory?.code} {it.estimatedWeightKg} kg{it.description ? ` — ${it.description}` : ''}</li>
                    ))}
                  </ul>
                )}
                <Link
                  href={`/citizen/requests/${r.id}`}
                  className="mt-2 inline-block text-sm font-medium text-brand hover:underline"
                >
                  View traceability →
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="text-sm text-slate-500">
        <Link href="/" className="text-brand hover:underline font-medium">← Back to home</Link> to see how the network works.
      </p>
    </div>
  );
}
