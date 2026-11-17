'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/useAuthStore';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/dashboard';
  const errorParam = searchParams.get('error');

  const setAuthUser = useAuthStore((state) => state.setAuthUser);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState(
    errorParam === 'verification_failed'
      ? 'Verification link expired or invalid. Please try logging in again.'
      : ''
  );

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) {
      setServerError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) {
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (error) {
        // Safe diagnostic logging (no passwords or sensitive tokens logged)
        console.warn('[TaskMatrix Auth Debug] Login failed:', {
          message: error.message,
          status: error.status,
          code: error.code,
        });
        setServerError(error.message);
        return;
      }

      if (data?.user) {
        const profileName =
          data.user.user_metadata?.full_name ||
          data.user.user_metadata?.display_name ||
          data.user.email?.split('@')[0] ||
          'Team Member';

        // Synchronize non-sensitive profile info into Zustand
        setAuthUser({
          id: data.user.id,
          name: profileName,
          email: data.user.email,
        });

        router.push(redirectTo);
        router.refresh();
      }
    } catch (err) {
      setServerError(err.message || 'An unexpected error occurred during login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-lg border border-slate-200 shadow-sm p-6 sm:p-8">
      <div className="mb-6 text-center">
        <h1 className="text-xl font-bold text-slate-900">Sign in to TaskMatrix</h1>
        <p className="text-sm text-slate-500 mt-1">Enter your credentials to access your dashboard</p>
      </div>

      {serverError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md" role="alert">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
            className={`w-full px-3 py-2 text-sm border rounded-md outline-none transition-colors ${
              errors.email
                ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-red-50/20'
                : 'border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
            }`}
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading}
            className={`w-full px-3 py-2 text-sm border rounded-md outline-none transition-colors ${
              errors.password
                ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-red-50/20'
                : 'border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
            }`}
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-600">{errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium rounded-md text-sm transition-colors flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="inline-flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Signing in...
            </span>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-500">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-indigo-600 hover:text-indigo-700 font-medium">
          Register here
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Suspense
        fallback={
          <div className="w-full max-w-md bg-white rounded-lg border border-slate-200 shadow-sm p-8 text-center text-slate-500 text-sm">
            Loading sign-in...
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
