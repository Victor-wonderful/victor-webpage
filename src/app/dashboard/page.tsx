import type { Metadata } from "next";
import { Suspense } from "react";
import { PillNav } from "@/components/pill-nav";
import {
  FearGreedCard,
  DominanceCard,
} from "@/components/home/market-snapshot";
import { MoversBoard } from "@/components/home/movers-board";
import { ChartHeroSection } from "@/components/dashboard/chart-hero-section";
import { LongShortCard } from "@/components/dashboard/long-short-card";
import { AutoRefreshBar } from "@/components/dashboard/auto-refresh-bar";
import { KimchiCard } from "@/components/dashboard/kimchi-card";
import { AltSeasonCard } from "@/components/dashboard/alt-season-card";
import { StablecapCard } from "@/components/dashboard/stablecap-card";
import { FundingRateTable } from "@/components/dashboard/funding-rate-table";
import { DefiTvlCard } from "@/components/dashboard/defi-tvl-card";
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
  const renderedAt = Date.now();
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
        <div className="mt-6">
          <AutoRefreshBar renderedAt={renderedAt} />
        </div>
      </section>

      <section className="container-page mt-10">
        <PillNav />
      </section>

      {/* ── 1. Snapshot: Technicals + Victor's take ──── */}
      <ChartHeroSection />

      {/* ── 2. Live Market: sentiment & structure ────── */}
      <section className="container-page mt-12" aria-label="시장 심리·구조">
        <header className="mb-6">
          <p className="text-eyebrow text-accent">Live Market</p>
          <h2 className="mt-2 font-display text-[28px] font-extrabold leading-[1.1] tracking-tight md:text-[36px]">
            지금 시장은 어디 있나
          </h2>
          <p className="mt-2 max-w-xl text-meta text-fg-muted">
            심리(F&amp;G) · 구조(BTC Dominance) · 알트 사이클(Alt Season) · 지역 프리미엄(김프) · 유동성(Stablecoin) · 포지셔닝(Long/Short).
          </p>
        </header>
        <div className="grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
          <Suspense fallback={<CardFallback label="Long/Short · BTC" />}>
            <LongShortCard />
          </Suspense>
        </div>
      </section>

      {/* ── 4. Flow: Movers + On-chain ────────────────── */}
      <Suspense fallback={null}>
        <MoversBoard />
      </Suspense>

      <section className="container-page mt-12" aria-label="온체인 · DeFi">
        <header className="mb-6">
          <p className="text-eyebrow text-accent">On-chain</p>
          <h2 className="mt-2 font-display text-[28px] font-extrabold leading-[1.1] tracking-tight md:text-[36px]">
            온체인 자금 흐름
          </h2>
          <p className="mt-2 max-w-xl text-meta text-fg-muted">
            DeFi에 잠긴 자금이 늘면 risk-on, 빠지면 risk-off — 가격보다 먼저 움직이는 선행 지표.
          </p>
        </header>
        <div className="grid gap-4 md:grid-cols-2">
          <Suspense fallback={<CardFallback label="DeFi TVL" />}>
            <DefiTvlCard />
          </Suspense>
          <article className="flex h-full flex-col gap-3 border border-border bg-surface-warm/40 p-6">
            <p className="text-eyebrow text-accent">읽는 법</p>
            <ul className="space-y-2 text-meta leading-[1.7] text-fg-muted">
              <li>
                <strong className="text-fg">TVL 7d ↑ + Stablecoin 시총 ↑</strong> = DeFi 자금 유입 + 탄약 누적 → 강한 risk-on.
              </li>
              <li>
                <strong className="text-fg">TVL 7d ↓ + 도미넌스 ↑</strong> = 알트에서 BTC로 회귀 — 알트 약세 후보.
              </li>
              <li>
                <strong className="text-fg">TVL 급락 + Funding 음수</strong> = 디레버리징 진행 — 단기 바닥 후보지만 칼날 잡지 말 것.
              </li>
              <li>
                <strong className="text-fg">특정 체인 TVL 비중 급증</strong> = 그 체인 토큰 알트시즌 신호 (예: Solana 비중 ↑ → SOL 생태계).
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
          데이터 새로고침 주기: Technicals 10분 · 펀딩비 5분 · 도미넌스/Alt Season/Stablecoin 10분 · F&amp;G/TVL 1시간.
          모든 수치는 참고용이며, 매매 결정은 본인 책임입니다.
        </p>
      </section>
    </>
  );
}
