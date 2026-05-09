"use client";

import { useState, useMemo } from "react";

/**
 * FOMO · 복수매매 감정 진단
 * 12문항 3축 — Yes 카운트가 높을수록 위험 신호
 *
 * 진입 직전에 자기 행동 패턴을 점검. 다른 체크리스트와 달리
 * "Yes가 많을수록 나쁘다"는 역방향 채점이라 UI에서 명확히 표시.
 */

type Axis = "FOMO 신호" | "복수매매 신호" | "상태·맥락";

type Question = {
  id: string;
  axis: Axis;
  text: string;
  hint?: string;
};

const QUESTIONS: Question[] = [
  // FOMO 신호 ─────────────────────────────────
  {
    id: "fm-1",
    axis: "FOMO 신호",
    text: "지난 30분 안에 외부 소스(친구·텔레그램·유튜브·트위터)에서 이 자산 이야기를 본 직후인가?",
    hint: "외부 자극 직후의 진입은 FOMO 1차 신호입니다.",
  },
  {
    id: "fm-2",
    axis: "FOMO 신호",
    text: "지난 5분 안에 차트를 5번 이상 새로고침·확대축소 했나?",
    hint: "차트 강박 행동은 진입 직전 FOMO를 알리는 가장 흔한 신호입니다.",
  },
  {
    id: "fm-3",
    axis: "FOMO 신호",
    text: "&ldquo;지금 안 사면 더 못 산다&rdquo;는 생각이 머리에 떠올랐나?",
    hint: "이 문장이 떠오르면 셋업 베팅이 아니라 가격 추격일 가능성이 큽니다.",
  },
  {
    id: "fm-4",
    axis: "FOMO 신호",
    text: "평소 사이즈(1R 한도)보다 크게 들어가고 싶은 충동이 있나?",
    hint: "사이즈를 키우고 싶다는 욕구 자체가 시스템 외부 요인입니다.",
  },

  // 복수매매 신호 ─────────────────────────────
  {
    id: "rv-1",
    axis: "복수매매 신호",
    text: "직전 매매가 손실이었나?",
  },
  {
    id: "rv-2",
    axis: "복수매매 신호",
    text: "직전 손실로부터 30분 이내인가?",
    hint: "손실 직후 30분 안의 진입은 시스템이 아닌 감정입니다.",
  },
  {
    id: "rv-3",
    axis: "복수매매 신호",
    text: "&ldquo;방금 잃은 만큼 빨리 회복하고 싶다&rdquo;는 충동이 있나?",
    hint: "회복 욕구는 사이즈 키움·손절 좁힘으로 이어져 추가 손실을 만듭니다.",
  },
  {
    id: "rv-4",
    axis: "복수매매 신호",
    text: "방금 손절된 자산에 다시 진입하려 하고 있나?",
    hint: "같은 자산 즉시 재진입은 가장 흔한 복수매매 패턴입니다.",
  },

  // 상태·맥락 ─────────────────────────────────
  {
    id: "st-1",
    axis: "상태·맥락",
    text: "음주·과로·심한 스트레스·수면 부족 상태인가?",
    hint: "신체·정신 상태가 흐트러지면 시스템 위반 확률이 급증합니다.",
  },
  {
    id: "st-2",
    axis: "상태·맥락",
    text: "평소보다 손절을 임의로 좁게 또는 넓게 잡고 있나?",
    hint: "손절 위치를 옮기는 것은 시스템을 자기에게 유리하게 왜곡한다는 신호.",
  },
  {
    id: "st-3",
    axis: "상태·맥락",
    text: "셋업이 명확하지 않은데 그냥 들어가고 싶은가?",
    hint: "&ldquo;왠지 갈 것 같다&rdquo;는 시스템이 아닙니다.",
  },
  {
    id: "st-4",
    axis: "상태·맥락",
    text: "이 진입을 매매 일지에 적기 부끄러운가?",
    hint: "기록하기 부끄러운 매매는 미래의 자기에게 부끄러운 매매입니다.",
  },
];

const AXES: Axis[] = ["FOMO 신호", "복수매매 신호", "상태·맥락"];

type Level = "incomplete" | "ok" | "watch" | "warn" | "block";

export function EmotionDiagnostic() {
  const [answers, setAnswers] = useState<Record<string, "yes" | "no" | null>>(
    Object.fromEntries(QUESTIONS.map((q) => [q.id, null])),
  );

  const result = useMemo(() => {
    const total = QUESTIONS.length;
    const answered = QUESTIONS.filter((q) => answers[q.id] !== null).length;
    const yesCount = QUESTIONS.filter((q) => answers[q.id] === "yes").length;

    let level: Level;
    let title: string;
    let advice: string;

    if (answered < total) {
      level = "incomplete";
      title = `진행 중 (${answered}/${total})`;
      advice = "12문항 모두 답하면 종합 판정이 나옵니다.";
    } else if (yesCount === 0) {
      level = "ok";
      title = "✅ 감정적으로 정상";
      advice =
        "감정 신호 없음. 다른 체크(셋업·1R·시장)도 통과하면 시스템적 진입.";
    } else if (yesCount <= 2) {
      level = "ok";
      title = "✅ 진입 가능";
      advice = `Yes ${yesCount}개. 신호는 약하지만 평소대로 진행 가능. 사이즈 키우지 마세요.`;
    } else if (yesCount <= 5) {
      level = "watch";
      title = "⚠️ 경계 — 사이즈 축소 권장";
      advice = `Yes ${yesCount}개. 평소 1R의 절반으로 줄이거나 한 번 호흡 후 재점검.`;
    } else if (yesCount <= 8) {
      level = "warn";
      title = "🚨 진입 금지 — 30분 휴식";
      advice = `Yes ${yesCount}개. 차트 닫고 30분 다른 일. 다시 와서 답해 보세요.`;
    } else {
      level = "block";
      title = "🚨 즉시 차단 — 오늘 매매 종료 권장";
      advice = `Yes ${yesCount}개. 시스템 외 요인이 다수. 오늘은 일지 정리·휴식만.`;
    }

    const byAxis = AXES.map((ax) => {
      const items = QUESTIONS.filter((q) => q.axis === ax);
      const yes = items.filter((q) => answers[q.id] === "yes").length;
      const no = items.filter((q) => answers[q.id] === "no").length;
      return {
        axis: ax,
        yes,
        no,
        total: items.length,
        unanswered: items.length - yes - no,
      };
    });

    return { total, answered, yesCount, level, title, advice, byAxis };
  }, [answers]);

  const setAns = (id: string, v: "yes" | "no") =>
    setAnswers((a) => ({ ...a, [id]: a[id] === v ? null : v }));

  const reset = () =>
    setAnswers(Object.fromEntries(QUESTIONS.map((q) => [q.id, null])));

  const verdictCls =
    result.level === "ok"
      ? "border-up/40 bg-up/10 text-up"
      : result.level === "watch"
        ? "border-warning/40 bg-warning/10 text-warning"
        : result.level === "warn" || result.level === "block"
          ? "border-down/40 bg-down/10 text-down"
          : "border-border bg-surface text-fg-muted";

  return (
    <div className="space-y-8">
      {/* Verdict ─────────────────────────────────── */}
      <aside
        className={`rounded-md border p-5 transition-colors ${verdictCls}`}
        aria-live="polite"
      >
        <p className="font-mono text-[11px] uppercase tracking-wider opacity-70">
          감정 진단 · Yes {result.yesCount} / 12 · 응답 {result.answered}/12
        </p>
        <h3 className="mt-2 break-keep font-display text-2xl font-extrabold leading-tight">
          {result.title}
        </h3>
        <p className="mt-2 break-keep font-serif-body text-[14px] leading-[1.6]">
          {result.advice}
        </p>

        {/* Score bar */}
        {result.answered > 0 && (
          <div className="mt-4">
            <div className="flex items-center gap-1">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-2 flex-1 rounded-full ${
                    i < result.yesCount
                      ? result.yesCount <= 2
                        ? "bg-up"
                        : result.yesCount <= 5
                          ? "bg-warning"
                          : "bg-down"
                      : "bg-current opacity-15"
                  }`}
                />
              ))}
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[10px] opacity-70">
              <span>0 정상</span>
              <span>2</span>
              <span>5 경계</span>
              <span>8 위험</span>
              <span>12 차단</span>
            </div>
          </div>
        )}

        {result.answered > 0 && (
          <button
            type="button"
            onClick={reset}
            className="mt-4 rounded-md border border-current px-3 py-1.5 text-[12px] font-semibold opacity-80 hover:opacity-100"
          >
            다시 시작
          </button>
        )}
      </aside>

      {/* Per-axis breakdown ─────────────────────── */}
      {result.answered > 0 && (
        <div className="rounded-md border border-border bg-surface p-5">
          <p className="text-eyebrow text-accent">3축별 신호 수</p>
          <ul className="mt-4 space-y-3">
            {result.byAxis.map((a) => (
              <li key={a.axis}>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-display text-[14px] font-bold">{a.axis}</p>
                  <p className="font-mono text-[13px] text-fg-muted">
                    Yes {a.yes}/{a.total}
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
                      a.yes === 0
                        ? "bg-up"
                        : a.yes <= 2
                          ? "bg-warning"
                          : "bg-down"
                    }`}
                    style={{ width: `${(a.yes / a.total) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] italic text-fg-muted">
            ⚠️ 다른 체크리스트와 달리 <strong>Yes가 많을수록 위험</strong>합니다.
          </p>
        </div>
      )}

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
                        <p
                          className="break-keep font-serif-body text-[16px] leading-[1.6] text-fg"
                          dangerouslySetInnerHTML={{ __html: q.text }}
                        />
                        {q.hint && (
                          <p className="mt-1 break-keep font-serif-body text-[13px] italic leading-[1.5] text-fg-muted">
                            {q.hint}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Inverse scoring colors: Yes = bad (red), No = safe (green) */}
                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() => setAns(q.id, "yes")}
                        className={`flex-1 rounded-md border px-3 py-2 text-sm font-semibold transition-colors ${
                          ans === "yes"
                            ? "border-down bg-down/10 text-down"
                            : "border-border bg-bg text-fg-muted hover:border-accent"
                        }`}
                        aria-pressed={ans === "yes"}
                      >
                        ✓ 예 (해당)
                      </button>
                      <button
                        type="button"
                        onClick={() => setAns(q.id, "no")}
                        className={`flex-1 rounded-md border px-3 py-2 text-sm font-semibold transition-colors ${
                          ans === "no"
                            ? "border-up bg-up/10 text-up"
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
