import { cookies } from 'next/headers';
import { AUTH_TOKEN_KEY } from './api';

/** Get JWT from cookie in server components. Returns null if not set. */
export async function getAuthToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(AUTH_TOKEN_KEY)?.value ?? null;
}
