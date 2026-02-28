'use client';

import { useRouter, useSearchParams } from 'next/navigation';

const CHANNELS = [
  { value: '', label: 'All channels' },
  { value: 'WHATSAPP', label: 'WhatsApp' },
  { value: 'IVR', label: 'IVR' },
];

const STATUSES = [
  { value: '', label: 'All statuses' },
  { value: 'OPEN', label: 'Open' },
  { value: 'CONVERTED_TO_PICKUP', label: 'Converted to pickup' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export function BookingRequestsFilters(props: { current: { channel?: string; status?: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const channel = props.current.channel ?? '';
  const status = props.current.status ?? '';

  function update(key: string, value: string) {
    const next = new URLSearchParams(searchParams?.toString() ?? '');
    if (value) next.set(key, value);
    else next.delete(key);
    router.push(`/admin/booking-requests?${next.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-4 mb-6">
      <div>
        <label htmlFor="br-filter-channel" className="block text-xs font-medium text-slate-500 mb-1">Channel</label>
        <select id="br-filter-channel" className="input-base w-auto min-w-[140px]" value={channel} onChange={(e) => update('channel', e.target.value)}>
          {CHANNELS.map((o) => <option key={o.value || '_'} value={o.value}>{o.label}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="br-filter-status" className="block text-xs font-medium text-slate-500 mb-1">Status</label>
        <select id="br-filter-status" className="input-base w-auto min-w-[180px]" value={status} onChange={(e) => update('status', e.target.value)}>
          {STATUSES.map((o) => <option key={o.value || '_'} value={o.value}>{o.label}</option>)}
        </select>
      </div>
    </div>
  );
}
