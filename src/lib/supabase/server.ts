import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

/**
 * When the browser cookie carries an expired/invalid refresh token, supabase-js
 * calls `console.error(authError)` from inside its refresh path BEFORE it
 * resolves the promise. Next dev intercepts every console.error(Error) and
 * paints a full-screen overlay — so .catch() on the caller side cannot fix it.
 *
 * Runs the supabase call with a scoped console.error filter that swallows
 * exactly this one signal. All other errors pass through untouched.
 */
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
 * Server-side Supabase client tied to the request's cookies.
 * Use from Server Components, Server Actions, and Route Handlers.
 *
 * `auth.getUser` is wrapped so a stale refresh-token cookie no longer floods
 * the dev console (and Next dev's error overlay). Callers still see the same
 * `{ data, error }` shape, including `error.code === "refresh_token_not_found"`
 * when the cookie is bad — they just don't see noisy console output.
 */
export async function createClient() {
  const cookieStore = await cookies();

  const client = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // setAll called from a Server Component is a no-op when middleware
          // refreshes sessions instead.
        }
      },
    },
  });

  const originalGetUser = client.auth.getUser.bind(client.auth);
  client.auth.getUser = ((jwt?: string) =>
    withSilencedRefreshNoise(() => originalGetUser(jwt))) as typeof client.auth.getUser;

  return client;
}
