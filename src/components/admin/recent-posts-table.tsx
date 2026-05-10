import Link from "next/link";
import type { AdminPost, EngagementCount } from "@/lib/admin/stats";
import { getCategory } from "@/lib/categories";
import { formatDate } from "@/lib/format";

function telegramLink(messageId: number | null | undefined): string | null {
  if (!messageId) return null;
  const channelUrl = process.env.NEXT_PUBLIC_TELEGRAM_CHANNEL_URL;
  if (!channelUrl) return null;
  // Channel URL is like https://t.me/victor_alpha — append /<messageId>
  const trimmed = channelUrl.replace(/\/+$/, "");
  return `${trimmed}/${messageId}`;
}

export function RecentPostsTable({
  posts,
  engagement,
}: {
  posts: AdminPost[];
  engagement: Record<string, EngagementCount>;
}) {
  if (posts.length === 0) {
    return (
      <section className="mt-10">
        <h2 className="font-display text-2xl font-bold tracking-tight">
          Recent Posts
        </h2>
        <p className="mt-3 text-meta text-fg-muted">발행된 글이 없습니다.</p>
      </section>
    );
  }

  return (
    <section className="mt-10">
      <h2 className="font-display text-2xl font-bold tracking-tight">
        Recent Posts ({posts.length})
      </h2>
      <div className="mt-4 -mx-4 overflow-x-auto md:mx-0">
        <table className="w-full min-w-[760px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-left text-meta text-fg-muted">
              <th className="px-4 py-3 font-medium">제목</th>
              <th className="px-3 py-3 font-medium">카테고리</th>
              <th className="px-3 py-3 font-medium">발행일</th>
              <th className="px-2 py-3 text-right font-medium">💬</th>
              <th className="px-2 py-3 text-right font-medium">❤</th>
              <th className="px-2 py-3 text-right font-medium">🔖</th>
              <th className="px-3 py-3 font-medium">TG</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => {
              const cat = p.category ? getCategory(p.category) : undefined;
              const e = engagement[p.slug] ?? {
                comments: 0,
                likes: 0,
                bookmarks: 0,
              };
              const tgUrl = telegramLink(p.telegramMessageId);
              return (
                <tr
                  key={p._id}
                  className="border-b border-border align-top hover:bg-surface-warm"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/blog/${p.slug}`}
                      className="font-medium hover:text-accent"
                    >
                      {p.title}
                    </Link>
                  </td>
                  <td className="px-3 py-3 text-fg-muted">
                    {cat?.label ?? p.category}
                  </td>
                  <td className="px-3 py-3 text-fg-muted">
                    {formatDate(p.publishedAt)}
                  </td>
                  <td className="px-2 py-3 text-right tabular-nums">
                    {e.comments}
                  </td>
                  <td className="px-2 py-3 text-right tabular-nums">{e.likes}</td>
                  <td className="px-2 py-3 text-right tabular-nums">
                    {e.bookmarks}
                  </td>
                  <td className="px-3 py-3 text-meta">
                    {p.telegramSentAt ? (
                      tgUrl ? (
                        <a
                          href={tgUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-accent hover:underline"
                        >
                          {formatDate(p.telegramSentAt)}
                        </a>
                      ) : (
                        <span className="text-fg-muted">
                          {formatDate(p.telegramSentAt)}
                        </span>
                      )
                    ) : (
                      <span className="text-fg-muted">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
