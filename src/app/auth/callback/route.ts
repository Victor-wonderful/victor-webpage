/**
 * Auth callback handler.
 *
 * Two flows feed this endpoint:
 *
 * 1. Email signup via /signup — a cookie carries the full form data
 *    (nickname, interests, newsletter, terms_agreed_at). We apply it to the
 *    user's profile in one shot and send them straight to the homepage.
 *
 * 2. Google OAuth or email login — no signup cookie. If the profile has no
 *    display_name yet (typical for Google first-timers) we redirect to
 *    /welcome to collect it; otherwise we go to the originally requested
 *    page.
 *
 * All DB writes are best-effort — a missing migration or transient error
 * never fails the entire login.
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { readAndClearSignupData } from "@/lib/auth-signup";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/";

  // Supabase forwards verification errors as query params instead of a code.
  // Surface a user-friendly hint rather than crashing.
  const supaError = url.searchParams.get("error");
  const supaErrorCode = url.searchParams.get("error_code");
  if (supaError || supaErrorCode) {
    console.warn(
      "[auth/callback] supabase returned error:",
      supaError,
      supaErrorCode,
    );
    const reason =
      supaErrorCode === "otp_expired"
        ? "link_expired"
        : supaErrorCode === "access_denied"
          ? "link_invalid"
          : "oauth_failed";
    return NextResponse.redirect(
      new URL(`/login?error=${reason}`, url.origin),
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL(`/login?error=oauth_failed`, url.origin),
    );
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error("[auth/callback] exchange failed:", error.message);
      return NextResponse.redirect(
        new URL(`/login?error=oauth_failed`, url.origin),
      );
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.redirect(new URL(next, url.origin));
    }

    // Path A — email signup with full data in cookie.
    const signupData = await readAndClearSignupData();
    if (signupData) {
      try {
        await supabase
          .from("profiles")
          .update({
            display_name: signupData.display_name,
            interests: signupData.interests,
            newsletter_opt_in: signupData.newsletter_opt_in,
            newsletter_channel: signupData.newsletter_channel,
            phone: signupData.phone,
            telegram_handle: signupData.telegram_handle,
            terms_agreed_at: signupData.terms_agreed_at,
            newsletter_consent_at: signupData.newsletter_opt_in
              ? signupData.terms_agreed_at
              : null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id);
      } catch (e) {
        console.warn("[auth/callback] profile write (signup) failed:", e);
      }
      return NextResponse.redirect(new URL("/", url.origin));
    }

    // Path B — Google OAuth or returning login. Only check display_name.
    let displayName: string | null = null;
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", user.id)
        .maybeSingle();
      displayName = profile?.display_name ?? null;
    } catch (e) {
      console.warn("[auth/callback] profile read failed:", e);
    }

    if (!displayName) {
      const params = new URLSearchParams();
      if (next && next !== "/" && next !== "/welcome") params.set("next", next);
      const qs = params.toString();
      return NextResponse.redirect(
        new URL(qs ? `/welcome?${qs}` : "/welcome", url.origin),
      );
    }
    return NextResponse.redirect(new URL(next, url.origin));
  } catch (e) {
    console.error("[auth/callback] unexpected error:", e);
    return NextResponse.redirect(
      new URL(`/login?error=oauth_failed`, url.origin),
    );
  }
}
