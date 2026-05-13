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
import { ThisWeekPanel } from "@/components/dashboard/this-week-panel";
import { SessionsClock } from "@/components/dashboard/sessions-clock";
import { SectionExplainer } from "@/components/dashboard/section-explainer";

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
          <SectionExplainer
            topics={[
              {
                title: "Fear & Greed (시장 심리)",
                body: (
                  <>
                    0–100 스케일. <strong>25 이하</strong> 극공포 = 역발상 매수 관점, <strong>75 이상</strong> 극탐욕 = 익절·관망. 단독 신호 아닌 다른 지표와 같이 사용.
                  </>
                ),
              },
              {
                title: "BTC Dominance (시장 구조)",
                body: (
                  <>
                    전체 시총 중 BTC 비중. <strong>↑</strong>면 자금이 BTC로 회귀 — 알트 약세 가능. <strong>↓</strong>면 알트로 자금 이동 — 알트 강세 신호.
                  </>
                ),
              },
              {
                title: "Alt Season Index",
                body: (
                  <>
                    Top 50 알트 중 90일 누적으로 BTC를 이긴 비율. <strong>75 이상</strong> = 알트 시즌, 알트 적극 운용. <strong>25 이하</strong> = BTC 시즌, BTC 비중 ↑ 권장.
                  </>
                ),
              },
              {
                title: "김치 프리미엄 (한국 특화)",
                body: (
                  <>
                    Upbit KRW가격 vs Binance USD가격×USDT/KRW. <strong>4% 이상</strong> = 한국 과열, 차익 매물 압력. <strong>음수</strong> = 한국 매도 쏠림 또는 글로벌 매수 우위.
                  </>
                ),
              },
              {
                title: "Stablecoin Mcap (유동성)",
                body: (
                  <>
                    USDT/USDC 등 스테이블 총 발행량. <strong>증가</strong> = 매수 탄약 누적, 위험자산 우호. <strong>감소</strong> = 시장 유동성 회수, 변동성 위험.
                  </>
                ),
              },
              {
                title: "Long/Short Ratio (포지셔닝)",
                body: (
                  <>
                    BTC perp 글로벌 계좌 비율. <strong>롱 65% 이상</strong> = 과열, 청산 캐스케이드 후보. <strong>숏 65% 이상</strong> = 숏 스퀴즈 가능. 펀딩비와 짝꿍.
                  </>
                ),
              },
            ]}
          />
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
      <section className="container-page mt-2">
        <SectionExplainer
          topics={[
            {
              title: "무엇인가",
              body: (
                <>
                  지난 24시간 동안 가장 많이 오른/내린 코인 Top 5. CoinGecko 시총 상위에서 추출.
                </>
              ),
            },
            {
              title: "이렇게 활용",
              body: (
                <>
                  급등 코인 발견 → <strong>왜 올랐는지</strong> 뉴스·온체인 활동 확인 → 추세 진입 또는 회피 결정.
                  급락 코인은 매수 후보로 보기보다 <strong>구조적 문제</strong>가 있는지 의심 먼저.
                </>
              ),
            },
            {
              title: "함정 주의",
              body: (
                <>
                  시총 작은 코인은 변동성만 클 뿐 유동성이 얇아 진입/청산이 어려울 수 있음. KRW 가격은 환산이라 실제 Upbit 호가와 다를 수 있음.
                </>
              ),
            },
          ]}
        />
      </section>

      <section className="container-page mt-12" aria-label="온체인 · DeFi">
        <header className="mb-6">
          <p className="text-eyebrow text-accent">On-chain</p>
          <h2 className="mt-2 font-display text-[28px] font-extrabold leading-[1.1] tracking-tight md:text-[36px]">
            온체인 자금 흐름
          </h2>
          <p className="mt-2 max-w-xl text-meta text-fg-muted">
            DeFi에 잠긴 자금이 늘면 risk-on, 빠지면 risk-off — 가격보다 먼저 움직이는 선행 지표.
          </p>
          <SectionExplainer
            topics={[
              {
                title: "TVL이란",
                body: (
                  <>
                    Total Value Locked. DeFi 프로토콜(스왑·렌딩·스테이킹)에 예치된 자산의 USD 환산 총합. 시장의 risk 자세 측정 도구.
                  </>
                ),
              },
              {
                title: "왜 선행 지표인가",
                body: (
                  <>
                    가격이 본격 움직이기 전에 자금이 먼저 들어오거나 빠집니다. TVL 7일 변화로 매크로 흐름의 결을 잡기 쉬움.
                  </>
                ),
              },
              {
                title: "체인별 비중 활용",
                body: (
                  <>
                    Ethereum 비중이 떨어지고 Solana 비중이 오르면 → SOL 생태계 알트시즌 신호. 신규 체인 비중 급증도 그 체인 토큰 강세 시그널.
                  </>
                ),
              },
            ]}
          />
        </header>
        <Suspense fallback={<CardFallback label="DeFi TVL" />}>
          <DefiTvlCard />
        </Suspense>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              t: "TVL 7d ↑ + Stablecoin 시총 ↑",
              d: "DeFi 자금 유입 + 탄약 누적 → 강한 risk-on.",
            },
            {
              t: "TVL 7d ↓ + 도미넌스 ↑",
              d: "알트에서 BTC로 회귀 — 알트 약세 후보.",
            },
            {
              t: "TVL 급락 + Funding 음수",
              d: "디레버리징 진행 — 단기 바닥 후보지만 칼날 잡지 말 것.",
            },
            {
              t: "특정 체인 TVL 비중 급증",
              d: "그 체인 알트시즌 신호 (예: Solana 비중 ↑ → SOL 생태계).",
            },
          ].map((r) => (
            <article
              key={r.t}
              className="flex flex-col gap-1 border border-border bg-surface-warm/40 p-4"
            >
              <p className="break-keep font-display text-[14px] font-bold leading-snug">
                {r.t}
              </p>
              <p className="break-keep text-meta leading-[1.6] text-fg-muted">
                {r.d}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* ── 5. Funding Rate ────────────────────────────── */}
      <Suspense fallback={null}>
        <FundingRateTable />
      </Suspense>
      <section className="container-page mt-2">
        <SectionExplainer
          topics={[
            {
              title: "펀딩비란",
              body: (
                <>
                  무기한 선물(Perpetual)에서 8시간마다 롱·숏이 서로 지불하는 비용. 시장 가격을 현물 인덱스에 수렴시키는 메커니즘.
                </>
              ),
            },
            {
              title: "어떻게 읽나",
              body: (
                <>
                  <strong>양수 ↑</strong> = 롱이 비용 지불 → 롱 우세. <strong>+0.05%/8h 이상</strong> = 롱 과열, 단기 조정 후보.{" "}
                  <strong>음수 ↓</strong> = 숏이 비용 지불 → 숏 과열, 숏 스퀴즈 가능.
                </>
              ),
            },
            {
              title: "L/S 비율과 같이",
              body: (
                <>
                  펀딩비가 매우 양수인데 L/S 비율도 롱 65% 이상이면 <strong>역추세 후보</strong>로 강하게 작용. 펀딩비만으로 단정 금물.
                </>
              ),
            },
            {
              title: "함정",
              body: (
                <>
                  대형 코인(BTC/ETH)은 펀딩비가 보통 낮음. 알트는 변동성에 따라 ±0.5% 이상 자주 나옴. 절대값보다 <strong>지속 시간</strong>이 중요.
                </>
              ),
            },
          ]}
        />
      </section>

      {/* ── 6. This Week macro ─────────────────────────── */}
      <ThisWeekPanel />
      <section className="container-page mt-2">
        <SectionExplainer
          topics={[
            {
              title: "왜 매크로가 중요한가",
              body: (
                <>
                  FOMC·CPI·고용지표는 달러 강세·금리 기대를 흔들어 위험자산 전반에 영향. 크립토도 발표 직후 변동성 폭발 흔함.
                </>
              ),
            },
            {
              title: "이렇게 활용",
              body: (
                <>
                  발표 <strong>직전 24시간</strong>은 큰 포지션 회피, 스톱 좁게.
                  발표 <strong>직후 첫 캔들</strong>은 추격 금지 — 페이크 출하 잦음. 두번째 캔들 확인 후 진입.
                </>
              ),
            },
            {
              title: "High vs Med",
              body: (
                <>
                  <strong>High</strong>(FOMC, CPI, NFP)는 시장 흔들기 충분. <strong>Med</strong>(주간 실업수당, PPI)는 보조 자료, 단독으로 큰 움직임 만들기 어려움.
                </>
              ),
            },
          ]}
        />
      </section>

      {/* ── 7. Sessions Clock ──────────────────────────── */}
      <SessionsClock />
      <section className="container-page mt-2">
        <SectionExplainer
          topics={[
            {
              title: "크립토는 24시간인데?",
              body: (
                <>
                  맞습니다 — 장이 닫히진 않지만 <strong>활동량</strong>은 세션별로 다릅니다. 활동이 몰리는 시간에 변동성·유동성 모두 좋음.
                </>
              ),
            },
            {
              title: "황금 시간대",
              body: (
                <>
                  <strong>런던 오픈 16:00 KST</strong>, <strong>뉴욕 오픈 22:30 KST</strong> 전후 1시간이 가장 활발. 두 세션 겹치는{" "}
                  <strong>22:30–01:00 KST</strong>가 가장 큰 움직임.
                </>
              ),
            },
            {
              title: "함정 시간대",
              body: (
                <>
                  뉴욕 마감(05:00 KST) ~ 도쿄 오픈(09:00 KST) 사이는 한산 → 페이크아웃·스톱 헌팅 잦음. 큰 매매 자제.
                </>
              ),
            },
          ]}
        />
      </section>

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
