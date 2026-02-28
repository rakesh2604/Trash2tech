import { AppShell } from '../../../components/app-shell';
import { TableSkeleton } from '../../../components/table-skeleton';

export default function AdminIncentivesLoading() {
  return (
    <AppShell title="E-waste Console">
      <h2 className="text-lg font-semibold mb-1">Incentive ledger</h2>
      <p className="text-sm text-slate-300 mb-6">
        Accrued, approved, and paid incentives (P1: payout tracking).
      </p>
      <TableSkeleton rows={5} cols={6} />
    </AppShell>
  );
}
