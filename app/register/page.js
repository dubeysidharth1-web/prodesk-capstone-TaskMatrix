'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/useAuthStore';

export default function RegisterPage() {
  const router = useRouter();
  const setAuthUser = useAuthStore((state) => state.setAuthUser);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [verificationNotice, setVerificationNotice] = useState('');

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required.';
    }

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

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Password confirmation is required.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
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
    setVerificationNotice('');

    if (!validate()) {
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();
      const redirectUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/auth/callback`
        : undefined;

      const { data, error } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
        options: {
          data: {
            full_name: formData.name.trim(),
            display_name: formData.name.trim(),
          },
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) {
        setServerError(error.message);
        return;
      }

      // If email confirmation is enabled, Supabase returns a user but session is null.
      if (data?.user && !data?.session) {
        setVerificationNotice(
          'Registration successful! Please check your email inbox to confirm your account before logging in.'
        );
        return;
      }

      // If email confirmation is disabled or auto-confirmed, session is provided:
      if (data?.session && data?.user) {
        // Synchronize user profile into Zustand (no tokens/secrets)
        setAuthUser({
          id: data.user.id,
          name: formData.name.trim(),
          email: data.user.email,
        });
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      setServerError(err.message || 'An unexpected error occurred during registration.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-bold text-slate-900">Create an Account</h1>
          <p className="text-sm text-slate-500 mt-1">Get started with TaskMatrix Agile Management</p>
        </div>

        {serverError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md" role="alert">
            {serverError}
          </div>
        )}

        {verificationNotice && (
          <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-md space-y-2" role="status">
            <p className="font-semibold">Check your email</p>
            <p>{verificationNotice}</p>
            <div className="pt-2">
              <Link href="/login" className="text-emerald-700 underline font-medium hover:text-emerald-900">
                Proceed to Login once confirmed &rarr;
              </Link>
            </div>
          </div>
        )}

        {!verificationNotice && (
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                disabled={isLoading}
                className={`w-full px-3 py-2 text-sm border rounded-md outline-none transition-colors ${
                  errors.name
                    ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-red-50/20'
                    : 'border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                }`}
                placeholder="Alex Johnson"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-600">{errors.name}</p>
              )}
            </div>

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
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                className={`w-full px-3 py-2 text-sm border rounded-md outline-none transition-colors ${
                  errors.password
                    ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-red-50/20'
                    : 'border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                }`}
                placeholder="At least 6 characters"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isLoading}
                className={`w-full px-3 py-2 text-sm border rounded-md outline-none transition-colors ${
                  errors.confirmPassword
                    ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-red-50/20'
                    : 'border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                }`}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>
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
                  Creating Account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link href="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
