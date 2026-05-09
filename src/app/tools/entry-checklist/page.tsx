import type { Metadata } from "next";
import Link from "next/link";
import { EntryChecklist } from "@/components/tools/entry-checklist";

export const metadata: Metadata = {
  title: "진입 전 체크리스트 10문항 — Victor Alpha",
  description:
    "셋업·손절·1R·시장환경·감정 5축에서 진입 전 자가 점검 10문항. 필수 항목 미충족 시 자동 차단.",
};

export default function EntryChecklistPage() {
  return (
    <article className="container-page mt-12 mb-24">
      <Link
        href="/tools"
        className="text-meta text-fg-muted hover:text-accent"
      >
        ← 도구함
      </Link>

      <p className="mt-6 text-eyebrow text-accent">Checklist · 체크리스트</p>
      <h1 className="mt-3 break-keep font-display text-[36px] font-extrabold leading-[1.2] md:text-[44px] md:leading-[1.15]">
        진입 전 체크리스트 10문항
      </h1>
      <p className="mt-5 max-w-2xl break-keep font-serif-body text-[17px] leading-[1.7] text-fg-muted">
        셋업·손절·1R·시장환경·감정 5축에서 매번 같은 문항으로 진입 전 자가
        점검. 필수 항목 4개 중 하나라도 No면 자동 차단합니다.
      </p>

      {/* The checklist */}
      <section className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.5fr]">
        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-md border border-border bg-surface-warm p-5">
            <p className="text-eyebrow text-accent">5축 구조</p>
            <ul className="mt-4 space-y-3 break-keep font-serif-body text-[14px] leading-[1.6] text-fg">
              <li>
                <strong>· 셋업 (2)</strong> — 정의·검증 이력
              </li>
              <li>
                <strong>· 손절 (2)</strong> — 사전 정의·구조 기반
              </li>
              <li>
                <strong>· 1R (2)</strong> — 자본 대비, 동시 리스크
              </li>
              <li>
                <strong>· 시장 환경 (2)</strong> — 톤 적합성, 매크로 이벤트
              </li>
              <li>
                <strong>· 감정 (2)</strong> — 복수매매·FOMO 차단
              </li>
            </ul>
            <p className="mt-4 border-t border-border pt-3 text-[12px] italic text-fg-muted">
              필수 항목(빨간 라벨) 4개는 미충족 시 즉시 차단됩니다.
            </p>
          </div>

          <div className="rounded-md border border-border bg-surface p-5">
            <p className="text-eyebrow text-accent">언제 쓰나</p>
            <p className="mt-3 break-keep font-serif-body text-[14px] leading-[1.6] text-fg">
              매수 버튼을 누르기 직전 30초. 처음에는 어색하지만 한 달 쓰면
              체크리스트 자체가 사라지고 자동으로 점검하는 습관이 됩니다.
            </p>
          </div>
        </aside>

        <div>
          <EntryChecklist />
        </div>
      </section>

      {/* Why this matters */}
      <section className="mt-16">
        <h2 className="font-display text-2xl font-bold leading-tight">
          왜 매번 체크해야 하나
        </h2>
        <div className="mt-5 space-y-4 break-keep font-serif-body text-[16px] leading-[1.75] text-fg">
          <p>
            트레이더가 잃는 가장 흔한 패턴은 <strong>같은 실수를 반복</strong>하는
            것입니다. 체크리스트는 그 반복을 끊습니다. 매번 같은 문항을 답하면,
            손실이 났을 때 어느 항목에서 미끄러졌는지가 사후 분석 없이도
            드러납니다.
          </p>
          <p>
            전통 금융 데스크에서는 <em>pre-trade compliance check</em>라고
            부릅니다. 한국 리테일 환경에 맞게 5축 10문항으로 압축했습니다.
            이 도구는 매매 일지와 짝이 됩니다 — 진입 시점에 체크리스트, 청산
            시점에 일지.
          </p>
          <p>
            가장 강력한 항목은 <strong>감정 2개</strong>입니다. 복수매매와
            FOMO는 시스템이 정상 작동하는 사람도 90초 만에 무너뜨립니다.
            이 두 항목이 No면 다른 8개가 모두 Yes여도 차단입니다.
          </p>
        </div>
      </section>

      <section className="mt-12 rounded-md border border-border bg-surface p-5">
        <p className="text-eyebrow text-accent">Disclaimer</p>
        <p className="mt-3 break-keep font-serif-body text-[14px] leading-[1.6] text-fg-muted">
          본 체크리스트는 자가 점검을 위한 교육·정보 도구이며, 투자 자문이
          아닙니다. 통과 여부와 무관하게 모든 매매 결정과 결과는 본인의
          책임입니다.
        </p>
      </section>
    </article>
  );
}
