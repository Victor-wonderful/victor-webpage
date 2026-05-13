import { Suspense } from "react";
import { TechnicalsTable } from "./technicals-table";
import { VictorTakeCard } from "./victor-take-card";
import { SectionExplainer } from "./section-explainer";

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

      <SectionExplainer
        topics={[
          {
            title: "추세 1D (가격 vs EMA21)",
            body: (
              <>
                ▲ 상승 = 가격이 21일 EMA 위, 단기 추세 살아있음 → 추격 가능. <br />
                ▼ 하락 = EMA 아래, 추세 약화 → 추격 자제, 반등 후 진입 검토. <br />
                → 횡보 = 박스권, 돌파 방향 기다리기.
              </>
            ),
          },
          {
            title: "RSI 14",
            body: (
              <>
                <strong>70+</strong> 과매수 — 추격보다 분할 익절. <br />
                <strong>30-</strong> 과매도 — 단기 바운스 후보, 단 추세 반전 확인 필요. <br />
                <strong>45-65</strong> 건강한 추세 영역.
              </>
            ),
          },
          {
            title: "200DMA 위치",
            body: (
              <>
                현재가가 200일 평균선 위 = 장기 강세장 유지. <br />
                아래 = 장기 약세 의심, 큰 포지션 자제. <br />
                기관·장기 투자자가 가장 많이 보는 1차 기준선.
              </>
            ),
          },
          {
            title: "펀딩비 (Perp)",
            body: (
              <>
                양수 = 롱이 비용 지불 (롱 우세). <br />
                <strong>+0.05%/8h 이상</strong> 지속 = 롱 과열 신호. <br />
                음수 = 숏이 비용 지불 (숏 우세, 바운스 가능).
              </>
            ),
          },
          {
            title: "한 줄 요약",
            body: (
              <>
                각 코인 행 아래 자동 생성되는 룰베이스 코멘트. 4가지 신호(추세·RSI·200DMA·펀딩비)를 조합한 가벼운 가이드 — 결정의 전부가 아니라 시작점.
              </>
            ),
          },
          {
            title: "Victor의 시각 (옆 카드)",
            body: (
              <>
                매일 발행되는 macro(오늘의 시장) 글의 핵심 요약. 수치만으로 못 잡는 그날의 컨텍스트(이벤트·시나리오·핵심 레벨)를 제공. 표 + 시각 같이 봐야 완성.
              </>
            ),
          },
        ]}
      />

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
