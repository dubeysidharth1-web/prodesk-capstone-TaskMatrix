'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/useAuthStore';

export default function DashboardClient({ initialUser }) {
  const router = useRouter();
  const { user, setAuthUser, clearAuthUser } = useAuthStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Synchronize server-verified profile into Zustand on mount
  useEffect(() => {
    if (initialUser && initialUser.id) {
      setAuthUser({
        id: initialUser.id,
        name: initialUser.name,
        email: initialUser.email,
      });
    }
  }, [initialUser, setAuthUser]);

  // Use Zustand user if synchronized, otherwise fall back to initial server-verified profile
  const displayName = user?.name || initialUser?.name || 'Team Member';
  const displayEmail = user?.email || initialUser?.email || '';
  const displayId = user?.id || initialUser?.id || '';

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      clearAuthUser();
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-indigo-600 rounded flex items-center justify-center text-white font-bold text-sm">
              TM
            </div>
            <span className="font-semibold text-slate-900 text-lg">TaskMatrix</span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-slate-600 hidden sm:inline-block">
              {displayEmail}
            </span>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="py-1.5 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded border border-slate-300 transition-colors disabled:opacity-50"
            >
              {isLoggingOut ? 'Logging out...' : 'Log Out'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back, <span className="text-indigo-600">{displayName}</span>!
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            TaskMatrix Sprint 14 Walking Skeleton — Supabase Authenticated Session
          </p>

          <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-50 p-4 rounded border border-slate-200">
              <span className="text-xs uppercase font-semibold text-slate-500 tracking-wider">
                User Name
              </span>
              <p className="text-base font-medium text-slate-900 mt-1">{displayName}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded border border-slate-200">
              <span className="text-xs uppercase font-semibold text-slate-500 tracking-wider">
                User Email
              </span>
              <p className="text-base font-medium text-slate-900 mt-1">{displayEmail}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded border border-slate-200">
              <span className="text-xs uppercase font-semibold text-slate-500 tracking-wider">
                User UID
              </span>
              <p className="text-xs font-mono text-slate-700 mt-2 truncate" title={displayId}>
                {displayId}
              </p>
            </div>
          </div>
        </div>

        {/* Minimal Placeholder Kanban Notice */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-5 text-indigo-900 text-sm">
          <p className="font-semibold">Sprint 14 Walking Skeleton Scope Notice</p>
          <p className="mt-1 text-indigo-700">
            Sprint 14 focuses strictly on authentication architecture, routing, and route protection. High-fidelity Kanban board features and task CRUD will be connected in Sprint 15.
          </p>
        </div>
      </main>
    </div>
  );
}
