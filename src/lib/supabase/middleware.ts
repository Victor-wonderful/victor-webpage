import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

/**
 * Refreshes the auth session on each request and rewrites cookies.
 * Called from the project-root middleware.ts.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  // Touch the user — this is what actually refreshes the token cookie.
  // If the cookie holds a stale/invalid refresh token, Supabase logs a noisy
  // AuthApiError. Catch it and clear the bad auth cookies so subsequent
  // requests don't keep tripping the same error.
  const { error } = await supabase.auth.getUser().catch((err) => ({ error: err }));
  if (error?.code === "refresh_token_not_found") {
    for (const c of request.cookies.getAll()) {
      if (c.name.startsWith("sb-")) {
        supabaseResponse.cookies.delete(c.name);
      }
    }
  }

  return supabaseResponse;
}
