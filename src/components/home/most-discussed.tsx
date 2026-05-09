import Link from "next/link";
import { getMostDiscussedSlugs } from "@/lib/comments";
import { getAllPosts } from "@/lib/posts";
import { formatDate } from "@/lib/format";

export async function MostDiscussed({ days = 30, limit = 3 }: { days?: number; limit?: number }) {
  const [ranked, posts] = await Promise.all([
    getMostDiscussedSlugs(days, limit),
    getAllPosts(),
  ]);
  if (ranked.length === 0) return null;

  const byId = new Map(posts.map((p) => [p.slug, p]));
  const items = ranked
    .map((r) => ({ post: byId.get(r.slug), count: r.count }))
    .filter((i) => i.post);

  if (items.length === 0) return null;

  return (
    <section className="container-page mt-24">
      <header className="mb-10">
        <p className="text-eyebrow text-accent">Loud This Week</p>
        <h2 className="mt-3 font-display text-[32px] font-extrabold leading-[1.1] tracking-tight md:text-[40px]">
          가장 활발한 글
        </h2>
        <p className="mt-3 text-meta text-fg-muted">
          최근 {days}일간 댓글이 가장 많이 달린 글입니다.
        </p>
      </header>

      <ol className="space-y-6">
        {items.map(({ post, count }, i) => (
          <li key={post!.slug} className="group">
            <Link
              href={`/blog/${post!.slug}`}
              className="flex gap-5 rounded-md border border-border bg-surface p-5 transition-colors hover:border-accent"
            >
              <span className="font-display text-4xl font-extrabold tabular-nums leading-none text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-serif-body text-xl font-bold leading-snug tracking-tight group-hover:text-accent">
                  {post!.title}
                </h3>
                <p className="mt-2 line-clamp-1 text-meta text-fg-muted">
                  {post!.summary}
                </p>
                <p className="mt-3 flex items-center gap-3 text-meta text-fg-muted">
                  <span className="inline-flex items-center gap-1.5">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    <span className="tabular-nums">{count}</span>
                  </span>
                  <span aria-hidden="true">·</span>
                  <time dateTime={post!.publishedAt}>
                    {formatDate(post!.publishedAt)}
                  </time>
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
