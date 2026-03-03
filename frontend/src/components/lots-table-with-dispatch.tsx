'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { api } from '../lib/api';

type Lot = {
  id: string;
  lotCode: string;
  status: string;
  hub?: { name?: string; id?: string };
  recycler?: { name?: string; id?: string };
  materialCategory?: { code?: string };
  createdAt: string;
};

export function LotsTableWithDispatch({ lots }: { lots: Lot[] }) {
  const router = useRouter();
  const [dispatchingLotId, setDispatchingLotId] = useState<string | null>(null);
  const [dispatchForm, setDispatchForm] = useState({
    vehicleNumber: '',
    driverName: '',
    dispatchWeightKg: '',
    dispatchTime: new Date().toISOString().slice(0, 16),
    dispatchDocsUrl: '',
  });
  const [submitStatus, setSubmitStatus] = useState<{ type: 'idle' | 'success' | 'error'; message?: string }>({ type: 'idle' });

  const canDispatch = (status: string) =>
    status === 'CREATED' || status === 'READY_FOR_DISPATCH';

  async function handleDispatchSubmit(lotId: string) {
    setSubmitStatus({ type: 'idle' });
    const dispatchTimeIso = dispatchForm.dispatchTime.includes('Z')
      ? dispatchForm.dispatchTime
      : `${dispatchForm.dispatchTime}:00.000Z`;
    try {
      await api.lots.dispatch(lotId, {
        vehicleNumber: dispatchForm.vehicleNumber.trim(),
        driverName: dispatchForm.driverName.trim(),
        dispatchWeightKg: dispatchForm.dispatchWeightKg.trim(),
        dispatchTime: dispatchTimeIso,
        dispatchDocsUrl: dispatchForm.dispatchDocsUrl.trim() || undefined,
      });
      setSubmitStatus({ type: 'success', message: 'Lot dispatched.' });
      setDispatchingLotId(null);
      setDispatchForm({
        vehicleNumber: '',
        driverName: '',
        dispatchWeightKg: '',
        dispatchTime: new Date().toISOString().slice(0, 16),
        dispatchDocsUrl: '',
      });
      router.refresh();
    } catch (e: unknown) {
      setSubmitStatus({
        type: 'error',
        message: e instanceof Error ? e.message : 'Dispatch failed.',
      });
    }
  }

  return (
    <>
      <div className="table-glass overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th className="p-3">Lot code</th>
              <th className="p-3">Status</th>
              <th className="p-3">Hub</th>
              <th className="p-3">Recycler</th>
              <th className="p-3">Category</th>
              <th className="p-3">Created</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {lots.map((l) => (
              <tr key={l.id}>
                <td className="p-3 font-medium">{l.lotCode}</td>
                <td className="p-3">{l.status}</td>
                <td className="p-3">{l.hub?.name ?? l.hub?.id}</td>
                <td className="p-3">{l.recycler?.name ?? l.recycler?.id}</td>
                <td className="p-3">{l.materialCategory?.code ?? '-'}</td>
                <td className="p-3 text-white/70">{new Date(l.createdAt).toLocaleString()}</td>
                <td className="p-3">
                  {canDispatch(l.status) && (
                    <button
                      type="button"
                      onClick={() => {
                        setDispatchingLotId(l.id);
                        setSubmitStatus({ type: 'idle' });
                      }}
                      className="text-eco hover:underline text-left font-medium"
                    >
                      Dispatch
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {dispatchingLotId && (
        <div className="mt-6 p-4 rounded-2xl glass-card max-w-md">
          <h3 className="text-sm font-semibold text-white mb-3">Dispatch lot</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-white/80 mb-1">Vehicle number *</label>
              <input
                className="input-glass w-full text-sm min-h-[40px]"
                value={dispatchForm.vehicleNumber}
                onChange={(e) => setDispatchForm((f) => ({ ...f, vehicleNumber: e.target.value }))}
                placeholder="e.g. MH-01-AB-1234"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/80 mb-1">Driver name *</label>
              <input
                className="input-glass w-full text-sm min-h-[40px]"
                value={dispatchForm.driverName}
                onChange={(e) => setDispatchForm((f) => ({ ...f, driverName: e.target.value }))}
                placeholder="Driver name"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/80 mb-1">Dispatch weight (kg) *</label>
              <input
                className="input-glass w-full text-sm min-h-[40px]"
                value={dispatchForm.dispatchWeightKg}
                onChange={(e) => setDispatchForm((f) => ({ ...f, dispatchWeightKg: e.target.value }))}
                placeholder="e.g. 120.5"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/80 mb-1">Dispatch time *</label>
              <input
                type="datetime-local"
                className="input-glass w-full text-sm min-h-[40px]"
                value={dispatchForm.dispatchTime}
                onChange={(e) => setDispatchForm((f) => ({ ...f, dispatchTime: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/80 mb-1">Dispatch docs URL (optional)</label>
              <input
                className="input-glass w-full text-sm min-h-[40px]"
                value={dispatchForm.dispatchDocsUrl}
                onChange={(e) => setDispatchForm((f) => ({ ...f, dispatchDocsUrl: e.target.value }))}
                placeholder="https://..."
              />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleDispatchSubmit(dispatchingLotId)}
              disabled={
                !dispatchForm.vehicleNumber.trim() ||
                !dispatchForm.driverName.trim() ||
                !dispatchForm.dispatchWeightKg.trim()
              }
              className="btn-glass-primary min-h-[40px] px-4 py-2 text-sm"
            >
              Confirm dispatch
            </button>
            <button
              type="button"
              onClick={() => {
                setDispatchingLotId(null);
                setSubmitStatus({ type: 'idle' });
              }}
              className="min-h-[40px] rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm text-white/90 hover:bg-white/10"
            >
              Cancel
            </button>
          </div>
          {submitStatus.type === 'success' && (
            <p className="mt-2 text-sm text-eco">{submitStatus.message}</p>
          )}
          {submitStatus.type === 'error' && (
            <p className="mt-2 text-sm text-red-300">{submitStatus.message}</p>
          )}
        </div>
      )}
    </>
  );
}
