import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

function isRefreshTokenNoise(arg: unknown): boolean {
  if (!arg) return false;
  if (typeof arg === "string") return arg.includes("refresh_token_not_found");
  if (typeof arg === "object") {
    const a = arg as { code?: unknown; message?: unknown };
    if (a.code === "refresh_token_not_found") return true;
    if (typeof a.message === "string" && a.message.includes("Refresh Token")) {
      return true;
    }
  }
  return false;
}

async function withSilencedRefreshNoise<T>(fn: () => Promise<T>): Promise<T> {
  const original = console.error;
  console.error = (...args: unknown[]) => {
    if (args.some(isRefreshTokenNoise)) return;
    original(...(args as Parameters<typeof original>));
  };
  try {
    return await fn();
  } finally {
    console.error = original;
  }
}

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
  // If the cookie holds a stale/invalid refresh token, supabase-js logs an
  // AuthApiError via console.error from inside its refresh path. Run the
  // call with a scoped console.error filter so Next dev's error overlay
  // doesn't surface that signal; also clear the bad sb-* cookies so the
  // browser stops re-sending them on subsequent requests.
  const { error } = await withSilencedRefreshNoise(() =>
    supabase.auth.getUser().catch((err) => ({
      data: { user: null },
      error: err as { code?: string },
    })),
  );
  if (error?.code === "refresh_token_not_found") {
    for (const c of request.cookies.getAll()) {
      if (c.name.startsWith("sb-")) {
        supabaseResponse.cookies.delete(c.name);
      }
    }
  }

  return supabaseResponse;
}
