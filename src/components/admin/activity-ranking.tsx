import type { ActivityRankRow } from "@/lib/admin/members";

export function ActivityRanking({ rows }: { rows: ActivityRankRow[] }) {
  return (
    <section>
      <h2 className="font-display text-xl font-bold tracking-tight">
        Activity Ranking
      </h2>
      <p className="mt-1 text-meta text-fg-muted">
        댓글 + 좋아요 + 북마크 합계 상위.
      </p>
      {rows.length === 0 ? (
        <p className="mt-3 text-meta text-fg-muted">활동 데이터 없음.</p>
      ) : (
        <ol className="mt-3 divide-y divide-border rounded-md border border-border bg-surface-warm">
          {rows.map((r, i) => (
            <li
              key={r.user_id}
              className="flex items-center gap-3 p-4"
            >
              <span className="w-5 text-right text-meta text-fg-muted tabular-nums">
                {i + 1}
              </span>
              {r.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={r.avatar_url}
                  alt=""
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-border" aria-hidden />
              )}
              <p className="min-w-0 flex-1 truncate font-medium">
                {r.display_name ?? r.user_id.slice(0, 8)}
              </p>
              <p className="text-meta text-fg-muted tabular-nums">
                💬 {r.comments} · ❤ {r.likes} · 🔖 {r.bookmarks}
              </p>
              <p className="font-medium tabular-nums">{r.total}</p>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
