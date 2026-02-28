import Link from 'next/link';
import { AppShell } from '../../../components/app-shell';
import { AccessDenied } from '../../../components/access-denied';
import { EmptyState } from '../../../components/empty-state';
import { LoginRequired } from '../../../components/login-required';
import { PickupsFilters } from '../../../components/pickups-filters';
import { PickupsTableClient } from '../../../components/pickups-table-client';
import { getApi } from '../../../lib/api';
import { getAuthToken } from '../../../lib/auth-server';

type SearchParams = { status?: string; hubId?: string };

export default async function AdminPickupsPage(props: { searchParams?: SearchParams }) {
  const token = await getAuthToken();
  if (!token) return <LoginRequired />;
  const sp = props.searchParams ?? {};
  const status = typeof sp.status === 'string' ? sp.status : undefined;
  const hubId = typeof sp.hubId === 'string' ? sp.hubId : undefined;

  const api = getApi(token);
  const [pickupsResult, hubsList] = await Promise.all([
    api.pickups.list({ limit: 50, status, hubId }).catch((err: unknown) => err as Error),
    api.reference.hubs().catch(() => []),
  ]);

  let listError: string | null = null;
  let pickups: { id: string; pickupCode: string; status: string; hub?: { name?: string; id?: string }; sourceChannel: string; createdAt: string }[] = [];
  const hubs = hubsList ?? [];

  if (pickupsResult instanceof Error || (pickupsResult && !Array.isArray(pickupsResult))) {
    const err = pickupsResult instanceof Error ? pickupsResult : new Error(String(pickupsResult));
    const msg = err.message;
    if (msg.includes('403')) return <AccessDenied />;
    listError =
      msg.includes('500') || msg.includes('503')
        ? 'Database not ready. Run migrations from the backend folder: npm run typeorm:migrate'
        : msg;
  } else {
    pickups = Array.isArray(pickupsResult) ? pickupsResult : [];
  }

  return (
    <AppShell title="E-waste Console">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Pickups</h2>
          <p className="text-sm text-slate-600 mt-1">
            Operational view of pickup chain-of-custody (latest first). Filter by status or hub.
          </p>
        </div>
        <Link
          href="/admin/create-pickup"
          className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-light focus-visible:outline focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        >
          New pickup
        </Link>
      </div>
      {listError && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800" role="alert">
          {listError}
        </div>
      )}
      <PickupsFilters current={{ status, hubId }} hubs={hubs} />

      {pickups.length === 0 ? (
        <EmptyState
          title="No pickups yet"
          description="Pickups will appear here once created from Sell requests (convert to pickup) or manually. Use Pickups to update status (e.g. AT_HUB before hub intake), then Hub intake to weigh."
        />
      ) : (
        <PickupsTableClient pickups={pickups} />
      )}
    </AppShell>
  );
}

