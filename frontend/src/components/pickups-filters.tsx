'use client';

import { useRouter, useSearchParams } from 'next/navigation';

const PICKUP_STATUSES = [
  { value: '', label: 'All statuses' },
  { value: 'NEW', label: 'New' },
  { value: 'SCHEDULED', label: 'Scheduled' },
  { value: 'ASSIGNED', label: 'Assigned' },
  { value: 'IN_COLLECTION', label: 'In collection' },
  { value: 'AT_HUB', label: 'At hub' },
  { value: 'WEIGHED', label: 'Weighed' },
  { value: 'IN_LOT', label: 'In lot' },
  { value: 'LOT_DISPATCHED', label: 'Lot dispatched' },
  { value: 'RECYCLED', label: 'Recycled' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

type Hub = { id: string; name: string; city?: string };

export function PickupsFilters(props: {
  current: { status?: string; hubId?: string };
  hubs: Hub[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = props.current.status ?? '';
  const hubId = props.current.hubId ?? '';

  function update(key: string, value: string) {
    const next = new URLSearchParams(searchParams?.toString() ?? '');
    if (value) next.set(key, value);
    else next.delete(key);
    router.push(`/admin/pickups?${next.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-4 mb-6">
      <div>
        <label htmlFor="filter-status" className="block text-xs font-medium text-slate-500 mb-1">Status</label>
        <select
          id="filter-status"
          className="input-base w-auto min-w-[160px]"
          value={status}
          onChange={(e) => update('status', e.target.value)}
        >
          {PICKUP_STATUSES.map((o) => (
            <option key={o.value || '_'} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="filter-hub" className="block text-xs font-medium text-slate-500 mb-1">Hub</label>
        <select
          id="filter-hub"
          className="input-base w-auto min-w-[200px]"
          value={hubId}
          onChange={(e) => update('hubId', e.target.value)}
        >
          <option value="">All hubs</option>
          {props.hubs.map((h) => (
            <option key={h.id} value={h.id}>{h.name} {h.city ? `(${h.city})` : ''}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
