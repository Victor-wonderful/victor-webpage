import type { Metadata } from "next";
import { Suspense } from "react";
import { PillNav } from "@/components/pill-nav";
import {
  FearGreedCard,
  DominanceCard,
} from "@/components/home/market-snapshot";
import { MoversBoard } from "@/components/home/movers-board";
import { ChartHeroSection } from "@/components/dashboard/chart-hero-section";
import { MiniChartsGrid } from "@/components/dashboard/mini-charts-grid";
import { PriceStrip } from "@/components/dashboard/price-strip";
import { KimchiCard } from "@/components/dashboard/kimchi-card";
import { AltSeasonCard } from "@/components/dashboard/alt-season-card";
import { StablecapCard } from "@/components/dashboard/stablecap-card";
import { FundingRateTable } from "@/components/dashboard/funding-rate-table";
import { EtfFlowCard } from "@/components/dashboard/etf-flow-card";
import { LiquidationHeatmap } from "@/components/dashboard/liquidation-heatmap";
import { ThisWeekPanel } from "@/components/dashboard/this-week-panel";
import { SessionsClock } from "@/components/dashboard/sessions-clock";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "트레이딩 대시보드 · Victor Alpha",
  description:
    "BTC·ETH 라이브 차트, 김치 프리미엄, 펀딩비 히트맵, 청산 히트맵, ETF 순유입, 매크로 이벤트 — 한 페이지에서.",
};

function CardFallback({ label }: { label: string }) {
  return (
    <article className="flex h-full min-h-[180px] flex-col gap-2 border border-border bg-surface-warm/40 p-6">
      <p className="text-eyebrow text-accent">{label}</p>
      <p className="mt-auto text-meta text-fg-muted">데이터 로드 중…</p>
    </article>
  );
}

export default function DashboardPage() {
  return (
    <>
      {/* ── Header ─────────────────────────────────────── */}
      <section className="container-page mt-12">
        <p className="text-eyebrow text-accent">Trading Dashboard · Live</p>
        <h1 className="mt-3 break-keep font-display text-[40px] font-extrabold leading-[1.05] tracking-tight md:text-[56px]">
          트레이딩 대시보드
        </h1>
        <p className="mt-4 max-w-2xl break-keep text-pretty font-serif-body text-lg leading-[1.65] text-fg-muted">
          매일 1분, 시장 상태·자금 흐름·다가오는 이벤트를 한 페이지에서. 영문 대시보드들이
          채우지 못하는 김치 프리미엄과 Victor의 시각을 같이 봅니다.
        </p>
      </section>

      <section className="container-page mt-10">
        <PillNav />
      </section>

      {/* ── 1. Live Chart + Victor's take ─────────────── */}
      <ChartHeroSection />

      {/* ── 1b. Watchlist mini charts ─────────────────── */}
      <MiniChartsGrid />

      {/* ── 2. Price strip ────────────────────────────── */}
      <Suspense
        fallback={
          <section className="container-page mt-8">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              <CardFallback label="BTC" />
              <CardFallback label="ETH" />
              <CardFallback label="SOL" />
            </div>
          </section>
        }
      >
        <PriceStrip />
      </Suspense>

      {/* ── 3. Live Market: sentiment & structure ────── */}
      <section className="container-page mt-12" aria-label="시장 심리·구조">
        <header className="mb-6">
          <p className="text-eyebrow text-accent">Live Market</p>
          <h2 className="mt-2 font-display text-[28px] font-extrabold leading-[1.1] tracking-tight md:text-[36px]">
            지금 시장은 어디 있나
          </h2>
          <p className="mt-2 max-w-xl text-meta text-fg-muted">
            심리(F&amp;G) · 구조(BTC Dominance) · 알트 사이클(Alt Season) · 지역 프리미엄(김프) · 유동성(Stablecoin).
          </p>
        </header>
        <div className="grid items-stretch gap-4 md:grid-cols-3 lg:grid-cols-5">
          <Suspense fallback={<CardFallback label="Fear & Greed" />}>
            <FearGreedCard />
          </Suspense>
          <Suspense fallback={<CardFallback label="BTC Dominance" />}>
            <DominanceCard />
          </Suspense>
          <Suspense fallback={<CardFallback label="Alt Season Index" />}>
            <AltSeasonCard />
          </Suspense>
          <Suspense fallback={<CardFallback label="김치 프리미엄" />}>
            <KimchiCard />
          </Suspense>
          <Suspense fallback={<CardFallback label="Stablecoin Mcap" />}>
            <StablecapCard />
          </Suspense>
        </div>
      </section>

      {/* ── 4. Flow: Movers + ETF ─────────────────────── */}
      <Suspense fallback={null}>
        <MoversBoard />
      </Suspense>

      <section className="container-page mt-12" aria-label="ETF 자금 흐름">
        <div className="grid gap-4 md:grid-cols-2">
          <Suspense fallback={<CardFallback label="BTC ETF" />}>
            <EtfFlowCard />
          </Suspense>
          <article className="flex h-full flex-col gap-3 border border-border bg-surface-warm/40 p-6">
            <p className="text-eyebrow text-accent">자금 흐름 읽는 법</p>
            <ul className="space-y-2 text-meta leading-[1.7] text-fg-muted">
              <li>
                <strong className="text-fg">ETF 순유입 ↑</strong> + 도미넌스 ↑ ={" "}
                기관 자금이 BTC로 — 알트 약세 가능.
              </li>
              <li>
                <strong className="text-fg">ETF 순유입 ↑</strong> + 도미넌스 ↓ ={" "}
                BTC와 알트 동반 상승, 시장 전반에 유입.
              </li>
              <li>
                <strong className="text-fg">ETF 순유출 + 김프 ↑</strong> ={" "}
                글로벌 매도/한국 FOMO 괴리 — 차익거래 매물 압력.
              </li>
              <li>
                <strong className="text-fg">스테이블 시총 확장</strong> ={" "}
                위험자산으로 갈 탄약 누적. 단기 매수 우호.
              </li>
            </ul>
          </article>
        </div>
      </section>

      {/* ── 5. Funding Rate ────────────────────────────── */}
      <Suspense fallback={null}>
        <FundingRateTable />
      </Suspense>

      {/* ── 6. Liquidation Heatmap ─────────────────────── */}
      <LiquidationHeatmap />

      {/* ── 7. This Week macro ─────────────────────────── */}
      <ThisWeekPanel />

      {/* ── 8. Sessions Clock ──────────────────────────── */}
      <SessionsClock />

      {/* ── Footer note ────────────────────────────────── */}
      <section className="container-page mt-16">
        <p className="text-meta text-fg-muted">
          데이터 새로고침 주기: 시세 60초 · 펀딩비 5분 · 도미넌스/Alt Season/Stablecoin 10분 · F&amp;G/ETF 1시간.
          모든 수치는 참고용이며, 매매 결정은 본인 책임입니다.
        </p>
      </section>
    </>
  );
}
