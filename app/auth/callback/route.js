import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Route handler to exchange auth code for session cookies (PKCE flow, email verification).
 */
export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // If code exchange fails or is missing, redirect to login with error parameter
  return NextResponse.redirect(`${origin}/login?error=verification_failed`);
}
