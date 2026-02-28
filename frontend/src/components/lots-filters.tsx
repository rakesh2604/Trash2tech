'use client';

import { useRouter, useSearchParams } from 'next/navigation';

const LOT_STATUSES = [
  { value: '', label: 'All statuses' },
  { value: 'CREATED', label: 'Created' },
  { value: 'READY_FOR_DISPATCH', label: 'Ready for dispatch' },
  { value: 'IN_TRANSIT', label: 'In transit' },
  { value: 'RECEIVED_AT_RECYCLER', label: 'Received at recycler' },
  { value: 'CLOSED', label: 'Closed' },
];

type Hub = { id: string; name: string };
type Recycler = { id: string; name: string };

export function LotsFilters(props: {
  current: { status?: string; hubId?: string; recyclerId?: string };
  hubs: Hub[];
  recyclers: Recycler[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = props.current.status ?? '';
  const hubId = props.current.hubId ?? '';
  const recyclerId = props.current.recyclerId ?? '';

  function update(key: string, value: string) {
    const next = new URLSearchParams(searchParams?.toString() ?? '');
    if (value) next.set(key, value);
    else next.delete(key);
    router.push(`/admin/lots?${next.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-4 mb-6">
      <div>
        <label htmlFor="lot-filter-status" className="block text-xs font-medium text-slate-500 mb-1">Status</label>
        <select id="lot-filter-status" className="input-base w-auto min-w-[180px]" value={status} onChange={(e) => update('status', e.target.value)}>
          {LOT_STATUSES.map((o) => <option key={o.value || '_'} value={o.value}>{o.label}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="lot-filter-hub" className="block text-xs font-medium text-slate-500 mb-1">Hub</label>
        <select id="lot-filter-hub" className="input-base w-auto min-w-[200px]" value={hubId} onChange={(e) => update('hubId', e.target.value)}>
          <option value="">All hubs</option>
          {props.hubs.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="lot-filter-recycler" className="block text-xs font-medium text-slate-500 mb-1">Recycler</label>
        <select id="lot-filter-recycler" className="input-base w-auto min-w-[200px]" value={recyclerId} onChange={(e) => update('recyclerId', e.target.value)}>
          <option value="">All recyclers</option>
          {props.recyclers.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
      </div>
    </div>
  );
}
