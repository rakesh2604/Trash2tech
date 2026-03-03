import { AppShell } from '../../../components/app-shell';
import { AccessDenied } from '../../../components/access-denied';
import { EmptyState } from '../../../components/empty-state';
import { IncentivesFilters } from '../../../components/incentives-filters';
import { LoginRequired } from '../../../components/login-required';
import { getApi } from '../../../lib/api';
import { getAuthToken } from '../../../lib/auth-server';

type SearchParams = { actorType?: string; status?: string };

export default async function AdminIncentivesPage(props: { searchParams?: SearchParams }) {
  const token = await getAuthToken();
  if (!token) return <LoginRequired />;
  const sp = props.searchParams ?? {};
  const actorType = typeof sp.actorType === 'string' ? sp.actorType : undefined;
  const status = typeof sp.status === 'string' ? sp.status : undefined;

  const api = getApi(token);
  const incentivesResult = await api.incentives.list({ limit: 100, actorType, status }).catch((err: unknown) => err as Error);

  let listError: string | null = null;
  let incentives: { id: string; actorType: string; actorId: string; status: string; amountInr?: string; amountCents?: number; reason?: string; createdAt: string }[] = [];

  if (incentivesResult instanceof Error || (incentivesResult && !Array.isArray(incentivesResult))) {
    const err = incentivesResult instanceof Error ? incentivesResult : new Error(String(incentivesResult));
    const msg = err.message;
    if (msg.includes('403')) return <AccessDenied />;
    listError =
      msg.includes('500') || msg.includes('503')
        ? 'Server or database error. Ensure the backend is running and migrations are applied.'
        : msg;
  } else {
    incentives = Array.isArray(incentivesResult) ? incentivesResult : [];
  }

  return (
    <AppShell title="E-waste Console">
      <h2 className="text-xl font-bold tracking-tight text-white">Incentive ledger</h2>
      <p className="text-sm text-white/70 mt-1 mb-4">
        Accrued, approved, and paid incentives. Filter by actor type or status.
      </p>
      {listError && (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300" role="alert">
          {listError}
        </div>
      )}
      <IncentivesFilters current={{ actorType, status }} />

      {incentives.length === 0 ? (
        <EmptyState
          title="No incentive entries yet"
          description="Incentives are recorded when configured (e.g. per lot or pickup)."
        />
      ) : (
        <div className="table-glass overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th className="p-3">Actor type</th>
                <th className="p-3">Actor ID</th>
                <th className="p-3">Amount (INR)</th>
                <th className="p-3">Status</th>
                <th className="p-3">Reason</th>
                <th className="p-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {incentives.map((i) => (
                <tr key={i.id}>
                  <td className="p-3 font-medium">{i.actorType}</td>
                  <td className="p-3">{i.actorId?.slice(0, 8)}…</td>
                  <td className="p-3">{i.amountInr ?? (i.amountCents != null ? (i.amountCents / 100).toFixed(2) : '—')}</td>
                  <td className="p-3">{i.status}</td>
                  <td className="p-3 text-white/70">{i.reason ?? '—'}</td>
                  <td className="p-3 text-white/70">{new Date(i.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppShell>
  );
}
