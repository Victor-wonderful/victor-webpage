import type { Metadata } from "next";
import Link from "next/link";
import { WeeklyPlan } from "@/components/tools/weekly-plan";

export const metadata: Metadata = {
  title: "주간 트레이딩 플랜 — Victor Alpha",
  description:
    "지난 주 회고·매크로 이벤트·핵심 레벨·셋업 후보·리스크 한도를 한 페이지에. 주말 30분에 다음 주 한 주의 트레이딩 데스크를 깔아둡니다.",
};

export default function WeeklyPlanPage() {
  return (
    <article className="container-page mt-12 mb-24">
      <Link href="/tools" className="text-meta text-fg-muted hover:text-accent">
        ← 도구함
      </Link>

      <p className="mt-6 text-eyebrow text-accent">Template · 주간 플랜</p>
      <h1 className="mt-3 break-keep font-display text-[36px] font-extrabold leading-[1.2] md:text-[44px] md:leading-[1.15]">
        주간 트레이딩 플랜
      </h1>
      <p className="mt-2 font-mono text-meta text-fg-muted">
        Recap · Macro · Levels · Setups · Risk · Mantra
      </p>
      <p className="mt-5 max-w-2xl break-keep font-serif-body text-[17px] leading-[1.7] text-fg-muted">
        주말 30분 투자로 다음 한 주의 트레이딩 데스크를 깔아둡니다. 매크로
        이벤트와 핵심 레벨을 미리 박아 두면 평일에는 셋업이 도착하기를 기다리는
        쪽이 됩니다 — 즉흥적으로 종목을 찾는 트레이더에서 졸업하는 첫 단계.
      </p>

      <section className="mt-12 grid gap-8 lg:grid-cols-[1fr_2fr]">
        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start print:hidden">
          <div className="rounded-md border border-border bg-surface-warm p-5">
            <p className="text-eyebrow text-accent">7 섹션 구조</p>
            <ul className="mt-4 space-y-3 break-keep font-serif-body text-[14px] leading-[1.6] text-fg">
              <li>
                <strong>① 지난 주 회고</strong>
                <br />
                <span className="text-fg-muted">
                  P&L·승률·시스템 위반·학습
                </span>
              </li>
              <li>
                <strong>② 매크로·이벤트</strong>
                <br />
                <span className="text-fg-muted">
                  FOMC·CPI·실적·언락 · 영향도
                </span>
              </li>
              <li>
                <strong>③ 시장 톤</strong>
                <br />
                <span className="text-fg-muted">추세·횡보·변동성 시각</span>
              </li>
              <li>
                <strong>④ 핵심 자산 레벨</strong>
                <br />
                <span className="text-fg-muted">
                  자산 3~5개 진입·손절·목표
                </span>
              </li>
              <li>
                <strong>⑤ 셋업 후보</strong>
                <br />
                <span className="text-fg-muted">
                  노릴 셋업 + 발동 조건
                </span>
              </li>
              <li>
                <strong>⑥ 리스크 한도</strong>
                <br />
                <span className="text-fg-muted">
                  1R · 동시 보유 · 주간 손실 상한
                </span>
              </li>
              <li>
                <strong>⑦ 한 줄 의지</strong>
                <br />
                <span className="text-fg-muted">이번 주 자기에게 한 줄</span>
              </li>
            </ul>
          </div>

          <div className="rounded-md border border-border bg-surface p-5">
            <p className="text-eyebrow text-accent">언제 쓰나</p>
            <p className="mt-3 break-keep font-serif-body text-[13px] leading-[1.6] text-fg-muted">
              일요일 저녁 또는 월요일 아침. 30분 투자.
              <br />
              <br />
              평일에는 이 페이지를 다시 열어 ⑥ 리스크 한도와 ⑦ 의지만 다시 읽고
              매매 시작.
            </p>
          </div>

          <div className="rounded-md border border-border bg-surface p-5">
            <p className="text-eyebrow text-accent">매매 일지와 짝</p>
            <p className="mt-3 break-keep font-serif-body text-[13px] leading-[1.6] text-fg-muted">
              주간 플랜 → 매매 일지 → 다음 주간 플랜 회고 사이클이 돌아갑니다.{" "}
              <Link
                href="/tools/trade-journal"
                className="text-accent underline"
              >
                매매 일지 템플릿
              </Link>
              과 함께 쓰세요.
            </p>
          </div>
        </aside>

        <div>
          <WeeklyPlan />
        </div>
      </section>

      {/* Why */}
      <section className="mt-16 print:hidden">
        <h2 className="font-display text-2xl font-bold leading-tight">
          왜 주간 플랜이 시스템 트레이더의 출발점인가
        </h2>
        <div className="mt-5 space-y-4 break-keep font-serif-body text-[16px] leading-[1.75] text-fg">
          <p>
            대부분의 리테일 손실은 <strong>장 시작 후 종목을 찾는 데서</strong>{" "}
            옵니다. 시간이 없으니 유튜브·텔레그램에서 본 종목을 따라가고,
            셋업이 명확하지 않은데 들어가고, 결국 사후에 &ldquo;왜 그랬지&rdquo;를
            반복합니다.
          </p>
          <p>
            데스크 트레이더는 <em>장 시작 전에 이미 무엇을 볼지 정해져
            있습니다</em>. 매크로 이벤트, 핵심 레벨, 셋업 시나리오가 주말에 미리
            깔립니다. 평일에는 셋업이 도착하기를 기다리는 쪽 — 능동적이지만
            즉흥적이지 않습니다.
          </p>
          <p>
            <strong>핵심:</strong> 이번 주 의지(⑦)와 리스크 한도(⑥)를 미리
            못박아 두면, 화요일 손실 후 수요일에 사이즈를 키우고 싶은 충동이
            왔을 때 자기에게 보여줄 <em>증거</em>가 생깁니다.
          </p>
        </div>
      </section>

      <section className="mt-12 rounded-md border border-border bg-surface p-5 print:hidden">
        <p className="text-eyebrow text-accent">Disclaimer</p>
        <p className="mt-3 break-keep font-serif-body text-[14px] leading-[1.6] text-fg-muted">
          본 템플릿은 자가 기획·교육 목적의 도구이며 투자 자문이 아닙니다.
          입력값은 사용자의 브라우저(LocalStorage)에만 저장되며 서버로 전송되지
          않습니다. 모든 투자 결정과 결과는 본인의 책임입니다.
        </p>
      </section>
    </article>
  );
}
