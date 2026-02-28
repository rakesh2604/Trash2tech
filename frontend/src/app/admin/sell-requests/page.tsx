'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AppShell } from '../../../components/app-shell';
import { api } from '../../../lib/api';

type SellRequest = {
  id: string;
  status: string;
  totalEstimatedKg: string;
  paymentAmountRs?: string | null;
  paymentCompletedAt?: string | null;
  createdAt: string;
  preferredDateFrom?: string | null;
  preferredDateTo?: string | null;
  alternatePhone?: string | null;
  address?: { line1: string; city: string; pincode: string };
  citizen?: { name?: string };
  campaign?: { name: string } | null;
  pickup?: { id: string; pickupCode: string } | null;
  items?: { materialCategory: { code: string }; estimatedWeightKg: string; description?: string | null }[];
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

const STATUS_OPTIONS = ['', 'OPEN', 'PICKUP_SCHEDULED', 'COLLECTED', 'AT_HUB', 'WEIGHED', 'PAID', 'IN_LOT', 'RECYCLED', 'CANCELLED'];

export default function AdminSellRequestsPage() {
  const [requests, setRequests] = useState<SellRequest[]>([]);
  const [hubs, setHubs] = useState<{ id: string; name: string; city: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [convertId, setConvertId] = useState<string | null>(null);
  const [convertHubId, setConvertHubId] = useState('');
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      api.adminSellRequests.list(statusFilter || undefined),
      api.reference.hubs(),
    ])
      .then(([list, h]) => { setRequests(list); setHubs(h); })
      .catch(() => setRequests([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const handleConvert = async (id: string) => {
    if (!convertHubId) {
      setError('Select a hub.');
      return;
    }
    setError(null);
    setSuccess(null);
    try {
      await api.adminSellRequests.convertToPickup(id, convertHubId);
      setConvertId(null);
      setConvertHubId('');
      setSuccess('Request converted to pickup. It is now in Pickups and can be assigned to Field Captain.');
      loadData();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Convert failed');
    }
  };

  const handleRecordPayment = async (id: string) => {
    const amount = parseFloat(paymentAmount);
    if (Number.isNaN(amount) || amount < 0) {
      setError('Enter a valid payment amount (₹).');
      return;
    }
    setError(null);
    setSuccess(null);
    try {
      await api.adminSellRequests.recordPayment(id, amount);
      setPaymentId(null);
      setPaymentAmount('');
      setSuccess('Payment recorded. Sell request status updated to PAID.');
      loadData();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Record payment failed');
    }
  };

  if (loading && requests.length === 0) {
    return <AppShell title="E-waste Console"><div className="py-8 text-slate-600">Loading...</div></AppShell>;
  }

  return (
    <AppShell title="E-waste Console">
      <h2 className="text-xl font-bold tracking-tight text-slate-900">Citizen sell requests</h2>

      {/* Flow explanation */}
      <div className="mt-2 mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700">
        <h3 className="font-semibold text-slate-900 mb-2">Kahan se accept karein aur aage ka process</h3>
        <ol className="list-decimal list-inside space-y-1.5">
          <li><strong>Accept request:</strong> Neeche table mein <strong>OPEN</strong> status wale requests ko dekhen. &quot;Convert to pickup&quot; dabayein, hub select karein, phir &quot;Convert&quot; — isse ek <strong>Pickup</strong> create ho jata hai.</li>
          <li><strong>Pickup flow:</strong> Created pickup <Link href="/admin/pickups" className="text-brand hover:underline font-medium">Admin → Pickups</Link> mein dikhega. Wahan se Field Captain / Kabadi ko assign kiya ja sakta hai; vendor citizen ke yahan jaa kar e-waste collect karta hai, hub par le jaata hai.</li>
          <li><strong>Hub par:</strong> <Link href="/captain/intake" className="text-brand hover:underline font-medium">Hub intake</Link> se weight record hota hai — sell request status automatically <strong>AT_HUB</strong> / <strong>WEIGHED</strong> ho jata hai.</li>
          <li><strong>Payment:</strong> Jab status <strong>WEIGHED</strong> ho jaye, isi page par usi row mein &quot;Record payment&quot; se amount daal kar payment complete karein — status <strong>PAID</strong> ho jayega aur citizen ko traceability dikhegi.</li>
          <li><strong>Aage:</strong> Lot create, recycler tak dispatch — sell request <strong>IN_LOT</strong> / <strong>RECYCLED</strong> tak update hota rehta hai; citizen apne dashboard se track kar sakta hai.</li>
        </ol>
      </div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <label htmlFor="status-filter" className="text-sm font-medium text-slate-700">Filter by status</label>
        <select
          id="status-filter"
          className="input-base w-48"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s === '' ? 'All' : STATUS_LABELS[s] ?? s}</option>
          ))}
        </select>
      </div>
      {error && <p className="mb-4 text-sm text-red-700 bg-red-50 rounded-lg px-3 py-2" role="alert">{error}</p>}
      {success && <p className="mb-4 text-sm text-green-800 bg-green-50 rounded-lg px-3 py-2 border border-green-200" role="status">{success}</p>}
      {requests.length === 0 ? (
        <p className="text-slate-600">No sell requests yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50">
              <tr className="text-left text-slate-700">
                <th className="p-3">Address</th>
                <th className="p-3">Kg</th>
                <th className="p-3">Items</th>
                <th className="p-3">Preferred dates</th>
                <th className="p-3">Alt. phone</th>
                <th className="p-3">Campaign</th>
                <th className="p-3">Status</th>
                <th className="p-3">Pickup</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Created</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id} className="border-t border-slate-200">
                  <td className="p-3 text-slate-600">{r.address?.line1}, {r.address?.city} {r.address?.pincode}</td>
                  <td className="p-3 text-slate-600">{r.totalEstimatedKg}</td>
                  <td className="p-3 text-slate-600 text-xs">{r.items?.map((i) => `${i.materialCategory?.code} ${i.estimatedWeightKg}kg`).join(', ') ?? '—'}</td>
                  <td className="p-3 text-slate-600 text-xs">{r.preferredDateFrom && r.preferredDateTo ? `${new Date(r.preferredDateFrom).toLocaleDateString()} – ${new Date(r.preferredDateTo).toLocaleDateString()}` : '—'}</td>
                  <td className="p-3 text-slate-600">{r.alternatePhone ?? '—'}</td>
                  <td className="p-3 text-slate-600">{r.campaign?.name ?? '—'}</td>
                  <td className="p-3"><span className="badge badge-requested">{STATUS_LABELS[r.status] ?? r.status}</span></td>
                  <td className="p-3 text-slate-600">
                    {r.pickup ? (
                      <Link href="/admin/pickups" className="text-brand hover:underline font-medium" title="View pickups">{r.pickup.pickupCode}</Link>
                    ) : '—'}
                  </td>
                  <td className="p-3 text-slate-600">
                    {r.paymentAmountRs != null ? `₹${r.paymentAmountRs}` : '—'}
                  </td>
                  <td className="p-3 text-slate-500">{new Date(r.createdAt).toLocaleString()}</td>
                  <td className="p-3">
                    {r.status === 'OPEN' && (
                      <div className="flex flex-wrap items-center gap-2">
                        {convertId === r.id ? (
                          <>
                            <select
                              className="input-base w-40"
                              value={convertHubId}
                              onChange={(e) => setConvertHubId(e.target.value)}
                            >
                              <option value="">Select hub</option>
                              {hubs.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
                            </select>
                            <button type="button" onClick={() => handleConvert(r.id)} className="btn-primary text-sm">Convert</button>
                            <button type="button" onClick={() => { setConvertId(null); setConvertHubId(''); }} className="text-slate-600 hover:underline text-sm">Cancel</button>
                          </>
                        ) : (
                          <button type="button" onClick={() => setConvertId(r.id)} className="btn-primary text-sm">Convert to pickup</button>
                        )}
                      </div>
                    )}
                    {r.status === 'WEIGHED' && (
                      <div className="flex flex-wrap items-center gap-2">
                        {paymentId === r.id ? (
                          <>
                            <input
                              type="number"
                              min={0}
                              step={0.01}
                              placeholder="Amount (₹)"
                              className="input-base w-28"
                              value={paymentAmount}
                              onChange={(e) => setPaymentAmount(e.target.value)}
                            />
                            <button type="button" onClick={() => handleRecordPayment(r.id)} className="btn-primary text-sm">Save payment</button>
                            <button type="button" onClick={() => { setPaymentId(null); setPaymentAmount(''); }} className="text-slate-600 hover:underline text-sm">Cancel</button>
                          </>
                        ) : (
                          <button type="button" onClick={() => setPaymentId(r.id)} className="btn-primary text-sm">Record payment</button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppShell>
  );
}
