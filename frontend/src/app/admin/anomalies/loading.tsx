import { AppShell } from '../../../components/app-shell';
import { TableSkeleton } from '../../../components/table-skeleton';

export default function AdminAnomaliesLoading() {
  return (
    <AppShell title="E-waste Console">
      <h2 className="text-lg font-semibold mb-1">Anomalies</h2>
      <p className="text-sm text-slate-300 mb-6">
        Weight variance and other alerts (e.g. hub vs recycler weight mismatch).
      </p>
      <TableSkeleton rows={5} cols={5} />
    </AppShell>
  );
}
