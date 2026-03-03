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
        <p className="mb-4 text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2" role="alert">
          {error}
        </p>
      )}
      <div className="table-glass overflow-x-auto">
        <table>
          <thead>
            <tr>
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
              <tr key={p.id}>
                <td className="p-3 font-medium">{p.pickupCode}</td>
                <td className="p-3">{p.status}</td>
                <td className="p-3">{p.hub?.name ?? p.hub?.id ?? '—'}</td>
                <td className="p-3">{p.sourceChannel}</td>
                <td className="p-3 text-white/70">{new Date(p.createdAt).toLocaleString()}</td>
                <td className="p-3">
                  <select
                    className="input-glass w-40 text-sm py-2"
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
