import { AppShell } from '../../components/app-shell';
import { LoginRequired } from '../../components/login-required';
import { getAuthToken } from '../../lib/auth-server';
import { CitizenDashboardClient } from '../../components/citizen/CitizenDashboardClient';

export default async function CitizenDashboardPage() {
  const token = await getAuthToken();
  if (!token) return <LoginRequired />;

  return (
    <AppShell title="My dashboard">
      <CitizenDashboardClient />
    </AppShell>
  );
}
