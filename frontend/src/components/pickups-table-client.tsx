'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { api } from '../lib/api';

const PICKUP_STATUSES = [
  'SCHEDULED',
  'ASSIGNED',
  'IN_COLLECTION',
  'AT_HUB',
  'WEIGHED',
  'IN_LOT',
  'LOT_DISPATCHED',
  'RECYCLED',
  'CANCELLED',
];

type Pickup = {
  id: string;
  pickupCode: string;
  status: string;
  hub?: { name?: string; id?: string };
  sourceChannel: string;
  createdAt: string;
};

export function PickupsTableClient(props: { pickups: Pickup[] }) {
  const router = useRouter();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStatusChange = async (id: string, newStatus: string) => {
    if (!newStatus) return;
    setError(null);
    setUpdatingId(id);
    try {
      await api.pickups.updateStatus(id, newStatus);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const { pickups } = props;
  if (pickups.length === 0) return null;

  return (
    <>
      {error && (
        <p className="mb-4 text-sm text-red-700 bg-red-50 rounded-lg px-3 py-2" role="alert">
          {error}
        </p>
      )}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left text-slate-700">
              <th className="p-3">Pickup code</th>
              <th className="p-3">Status</th>
              <th className="p-3">Hub</th>
              <th className="p-3">Channel</th>
              <th className="p-3">Created</th>
              <th className="p-3">Update status</th>
            </tr>
          </thead>
          <tbody>
            {pickups.map((p) => (
              <tr key={p.id} className="border-t border-slate-200">
                <td className="p-3 font-medium text-slate-900">{p.pickupCode}</td>
                <td className="p-3 text-slate-600">{p.status}</td>
                <td className="p-3 text-slate-600">{p.hub?.name ?? p.hub?.id ?? '—'}</td>
                <td className="p-3 text-slate-600">{p.sourceChannel}</td>
                <td className="p-3 text-slate-500">{new Date(p.createdAt).toLocaleString()}</td>
                <td className="p-3">
                  <select
                    className="input-base w-40 text-sm"
                    value=""
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v) handleStatusChange(p.id, v);
                    }}
                    disabled={updatingId === p.id}
                    aria-label={`Update status for ${p.pickupCode}`}
                  >
                    <option value="">— Change —</option>
                    {PICKUP_STATUSES.filter((s) => s !== p.status).map((s) => (
                      <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
