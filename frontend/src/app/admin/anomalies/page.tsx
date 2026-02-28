import { AppShell } from '../../../components/app-shell';
import { AccessDenied } from '../../../components/access-denied';
import { EmptyState } from '../../../components/empty-state';
import { AnomaliesFilters } from '../../../components/anomalies-filters';
import { LoginRequired } from '../../../components/login-required';
import { getApi } from '../../../lib/api';
import { getAuthToken } from '../../../lib/auth-server';

type SearchParams = { type?: string; severity?: string };

export default async function AdminAnomaliesPage(props: { searchParams?: SearchParams }) {
  const token = await getAuthToken();
  if (!token) return <LoginRequired />;
  const sp = props.searchParams ?? {};
  const type = typeof sp.type === 'string' ? sp.type : undefined;
  const severity = typeof sp.severity === 'string' ? sp.severity : undefined;

  const api = getApi(token);
  const anomaliesResult = await api.anomalies.list({ limit: 100, type, severity }).catch((err: unknown) => err as Error);

  let listError: string | null = null;
  let anomalies: { id: string; type: string; severity: string; entityType: string; entityId: string; createdAt: string; payloadJson?: Record<string, unknown> }[] = [];

  if (anomaliesResult instanceof Error || (anomaliesResult && !Array.isArray(anomaliesResult))) {
    const err = anomaliesResult instanceof Error ? anomaliesResult : new Error(String(anomaliesResult));
    const msg = err.message;
    if (msg.includes('403')) return <AccessDenied />;
    listError =
      msg.includes('500') || msg.includes('503')
        ? 'Server or database error. Ensure the backend is running and migrations are applied.'
        : msg;
  } else {
    anomalies = Array.isArray(anomaliesResult) ? anomaliesResult : [];
  }

  return (
    <AppShell title="E-waste Console">
      <h2 className="text-xl font-bold tracking-tight text-slate-900">Anomalies</h2>
      <p className="text-sm text-slate-600 mt-1 mb-4">
        Weight variance and other alerts. Filter by type or severity.
      </p>
      {listError && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800" role="alert">
          {listError}
        </div>
      )}
      <AnomaliesFilters current={{ type, severity }} />

      {anomalies.length === 0 ? (
        <EmptyState
          title="No anomalies yet"
          description="Anomalies are created when recycler intake weight differs from hub weight beyond the configured threshold."
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50">
              <tr className="text-left text-slate-700">
                <th className="p-3">Type</th>
                <th className="p-3">Severity</th>
                <th className="p-3">Entity</th>
                <th className="p-3">Created</th>
                <th className="p-3">Payload</th>
              </tr>
            </thead>
            <tbody>
              {anomalies.map((a: { id: string; type: string; severity: string; entityType: string; entityId: string; createdAt: string; payloadJson?: Record<string, unknown> }) => (
                <tr key={a.id} className="border-t border-slate-200">
                  <td className="p-3 font-medium text-slate-900">{a.type}</td>
                  <td className="p-3 text-slate-600">{a.severity}</td>
                  <td className="p-3 text-slate-600">{a.entityType} {a.entityId?.slice(0, 8)}…</td>
                  <td className="p-3 text-slate-500">{new Date(a.createdAt).toLocaleString()}</td>
                  <td className="p-3 text-slate-500 max-w-xs truncate">
                    {a.payloadJson ? JSON.stringify(a.payloadJson) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppShell>
  );
}
