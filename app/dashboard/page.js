import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import DashboardClient from './DashboardClient';

export const metadata = {
  title: 'Dashboard — TaskMatrix',
};

/**
 * Server Component: Authenticates user server-side using Supabase cookies before rendering.
 * Unauthenticated requests are immediately redirected to /login.
 */
export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/login');
  }

  const initialUser = {
    id: user.id,
    email: user.email,
    name:
      user.user_metadata?.full_name ||
      user.user_metadata?.display_name ||
      user.email?.split('@')[0] ||
      'Team Member',
  };

  return <DashboardClient initialUser={initialUser} />;
}
