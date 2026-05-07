import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { formatDate } from "@/lib/format";
import { PillNav } from "@/components/pill-nav";
import { FeaturedHero } from "@/components/featured-hero";
import { EditorialCTA } from "@/components/editorial-cta";
import { SpotlightSection } from "@/components/spotlight-section";
import { MustWatchGrid } from "@/components/must-watch-grid";
import { EditorNote } from "@/components/home/editor-note";
import { TokenPicks } from "@/components/home/token-picks";
import { MostDiscussed } from "@/components/home/most-discussed";
import { TodaysPoll } from "@/components/home/todays-poll";

export default async function Home() {
  const posts = await getAllPosts();
  const [hero, ...rest] = posts;

  // Mock backtest stats until Sanity ‘strategy’ schema lands
  const spotlight = rest.slice(0, 2).map((p, i) => ({
    post: p,
    winRate: [78, 64][i] ?? 60,
    mdd: [12, 18][i] ?? 20,
    author: "Victor",
  }));

  // Curated chart-tagged posts
  const CHART_TAGS = ["차트노트", "차트", "chart"];
  const mustWatch = posts
    .filter((p) => p.tags?.some((t) => CHART_TAGS.includes(t)))
    .slice(0, 3);

  const latest = posts.slice(0, 8);

  return (
    <>
      {/* 1. Hero — 이번 주 핵심 글 */}
      <FeaturedHero post={hero} />

      <section className="container-page mt-12">
        <PillNav />
      </section>

      {/* 2. Editor's Note + Sentence of the Day */}
      <EditorNote />

      {/* 3. Token Picks — 투자 후보 토큰 */}
      <TokenPicks />

      {/* 4. Strategy Spotlight (기존, 재배치) */}
      <SpotlightSection items={spotlight} />

      {/* 5. Must-Watch Charts (차트 태그 글이 있을 때만 노출) */}
      <MustWatchGrid posts={mustWatch} />

      {/* 6. Today's Poll — 투표 위젯 */}
      <TodaysPoll />

      {/* 7. Most Discussed — 댓글 많은 글 */}
      <MostDiscussed days={30} limit={3} />

      {/* 7. Newsletter CTA */}
      <EditorialCTA
        eyebrow="Newsletter"
        headline={["Sign Up for Our", "Newsletter"]}
        ctaLabel="구독하기"
        ctaHref="/subscribe"
      />

      {/* 8. Latest — 최신 글 (간소) */}
      <section className="container-page mt-24">
        <header className="mb-10 flex items-baseline justify-between">
          <div>
            <p className="text-eyebrow text-accent">Latest</p>
            <h2 className="mt-3 font-display text-[40px] font-extrabold leading-[1.02] tracking-tight md:text-[48px]">
              최신 글
            </h2>
          </div>
          <Link href="/blog" className="text-meta text-fg-muted hover:text-accent">
            전체 보기 →
          </Link>
        </header>
        <ul className="divide-y divide-border border-y border-border">
          {latest.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/blog/${p.slug}`}
                className="group flex flex-col gap-2 py-6 transition-colors hover:bg-surface-warm/50 md:flex-row md:items-baseline md:justify-between"
              >
                <div className="min-w-0 flex-1 pr-4">
                  <h3 className="font-serif-body text-2xl font-bold leading-snug tracking-tight group-hover:text-accent">
                    {p.title}
                  </h3>
                  <p className="mt-1 line-clamp-1 text-sm text-fg-muted">
                    {p.summary}
                  </p>
                </div>
                <p className="shrink-0 text-meta text-fg-muted">
                  {formatDate(p.publishedAt)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
