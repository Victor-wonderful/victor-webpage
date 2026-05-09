import Link from "next/link";
import { getPostsByCategory } from "@/lib/posts";
import { formatDate } from "@/lib/format";

/**
 * Basics Track Rail — Promise #5 payoff zone.
 * Latest 3 posts in 입문 가이드(basics) + book series intro card.
 */
export async function BasicsTrackRail({ limit = 3 }: { limit?: number }) {
  const posts = (await getPostsByCategory("basics")).slice(0, limit);

  return (
    <section className="container-page mt-10">
      <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        {/* Series intro card */}
        <aside className="rounded-md border border-border bg-surface-warm p-6">
          <p className="text-eyebrow text-accent">시리즈</p>
          <h3 className="mt-2 break-keep font-display text-[22px] font-extrabold leading-[1.2]">
            월가의 전설 ×<br />
            크립토
          </h3>
          <p className="mt-3 break-keep font-serif-body text-[14px] leading-[1.7] text-fg-muted">
            Livermore·Soros·Tudor Jones·Dalio·Druckenmiller의 검증된 원칙을
            암호화폐에 적용하는 100편 시리즈. 매주 화·목 발행, 약 12개월 트랙.
          </p>
          <Link
            href="/category/basics"
            className="mt-5 inline-block text-meta font-medium text-accent hover:text-accent-hover"
          >
            시리즈 전체 →
          </Link>
        </aside>

        {/* Latest posts list */}
        <div>
          {posts.length === 0 ? (
            <div className="flex h-full items-center rounded-md border border-dashed border-border p-6 text-meta text-fg-muted">
              곧 첫 시리즈가 발행됩니다.
            </div>
          ) : (
            <ul className="space-y-3">
              {posts.map((p, i) => (
                <li key={p.slug}>
                  <Link
                    href={`/blog/${p.slug}`}
                    className="group flex items-baseline justify-between gap-4 rounded-md border border-border bg-surface p-5 transition-colors hover:border-accent"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-[11px] uppercase tracking-wider text-accent">
                        편 {String(posts.length - i).padStart(2, "0")} ·{" "}
                        {formatDate(p.publishedAt)}
                      </p>
                      <h4 className="mt-1.5 break-keep font-display text-[18px] font-bold leading-snug group-hover:text-accent">
                        {p.title}
                      </h4>
                      <p className="mt-1 line-clamp-2 break-keep font-serif-body text-[14px] leading-[1.6] text-fg-muted">
                        {p.summary}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
