import { AppShell } from '../../../components/app-shell';
import { AccessDenied } from '../../../components/access-denied';
import { EmptyState } from '../../../components/empty-state';
import { BookingRequestsFilters } from '../../../components/booking-requests-filters';
import { LoginRequired } from '../../../components/login-required';
import { getApi } from '../../../lib/api';
import { getAuthToken } from '../../../lib/auth-server';

type SearchParams = { channel?: string; status?: string };

export default async function AdminBookingRequestsPage(props: { searchParams?: SearchParams }) {
  const token = await getAuthToken();
  if (!token) return <LoginRequired />;
  const sp = props.searchParams ?? {};
  const channel = typeof sp.channel === 'string' ? sp.channel : undefined;
  const status = typeof sp.status === 'string' ? sp.status : undefined;

  const api = getApi(token);
  const requestsResult = await api.bookingRequests.list({ limit: 50, channel, status }).catch((err: unknown) => err as Error);

  let listError: string | null = null;
  let requests: { id: string; channel: string; phone: string; status: string; createdAt: string; pincode?: string; pickupId?: string }[] = [];

  if (requestsResult instanceof Error || (requestsResult && !Array.isArray(requestsResult))) {
    const err = requestsResult instanceof Error ? requestsResult : new Error(String(requestsResult));
    const msg = err.message;
    if (msg.includes('403')) return <AccessDenied />;
    listError =
      msg.includes('500') || msg.includes('503')
        ? 'Server or database error. Ensure the backend is running and migrations are applied.'
        : msg;
  } else {
    requests = Array.isArray(requestsResult) ? requestsResult : [];
  }

  return (
    <AppShell title="E-waste Console">
      <h2 className="text-xl font-bold tracking-tight text-slate-900">Booking requests</h2>
      <p className="text-sm text-slate-600 mt-1 mb-4">
        Leads captured from WhatsApp / IVR before conversion to compliant pickups. Filter by channel or status.
      </p>
      {listError && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800" role="alert">
          {listError}
        </div>
      )}
      <BookingRequestsFilters current={{ channel, status }} />

      {requests.length === 0 ? (
        <EmptyState
          title="No booking requests yet"
          description="Requests will appear when citizens use WhatsApp or IVR (missed call) to request a pickup."
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50">
              <tr className="text-left text-slate-700">
                <th className="p-3">Channel</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Pincode</th>
                <th className="p-3">Status</th>
                <th className="p-3">Pickup</th>
                <th className="p-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r: { id: string; channel: string; phone: string; pincode?: string; status: string; pickupId?: string; createdAt: string }) => (
                <tr key={r.id} className="border-t border-slate-200">
                  <td className="p-3 text-slate-600">{r.channel}</td>
                  <td className="p-3 text-slate-600">{r.phone}</td>
                  <td className="p-3 text-slate-600">{r.pincode ?? '-'}</td>
                  <td className="p-3 text-slate-600">{r.status}</td>
                  <td className="p-3 text-slate-600">{r.pickupId ?? '-'}</td>
                  <td className="p-3 text-slate-500">{new Date(r.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppShell>
  );
}

