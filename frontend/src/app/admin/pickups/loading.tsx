import { AppShell } from '../../../components/app-shell';
import { TableSkeleton } from '../../../components/table-skeleton';

export default function AdminPickupsLoading() {
  return (
    <AppShell title="E-waste Console">
      <h2 className="text-lg font-semibold mb-1">Pickups</h2>
      <p className="text-sm text-slate-300 mb-6">
        Operational view of pickup chain-of-custody (latest first).
      </p>
      <TableSkeleton rows={6} cols={5} />
    </AppShell>
  );
}
