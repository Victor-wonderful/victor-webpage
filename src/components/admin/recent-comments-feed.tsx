import Link from "next/link";
import type { AdminCommentRow } from "@/lib/admin/stats";
import { formatDate } from "@/lib/format";

export function RecentCommentsFeed({ comments }: { comments: AdminCommentRow[] }) {
  return (
    <section>
      <h2 className="font-display text-xl font-bold tracking-tight">
        Recent Comments
      </h2>
      {comments.length === 0 ? (
        <p className="mt-3 text-meta text-fg-muted">댓글이 없습니다.</p>
      ) : (
        <ul className="mt-3 divide-y divide-border rounded-md border border-border bg-surface-warm">
          {comments.map((c) => (
            <li key={c.id} className="p-4">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-meta">
                  <span className="font-medium">{c.author_name ?? "익명"}</span>
                  <span className="text-fg-muted"> · {formatDate(c.created_at)}</span>
                </p>
                <Link
                  href={`/blog/${c.post_slug}#comments`}
                  className="text-meta text-accent hover:underline"
                >
                  글 보기 →
                </Link>
              </div>
              <p className="mt-2 line-clamp-3 text-sm text-fg">{c.body}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
