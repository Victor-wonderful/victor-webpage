import Link from "next/link";
import type { Post } from "@/lib/posts";

type Strategy = {
  post: Post;
  winRate: number; // %
  mdd: number; // %
  author?: string;
};

export function SpotlightSection({ items }: { items: Strategy[] }) {
  if (items.length === 0) return null;
  return (
    <section className="container-page mt-24">
      <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <header>
          <p className="text-eyebrow text-accent">Strategy Notes</p>
          <h2 className="mt-3 break-keep font-display text-[32px] font-extrabold leading-[1.1] tracking-tight md:text-[40px]">
            전략 노트
          </h2>
          <p className="mt-5 max-w-sm break-keep text-pretty text-meta leading-[1.7] text-fg-muted">
            왜 이 전략이 통하는지, 어디서 무너지는지. 진입·청산 룰과 실수 1개까지 풀어쓴 트레이딩 노트.
          </p>
        </header>

        <ul className="space-y-8">
          {items.map(({ post, winRate, mdd, author }) => (
            <li
              key={post.slug}
              className="group flex gap-5 border-b border-border pb-8 last:border-b-0"
            >
              {/* Round backtest badge */}
              <div className="shrink-0">
                <div className="flex h-20 w-20 flex-col items-center justify-center rounded-full bg-ink text-bg dark:bg-fg dark:text-ink">
                  <span className="font-display text-lg font-bold leading-none tabular-nums">
                    {winRate}%
                  </span>
                  <span className="mt-1 text-[10px] uppercase tracking-[0.18em] text-bg/70 dark:text-ink/70">
                    승률
                  </span>
                </div>
                <p className="mt-2 text-center text-[11px] tabular-nums text-fg-muted">
                  MDD {mdd}%
                </p>
              </div>
              <div className="min-w-0 flex-1">
                {author && (
                  <p className="text-meta text-fg-muted">By {author}</p>
                )}
                <h3 className="mt-1 font-serif-body text-xl font-bold leading-snug tracking-tight">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group-hover:text-accent"
                  >
                    {post.title}
                  </Link>
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-fg-muted">
                  {post.summary}
                </p>
                <ul className="mt-3 flex flex-wrap gap-2 text-[11px] text-fg-muted">
                  {post.tags.slice(0, 3).map((t) => (
                    <li key={t} className="rounded-full bg-surface-warm px-2 py-1">
                      #{t}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
