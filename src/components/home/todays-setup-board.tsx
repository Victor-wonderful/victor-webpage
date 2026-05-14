import Link from "next/link";
import { getActiveTradeIdeas } from "@/lib/trade-ideas";
import { TradeIdeaCard } from "@/components/today/trade-idea-card";

/**
 * TodaysSetupBoard — 홈 Promise 01 아래 노출하는 활성 셋업 보드.
 * Plan Part C Phase 2: 신규 tradeIdea 콘텐츠 타입에서 active 카드 1~3개 렌더.
 *
 * 활성 카드 0개면 컴포넌트는 null (빈 박스 X — 정직 원칙).
 * 1개면 단독, 2~3개면 그리드.
 */
export async function TodaysSetupBoard({ limit = 3 }: { limit?: number }) {
  const ideas = (await getActiveTradeIdeas()).slice(0, limit);
  if (ideas.length === 0) return null;

  return (
    <section className="container-page mt-6">
      <header className="mb-4 flex items-baseline justify-between gap-4">
        <p className="text-eyebrow text-accent">오늘의 셋업</p>
        <Link
          href="/today"
          className="text-meta text-fg-muted hover:text-accent"
        >
          전체 + 결과 추적 →
        </Link>
      </header>
      <div
        className={
          ideas.length === 1
            ? "grid"
            : "grid gap-4 md:grid-cols-2 xl:grid-cols-3"
        }
      >
        {ideas.map((idea) => (
          <TradeIdeaCard key={idea.slug} idea={idea} variant="board" />
        ))}
      </div>
    </section>
  );
}
