import type { Metadata } from "next";
import Link from "next/link";
import { TradeJournal } from "@/components/tools/trade-journal";

export const metadata: Metadata = {
  title: "매매 일지 템플릿 — Victor Alpha",
  description:
    "진입 계획 · 실행 결과 · 회고 3단 구조로 매 트레이드를 기록. Markdown 복사·인쇄(PDF)·자동 저장 지원.",
};

export default function TradeJournalPage() {
  return (
    <article className="container-page mt-12 mb-24">
      <Link href="/tools" className="text-meta text-fg-muted hover:text-accent">
        ← 도구함
      </Link>

      <p className="mt-6 text-eyebrow text-accent">Template · 매매 일지</p>
      <h1 className="mt-3 break-keep font-display text-[36px] font-extrabold leading-[1.2] md:text-[44px] md:leading-[1.15]">
        매매 일지 템플릿
      </h1>
      <p className="mt-2 font-mono text-meta text-fg-muted">
        Plan · Execute · Review · 자동 저장
      </p>
      <p className="mt-5 max-w-2xl break-keep font-serif-body text-[17px] leading-[1.7] text-fg-muted">
        매 트레이드를 같은 구조로 기록하면 손실 원인이 사후에 분리됩니다 —
        시스템 위반인지, 시장 변동성인지. 진입 직전 1분, 청산 직후 1분, 당일 마감 시
        2분으로 시스템 트레이더의 기본 인프라를 만듭니다.
      </p>

      {/* Layout: form (main) + sidebar (sticky guide) */}
      <section className="mt-12 grid gap-8 lg:grid-cols-[1fr_2fr]">
        {/* Sidebar — workflow guide */}
        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start print:hidden">
          <div className="rounded-md border border-border bg-surface-warm p-5">
            <p className="text-eyebrow text-accent">3단 워크플로</p>
            <ul className="mt-4 space-y-4 break-keep font-serif-body text-[14px] leading-[1.6] text-fg">
              <li>
                <strong>① 진입 계획</strong>
                <br />
                <span className="text-fg-muted">
                  진입 직전 1분. 셋업·근거·진입가·손절·1R을 미리 박아 둡니다.
                  진입 후 손절을 옮기고 싶을 때 자기에게 보여줄 자료입니다.
                </span>
              </li>
              <li>
                <strong>② 실행 결과</strong>
                <br />
                <span className="text-fg-muted">
                  청산 직후 1분. 청산 사유·손익(R)·보유 시간 기록. 즉시 적지
                  않으면 기억이 자기에게 유리하게 왜곡됩니다.
                </span>
              </li>
              <li>
                <strong>③ 회고</strong>
                <br />
                <span className="text-fg-muted">
                  당일 마감 시 2분. 시스템 준수·감정 상태·학습. 1주일 모이면
                  &lsquo;이번 주 시스템 위반 N회&rsquo;가 보입니다.
                </span>
              </li>
            </ul>
          </div>

          <div className="rounded-md border border-border bg-surface p-5">
            <p className="text-eyebrow text-accent">출력</p>
            <ul className="mt-3 space-y-2 break-keep font-serif-body text-[13px] leading-[1.6] text-fg-muted">
              <li>
                <strong>Markdown 복사</strong> — Notion·Obsidian·Bear에 붙여 넣어
                축적
              </li>
              <li>
                <strong>표 한 줄 복사</strong> — 스프레드시트 누적용
              </li>
              <li>
                <strong>인쇄 / PDF</strong> — 종이 일지 또는 디지털 아카이브
              </li>
            </ul>
          </div>

          <div className="rounded-md border border-border bg-surface p-5">
            <p className="text-eyebrow text-accent">자동 저장</p>
            <p className="mt-3 break-keep font-serif-body text-[13px] leading-[1.6] text-fg-muted">
              입력값은 이 브라우저의 LocalStorage에 자동 저장됩니다. 페이지를
              실수로 닫아도 복원됩니다. 단, 다른 기기·브라우저로는 이동되지
              않으므로 영구 보관은 Markdown 복사를 권장합니다.
            </p>
          </div>
        </aside>

        {/* Main form */}
        <div>
          <TradeJournal />
        </div>
      </section>

      {/* Why this matters */}
      <section className="mt-16 print:hidden">
        <h2 className="font-display text-2xl font-bold leading-tight">
          왜 매매 일지가 시스템의 절반인가
        </h2>
        <div className="mt-5 space-y-4 break-keep font-serif-body text-[16px] leading-[1.75] text-fg">
          <p>
            트레이딩에서 가장 비싼 자산은 <strong>자기 데이터</strong>입니다.
            같은 셋업을 30번 반복하면 그 셋업의 실제 승률·평균 R이 드러납니다.
            그런데 데이터가 없으면 30번을 해도 모릅니다 — 매번 처음 하는 셋업과
            같습니다.
          </p>
          <p>
            데스크 트레이더가 강한 이유는 <em>매매 후 분석</em> 인프라가 있기
            때문입니다. 모든 진입·청산이 자동 기록되고, 주간·월간 리뷰에서{" "}
            <strong>시스템 위반 vs 시장 변동성</strong>이 분리됩니다. 이 도구는
            그 워크플로를 한 명의 리테일이 쓸 수 있게 압축한 것입니다.
          </p>
          <p>
            <strong>핵심:</strong> 손실이 났을 때 &ldquo;운이 나빴다&rdquo;와
            &ldquo;시스템을 위반했다&rdquo;를 구분할 수 있어야 다음 매매가
            달라집니다. 일지가 없으면 둘 다 똑같이 보입니다.
          </p>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="mt-12 rounded-md border border-border bg-surface p-5 print:hidden">
        <p className="text-eyebrow text-accent">Disclaimer</p>
        <p className="mt-3 break-keep font-serif-body text-[14px] leading-[1.6] text-fg-muted">
          본 템플릿은 자가 기록·교육 목적의 도구이며 투자 자문이 아닙니다.
          입력값은 사용자의 브라우저(LocalStorage)에만 저장되며 서버로 전송되지
          않습니다. 영구 보관·다른 기기 동기화가 필요하면 Markdown으로 복사해
          본인 노트 시스템에 저장하세요.
        </p>
      </section>
    </article>
  );
}
