import type { RecentSignup } from "@/lib/admin/members";
import { formatDate } from "@/lib/format";

export function RecentSignupsList({ signups }: { signups: RecentSignup[] }) {
  return (
    <section>
      <h2 className="font-display text-xl font-bold tracking-tight">
        Recent Signups
      </h2>
      {signups.length === 0 ? (
        <p className="mt-3 text-meta text-fg-muted">최근 가입자가 없습니다.</p>
      ) : (
        <ul className="mt-3 divide-y divide-border rounded-md border border-border bg-surface-warm">
          {signups.map((s) => (
            <li key={s.id} className="flex items-center gap-3 p-4">
              {s.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={s.avatar_url}
                  alt=""
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-border" aria-hidden />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">
                  {s.display_name ?? s.email ?? s.id.slice(0, 8)}
                </p>
                {s.email && s.display_name && (
                  <p className="truncate text-meta text-fg-muted">{s.email}</p>
                )}
              </div>
              <p className="text-meta text-fg-muted">{formatDate(s.created_at)}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
