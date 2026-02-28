'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AppShell } from '../../../../components/app-shell';
import { LoginRequired } from '../../../../components/login-required';
import { api } from '../../../../lib/api';

type Step = { stage: string; label: string; done: boolean; date?: string; detail?: string };

export default function CitizenRequestTraceabilityPage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const [data, setData] = useState<{
    sellRequest: { id: string; status: string; totalEstimatedKg: string; paymentAmountRs?: string | null; createdAt: string; items?: { materialCategory: { code: string }; estimatedWeightKg: string; description?: string | null }[] };
    steps: Step[];
    tentativeDaysToRecycle: number;
    paymentAmountRs: string | null;
    paymentCompletedAt: string | null;
    pickupCode: string | null;
    hubName: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    api.citizen.sellRequests.traceability(id)
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load'))
      .finally(() => setLoading(false));
  }, [id]);

  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  if (!token) return <LoginRequired />;

  if (loading) return <AppShell title="Traceability"><div className="py-8 text-slate-600">Loading...</div></AppShell>;
  if (error || !data) return <AppShell title="Traceability"><div className="py-8 text-red-700">{error || 'Not found'}</div></AppShell>;

  const { sellRequest, steps, tentativeDaysToRecycle, paymentAmountRs, paymentCompletedAt, pickupCode, hubName } = data;

  return (
    <AppShell title="Traceability">
      <div className="space-y-6">
        <div>
          <Link href="/citizen" className="text-sm text-brand hover:underline font-medium">← Back to dashboard</Link>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 mt-2">Digital traceability</h2>
          <p className="text-slate-600 mt-1">
            Your e-waste is tracked from collection to recycler. Tentative time to reach recycle center: <strong>~{tentativeDaysToRecycle} days</strong>.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-2">
          <p className="text-sm text-slate-600">
            Request: <strong>{sellRequest.totalEstimatedKg} kg</strong> · Created {new Date(sellRequest.createdAt).toLocaleString()}
            {paymentAmountRs && (
              <span className="ml-2 text-green-700">· ₹{paymentAmountRs} paid {paymentCompletedAt ? new Date(paymentCompletedAt).toLocaleDateString() : ''}</span>
            )}
          </p>
          {sellRequest.items && sellRequest.items.length > 0 && (
            <p className="text-xs text-slate-600">
              Items: {sellRequest.items.map((i) => `${i.materialCategory?.code} ${i.estimatedWeightKg} kg${i.description ? ` (${i.description})` : ''}`).join('; ')}
            </p>
          )}
          {(pickupCode || hubName) && (
            <p className="text-sm font-medium text-slate-800 mt-2">
              Pickup code: <strong>{pickupCode ?? '—'}</strong>
              {hubName && <> · Hub: <strong>{hubName}</strong></>}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-slate-900">Status steps</h3>
          <ul className="space-y-2">
            {steps.filter((s) => s.stage !== 'TRACE').map((step, i) => (
              <li
                key={i}
                className={`flex items-center gap-3 rounded-lg border px-4 py-3 ${
                  step.done ? 'border-green-200 bg-green-50/50' : 'border-slate-200 bg-white'
                }`}
              >
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium ${
                  step.done ? 'bg-green-600 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {step.done ? '✓' : i + 1}
                </span>
                <div>
                  <span className="font-medium text-slate-900">{step.label}</span>
                  {step.date && <p className="text-xs text-slate-500">{step.date}</p>}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-sm text-slate-500">
          Full chain-of-custody is recorded. Once the lot is dispatched to the recycler, your material will be processed there within the estimated period.
        </p>
      </div>
    </AppShell>
  );
}
