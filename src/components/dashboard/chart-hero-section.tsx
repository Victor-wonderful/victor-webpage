import { Suspense } from "react";
import { TechnicalsTable } from "./technicals-table";
import { VictorTakeCard } from "./victor-take-card";

/**
 * Top-of-dashboard hero. Pairs the day's editorial (Victor's take) with a
 * quantitative read (technicals table). A bare TradingView embed sat here
 * before — it was a mirror of tradingview.com and added no value. The
 * signal table answers "어느 코인이 지금 어떤 상태인가" in 2 seconds, which
 * is the actual dashboard use case.
 *
 * Layout: technicals 60% / take 40% on lg+. Stacked on smaller screens.
 */
export function ChartHeroSection() {
  return (
    <section className="container-page mt-12" aria-label="기술적 시그널 + Victor의 시각">
      <header className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <p className="text-eyebrow text-accent">Snapshot · Today</p>
          <h2 className="mt-2 font-display text-[28px] font-extrabold leading-[1.1] tracking-tight md:text-[36px]">
            지금 시장 + Victor의 시각
          </h2>
          <p className="mt-2 max-w-xl text-meta text-fg-muted">
            주요 6개 코인의 추세·RSI·200DMA·펀딩비를 한 표로. 옆에는 오늘의 매크로 코멘트.
          </p>
        </div>
      </header>

      <div className="grid items-stretch gap-4 lg:grid-cols-[1.5fr_1fr]">
        <Suspense
          fallback={
            <article className="flex h-full min-h-[400px] flex-col gap-2 border border-border bg-surface-warm/40 p-6">
              <p className="text-eyebrow text-accent">Technicals</p>
              <p className="mt-auto text-meta text-fg-muted">계산 중…</p>
            </article>
          }
        >
          <TechnicalsTable />
        </Suspense>
        <Suspense
          fallback={
            <aside className="flex h-full min-h-[200px] flex-col gap-2 border border-border bg-surface-warm/40 p-6">
              <p className="text-eyebrow text-accent">Victor의 시각</p>
              <p className="mt-auto text-meta text-fg-muted">불러오는 중…</p>
            </aside>
          }
        >
          <VictorTakeCard />
        </Suspense>
      </div>
    </section>
  );
}
