import type { Metadata } from "next";
import Link from "next/link";
import { PositionSizingCalculator } from "@/components/tools/position-sizing-calculator";

export const metadata: Metadata = {
  title: "포지션 사이징 계산기 — Victor Alpha",
  description:
    "자본·리스크·진입가·손절가·레버리지를 입력하면 권장 수량·1R 금액·청산가·위험 신호를 즉시 계산합니다.",
};

export default function PositionSizingPage() {
  return (
    <article className="container-page mt-12 mb-24">
      <Link
        href="/tools"
        className="text-meta text-fg-muted hover:text-accent"
      >
        ← 도구함
      </Link>

      <p className="mt-6 text-eyebrow text-accent">Calculator · 계산기</p>
      <h1 className="mt-3 break-keep font-display text-[36px] font-extrabold leading-[1.2] md:text-[44px] md:leading-[1.15]">
        포지션 사이징 계산기
      </h1>
      <p className="mt-5 max-w-2xl break-keep font-serif-body text-[17px] leading-[1.7] text-fg-muted">
        모든 진입 직전에 한 번. &ldquo;이 트레이드에 얼마 걸지&rdquo;를
        감으로 정하지 않고 자본·리스크 한도·손절 거리에서 역산합니다.
        결과 옆 위험 신호도 자동 점검합니다.
      </p>

      {/* Calculator */}
      <section className="mt-12">
        <PositionSizingCalculator />
      </section>

      {/* How to use */}
      <section className="mt-16 rounded-md border-l-4 border-accent bg-surface-warm p-6">
        <p className="text-eyebrow text-accent">How to use</p>
        <ol className="mt-4 space-y-3 break-keep font-serif-body text-[15px] leading-[1.7] text-fg">
          <li>
            <strong>1. 자본금</strong> — 거래소 계좌 평가액. 별도 계좌·코인은
            제외. 한 번 정하면 트레이드마다 다시 입력하지 마세요.
          </li>
          <li>
            <strong>2. 리스크 %</strong> — 한 번에 잃어도 괜찮은 자본 비율.
            리테일 권장 <strong>0.5~2%</strong>. 첫 1년은 1% 이하 추천.
          </li>
          <li>
            <strong>3. 진입가·손절가</strong> — 셋업의 기술적 손절을 먼저
            정하고 그 거리에서 수량을 역산합니다. 수량 → 손절이 아닌
            <strong> 손절 → 수량</strong>.
          </li>
          <li>
            <strong>4. 레버리지</strong> — 현물이면 1, 선물이면 2~10.
            레버리지가 높을수록 청산가가 진입가에 가까워지므로 손절이 청산보다
            반드시 먼저 발동해야 합니다.
          </li>
          <li>
            <strong>5. 위험 신호 확인</strong> — 빨간 박스(🚨)는 진입 전 반드시
            해결. 노란 박스(⚠️)는 셋업 재검토 신호.
          </li>
        </ol>
      </section>

      {/* Why this matters */}
      <section className="mt-12">
        <h2 className="font-display text-2xl font-bold leading-tight">
          왜 이 도구를 매번 써야 하나
        </h2>
        <div className="mt-5 space-y-4 break-keep font-serif-body text-[16px] leading-[1.75] text-fg">
          <p>
            대부분의 리테일 손실은 <strong>잘못된 종목 선택</strong>이 아니라
            <strong> 잘못된 포지션 크기</strong>에서 옵니다. 셋업이 옳아도
            한 트레이드에 자본의 20%를 넣으면 손절 한 번이 회복 불가능한
            드로다운으로 번집니다.
          </p>
          <p>
            전통 금융 데스크에서는 <em>리스크가 먼저, 사이즈가 나중</em>입니다.
            포트폴리오 매니저가 매일 아침 가장 먼저 체크하는 숫자가 1R 한도와
            VaR입니다. 이 계산기는 그 워크플로를 한 트레이드 단위로 옮겨 놓은
            것입니다.
          </p>
          <p>
            계산 결과를 매매 일지에 기록하세요. 손절이 발동했을 때 &ldquo;계획
            대로 잃었는지&rdquo;를 검증할 수 있습니다. 시스템 위반과 시장
            변동성을 분리하는 첫 단계입니다.
          </p>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="mt-12 rounded-md border border-border bg-surface p-5">
        <p className="text-eyebrow text-accent">Disclaimer</p>
        <p className="mt-3 break-keep font-serif-body text-[14px] leading-[1.6] text-fg-muted">
          청산가는 거래소·자산별 마진 모드(격리/교차)와 펀딩비·수수료·진입
          평단에 따라 달라지며, 본 계산은 단순 선형 추정치입니다. 실제 진입
          전에 거래소 화면의 청산가를 한 번 더 확인하시고, 본 도구는 정보·교육
          목적이지 투자 자문이 아닙니다.
        </p>
      </section>
    </article>
  );
}
