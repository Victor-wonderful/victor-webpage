import Link from "next/link";
import type { Post } from "@/lib/posts";
import { formatDate } from "@/lib/format";

/**
 * Compact text-card grid for Pine Script posts on the home page.
 * Mirrors the DeepDives visual rhythm (no hero image, tags + title +
 * summary + date) so Promise 03 reads as a coherent pair: strategy
 * notes (left) → executable code (right).
 */
export function PinescriptGrid({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="container-page mt-16">
      <header className="mb-8 flex items-baseline justify-between gap-4 flex-wrap">
        <div>
          <p className="text-eyebrow text-accent">Pine Script</p>
          <h2 className="mt-3 font-display text-[32px] font-extrabold leading-[1.1] tracking-tight md:text-[40px]">
            차트에 바로 붙이는 코드
          </h2>
          <p className="mt-3 max-w-xl text-meta text-fg-muted">
            전략 노트의 셋업을 TradingView Pine Script로 옮긴 코드 — 복붙해서 차트에 그대로.
          </p>
        </div>
        <Link
          href="/category/pinescript"
          className="text-meta text-fg-muted hover:text-accent"
        >
          전체 보기 →
        </Link>
      </header>

      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/blog/${p.slug}`}
              className="group flex h-full flex-col rounded-md border border-border bg-surface p-6 transition-colors hover:border-accent"
            >
              <div className="flex flex-wrap items-center gap-2">
                {(p.tags ?? []).slice(0, 3).map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-fg-muted"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <h3 className="mt-4 font-display text-xl font-bold leading-snug tracking-tight group-hover:text-accent break-keep text-pretty">
                {p.title}
              </h3>
              <p className="mt-3 break-keep text-pretty font-serif-body text-[15px] leading-[1.7] text-fg">
                {p.summary}
              </p>
              <p className="mt-auto pt-5 text-meta text-fg-muted">
                {formatDate(p.publishedAt)}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
