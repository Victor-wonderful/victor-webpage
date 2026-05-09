import type { Metadata } from "next";
import Link from "next/link";
import { CompoundCalculator } from "@/components/tools/compound-calculator";

export const metadata: Metadata = {
  title: "복리 수익률·손실 회복 계산기 — Victor Alpha",
  description:
    "복리 성장 시뮬, 손실 회복에 필요한 수익률, 목표 자본 역산. 한 도구로 3가지 모드.",
};

export default function CompoundCalculatorPage() {
  return (
    <article className="container-page mt-12 mb-24">
      <Link href="/tools" className="text-meta text-fg-muted hover:text-accent">
        ← 도구함
      </Link>

      <p className="mt-6 text-eyebrow text-accent">Calculator · 계산기</p>
      <h1 className="mt-3 break-keep font-display text-[36px] font-extrabold leading-[1.2] md:text-[44px] md:leading-[1.15]">
        복리 수익률·손실 회복 계산기
      </h1>
      <p className="mt-2 font-mono text-meta text-fg-muted">
        Growth · Recovery · Target — 3 modes
      </p>
      <p className="mt-5 max-w-2xl break-keep font-serif-body text-[17px] leading-[1.7] text-fg-muted">
        복리는 직관과 다릅니다. 월 3%는 연 36%가 아니라 42.6%이고, -50%
        손실은 +100%로만 회복됩니다. 이 비대칭을 숫자로 직접 보면 리스크 관리에
        대한 감각이 바뀝니다.
      </p>

      <section className="mt-12">
        <CompoundCalculator />
      </section>

      {/* Modes guide */}
      <section className="mt-16 grid gap-6 md:grid-cols-3">
        <div className="rounded-md border border-border bg-surface p-5">
          <p className="font-mono text-[11px] uppercase tracking-wider text-accent">
            ① 복리 성장
          </p>
          <h3 className="mt-2 font-display text-lg font-bold">미래 자본 시뮬</h3>
          <p className="mt-2 break-keep font-serif-body text-[14px] leading-[1.6] text-fg-muted">
            평균 월 수익률을 가정하면 N개월 후 자본이 얼마인지. 단순 합산과
            복리의 차이도 함께 보여 줍니다.
          </p>
        </div>
        <div className="rounded-md border border-border bg-surface p-5">
          <p className="font-mono text-[11px] uppercase tracking-wider text-accent">
            ② 손실 회복
          </p>
          <h3 className="mt-2 font-display text-lg font-bold">비대칭 회복률</h3>
          <p className="mt-2 break-keep font-serif-body text-[14px] leading-[1.6] text-fg-muted">
            -X% 손실 후 본전을 맞추는 데 필요한 수익률. 월 3%·5% 가정 시 회복에
            걸리는 개월 수도 함께.
          </p>
        </div>
        <div className="rounded-md border border-border bg-surface p-5">
          <p className="font-mono text-[11px] uppercase tracking-wider text-accent">
            ③ 목표 역산
          </p>
          <h3 className="mt-2 font-display text-lg font-bold">필요 월 수익률</h3>
          <p className="mt-2 break-keep font-serif-body text-[14px] leading-[1.6] text-fg-muted">
            시작 자본·목표 자본·기간을 정하면 매월 몇 %를 벌어야 하는지.
            현실성도 자동 평가.
          </p>
        </div>
      </section>

      {/* Why this matters */}
      <section className="mt-16">
        <h2 className="font-display text-2xl font-bold leading-tight">
          왜 이 숫자를 매번 봐야 하나
        </h2>
        <div className="mt-5 space-y-4 break-keep font-serif-body text-[16px] leading-[1.75] text-fg">
          <p>
            <strong>리테일이 가장 자주 잃는 이유는 비대칭 회복률을 모르기 때문</strong>
            입니다. -30% 손실은 +43%, -50%는 +100%, -70%는 +233%가 있어야 본전.
            이 숫자를 알면 손절 1회의 무게가 달라집니다.
          </p>
          <p>
            데스크 트레이더는 매일 아침 자본·드로다운·필요 회복률을 함께 봅니다.
            단순 P/L이 아니라 &ldquo;이 손실을 메우려면 얼마가 필요한가&rdquo;가
            매매 사이즈를 결정합니다.
          </p>
          <p>
            <strong>핵심:</strong> 1R = 자본의 1~2%로 제한하는 룰이 왜 절대적인지,
            한 번의 -50% 드로다운이 시스템을 어떻게 깨뜨리는지가 이 계산기에서
            숫자로 보입니다.
          </p>
        </div>
      </section>

      <section className="mt-12 rounded-md border border-border bg-surface p-5">
        <p className="text-eyebrow text-accent">Disclaimer</p>
        <p className="mt-3 break-keep font-serif-body text-[14px] leading-[1.6] text-fg-muted">
          본 계산기는 단순 복리 수학 도구이며 미래 수익을 예측·보장하지 않습니다.
          실제 트레이딩 수익률은 시장·전략·리스크 관리에 따라 변동하며 손실
          가능성이 항상 존재합니다.
        </p>
      </section>
    </article>
  );
}
