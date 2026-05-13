import { Suspense } from "react";
import { TvAdvancedChart } from "./tv-advanced-chart";
import { VictorTakeCard } from "./victor-take-card";

/**
 * Top-of-dashboard hero: live chart on the left, Victor's editorial take on
 * the right. The chart alone is a mirror of TradingView; pairing it with
 * the latest macro post is the actual differentiator.
 *
 * Layout: chart 65% / sidebar 35% on lg+. Stacked on smaller screens with
 * the sidebar collapsing below the chart.
 */
export function ChartHeroSection() {
  return (
    <section className="container-page mt-12" aria-label="라이브 차트 + Victor의 시각">
      <header className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <p className="text-eyebrow text-accent">Live Chart · TradingView</p>
          <h2 className="mt-2 font-display text-[28px] font-extrabold leading-[1.1] tracking-tight md:text-[36px]">
            지금 차트 + Victor의 시각
          </h2>
          <p className="mt-2 max-w-xl text-meta text-fg-muted">
            차트는 TradingView, 코멘트는 오늘의 시장(macro). 매일 갱신.
          </p>
        </div>
      </header>

      <div className="grid items-stretch gap-4 lg:grid-cols-[1.85fr_1fr]">
        <div className="min-h-[640px]">
          <TvAdvancedChart />
        </div>
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
