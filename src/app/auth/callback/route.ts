/**
 * OAuth callback handler.
 *
 * Supabase redirects here with `?code=...` after the user authenticates
 * with the upstream provider (Google). We exchange the code for a session
 * cookie and redirect back to the originating page.
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL(next, url.origin));
    }
    console.error("[auth/callback] exchange failed:", error.message);
  }

  // Fallback — show a hint and let the user retry.
  return NextResponse.redirect(
    new URL(`/login?error=oauth_failed`, url.origin),
  );
}
