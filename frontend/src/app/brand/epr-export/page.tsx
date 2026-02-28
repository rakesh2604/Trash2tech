'use client';

import { useEffect, useMemo, useState } from 'react';
import { AppShell } from '../../../components/app-shell';
import { LoginRequired } from '../../../components/login-required';
import { api } from '../../../lib/api';

/** Generate last 8 quarters for reporting period dropdown (e.g. 2024-Q1 … 2025-Q4). */
function getReportingPeriodOptions(): { value: string; label: string }[] {
  const now = new Date();
  const options: { value: string; label: string }[] = [];
  for (let i = 0; i < 8; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - 3 * i, 1);
    const year = d.getFullYear();
    const q = Math.floor(d.getMonth() / 3) + 1;
    const value = `${year}-Q${q}`;
    options.push({ value, label: value });
  }
  return options;
}

const REPORTING_PERIOD_OPTIONS = getReportingPeriodOptions();

export default function BrandEprExportPage() {
  const [brandId, setBrandId] = useState('');
  const [reportingPeriod, setReportingPeriod] = useState(REPORTING_PERIOD_OPTIONS[0]?.value ?? '2025-Q1');
  const [brands, setBrands] = useState<{ id: string; name: string; eprRegistrationNumber: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [authFailed, setAuthFailed] = useState(false);
  const [csv, setCsv] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedBrandName = useMemo(
    () => brands.find((b) => b.id === brandId)?.name ?? 'export',
    [brands, brandId]
  );

  useEffect(() => {
    setError(null);
    api.reference
      .brands()
      .then((list) => {
        setBrands(list);
        if (list.length && !brandId) setBrandId(list[0].id);
      })
      .catch((e: unknown) => {
        const msg = e instanceof Error ? e.message : 'Failed to load brands.';
        if (msg.includes('401') || msg.includes('403')) setAuthFailed(true);
        else setError(msg.includes('403') ? 'Access denied. Ensure you are signed in as Brand or Admin.' : msg);
      })
      .finally(() => setLoading(false));
  }, []);

  async function run() {
    if (!brandId.trim()) {
      setError('Please select a brand.');
      return;
    }
    if (!reportingPeriod.trim()) {
      setError('Please select a reporting period.');
      return;
    }
    setError(null);
    setCsv(null);
    setExporting(true);
    try {
      const text = await api.epr.exportCsv({ brandId: brandId.trim(), reportingPeriod: reportingPeriod.trim() });
      setCsv(text);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Export failed.');
    } finally {
      setExporting(false);
    }
  }

  function downloadCsv() {
    if (!csv) return;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `epr-export-${selectedBrandName.replace(/\W+/g, '-')}-${reportingPeriod}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (authFailed) return <LoginRequired />;
  if (loading) {
    return (
      <AppShell title="E-waste Console">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">EPR CSV export</h2>
        <p className="mt-1 text-slate-600">Loading brands…</p>
      </AppShell>
    );
  }

  return (
    <AppShell title="E-waste Console">
      <h2 className="text-xl font-bold tracking-tight text-slate-900">EPR CSV export</h2>
      <p className="mt-1 text-slate-600 mb-6">
        Compliance-ready export for brand reporting periods (PO: CSV).
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl">
        <div>
          <label htmlFor="epr-brand" className="block text-sm font-medium text-slate-700 mb-1">Brand *</label>
          <select
            id="epr-brand"
            className="input-base"
            value={brandId}
            onChange={(e) => setBrandId(e.target.value)}
          >
            <option value="">Select brand</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>{b.name} — {b.eprRegistrationNumber}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="epr-period" className="block text-sm font-medium text-slate-700 mb-1">Reporting period *</label>
          <select
            id="epr-period"
            className="input-base"
            value={reportingPeriod}
            onChange={(e) => setReportingPeriod(e.target.value)}
          >
            {REPORTING_PERIOD_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={run}
          disabled={exporting || !brandId.trim() || !reportingPeriod.trim()}
          className="btn-primary disabled:opacity-50"
        >
          {exporting ? 'Exporting…' : 'Export CSV'}
        </button>
      </div>

      {error ? (
        <div className="mt-4 text-sm text-red-700 bg-red-50 rounded-lg px-3 py-2 border border-red-100" role="alert">
          {error}
        </div>
      ) : null}
      {csv ? (
        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <span className="text-sm font-medium text-slate-700">CSV output</span>
            <button
              type="button"
              onClick={downloadCsv}
              className="btn-primary text-sm"
            >
              Download CSV file
            </button>
          </div>
          <textarea
            className="w-full h-48 rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 font-mono text-xs"
            value={csv}
            readOnly
            aria-label="Exported CSV content"
          />
        </div>
      ) : null}
    </AppShell>
  );
}
