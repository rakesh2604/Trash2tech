export const AUTH_TOKEN_KEY = 'auth_token';

/** Default dashboard path after login, by role (API role: ADMIN, FIELD_CAPTAIN, RECYCLER, BRAND, COORDINATOR, CITIZEN). */
export function getDashboardPathForRole(role: string): string {
  switch (role) {
    case 'ADMIN':
      return '/admin/pickups';
    case 'FIELD_CAPTAIN':
      return '/captain/intake';
    case 'RECYCLER':
      return '/recycler/intake';
    case 'BRAND':
      return '/brand/epr-export';
    case 'COORDINATOR':
      return '/admin/pickups';
    case 'CITIZEN':
      return '/citizen';
    default:
      return '/admin/pickups';
  }
}

export type ApiConfig = {
  baseUrl: string;
};

function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api/v1';
}

/** Resolve token: explicit token, or (client-only) localStorage. */
function resolveToken(token?: string | null): string | null {
  if (token !== undefined && token !== null) return token;
  if (typeof window !== 'undefined') return localStorage.getItem(AUTH_TOKEN_KEY);
  return null;
}

async function apiFetch<T>(
  path: string,
  init?: RequestInit & { json?: unknown },
  token?: string | null
): Promise<T> {
  const url = `${getBaseUrl()}${path}`;
  const auth = resolveToken(token);
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init?.headers as Record<string, string> || {}),
  };
  if (auth) headers['Authorization'] = `Bearer ${auth}`;

  const res = await fetch(url, {
    ...init,
    headers,
    body: init?.json ? JSON.stringify(init.json) : init?.body,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    let errMsg: string;
    try {
      const errBody = JSON.parse(text) as {
        message?: string;
        error?: string | { message?: string; code?: string };
      };
      const nestedMsg =
        typeof errBody?.error === 'object' ? errBody.error?.message : errBody?.error;
      errMsg =
        nestedMsg ?? errBody?.message ?? (text || `Request failed (${res.status})`);
    } catch {
      errMsg = text || `API error ${res.status}`;
    }
    throw new Error(errMsg);
  }

  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('text/csv')) {
    return (await res.text()) as unknown as T;
  }

  return (await res.json()) as T;
}

function createApi(token?: string | null) {
  const t = token;
  return {
    auth: {
      login: (body: { email: string; password: string }) =>
        apiFetch<{ accessToken: string; user: { id: string; email: string; role: string } }>(
          '/auth/login',
          { method: 'POST', json: body },
          undefined
        ),
      me: () =>
        apiFetch<{ id: string; email: string; role: string }>('/auth/me', { cache: 'no-store' }, t),
      register: (body: { email: string; password: string; name: string; phone: string; role: string }) =>
        apiFetch<{ accessToken: string; user: { id: string; email: string; role: string } }>(
          '/auth/register',
          { method: 'POST', json: body },
          t
        ),
    },
    pickups: {
      list: (params?: { hubId?: string; status?: string; limit?: number }) => {
        const q = new URLSearchParams();
        if (params?.hubId) q.set('hubId', params.hubId);
        if (params?.status) q.set('status', params.status);
        const limit = params?.limit != null && Number.isInteger(params.limit) && params.limit >= 1 ? params.limit : 50;
        q.set('limit', String(limit));
        const suffix = q.toString() ? `?${q.toString()}` : '';
        return apiFetch<any[]>(`/pickups${suffix}`, { cache: 'no-store' }, t);
      },
      create: (body: any) => apiFetch<any>(`/pickups`, { method: 'POST', json: body }, t),
      updateStatus: (id: string, status: string) =>
        apiFetch<any>(`/pickups/${id}/status`, { method: 'PATCH', json: { status } }, t),
    },
    lots: {
      list: (params?: { hubId?: string; recyclerId?: string; status?: string; limit?: number }) => {
        const q = new URLSearchParams();
        if (params?.hubId) q.set('hubId', params.hubId);
        if (params?.recyclerId) q.set('recyclerId', params.recyclerId);
        if (params?.status) q.set('status', params.status);
        const limit = params?.limit != null && Number.isInteger(params.limit) && params.limit >= 1 ? params.limit : 50;
        q.set('limit', String(limit));
        const suffix = q.toString() ? `?${q.toString()}` : '';
        return apiFetch<any[]>(`/lots${suffix}`, { cache: 'no-store' }, t);
      },
      create: (body: any) => apiFetch<any>(`/lots`, { method: 'POST', json: body }, t),
      dispatch: (id: string, body: any) =>
        apiFetch<any>(`/lots/${id}/dispatch`, { method: 'POST', json: body }, t),
    },
    hubIntake: {
      record: (body: any) => apiFetch<any>(`/hub-intake`, { method: 'POST', json: body }, t),
    },
    bookingRequests: {
      list: (params?: { channel?: string; status?: string; phone?: string; limit?: number }) => {
        const q = new URLSearchParams();
        if (params?.channel) q.set('channel', params.channel);
        if (params?.status) q.set('status', params.status);
        if (params?.phone) q.set('phone', params.phone);
        const limit = params?.limit != null && Number.isInteger(params.limit) && params.limit >= 1 ? params.limit : 50;
        q.set('limit', String(limit));
        const suffix = q.toString() ? `?${q.toString()}` : '';
        return apiFetch<any[]>(`/booking-requests${suffix}`, { cache: 'no-store' }, t);
      },
    },
    recycler: {
      confirmIntake: (body: any) => apiFetch<any>(`/recycler/intakes`, { method: 'POST', json: body }, t),
    },
    epr: {
      exportCsv: (params: { brandId: string; reportingPeriod: string }) => {
        const q = new URLSearchParams(params);
        return apiFetch<string>(`/epr/export?${q.toString()}`, { cache: 'no-store' }, t);
      },
    },
    audit: {
      verify: (params: { entityType: string; entityId: string }) => {
        const q = new URLSearchParams(params);
        return apiFetch<any>(`/audit/verify?${q.toString()}`, { cache: 'no-store' }, t);
      },
    },
    reference: {
      hubs: () => apiFetch<{ id: string; name: string; city: string; pincode: string }[]>(`/reference/hubs`, { cache: 'no-store' }, t),
      materialCategories: () =>
        apiFetch<{ id: string; code: string; description: string }[]>(`/reference/material-categories`, { cache: 'no-store' }, t),
      recyclers: () => apiFetch<{ id: string; name: string; city: string }[]>(`/reference/recyclers`, { cache: 'no-store' }, t),
      brands: () =>
        apiFetch<{ id: string; name: string; eprRegistrationNumber: string }[]>(`/reference/brands`, { cache: 'no-store' }, t),
      users: () => apiFetch<{ id: string; name: string; phone: string; role: string }[]>(`/reference/users`, { cache: 'no-store' }, t),
    },
    hubIntakeRecords: {
      listAvailable: (hubId: string) =>
        apiFetch<{ id: string; weighedAt: string; hubWeightKg: string }[]>(`/hub-intake-records?hubId=${encodeURIComponent(hubId)}`, { cache: 'no-store' }, t),
    },
    incentives: {
      list: (params?: { actorType?: string; status?: string; limit?: number }) => {
        const q = new URLSearchParams();
        if (params?.actorType) q.set('actorType', params.actorType);
        if (params?.status) q.set('status', params.status);
        const limit = params?.limit != null && Number.isInteger(params.limit) && params.limit >= 1 ? params.limit : 100;
        q.set('limit', String(limit));
        const suffix = q.toString() ? `?${q.toString()}` : '';
        return apiFetch<any[]>(`/incentives${suffix}`, { cache: 'no-store' }, t);
      },
    },
    anomalies: {
      list: (params?: { entityType?: string; type?: string; severity?: string; limit?: number }) => {
        const q = new URLSearchParams();
        if (params?.entityType) q.set('entityType', params.entityType);
        if (params?.type) q.set('type', params.type);
        if (params?.severity) q.set('severity', params.severity);
        const limit = params?.limit != null && Number.isInteger(params.limit) && params.limit >= 1 ? params.limit : 100;
        q.set('limit', String(limit));
        const suffix = q.toString() ? `?${q.toString()}` : '';
        return apiFetch<any[]>(`/anomalies${suffix}`, { cache: 'no-store' }, t);
      },
    },
    adminSellRequests: {
      list: (status?: string) => {
        const q = status ? `?status=${encodeURIComponent(status)}` : '';
        return apiFetch<any[]>(`/admin/sell-requests${q}`, { cache: 'no-store' }, t);
      },
      convertToPickup: (id: string, hubId: string) =>
        apiFetch<any>(`/admin/sell-requests/${id}/convert-to-pickup`, { method: 'POST', json: { hubId } }, t),
      recordPayment: (id: string, paymentAmountRs: number) =>
        apiFetch<any>(`/admin/sell-requests/${id}/payment`, { method: 'PATCH', json: { paymentAmountRs } }, t),
    },
    citizen: {
      campaigns: () =>
        apiFetch<{ id: string; name: string; type: string; startAt: string; endAt: string; bonusPerKgRs: string }[]>(
          '/citizen/campaigns',
          { cache: 'no-store' },
          t
        ),
      materialCategories: () =>
        apiFetch<{ id: string; code: string; description: string }[]>(
          '/citizen/material-categories',
          { cache: 'no-store' },
          t
        ),
      sellRequests: {
        list: () =>
          apiFetch<any[]>('/citizen/sell-requests', { cache: 'no-store' }, t),
        create: (body: {
          address: { line1: string; line2?: string; landmark?: string; city: string; state: string; pincode: string };
          campaignId?: string;
          items: { materialCategoryId: string; estimatedWeightKg: number; description?: string }[];
          notes?: string;
          preferredDateFrom?: string;
          preferredDateTo?: string;
          alternatePhone?: string;
        }) => apiFetch<any>('/citizen/sell-requests', { method: 'POST', json: body }, t),
        get: (id: string) =>
          apiFetch<any>(`/citizen/sell-requests/${id}`, { cache: 'no-store' }, t),
        traceability: (id: string) =>
          apiFetch<any>(`/citizen/sell-requests/${id}/traceability`, { cache: 'no-store' }, t),
      },
    },
  };
}

/** API with optional token. Server: pass token from cookies. Client: uses localStorage when token is undefined. */
export const api = createApi(undefined);

/** Use in server components: pass token from cookies to attach JWT to requests. */
export function getApi(token: string | null | undefined) {
  return createApi(token ?? undefined);
}
