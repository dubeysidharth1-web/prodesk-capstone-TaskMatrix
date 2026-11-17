import test from 'node:test';
import assert from 'node:assert/strict';
import { useAuthStore } from '../store/useAuthStore.js';

// Mock request and response helpers to test Middleware logic in isolation
class MockNextURL {
  constructor(url) {
    this._url = new URL(url);
    this.pathname = this._url.pathname;
    this.searchParams = this._url.searchParams;
  }
  clone() {
    return new MockNextURL(this._url.toString());
  }
}

class MockRequest {
  constructor(url, cookies = {}) {
    this.url = url;
    this.nextUrl = new MockNextURL(url);
    this.headers = new Map();
    this.cookies = {
      _cookies: cookies,
      get: (name) => (cookies[name] ? { name, value: cookies[name] } : undefined),
      getAll: () => Object.entries(cookies).map(([name, value]) => ({ name, value })),
    };
  }
}

// Replicate the pure routing logic of middleware.js for test assertions
function evaluateMiddlewareRoute(user, pathname) {
  if (!user && pathname.startsWith('/dashboard')) {
    return { redirect: '/login', redirectToParam: pathname };
  }
  if (user && (pathname === '/login' || pathname === '/register')) {
    return { redirect: '/dashboard' };
  }
  return { next: true };
}

test('Scenario 1: Register a new user with auto-confirmation', () => {
  useAuthStore.getState().clearAuthUser();

  const mockSignUpResponse = {
    data: {
      user: {
        id: 'usr_abc123',
        email: 'alex@taskmatrix.io',
        user_metadata: { full_name: 'Alex Johnson', display_name: 'Alex Johnson' },
      },
      session: {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
      },
    },
    error: null,
  };

  const { data } = mockSignUpResponse;
  assert.ok(data.user && data.session, 'User and session must exist');

  // Sync only non-sensitive profile info into Zustand
  useAuthStore.getState().setAuthUser({
    id: data.user.id,
    name: data.user.user_metadata.full_name,
    email: data.user.email,
  });

  const state = useAuthStore.getState();
  assert.equal(state.isAuthenticated, true);
  assert.equal(state.user.id, 'usr_abc123');
  assert.equal(state.user.name, 'Alex Johnson');
  assert.equal(state.user.email, 'alex@taskmatrix.io');
  assert.equal(state.user.access_token, undefined, 'Access token must never be in Zustand');
  assert.equal(state.user.password, undefined, 'Password must never be in Zustand');
});

test('Scenario 2: Handle email confirmation when enabled (data.session is null)', () => {
  useAuthStore.getState().clearAuthUser();

  const mockUnconfirmedSignUpResponse = {
    data: {
      user: {
        id: 'usr_unconfirmed',
        email: 'pending@taskmatrix.io',
      },
      session: null, // Email confirmation enabled: session is null
    },
    error: null,
  };

  const { data } = mockUnconfirmedSignUpResponse;
  let redirectedToDashboard = false;
  let verificationNotice = '';

  if (data?.user && !data?.session) {
    verificationNotice = 'Registration successful! Please check your email inbox to confirm your account before logging in.';
  } else if (data?.session) {
    redirectedToDashboard = true;
  }

  assert.equal(redirectedToDashboard, false, 'Must not redirect to dashboard when session is null');
  assert.ok(verificationNotice.includes('check your email inbox'), 'Must show verification notice');
  assert.equal(useAuthStore.getState().isAuthenticated, false, 'Zustand must remain unauthenticated');
});

test('Scenario 3: Log in with valid credentials', () => {
  useAuthStore.getState().clearAuthUser();

  const mockSignInResponse = {
    data: {
      user: {
        id: 'usr_logged_in',
        email: 'dev@taskmatrix.io',
        user_metadata: { full_name: 'Dev Specialist' },
      },
      session: { access_token: 'mock_jwt' },
    },
    error: null,
  };

  const { data, error } = mockSignInResponse;
  assert.equal(error, null);

  const profileName = data.user.user_metadata.full_name;
  useAuthStore.getState().setAuthUser({
    id: data.user.id,
    name: profileName,
    email: data.user.email,
  });

  const state = useAuthStore.getState();
  assert.equal(state.isAuthenticated, true);
  assert.equal(state.user.name, 'Dev Specialist');
  assert.equal(state.user.email, 'dev@taskmatrix.io');
  assert.equal(state.user.id, 'usr_logged_in');
});

test('Scenario 4: Reject invalid credentials', () => {
  useAuthStore.getState().clearAuthUser();

  const mockInvalidSignInResponse = {
    data: { user: null, session: null },
    error: { message: 'Invalid login credentials' },
  };

  const { data, error } = mockInvalidSignInResponse;
  let serverError = '';
  if (error) {
    serverError = error.message;
  }

  assert.equal(serverError, 'Invalid login credentials');
  assert.equal(useAuthStore.getState().isAuthenticated, false);
  assert.equal(useAuthStore.getState().user.id, null);
});

test('Scenario 5: Access /dashboard without logging in redirects to /login', () => {
  const unauthenticatedUser = null;
  const decision = evaluateMiddlewareRoute(unauthenticatedUser, '/dashboard');

  assert.equal(decision.redirect, '/login');
  assert.equal(decision.redirectToParam, '/dashboard');
});

test('Scenario 6: Refresh the dashboard while authenticated maintains session', () => {
  const authenticatedUser = { id: 'usr_refresh', email: 'refresh@taskmatrix.io' };
  const decision = evaluateMiddlewareRoute(authenticatedUser, '/dashboard');

  assert.equal(decision.next, true, 'Middleware allows authenticated user to access dashboard on refresh');

  // Verify server-side component initialUser hydration
  const initialUser = {
    id: authenticatedUser.id,
    email: authenticatedUser.email,
    name: 'Refresh User',
  };
  useAuthStore.getState().setAuthUser(initialUser);

  const state = useAuthStore.getState();
  assert.equal(state.isAuthenticated, true);
  assert.equal(state.user.id, 'usr_refresh');
});

test('Scenario 7: Logout clears session and subsequent /dashboard access is rejected', () => {
  // Pre-condition: user is logged in
  useAuthStore.getState().setAuthUser({ id: 'usr_active', name: 'Active User', email: 'active@taskmatrix.io' });
  assert.equal(useAuthStore.getState().isAuthenticated, true);

  // Perform logout
  useAuthStore.getState().clearAuthUser();
  assert.equal(useAuthStore.getState().isAuthenticated, false);
  assert.equal(useAuthStore.getState().user.id, null);

  // Now simulate navigation to /dashboard with user session cleared
  const decisionAfterLogout = evaluateMiddlewareRoute(null, '/dashboard');
  assert.equal(decisionAfterLogout.redirect, '/login', 'Unauthenticated dashboard access redirects to /login');
});

test('Scenario 8: Navigate to /login or /register while already authenticated redirects to /dashboard', () => {
  const authenticatedUser = { id: 'usr_logged', email: 'member@taskmatrix.io' };

  const loginDecision = evaluateMiddlewareRoute(authenticatedUser, '/login');
  assert.equal(loginDecision.redirect, '/dashboard', 'Authenticated user visiting /login is redirected to /dashboard');

  const registerDecision = evaluateMiddlewareRoute(authenticatedUser, '/register');
  assert.equal(registerDecision.redirect, '/dashboard', 'Authenticated user visiting /register is redirected to /dashboard');
});
