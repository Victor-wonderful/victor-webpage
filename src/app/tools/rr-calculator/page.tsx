import type { Metadata } from "next";
import Link from "next/link";
import { RRCalculator } from "@/components/tools/rr-calculator";

export const metadata: Metadata = {
  title: "R:R + 손익분기 승률 계산기 — Victor Alpha",
  description:
    "진입·손절·목표가를 입력하면 손익비, 본전 승률, 100회 매매 기대 손익을 즉시 계산합니다. 셋업 평가의 표준 도구.",
};

export default function RRCalculatorPage() {
  return (
    <article className="container-page mt-12 mb-24">
      <Link href="/tools" className="text-meta text-fg-muted hover:text-accent">
        ← 도구함
      </Link>

      <p className="mt-6 text-eyebrow text-accent">Calculator · 계산기</p>
      <h1 className="mt-3 break-keep font-display text-[36px] font-extrabold leading-[1.2] md:text-[44px] md:leading-[1.15]">
        R:R + 손익분기 승률 계산기
      </h1>
      <p className="mt-5 max-w-2xl break-keep font-serif-body text-[17px] leading-[1.7] text-fg-muted">
        진입·손절·목표가 세 값만 있으면 셋업의 통계적 가치가 정해집니다.
        손익비, 본전 승률, 100회 매매 시뮬레이션으로 셋업을 정량 평가하세요.
      </p>

      {/* Calculator */}
      <section className="mt-12">
        <RRCalculator />
      </section>

      {/* Concept ────────────────────────────────────── */}
      <section className="mt-16">
        <h2 className="font-display text-2xl font-bold leading-tight">
          개념 — 손익비와 본전 승률
        </h2>
        <div className="mt-5 space-y-5 break-keep font-serif-body text-[16px] leading-[1.75] text-fg">
          <p>
            트레이더의 장기 수익은 <strong>승률 × 손익비</strong>의 함수입니다.
            승률이 낮아도 손익비가 충분히 크면 양의 기대값이 나오고, 반대로
            승률이 높아도 손익비가 1:1 미만이면 결국 잃습니다.
          </p>

          <p>
            <strong>본전 승률(Breakeven Win Rate)</strong>은 그 손익비에서 본전을
            맞추는 데 필요한 승률입니다. 공식은 단순합니다:
          </p>

          <pre className="overflow-x-auto rounded-md border border-border bg-surface px-5 py-4 font-mono text-[14px] text-fg">
            본전 승률 = 1 / (1 + R:R)
          </pre>

          <p>예를 들어,</p>
          <ul className="ml-6 list-disc space-y-1 text-fg-muted">
            <li>R:R 1:1 → 본전 승률 50%</li>
            <li>R:R 1:2 → 본전 승률 33.3%</li>
            <li>R:R 1:3 → 본전 승률 25%</li>
            <li>R:R 1:5 → 본전 승률 16.7%</li>
          </ul>

          <p>
            손익비가 클수록 낮은 승률로도 살아남습니다. 그래서 데스크 트레이더는
            <strong> 진입 직전에 항상 R:R을 먼저 계산</strong>합니다. 1:1 미만이면
            그 자체로 진입 보류 신호입니다.
          </p>
        </div>
      </section>

      {/* When to use */}
      <section className="mt-12 rounded-md border-l-4 border-accent bg-surface-warm p-6">
        <p className="text-eyebrow text-accent">언제 쓰나</p>
        <ol className="mt-4 space-y-3 break-keep font-serif-body text-[15px] leading-[1.7] text-fg">
          <li>
            <strong>1. 셋업 후보 발견 시</strong> — 진입가·손절가·목표가가 머릿속에 그려졌으면
            바로 입력. R:R 2:1 미만이면 셋업 자체를 의심.
          </li>
          <li>
            <strong>2. 추정 승률을 함께 입력</strong> — 같은 셋업을 30회 이상 트래킹한
            데이터가 있을 때만 의미 있음. 표본 10회 이하의 승률은 랜덤과 같음.
          </li>
          <li>
            <strong>3. 수수료 반영 R:R 확인</strong> — 단기 매매(스캘핑·데이)일수록 수수료가
            R:R을 빠르게 갉아먹습니다. Net R:R이 진짜 손익비입니다.
          </li>
          <li>
            <strong>4. 에지가 5% 미만이면 보류</strong> — 슬리피지, 심리 비용, 표본 노이즈가
            그 정도 에지를 잠식합니다.
          </li>
        </ol>
      </section>

      {/* Why this matters */}
      <section className="mt-12">
        <h2 className="font-display text-2xl font-bold leading-tight">
          왜 매번 계산해야 하나
        </h2>
        <div className="mt-5 space-y-4 break-keep font-serif-body text-[16px] leading-[1.75] text-fg">
          <p>
            대부분의 리테일 트레이더가 손실을 보는 이유는 <strong>R:R을 사후에
            계산하기 때문</strong>입니다. &ldquo;왠지 이번엔 갈 것 같다&rdquo;로
            진입한 뒤, 손절을 자기에게 유리하게 옮기고, 목표를 줄이고, 결국
            손익비 0.5:1짜리 트레이드를 반복합니다.
          </p>
          <p>
            R:R을 진입 전에 계산하면 셋업이 <em>거를 만한 것인지</em>가 1초 만에
            드러납니다. 이 도구는 그 1초를 체계화한 것입니다. 본전 승률과 EV가
            함께 보이면, 자기 셋업의 통계적 진실이 노출됩니다.
          </p>
          <p>
            <strong>핵심:</strong> &ldquo;이 셋업은 승률 N%에 R:R M:1이다&rdquo;를
            기록한 사람만이 자기 시스템을 가집니다. 나머지는 그냥 매번 다른
            셋업을 쓰는 것과 같습니다.
          </p>
        </div>
      </section>

      <section className="mt-12 rounded-md border border-border bg-surface p-5">
        <p className="text-eyebrow text-accent">Disclaimer</p>
        <p className="mt-3 break-keep font-serif-body text-[14px] leading-[1.6] text-fg-muted">
          본 도구는 정보·교육 목적이며 투자 자문이 아닙니다. 실제 매매에서는
          슬리피지, 부분 청산, 펀딩비, 세금 등 추가 비용이 R:R을 추가로 깎을
          수 있습니다. 모든 매매 결정과 결과는 본인의 책임입니다.
        </p>
      </section>
    </article>
  );
}
