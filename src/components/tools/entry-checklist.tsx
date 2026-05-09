"use client";

import { useState, useMemo } from "react";

/**
 * 진입 전 체크리스트 — 10문항 5축
 * - Hard stops: 답 No면 즉시 진입 금지 신호
 * - Soft stops: 답 No 누적되면 보류 권장
 */

type Severity = "hard" | "soft";

type Question = {
  id: string;
  axis: string;
  text: string;
  hint?: string;
  severity: Severity;
};

const QUESTIONS: Question[] = [
  // 셋업 ─────────────────────────────────────────────
  {
    id: "setup-1",
    axis: "셋업",
    text: "이번 진입의 셋업 이름과 진입·청산 조건이 명확하게 정해져 있나?",
    hint: "예: '주봉 EMA50 위, 일봉 RSI50 돌파, 거래량 평균 1.5배' 처럼 한 줄로 적을 수 있어야 합니다.",
    severity: "soft",
  },
  {
    id: "setup-2",
    axis: "셋업",
    text: "이 셋업이 과거에 작동한 사례를 차트나 백테스트로 5회 이상 직접 본 적이 있나?",
    hint: "처음 시도하는 셋업이면 '연습용 사이즈'(평소의 1/3)로만 들어가세요.",
    severity: "soft",
  },

  // 손절 ─────────────────────────────────────────────
  {
    id: "stop-1",
    axis: "손절",
    text: "진입 전에 손절가를 정확한 수치로 적어 두었나?",
    hint: "머릿속에만 있는 손절은 손절이 아닙니다. 메모장이든 차트 라인이든 외부에 적혀 있어야 합니다.",
    severity: "hard",
  },
  {
    id: "stop-2",
    axis: "손절",
    text: "손절가가 차트 구조(직전 스윙·지지·저항)에 기반해 있나?",
    hint: "임의의 'N% 손절'은 시장이 알려주는 손절이 아닙니다. 구조가 깨지는 자리가 진짜 손절입니다.",
    severity: "soft",
  },

  // 1R / 리스크 ─────────────────────────────────────
  {
    id: "risk-1",
    axis: "1R",
    text: "1R 금액(이 트레이드의 최대 손실)이 자본의 2% 이하로 계산돼 있나?",
    hint: "포지션 사이징 계산기로 진입가·손절가·자본을 입력해 역산했나요.",
    severity: "hard",
  },
  {
    id: "risk-2",
    axis: "1R",
    text: "현재 보유 포지션과 이 진입을 합친 총 리스크가 자본의 5% 이하인가?",
    hint: "BTC·ETH·알트처럼 상관도가 높은 종목은 사실상 한 포지션으로 묶어서 계산하세요.",
    severity: "soft",
  },

  // 시장 환경 ─────────────────────────────────────
  {
    id: "env-1",
    axis: "시장 환경",
    text: "지금의 시장 톤(추세·횡보·변동성)이 이 셋업이 잘 작동하는 환경과 맞나?",
    hint: "추세추종 셋업을 횡보장에 쓰면 손절만 반복됩니다. 환경이 안 맞으면 셋업이 좋아도 패스.",
    severity: "soft",
  },
  {
    id: "env-2",
    axis: "시장 환경",
    text: "24시간 안에 매크로 이벤트(FOMC·CPI·실적·언락)가 없거나, 있다면 그 영향을 충분히 고려했나?",
    hint: "이벤트 직전의 진입은 셋업 베팅이 아니라 변동성 베팅입니다.",
    severity: "soft",
  },

  // 감정 ─────────────────────────────────────────
  {
    id: "emo-1",
    axis: "감정",
    text: "직전 손실 매매로부터 30분 이상 지났나?",
    hint: "손실 직후 30분 안의 진입은 시스템이 아닌 감정입니다. 복수매매를 차단합니다.",
    severity: "hard",
  },
  {
    id: "emo-2",
    axis: "감정",
    text: "외부 추천(친구·텔레그램·유튜브)이 아니라 자기 시스템의 신호로 진입하는가?",
    hint: "진입의 출처가 외부 시그널이면 손절·사이즈를 본인이 정하는 의미가 사라집니다.",
    severity: "hard",
  },
];

const AXES = ["셋업", "손절", "1R", "시장 환경", "감정"] as const;

export function EntryChecklist() {
  const [answers, setAnswers] = useState<Record<string, "yes" | "no" | null>>(
    Object.fromEntries(QUESTIONS.map((q) => [q.id, null])),
  );

  const verdict = useMemo(() => {
    const total = QUESTIONS.length;
    const answered = QUESTIONS.filter((q) => answers[q.id] !== null).length;
    const yes = QUESTIONS.filter((q) => answers[q.id] === "yes").length;
    const hardFails = QUESTIONS.filter(
      (q) => q.severity === "hard" && answers[q.id] === "no",
    );
    const softFails = QUESTIONS.filter(
      (q) => q.severity === "soft" && answers[q.id] === "no",
    );

    let level: "ok" | "warn" | "block" | "incomplete";
    let title: string;
    let detail: string;

    if (answered < total) {
      level = "incomplete";
      title = `진행 중 (${answered}/${total})`;
      detail = "10개 문항을 모두 답하면 종합 판정이 나옵니다.";
    } else if (hardFails.length > 0) {
      level = "block";
      title = "🚨 진입 금지";
      detail = `필수 항목 ${hardFails.length}개 미충족. 진입 전에 반드시 해결.`;
    } else if (softFails.length >= 3) {
      level = "block";
      title = "🚨 진입 금지";
      detail = `보강 항목 ${softFails.length}개 미충족 — 셋업 자체를 의심해야 합니다.`;
    } else if (softFails.length >= 1) {
      level = "warn";
      title = "⚠️ 보류 권장";
      detail = `보강 항목 ${softFails.length}개 미충족. 사이즈 절반으로 줄이거나 다음 신호까지 대기 권장.`;
    } else {
      level = "ok";
      title = "✅ 진입 OK";
      detail = "10/10 통과. 계획대로 사이즈·손절 지키며 실행.";
    }

    return { level, title, detail, total, answered, yes, hardFails, softFails };
  }, [answers]);

  const setAns = (id: string, v: "yes" | "no") =>
    setAnswers((a) => ({ ...a, [id]: a[id] === v ? null : v }));

  const reset = () =>
    setAnswers(Object.fromEntries(QUESTIONS.map((q) => [q.id, null])));

  const verdictCls =
    verdict.level === "ok"
      ? "border-up/40 bg-up/10 text-up"
      : verdict.level === "warn"
        ? "border-warning/40 bg-warning/10 text-warning"
        : verdict.level === "block"
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
          종합 판정 · {verdict.answered}/{verdict.total} 응답
        </p>
        <h3 className="mt-2 break-keep font-display text-2xl font-extrabold leading-tight">
          {verdict.title}
        </h3>
        <p className="mt-2 break-keep font-serif-body text-[14px] leading-[1.6]">
          {verdict.detail}
        </p>
        {verdict.level !== "incomplete" && (
          <button
            type="button"
            onClick={reset}
            className="mt-4 rounded-md border border-current px-3 py-1.5 text-[12px] font-semibold opacity-80 hover:opacity-100"
          >
            다시 시작
          </button>
        )}
      </aside>

      {/* Questions grouped by axis ─────────────── */}
      {AXES.map((axis) => {
        const items = QUESTIONS.filter((q) => q.axis === axis);
        return (
          <section key={axis} className="space-y-4">
            <h2 className="font-display text-xl font-bold leading-tight">
              <span className="text-accent">·</span> {axis}
            </h2>
            <ol className="space-y-3">
              {items.map((q, i) => {
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
                        {q.severity === "hard" && (
                          <p className="mt-2 inline-block rounded-full border border-down/40 bg-down/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-down">
                            필수 항목
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

      {verdict.level === "block" && verdict.hardFails.length > 0 && (
        <section className="rounded-md border border-down/40 bg-down/10 p-5">
          <p className="text-eyebrow text-down">차단 사유</p>
          <ul className="mt-3 space-y-2 text-[14px] leading-[1.6] text-fg">
            {verdict.hardFails.map((q) => (
              <li key={q.id}>
                <span className="font-mono text-[11px] text-down">
                  [{q.axis}]
                </span>{" "}
                {q.text}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
