import Link from "next/link";
import { getPostsByCategory } from "@/lib/posts";
import { formatDate } from "@/lib/format";

/**
 * Deep Dives — 심층분석 카테고리(`tokens`)의 최신 글 3개를 카드형으로 노출.
 * 토큰 픽(stance 카드)과 분리: 여기는 본격 분석 글로 이어지는 입구.
 */
export async function DeepDives({ limit = 3 }: { limit?: number }) {
  const posts = (await getPostsByCategory("tokens")).slice(0, limit);
  if (posts.length === 0) return null;

  return (
    <section className="container-page mt-24">
      <header className="mb-10 flex items-baseline justify-between gap-4 flex-wrap">
        <div>
          <p className="text-eyebrow text-accent">Deep Dives</p>
          <h2 className="mt-3 font-display text-[32px] font-extrabold leading-[1.1] tracking-tight md:text-[40px]">
            심층분석
          </h2>
          <p className="mt-3 max-w-xl text-meta text-fg-muted">
            프로젝트 노믹스·온체인·섹터 흐름 — 장기 안목으로 읽는 토큰 분석.
          </p>
        </div>
        <Link
          href="/category/tokens"
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
