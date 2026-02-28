'use client';

import { useRouter, useSearchParams } from 'next/navigation';

const TYPES = [
  { value: '', label: 'All types' },
  { value: 'WEIGHT_VARIANCE', label: 'Weight variance' },
];

const SEVERITIES = [
  { value: '', label: 'All severities' },
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
];

export function AnomaliesFilters(props: { current: { type?: string; severity?: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = props.current.type ?? '';
  const severity = props.current.severity ?? '';

  function update(key: string, value: string) {
    const next = new URLSearchParams(searchParams?.toString() ?? '');
    if (value) next.set(key, value);
    else next.delete(key);
    router.push(`/admin/anomalies?${next.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-4 mb-6">
      <div>
        <label htmlFor="anom-filter-type" className="block text-xs font-medium text-slate-500 mb-1">Type</label>
        <select id="anom-filter-type" className="input-base w-auto min-w-[160px]" value={type} onChange={(e) => update('type', e.target.value)}>
          {TYPES.map((o) => <option key={o.value || '_'} value={o.value}>{o.label}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="anom-filter-severity" className="block text-xs font-medium text-slate-500 mb-1">Severity</label>
        <select id="anom-filter-severity" className="input-base w-auto min-w-[140px]" value={severity} onChange={(e) => update('severity', e.target.value)}>
          {SEVERITIES.map((o) => <option key={o.value || '_'} value={o.value}>{o.label}</option>)}
        </select>
      </div>
    </div>
  );
}
