import { AppShell } from '../../../components/app-shell';
import { TableSkeleton } from '../../../components/table-skeleton';

export default function AdminLotsLoading() {
  return (
    <AppShell title="E-waste Console">
      <h2 className="text-lg font-semibold mb-1">Lots</h2>
      <p className="text-sm text-slate-300 mb-6">
        Aggregation hub lots and recycler dispatch status (latest first).
      </p>
      <TableSkeleton rows={6} cols={6} />
    </AppShell>
  );
}
