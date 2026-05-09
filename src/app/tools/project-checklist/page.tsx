import type { Metadata } from "next";
import Link from "next/link";
import { ProjectChecklist } from "@/components/tools/project-checklist";

export const metadata: Metadata = {
  title: "프로젝트 검증 체크리스트 35문항 — Victor Alpha",
  description:
    "토크노믹스·베스팅·팀·메커니즘·규제·정량지표·펀더트랙 7축 35문항으로 프로젝트의 구조적 강·약점을 정량 평가. Tier S~D 등급 산출.",
};

export default function ProjectChecklistPage() {
  return (
    <article className="container-page mt-12 mb-24">
      <Link href="/tools" className="text-meta text-fg-muted hover:text-accent">
        ← 도구함
      </Link>

      <p className="mt-6 text-eyebrow text-accent">Checklist · 체크리스트</p>
      <h1 className="mt-3 break-keep font-display text-[36px] font-extrabold leading-[1.2] md:text-[44px] md:leading-[1.15]">
        프로젝트 검증 체크리스트
      </h1>
      <p className="mt-2 font-mono text-meta text-fg-muted">
        35 questions · 7 axes · Tier S~D
      </p>
      <p className="mt-5 max-w-2xl break-keep font-serif-body text-[17px] leading-[1.7] text-fg-muted">
        &ldquo;이 토큰 좋다더라&rdquo; 가 아니라 같은 프레임으로 매번 분해.
        토크노믹스·베스팅·팀·메커니즘·규제·정량지표·펀더트랙 7축에서 백서와
        온체인 데이터를 함께 평가하는 35문항 체크리스트입니다. a16z·Messari·
        Token Terminal·Paradigm 등 기관 프레임을 합성·압축했습니다.
      </p>
      <p className="mt-3">
        <Link
          href="/tools/project-checklist/methodology"
          className="text-meta font-medium text-accent hover:text-accent-hover"
        >
          방법론·근거 문서 →
        </Link>
      </p>

      {/* The checklist */}
      <section className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.5fr]">
        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-md border border-border bg-surface-warm p-5">
            <p className="text-eyebrow text-accent">7축 구조</p>
            <ul className="mt-4 space-y-3 break-keep font-serif-body text-[14px] leading-[1.6] text-fg">
              <li>
                <strong>· 토크노믹스 (5)</strong>
                <br />
                <span className="text-fg-muted">
                  공급량·분배·인사이더 비중·인센티브 풀
                </span>
              </li>
              <li>
                <strong>· 베스팅·언락 (5)</strong>
                <br />
                <span className="text-fg-muted">
                  Founder/Team 클리프·Private 즉시해제·향후 12개월 언락
                </span>
              </li>
              <li>
                <strong>· 팀·거버넌스 (5)</strong>
                <br />
                <span className="text-fg-muted">
                  팀 신원·멀티시그·타임락·재무 보고
                </span>
              </li>
              <li>
                <strong>· 메커니즘·실효성 (5)</strong>
                <br />
                <span className="text-fg-muted">
                  사용처·검증·가치포착·외부감사·buzzword
                </span>
              </li>
              <li>
                <strong>· 규제·리스크 공시 (5)</strong>
                <br />
                <span className="text-fg-muted">
                  관할권·KYC·한국 회색지대·면책
                </span>
              </li>
              <li>
                <strong>· 정량 지표 (5)</strong>
                <br />
                <span className="text-fg-muted">
                  P/F·시총/TVL·FDV·유동성·집중도
                </span>
              </li>
              <li>
                <strong>· 펀더 트랙 레코드 (5)</strong>
                <br />
                <span className="text-fg-muted">
                  GitHub·이전 트랙·소속 이력·VC·다양성
                </span>
              </li>
            </ul>
          </div>

          <div className="rounded-md border border-border bg-surface p-5">
            <p className="text-eyebrow text-accent">등급 기준 (35점 만점)</p>
            <ul className="mt-4 space-y-2 break-keep font-serif-body text-[13px] leading-[1.6] text-fg">
              <li>
                <span className="font-mono font-bold text-up">S</span> · 32~35
                점 (≥92%) · 우수
              </li>
              <li>
                <span className="font-mono font-bold text-up">A</span> · 28~31
                점 (≥80%) · 양호
              </li>
              <li>
                <span className="font-mono font-bold text-warning">B</span> ·
                21~27 점 (≥60%) · 평균
              </li>
              <li>
                <span className="font-mono font-bold text-down">C</span> ·
                14~20 점 (≥40%) · 위험
              </li>
              <li>
                <span className="font-mono font-bold text-down">D</span> · 0~13
                점 (&lt;40%) · 비추천
              </li>
            </ul>
          </div>
        </aside>

        <div>
          <ProjectChecklist />
        </div>
      </section>

      {/* How to use */}
      <section className="mt-16 rounded-md border-l-4 border-accent bg-surface-warm p-6">
        <p className="text-eyebrow text-accent">사용법</p>
        <ol className="mt-4 space-y-3 break-keep font-serif-body text-[15px] leading-[1.7] text-fg">
          <li>
            <strong>1. 백서·공식 사이트·CoinGecko·Etherscan을 함께 열어 두세요.</strong>{" "}
            모든 25문항은 1차 자료에서 답이 나와야 합니다. &ldquo;유튜브에서
            들었다&rdquo;는 답변 자료로 사용하지 마세요.
          </li>
          <li>
            <strong>2. 모르는 항목은 일단 비워 두세요.</strong> &ldquo;아니오&rdquo;와{" "}
            &ldquo;자료를 못 찾음&rdquo;은 다릅니다. 찾을 수 없다면 그것 자체가
            정보 비대칭 신호입니다.
          </li>
          <li>
            <strong>3. 5축 점수 차이를 보세요.</strong> 종합 점수보다 어느 축이
            약한지가 중요합니다. 메커니즘은 우수한데 규제 공시가 약한 프로젝트와
            그 반대는 다른 종류의 리스크입니다.
          </li>
          <li>
            <strong>4. Tier S/A여도 시점이 중요합니다.</strong> TGE 직후 매도 압력,
            메인넷 미배포, 보안 감사 미완 같은 시점 리스크는 등급과 별개로
            존재합니다.
          </li>
          <li>
            <strong>5. 같은 프레임으로 3개 이상 다른 프로젝트를 분석하면</strong>{" "}
            상대 비교가 가능해집니다. 단발 분석은 의미가 약합니다.
          </li>
        </ol>
      </section>

      {/* Why this matters */}
      <section className="mt-12">
        <h2 className="font-display text-2xl font-bold leading-tight">
          왜 이 프레임이 필요한가
        </h2>
        <div className="mt-5 space-y-4 break-keep font-serif-body text-[16px] leading-[1.75] text-fg">
          <p>
            한국 크립토 미디어 대부분은 가격·뉴스·상장 일정을 다룹니다.{" "}
            <strong>토크노믹스·베스팅·메커니즘 실효성을 정량 분해하는
            프레임</strong>을 가르치는 곳은 거의 없습니다. 그래서 리테일은 백서를
            받아도 어디부터 봐야 하는지 모릅니다.
          </p>
          <p>
            기관 데스크에서 자산을 평가할 때는 항상 <em>같은 프레임</em>을
            반복합니다. 5명이 같은 프로젝트를 보면 비슷한 결론에 도달해야
            프레임이 작동하는 것이고, 그래야 분석 결과가 누적·비교 가능합니다.
            이 도구는 그 프레임을 한 페이지로 압축한 것입니다.
          </p>
          <p>
            <strong>핵심:</strong> 프로젝트 25개를 같은 25문항으로 평가하면, 어떤
            축에서 시장이 무엇을 신호로 받아들이는지가 데이터로 보입니다. 직감이
            아닌 패턴 인식. 이게 데스크와 리테일의 차이입니다.
          </p>
        </div>
      </section>

      <section className="mt-12 rounded-md border border-border bg-surface p-5">
        <p className="text-eyebrow text-accent">Disclaimer</p>
        <p className="mt-3 break-keep font-serif-body text-[14px] leading-[1.6] text-fg-muted">
          본 체크리스트는 정보·교육 목적의 자가 평가 도구이며 투자 자문이
          아닙니다. 등급(Tier S~D)은 구조적 평가 결과이지 가격 예측이나 매수·
          매도 추천이 아닙니다. 모든 투자 결정과 결과는 본인의 책임입니다.
        </p>
      </section>
    </article>
  );
}
