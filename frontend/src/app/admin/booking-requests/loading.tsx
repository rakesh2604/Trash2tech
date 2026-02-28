import { AppShell } from '../../../components/app-shell';
import { TableSkeleton } from '../../../components/table-skeleton';

export default function AdminBookingRequestsLoading() {
  return (
    <AppShell title="E-waste Console">
      <h2 className="text-lg font-semibold mb-1">Booking requests</h2>
      <p className="text-sm text-slate-300 mb-6">
        Leads captured from WhatsApp / IVR before conversion to compliant pickups.
      </p>
      <TableSkeleton rows={6} cols={6} />
    </AppShell>
  );
}
