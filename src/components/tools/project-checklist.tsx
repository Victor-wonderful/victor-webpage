"use client";

import { useMemo, useState } from "react";

/**
 * 프로젝트 검증 체크리스트 — 25문항 5축
 * 토크노믹스 / 베스팅·언락 / 팀·거버넌스 / 메커니즘·실효성 / 규제·리스크 공시
 *
 * 트레이딩 진입 체크리스트와 달리 "필수 차단" 개념이 약하다.
 * 대신 5축 각각의 점수와 종합 등급(Tier)을 산출한다.
 */

type Axis =
  | "토크노믹스"
  | "베스팅·언락"
  | "팀·거버넌스"
  | "메커니즘·실효성"
  | "규제·리스크 공시"
  | "정량 지표"
  | "펀더 트랙 레코드";

type Question = {
  id: string;
  axis: Axis;
  text: string;
  hint?: string;
};

const QUESTIONS: Question[] = [
  // 토크노믹스 ─────────────────────────────────
  {
    id: "tk-1",
    axis: "토크노믹스",
    text: "총 공급량(Total Supply)이 명시되고, 무한 발행이 아니거나 발행 상한이 있나?",
    hint: "무한 발행 토큰은 구조적으로 인플레이션 리스크가 큽니다.",
  },
  {
    id: "tk-2",
    axis: "토크노믹스",
    text: "Founder/Team 비율을 합쳐 25% 이하인가?",
    hint: "초기 인사이더 비중이 클수록 매도 압력과 거버넌스 집중 위험이 큽니다.",
  },
  {
    id: "tk-3",
    axis: "토크노믹스",
    text: "Treasury/Foundation 비중이 30% 이하이고 운용 정책이 공시돼 있나?",
    hint: "큰 트레저리는 운용 권한·투명성이 함께 명시되어야 합니다.",
  },
  {
    id: "tk-4",
    axis: "토크노믹스",
    text: "인센티브 풀(Marketing, Bonus 등)의 사용처와 베스팅이 명확한가?",
    hint: "'Marketing 10%' 같은 큰 풀이 즉시 해제·비공개면 매도 압력으로 흡수됩니다.",
  },
  {
    id: "tk-5",
    axis: "토크노믹스",
    text: "Public Sale 비율이 적절(5~15%)이고, 즉시 해제 비율이 30% 이하인가?",
    hint: "Public 즉시 해제가 크면 TGE 직후 매도 압력의 1차 원인이 됩니다.",
  },

  // 베스팅·언락 ─────────────────────────────────
  {
    id: "vs-1",
    axis: "베스팅·언락",
    text: "Founder 베스팅이 6개월 이상 클리프 + 36개월 이상 선형 베스팅인가?",
    hint: "장기 정합성을 강제하는 최소 기준입니다.",
  },
  {
    id: "vs-2",
    axis: "베스팅·언락",
    text: "Team & Advisors 베스팅이 6개월 이상 클리프 + 24개월 이상 선형인가?",
  },
  {
    id: "vs-3",
    axis: "베스팅·언락",
    text: "Private Investors가 TGE 즉시 100% 해제가 아닌, 단계적 베스팅을 적용받는가?",
    hint: "Private 즉시 해제는 단기 매도 압력의 가장 큰 원인입니다.",
  },
  {
    id: "vs-4",
    axis: "베스팅·언락",
    text: "향후 12개월 내 대규모 언락 일정이 공시되어 있고, 단일 시점 누적량이 유통량의 30% 미만인가?",
  },
  {
    id: "vs-5",
    axis: "베스팅·언락",
    text: "베스팅 일정이 스마트컨트랙트로 강제 집행되고 누구나 온체인에서 검증 가능한가?",
    hint: "오프체인 약속만 있는 베스팅은 깨질 수 있습니다.",
  },

  // 팀·거버넌스 ─────────────────────────────────
  {
    id: "tm-1",
    axis: "팀·거버넌스",
    text: "Founder·CEO의 신원과 경력이 공개돼 있나? (LinkedIn·이력서·과거 프로젝트)",
  },
  {
    id: "tm-2",
    axis: "팀·거버넌스",
    text: "팀이 익명이 아니거나, 익명이라면 그 이유와 보안 모델이 합리적으로 공개돼 있나?",
  },
  {
    id: "tm-3",
    axis: "팀·거버넌스",
    text: "관리자 권한이 다중 멀티시그(N-of-M)로 분산되어 있고, 단일 키 의존이 아닌가?",
  },
  {
    id: "tm-4",
    axis: "팀·거버넌스",
    text: "핵심 결정(추가 발행·계약 업그레이드)에 24시간 이상 타임락이나 거버넌스 투표가 적용되나?",
  },
  {
    id: "tm-5",
    axis: "팀·거버넌스",
    text: "분기 또는 월간 트레저리·재무 보고서가 공개되거나 공개 약속이 명문화돼 있나?",
  },

  // 메커니즘·실효성 ─────────────────────────────────
  {
    id: "mx-1",
    axis: "메커니즘·실효성",
    text: "토큰의 사용처가 구체적이고 검증 가능한가? (예: 결제·수수료 할인·실제 서비스 접근)",
    hint: "'거버넌스만'은 가치 포착이 매우 약합니다.",
  },
  {
    id: "mx-2",
    axis: "메커니즘·실효성",
    text: "메커니즘이 시장 사이클을 한 번 이상 거쳐본 검증 이력 또는 정량 백테스트 시뮬레이션이 있나?",
    hint: "신조어 메커니즘은 약세장을 한 번 거쳐야 진짜 검증됩니다.",
  },
  {
    id: "mx-3",
    axis: "메커니즘·실효성",
    text: "토큰 가격과 프로토콜 실적(매출·활성도·TVL) 사이에 명확한 가치 포착 구조가 있나?",
    hint: "거버넌스 토큰은 종종 실적과 가격이 분리됩니다.",
  },
  {
    id: "mx-4",
    axis: "메커니즘·실효성",
    text: "외부 보안 감사(CertiK·Trail of Bits·SlowMist·OpenZeppelin 등) 보고서가 공개돼 있나?",
    hint: "메인넷 배포 전 감사 미공개는 큰 위험 신호입니다.",
  },
  {
    id: "mx-5",
    axis: "메커니즘·실효성",
    text: "메커니즘 이름이 buzzword(예: 'AI Augmented', 'Asymmetric')에 머물지 않고, 실제 작동 원리가 분해 가능한가?",
    hint: "이름만 멋있고 작동 설명이 모호하면 마케팅일 가능성이 높습니다.",
  },

  // 규제·리스크 공시 ─────────────────────────────────
  {
    id: "rg-1",
    axis: "규제·리스크 공시",
    text: "발행 법인의 관할권(Cayman·BVI·Switzerland·Singapore 등)이 명시되고 합법적 프레임워크 안에서 운영되나?",
  },
  {
    id: "rg-2",
    axis: "규제·리스크 공시",
    text: "규제 리스크와 KYC/AML 정책이 공개돼 있나?",
  },
  {
    id: "rg-3",
    axis: "규제·리스크 공시",
    text: "한국 사용자 대상 영업이라면 자본시장법·특금법 회색 지대를 인지하고 공시하고 있나?",
    hint: "한국 거주자에게는 특히 중요한 항목입니다.",
  },
  {
    id: "rg-4",
    axis: "규제·리스크 공시",
    text: "백서에 위험 고지(Risk Disclosure & Legal) 섹션이 있고, 일반적·구체적 리스크가 충분히 나열돼 있나?",
  },
  {
    id: "rg-5",
    axis: "규제·리스크 공시",
    text: "분쟁 해결·면책 조항·관할 법원이 명시돼 있나?",
  },

  // 정량 지표 ─────────────────────────────────
  // Token Terminal·Messari Pro Report 표준 비율들. DeFi/L1/Memecoin마다
  // 적정 범위가 다르므로 hint에 섹터별 참고치를 함께 적습니다.
  {
    id: "qm-1",
    axis: "정량 지표",
    text: "시가총액 / 연간 수수료(P/F) 비율이 동일 섹터 평균 대비 합리적 범위인가?",
    hint: "참고 범위: L1 ~30~80배, DeFi ~10~30배. 200배 이상은 고평가 가능성. 출처: Token Terminal.",
  },
  {
    id: "qm-2",
    axis: "정량 지표",
    text: "시가총액 / TVL 비율(DeFi·L2 한정)이 1.0~3.0배 범위인가?",
    hint: "1배 미만은 저평가, 3배 초과는 고평가 신호. 토큰 모델 종류에 따라 다름. 출처: DefiLlama.",
  },
  {
    id: "qm-3",
    axis: "정량 지표",
    text: "일평균 거래량이 시가총액의 2% 이상인가? (유동성 충분)",
    hint: "유동성이 얕은 토큰은 큰 매도가 가격을 단숨에 깎습니다. 출처: CoinGecko.",
  },
  {
    id: "qm-4",
    axis: "정량 지표",
    text: "Fully Diluted Valuation(FDV) / 현재 시가총액 비율이 3배 이내인가?",
    hint: "3배 초과는 미래 공급 압박이 큰 신호. CoinGecko·CoinMarketCap에서 확인.",
  },
  {
    id: "qm-5",
    axis: "정량 지표",
    text: "Top 10 지갑이 유통 공급의 30% 이하인가? (집중도)",
    hint: "Etherscan·Solscan의 Holders 탭에서 확인. 거래소·브릿지 컨트랙트는 제외.",
  },

  // 펀더 트랙 레코드 ─────────────────────────────────
  // Polychain·Pantera·Dragonfly 등 VC가 실제 사용하는 팀 평가 기준.
  {
    id: "fd-1",
    axis: "펀더 트랙 레코드",
    text: "핵심 팀의 GitHub 활동이 활발하고 외부에서 검증 가능한가? (지속 commit·핵심 컨트랙트 PR)",
    hint: "프로젝트 GitHub org의 최근 90일 commit 수, 컨트리뷰터 수를 보세요.",
  },
  {
    id: "fd-2",
    axis: "펀더 트랙 레코드",
    text: "창업자가 이전에 출시한 프로젝트(크립토 또는 일반 IT·금융) 트랙이 추적 가능한가?",
    hint: "LinkedIn·GitHub·이전 회사 공시 자료로 확인.",
  },
  {
    id: "fd-3",
    axis: "펀더 트랙 레코드",
    text: "코어 팀에 신뢰할 만한 메이저 기관(거래소·VC 포트폴리오·메이저 IT 기업) 출신이 있나?",
    hint: "이력의 양보다 검증 가능성을 우선.",
  },
  {
    id: "fd-4",
    axis: "펀더 트랙 레코드",
    text: "투자자·어드바이저 라인업이 검증 가능한 곳(a16z·Paradigm·Multicoin·Coinbase Ventures·Pantera 등)인가?",
    hint: "이름만 빌리는 어드바이저는 흔합니다. 실제 투자 라운드 공시가 1차 자료.",
  },
  {
    id: "fd-5",
    axis: "펀더 트랙 레코드",
    text: "팀이 한 사람·한 지역에 집중되지 않고 합리적 다양성(기술·지역·산업 경험)이 있나?",
    hint: "단일 의존 리스크는 인수·이탈 시 프로젝트 자체를 흔듭니다.",
  },
];

const AXES: Axis[] = [
  "토크노믹스",
  "베스팅·언락",
  "팀·거버넌스",
  "메커니즘·실효성",
  "규제·리스크 공시",
  "정량 지표",
  "펀더 트랙 레코드",
];

type Tier = "S" | "A" | "B" | "C" | "D";
function tierOf(score: number, total: number): Tier {
  const pct = (score / total) * 100;
  if (pct >= 92) return "S";
  if (pct >= 80) return "A";
  if (pct >= 60) return "B";
  if (pct >= 40) return "C";
  return "D";
}

const TIER_META: Record<
  Tier,
  { label: string; cls: string; advice: string }
> = {
  S: {
    label: "🟢 Tier S — 우수",
    cls: "border-up/40 bg-up/10 text-up",
    advice: "구조적으로 견고한 프로젝트. 본격 분석·할당 검토 가치 있음.",
  },
  A: {
    label: "🟢 Tier A — 양호",
    cls: "border-up/40 bg-up/10 text-up",
    advice:
      "강점이 분명하나 몇 가지 보강 항목 존재. 약점 축에 대한 추가 자료 확인 후 검토.",
  },
  B: {
    label: "🟡 Tier B — 평균",
    cls: "border-warning/40 bg-warning/10 text-warning",
    advice:
      "강점·약점이 혼재. 사이즈 축소 또는 트리거 발생(감사 공개·사용 데이터 등)까지 관망 권장.",
  },
  C: {
    label: "🔴 Tier C — 위험 신호 다수",
    cls: "border-down/40 bg-down/10 text-down",
    advice:
      "구조적 약점이 다수. 단기 트레이딩 외 장기 보유는 비추천. 명확한 개선 로드맵 없으면 회피.",
  },
  D: {
    label: "🔴 Tier D — 비추천",
    cls: "border-down/40 bg-down/10 text-down",
    advice:
      "기본 검증 항목 다수 미충족. 자본 투입 비추천. 메커니즘이 흥미롭더라도 시간이 더 필요.",
  },
};

export function ProjectChecklist() {
  const [projectName, setProjectName] = useState("");
  const [answers, setAnswers] = useState<Record<string, "yes" | "no" | null>>(
    Object.fromEntries(QUESTIONS.map((q) => [q.id, null])),
  );

  const stats = useMemo(() => {
    const total = QUESTIONS.length;
    const answered = QUESTIONS.filter((q) => answers[q.id] !== null).length;
    const yes = QUESTIONS.filter((q) => answers[q.id] === "yes").length;
    const tier = answered === total ? tierOf(yes, total) : null;

    const byAxis = AXES.map((ax) => {
      const items = QUESTIONS.filter((q) => q.axis === ax);
      const ay = items.filter((q) => answers[q.id] === "yes").length;
      const an = items.filter((q) => answers[q.id] === "no").length;
      return {
        axis: ax,
        yes: ay,
        no: an,
        total: items.length,
        unanswered: items.length - ay - an,
      };
    });

    return { total, answered, yes, tier, byAxis };
  }, [answers]);

  const setAns = (id: string, v: "yes" | "no") =>
    setAnswers((a) => ({ ...a, [id]: a[id] === v ? null : v }));

  const reset = () =>
    setAnswers(Object.fromEntries(QUESTIONS.map((q) => [q.id, null])));

  const verdictCls = stats.tier
    ? TIER_META[stats.tier].cls
    : "border-border bg-surface text-fg-muted";

  return (
    <div className="space-y-8">
      {/* Project name + Verdict ───────────────────── */}
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-meta font-semibold text-fg">
            프로젝트 이름 (선택)
          </label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="예: AAG, Bitcoin, Ethereum"
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-[15px] outline-none focus:border-accent"
          />
        </div>

        <aside
          className={`rounded-md border p-5 transition-colors ${verdictCls}`}
          aria-live="polite"
        >
          <p className="font-mono text-[11px] uppercase tracking-wider opacity-70">
            종합 등급 ·{" "}
            <span className="font-mono">
              {stats.yes}/{stats.total}
            </span>{" "}
            응답 {stats.answered}/{stats.total}
          </p>
          <h3 className="mt-2 break-keep font-display text-2xl font-extrabold leading-tight">
            {stats.tier
              ? TIER_META[stats.tier].label
              : `진행 중 (${stats.answered}/${stats.total})`}
          </h3>
          <p className="mt-2 break-keep font-serif-body text-[14px] leading-[1.6]">
            {stats.tier
              ? TIER_META[stats.tier].advice
              : "25개 문항을 모두 답하면 등급이 산출됩니다."}
          </p>
          {stats.answered > 0 && (
            <button
              type="button"
              onClick={reset}
              className="mt-4 rounded-md border border-current px-3 py-1.5 text-[12px] font-semibold opacity-80 hover:opacity-100"
            >
              다시 시작
            </button>
          )}
        </aside>

        {/* Per-axis breakdown ───────────────────── */}
        {stats.answered > 0 && (
          <div className="rounded-md border border-border bg-surface p-5">
            <p className="text-eyebrow text-accent">5축별 점수</p>
            <ul className="mt-4 space-y-3">
              {stats.byAxis.map((a) => {
                const totalAnswered = a.yes + a.no;
                const pct = totalAnswered > 0 ? (a.yes / a.total) * 100 : 0;
                return (
                  <li key={a.axis}>
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="font-display text-[14px] font-bold">
                        {a.axis}
                      </p>
                      <p className="font-mono text-[13px] text-fg-muted">
                        {a.yes}/{a.total}
                        {a.unanswered > 0 && (
                          <span className="ml-1 text-[11px]">
                            ({a.unanswered} 미응답)
                          </span>
                        )}
                      </p>
                    </div>
                    <div
                      className="mt-1.5 h-2 overflow-hidden rounded-full bg-bg"
                      role="progressbar"
                      aria-valuenow={a.yes}
                      aria-valuemax={a.total}
                    >
                      <div
                        className={`h-full transition-all ${
                          pct >= 80
                            ? "bg-up"
                            : pct >= 60
                              ? "bg-warning"
                              : pct >= 40
                                ? "bg-warning/70"
                                : "bg-down"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      {/* Questions grouped by axis ─────────────── */}
      {AXES.map((axis) => {
        const items = QUESTIONS.filter((q) => q.axis === axis);
        return (
          <section key={axis} className="space-y-4">
            <h2 className="font-display text-xl font-bold leading-tight">
              <span className="text-accent">·</span> {axis}
            </h2>
            <ol className="space-y-3">
              {items.map((q) => {
                const idx = QUESTIONS.findIndex((x) => x.id === q.id) + 1;
                const ans = answers[q.id];
                return (
                  <li
                    key={q.id}
                    className="rounded-md border border-border bg-surface p-5"
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-1 shrink-0 font-mono text-[12px] font-bold text-fg-muted">
                        Q{idx.toString().padStart(2, "0")}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="break-keep font-serif-body text-[16px] leading-[1.6] text-fg">
                          {q.text}
                        </p>
                        {q.hint && (
                          <p className="mt-1 break-keep font-serif-body text-[13px] italic leading-[1.5] text-fg-muted">
                            {q.hint}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() => setAns(q.id, "yes")}
                        className={`flex-1 rounded-md border px-3 py-2 text-sm font-semibold transition-colors ${
                          ans === "yes"
                            ? "border-up bg-up/10 text-up"
                            : "border-border bg-bg text-fg-muted hover:border-accent"
                        }`}
                        aria-pressed={ans === "yes"}
                      >
                        ✓ 예
                      </button>
                      <button
                        type="button"
                        onClick={() => setAns(q.id, "no")}
                        className={`flex-1 rounded-md border px-3 py-2 text-sm font-semibold transition-colors ${
                          ans === "no"
                            ? "border-down bg-down/10 text-down"
                            : "border-border bg-bg text-fg-muted hover:border-accent"
                        }`}
                        aria-pressed={ans === "no"}
                      >
                        ✗ 아니오
                      </button>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        );
      })}
    </div>
  );
}
