'use client';

import { useRouter, useSearchParams } from 'next/navigation';

const ACTOR_TYPES = [
  { value: '', label: 'All actor types' },
  { value: 'KABADI', label: 'Kabadi' },
  { value: 'FIELD_CAPTAIN', label: 'Hub & collection officer' },
  { value: 'HUB', label: 'Hub' },
  { value: 'SOCIETY', label: 'Society' },
];

const STATUSES = [
  { value: '', label: 'All statuses' },
  { value: 'ACCRUED', label: 'Accrued' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'PAID', label: 'Paid' },
];

export function IncentivesFilters(props: { current: { actorType?: string; status?: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const actorType = props.current.actorType ?? '';
  const status = props.current.status ?? '';

  function update(key: string, value: string) {
    const next = new URLSearchParams(searchParams?.toString() ?? '');
    if (value) next.set(key, value);
    else next.delete(key);
    router.push(`/admin/incentives?${next.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-4 mb-6">
      <div>
        <label htmlFor="inc-filter-actor" className="block text-xs font-medium text-slate-500 mb-1">Actor type</label>
        <select id="inc-filter-actor" className="input-base w-auto min-w-[160px]" value={actorType} onChange={(e) => update('actorType', e.target.value)}>
          {ACTOR_TYPES.map((o) => <option key={o.value || '_'} value={o.value}>{o.label}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="inc-filter-status" className="block text-xs font-medium text-slate-500 mb-1">Status</label>
        <select id="inc-filter-status" className="input-base w-auto min-w-[140px]" value={status} onChange={(e) => update('status', e.target.value)}>
          {STATUSES.map((o) => <option key={o.value || '_'} value={o.value}>{o.label}</option>)}
        </select>
      </div>
    </div>
  );
}
