import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

/**
 * Server Component — renders either the "로그인" link (logged out)
 * or the user avatar + sign-out form (logged in).
 *
 * Used in the desktop header. Runs on every request because middleware
 * refreshes auth cookies; cheap (no extra DB query).
 */
export async function UserMenu({ className = "" }: { className?: string }) {
  const supabase = await createClient();
  // Supabase logs a noisy AuthApiError to stderr when the cookie carries an
  // expired/invalid refresh token, even though the call still resolves to
  // { user: null }. Swallow it — the logged-out branch handles that case.
  const user = await supabase.auth
    .getUser()
    .then((r) => r.data?.user ?? null)
    .catch(() => null);

  if (!user) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <Link
          href="/signup"
          className="rounded-full bg-accent px-4 py-2 font-semibold text-white transition-colors hover:bg-accent-hover"
        >
          회원가입
        </Link>
        <Link href="/login" className="hover:text-accent">
          로그인
        </Link>
      </div>
    );
  }

  const meta = (user.user_metadata ?? {}) as {
    avatar_url?: string;
    full_name?: string;
    name?: string;
  };
  const displayName =
    meta.full_name ?? meta.name ?? user.email?.split("@")[0] ?? "User";
  const avatar = meta.avatar_url;
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="hidden items-center gap-2 lg:flex" title={user.email ?? ""}>
        {avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatar}
            alt=""
            className="h-7 w-7 rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-semibold text-white">
            {initial}
          </span>
        )}
        <span className="text-meta">{displayName}</span>
      </span>
      <form action="/auth/sign-out" method="post">
        <button
          type="submit"
          className="text-meta hover:text-accent"
          aria-label="로그아웃"
        >
          로그아웃
        </button>
      </form>
    </div>
  );
}
