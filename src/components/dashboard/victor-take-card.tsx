import Link from "next/link";
import { getPostsByCategory } from "@/lib/posts";
import { formatDate } from "@/lib/format";

/**
 * "Victor의 시각" sidebar card — sits next to the main TradingView chart.
 *
 * Pulls the latest post from the `macro` ("오늘의 시장") category and
 * renders title + summary + permalink. This is the daily editorial that
 * complements the live chart; without it, a TV embed alone is just a
 * mirror of tradingview.com.
 *
 * Falls back to an empty-state when no macro post exists yet.
 */
export async function VictorTakeCard() {
  const posts = await getPostsByCategory("macro").catch(() => []);
  const latest = posts[0];

  return (
    <aside
      className="flex h-full flex-col gap-4 border border-border bg-surface-warm/40 p-6"
      aria-label="Victor의 시각"
    >
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-eyebrow text-accent">Victor의 시각</p>
        {latest && (
          <p className="text-[11px] uppercase tracking-[0.18em] text-fg-muted">
            {formatDate(latest.publishedAt)}
          </p>
        )}
      </div>

      {!latest ? (
        <>
          <p className="font-display text-xl font-bold leading-snug">
            오늘의 시장 글이 아직 없습니다.
          </p>
          <p className="text-meta text-fg-muted">
            매일 발행되는 macro 카테고리 글이 여기에 자동으로 노출됩니다. 글이
            올라오면 차트 옆에 그날의 시각·핵심 레벨이 표시됩니다.
          </p>
          <Link
            href="/category/macro"
            className="mt-auto inline-block self-start text-meta font-semibold text-accent hover:text-accent-hover"
          >
            오늘의 시장 카테고리 →
          </Link>
        </>
      ) : (
        <>
          <Link
            href={`/blog/${latest.slug}`}
            className="group flex flex-col gap-3"
          >
            <h3 className="break-keep font-display text-xl font-bold leading-snug tracking-tight group-hover:text-accent md:text-2xl">
              {latest.title}
            </h3>
            <p className="break-keep font-serif-body text-[15px] leading-[1.65] text-fg">
              {latest.summary}
            </p>
          </Link>

          {(latest.tags ?? []).length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {(latest.tags ?? []).slice(0, 4).map((t) => (
                <li
                  key={t}
                  className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-fg-muted"
                >
                  {t}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-auto flex flex-wrap items-center gap-3 border-t border-border/60 pt-4">
            <Link
              href={`/blog/${latest.slug}`}
              className="text-meta font-semibold text-accent hover:text-accent-hover"
            >
              전문 보기 →
            </Link>
            <span className="text-meta text-fg-muted">·</span>
            <Link
              href="/category/macro"
              className="text-meta text-fg-muted hover:text-accent"
            >
              이전 글들
            </Link>
          </div>
        </>
      )}

      <p className="text-[11px] uppercase tracking-[0.18em] text-fg-muted">
        from /category/macro · 매일 갱신
      </p>
    </aside>
  );
}
