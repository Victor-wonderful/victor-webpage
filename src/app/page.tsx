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
import { DeepDives } from "@/components/home/deep-dives";
import { MostDiscussed } from "@/components/home/most-discussed";
import { TodaysPoll } from "@/components/home/todays-poll";
import { MarketSnapshot } from "@/components/home/market-snapshot";
import { MoversBoard } from "@/components/home/movers-board";
import { PositioningStrip } from "@/components/home/positioning-strip";
import { PromiseSection } from "@/components/home/promise-section";
import { ToolsRail } from "@/components/home/tools-rail";
import { BasicsTrackRail } from "@/components/home/basics-track-rail";

export const revalidate = 60;

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

  // Exclude the hero (already featured at top); show the rest.
  // Cap at 20 — beyond that, /blog has full pagination.
  const latest = rest.slice(0, 20);

  return (
    <>
      {/* ── Entry: who this site is for + 5 약속 ─────────── */}
      <PositioningStrip />

      {/* ── This week's headline ────────────────────────── */}
      <FeaturedHero post={hero} />

      {/* ── Market context (snapshot + nav) ─────────────── */}
      <MarketSnapshot />

      <section className="container-page mt-12">
        <PillNav />
      </section>

      {/* ── Editor's note + Sentence of the Day ─────────── */}
      <EditorNote />

      {/* ═════════════════════════════════════════════════
          Promise 01 · 매일 1개 시장 신호
          ═══════════════════════════════════════════════ */}
      <PromiseSection
        number="01"
        title="매일 1개 시장 신호"
        description="주간마켓인사이트로 시장 톤을 한 페이지에 정리. 보조 지표는 24시간 Movers."
      />
      <MoversBoard />

      {/* ═════════════════════════════════════════════════
          Promise 02 · 좋은 프로젝트 가려보기
          ═══════════════════════════════════════════════ */}
      <PromiseSection
        number="02"
        title="좋은 프로젝트 가려보기"
        description="심층분석으로 토크노믹스·메커니즘을 분해. stance 카드로 코어 자산의 현재 입장을 한 눈에."
      />
      <DeepDives />
      <TokenPicks />

      {/* ═════════════════════════════════════════════════
          Promise 03 · 검증된 셋업 라이브러리
          ═══════════════════════════════════════════════ */}
      <PromiseSection
        number="03"
        title="검증된 셋업 라이브러리"
        description="모든 셋업에 백테스트 수치(승률·MDD)를 공개. '어디서 들었는데'가 아닌 데이터로 검증된 것만."
      />
      <SpotlightSection items={spotlight} />
      <MustWatchGrid posts={mustWatch} />

      {/* ═════════════════════════════════════════════════
          Promise 04 · 자기 진단 도구
          ═══════════════════════════════════════════════ */}
      <PromiseSection
        number="04"
        title="자기 진단 도구"
        description="계산기 3개·체크리스트 3개·템플릿 2개. 글이 아니라 도구를 가져갑니다."
      />
      <ToolsRail />

      {/* ═════════════════════════════════════════════════
          Promise 05 · 시리즈 학습 트랙
          ═══════════════════════════════════════════════ */}
      <PromiseSection
        number="05"
        title="시리즈 학습 트랙"
        description="월가의 전설 × 크립토 — 100편 시리즈로 자기 매매 시스템을 단계적으로 구축합니다."
      />
      <BasicsTrackRail />

      {/* ── Engagement: poll · most discussed ───────────── */}
      <TodaysPoll />
      <MostDiscussed days={30} limit={3} />

      {/* ── Newsletter CTA ───────────────────────────────── */}
      <EditorialCTA
        eyebrow="Newsletter"
        headline={["Sign Up for Our", "Newsletter"]}
        ctaLabel="구독하기"
        ctaHref="/subscribe"
      />

      {/* ── Latest posts (uncategorized stream) ─────────── */}
      <section className="container-page mt-24">
        <header className="mb-10 flex items-baseline justify-between">
          <div>
            <p className="text-eyebrow text-accent">Latest</p>
            <h2 className="mt-3 break-keep font-display text-[40px] font-extrabold leading-[1.05] md:text-[48px]">
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
                  <h3 className="break-keep font-serif-body text-2xl font-bold leading-snug group-hover:text-accent">
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
