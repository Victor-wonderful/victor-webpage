import type { Metadata } from "next";
import Link from "next/link";
import { EmotionDiagnostic } from "@/components/tools/emotion-diagnostic";

export const metadata: Metadata = {
  title: "FOMO·복수매매 감정 진단 12문항 — Victor Alpha",
  description:
    "FOMO·복수매매·상태/맥락 3축 12문항으로 진입 직전 감정 신호를 정량 진단. Yes 카운트가 높을수록 위험.",
};

export default function EmotionDiagnosticPage() {
  return (
    <article className="container-page mt-12 mb-24">
      <Link href="/tools" className="text-meta text-fg-muted hover:text-accent">
        ← 도구함
      </Link>

      <p className="mt-6 text-eyebrow text-accent">Checklist · 감정 진단</p>
      <h1 className="mt-3 break-keep font-display text-[36px] font-extrabold leading-[1.2] md:text-[44px] md:leading-[1.15]">
        FOMO · 복수매매 감정 진단
      </h1>
      <p className="mt-2 font-mono text-meta text-fg-muted">
        12 questions · 3 axes · Yes = 위험 신호
      </p>
      <p className="mt-5 max-w-2xl break-keep font-serif-body text-[17px] leading-[1.7] text-fg-muted">
        진입 직전 30초. 차트를 닫고 답해 보세요. 셋업이 완벽해도 감정 상태가
        시스템을 90초 만에 무너뜨립니다. Yes 카운트가 늘어날수록 진입 차단
        신호가 강해집니다.
      </p>

      <section className="mt-12 grid gap-8 lg:grid-cols-[1fr_2fr]">
        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-md border border-border bg-surface-warm p-5">
            <p className="text-eyebrow text-accent">3축 구조</p>
            <ul className="mt-4 space-y-3 break-keep font-serif-body text-[14px] leading-[1.6] text-fg">
              <li>
                <strong>· FOMO 신호 (4)</strong>
                <br />
                <span className="text-fg-muted">
                  외부 자극 · 차트 강박 · 추격 욕구 · 사이즈 키움
                </span>
              </li>
              <li>
                <strong>· 복수매매 신호 (4)</strong>
                <br />
                <span className="text-fg-muted">
                  직전 손실 · 30분 이내 · 회복 욕구 · 즉시 재진입
                </span>
              </li>
              <li>
                <strong>· 상태·맥락 (4)</strong>
                <br />
                <span className="text-fg-muted">
                  음주·피로 · 손절 왜곡 · 셋업 모호 · 일지 부끄러움
                </span>
              </li>
            </ul>
          </div>

          <div className="rounded-md border border-border bg-surface p-5">
            <p className="text-eyebrow text-accent">판정 기준</p>
            <ul className="mt-3 space-y-2 break-keep font-serif-body text-[13px] leading-[1.6] text-fg">
              <li>
                <span className="font-mono font-bold text-up">0~2</span> Yes ·
                정상 · 진입 가능
              </li>
              <li>
                <span className="font-mono font-bold text-warning">3~5</span>{" "}
                Yes · 경계 · 사이즈 절반
              </li>
              <li>
                <span className="font-mono font-bold text-down">6~8</span> Yes ·
                위험 · 30분 휴식
              </li>
              <li>
                <span className="font-mono font-bold text-down">9~12</span> Yes
                · 차단 · 오늘 매매 종료
              </li>
            </ul>
          </div>

          <div className="rounded-md border border-border bg-surface p-5">
            <p className="text-eyebrow text-accent">언제 쓰나</p>
            <p className="mt-3 break-keep font-serif-body text-[13px] leading-[1.6] text-fg-muted">
              매수 버튼을 누르고 싶을 때, 특히 직전 손실 후 또는 외부에서 누가
              샀다는 걸 본 직후. 30초면 됩니다.
            </p>
          </div>
        </aside>

        <div>
          <EmotionDiagnostic />
        </div>
      </section>

      {/* Why */}
      <section className="mt-16">
        <h2 className="font-display text-2xl font-bold leading-tight">
          왜 감정 진단이 셋업보다 우선인가
        </h2>
        <div className="mt-5 space-y-4 break-keep font-serif-body text-[16px] leading-[1.75] text-fg">
          <p>
            트레이딩에서 시스템이 작동하는 사람도 <strong>FOMO와 복수매매에는
            90초 안에 무너집니다</strong>. 셋업이 옳았어도 사이즈를 평소의 3배로
            올리면 한 번의 손절이 한 달 수익을 날립니다.
          </p>
          <p>
            데스크 트레이더의 가장 큰 무기는 <em>자기 상태 인식</em>입니다.
            &ldquo;지금 나는 시스템적인가, 감정적인가&rdquo;를 진입 전 1분 안에
            확인하는 습관. 익숙해지면 이 12문항이 머릿속에서 자동으로 돌아갑니다.
          </p>
          <p>
            <strong>핵심:</strong> 좋은 트레이더는 좋은 셋업을 찾는 게 아니라
            나쁜 진입을 거르는 사람입니다. 이 도구는 거름망입니다.
          </p>
        </div>
      </section>

      <section className="mt-12 rounded-md border border-border bg-surface p-5">
        <p className="text-eyebrow text-accent">Disclaimer</p>
        <p className="mt-3 break-keep font-serif-body text-[14px] leading-[1.6] text-fg-muted">
          본 진단은 자가 점검을 위한 교육·정보 도구이며 투자 자문이 아닙니다.
          모든 매매 결정과 결과는 본인의 책임입니다.
        </p>
      </section>
    </article>
  );
}
