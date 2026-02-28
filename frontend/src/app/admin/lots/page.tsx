import { AppShell } from '../../../components/app-shell';
import { AccessDenied } from '../../../components/access-denied';
import { EmptyState } from '../../../components/empty-state';
import { LotsFilters } from '../../../components/lots-filters';
import { LotsTableWithDispatch } from '../../../components/lots-table-with-dispatch';
import { LoginRequired } from '../../../components/login-required';
import { getApi } from '../../../lib/api';
import { getAuthToken } from '../../../lib/auth-server';

type SearchParams = { status?: string; hubId?: string; recyclerId?: string };

export default async function AdminLotsPage(props: { searchParams?: SearchParams }) {
  const token = await getAuthToken();
  if (!token) return <LoginRequired />;
  const sp = props.searchParams ?? {};
  const status = typeof sp.status === 'string' ? sp.status : undefined;
  const hubId = typeof sp.hubId === 'string' ? sp.hubId : undefined;
  const recyclerId = typeof sp.recyclerId === 'string' ? sp.recyclerId : undefined;

  const api = getApi(token);
  const [lotsResult, hubsList, recyclersList] = await Promise.all([
    api.lots.list({ limit: 50, status, hubId, recyclerId }).catch((err: unknown) => err as Error),
    api.reference.hubs().catch(() => []),
    api.reference.recyclers().catch(() => []),
  ]);

  let listError: string | null = null;
  let lots: { id: string; lotCode: string; status: string; hub?: { name?: string; id?: string }; recycler?: { name?: string; id?: string }; materialCategory?: { code?: string }; createdAt: string }[] = [];
  const hubs = hubsList ?? [];
  const recyclers = recyclersList ?? [];

  if (lotsResult instanceof Error || (lotsResult && !Array.isArray(lotsResult))) {
    const err = lotsResult instanceof Error ? lotsResult : new Error(String(lotsResult));
    const msg = err.message;
    if (msg.includes('403')) return <AccessDenied />;
    listError =
      msg.includes('500') || msg.includes('503')
        ? 'Server or database error. Ensure the backend is running and migrations are applied.'
        : msg;
  } else {
    lots = Array.isArray(lotsResult) ? lotsResult : [];
  }

  return (
    <AppShell title="E-waste Console">
      <h2 className="text-xl font-bold tracking-tight text-slate-900">Lots</h2>
      <p className="text-sm text-slate-600 mt-1 mb-4">
        Aggregation hub lots and recycler dispatch status. Filter by status, hub, or recycler.
      </p>
      {listError && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800" role="alert">
          {listError}
        </div>
      )}
      <LotsFilters current={{ status, hubId, recyclerId }} hubs={hubs} recyclers={recyclers} />

      {lots.length === 0 ? (
        <EmptyState
          title="No lots yet"
          description="Record hub intakes first, then create lots from the Field Captain lot-creation page."
        />
      ) : (
        <LotsTableWithDispatch lots={lots as { id: string; lotCode: string; status: string; hub?: { name?: string; id?: string }; recycler?: { name?: string; id?: string }; materialCategory?: { code?: string }; createdAt: string }[]} />
      )}
    </AppShell>
  );
}

