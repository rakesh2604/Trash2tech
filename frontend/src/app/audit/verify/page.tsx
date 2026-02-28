'use client';

import { useState } from 'react';
import { AppShell } from '../../../components/app-shell';
import { api } from '../../../lib/api';

const ENTITY_TYPES = ['pickup', 'lot', 'hub_intake', 'recycler_intake'] as const;

export default function AuditVerifyPage() {
  const [entityType, setEntityType] = useState<string>('pickup');
  const [entityId, setEntityId] = useState('');
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function run() {
    setError(null);
    setResult(null);
    if (!entityId.trim()) {
      setError('Enter an entity ID (UUID).');
      return;
    }
    setLoading(true);
    try {
      const r = await api.audit.verify({ entityType: entityType.trim(), entityId: entityId.trim() });
      setResult(r as Record<string, unknown>);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Verification failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell title="E-waste Console">
      <h2 className="text-xl font-bold tracking-tight text-slate-900">Audit chain verify</h2>
      <p className="text-sm text-slate-600 mt-1 mb-6">
        Recompute hash-chain for an entity to detect tampering. Enter entity type and UUID.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Entity type</label>
          <select
            className="input-base min-h-[44px]"
            value={entityType}
            onChange={(e) => setEntityType(e.target.value)}
          >
            {ENTITY_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Entity ID (UUID) *</label>
          <input
            className="input-base"
            value={entityId}
            onChange={(e) => setEntityId(e.target.value)}
            placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={run}
          disabled={loading}
          className="btn-primary disabled:opacity-50"
        >
          {loading ? 'Verifying…' : 'Verify'}
        </button>
      </div>

      {error && (
        <div className="mt-4 text-sm text-red-700 bg-red-50 rounded-lg px-4 py-3 border border-red-200" role="alert">
          {error}
        </div>
      )}
      {result && (
        <pre className="mt-4 text-xs bg-slate-100 border border-slate-200 rounded-xl p-4 overflow-auto text-slate-800 font-mono">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </AppShell>
  );
}

