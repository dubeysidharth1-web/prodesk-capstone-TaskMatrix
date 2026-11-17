import { create } from 'zustand';

/**
 * Zustand store for UI authentication state and profile synchronization.
 * SECURITY NOTICE: Sensitive credentials, passwords, session secrets, and tokens
 * must NEVER be stored here. Session truth is maintained via Supabase SSR HTTP-only cookies.
 */
export const useAuthStore = create((set) => ({
  user: {
    id: null,
    name: null,
    email: null,
  },
  isAuthenticated: false,

  setAuthUser: (userData) =>
    set({
      user: {
        id: userData?.id || null,
        name: userData?.name || null,
        email: userData?.email || null,
      },
      isAuthenticated: Boolean(userData && userData.id),
    }),

  clearAuthUser: () =>
    set({
      user: {
        id: null,
        name: null,
        email: null,
      },
      isAuthenticated: false,
    }),
}));
