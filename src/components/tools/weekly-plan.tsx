"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * 주간 트레이딩 플랜 템플릿
 * - 7 섹션: 지난 주 회고 / 매크로 이벤트 / 시장 톤 / 핵심 레벨 / 셋업 후보 / 리스크 한도 / 한 줄 의지
 * - 동적 행 (이벤트·레벨)
 * - LocalStorage 자동 저장
 * - Markdown 복사 / 인쇄(PDF)
 */

const STORAGE_KEY = "victor-alpha-weekly-plan-draft";

type Event = { date: string; title: string; impact: string };
type Level = { asset: string; bias: string; entry: string; stop: string; target: string; note: string };

type Plan = {
  weekStart: string; // ISO date
  // ① 지난 주 회고
  recapPnlR: string;
  recapTrades: string;
  recapWinRate: string;
  recapBreaches: string;
  recapLesson: string;
  // ② 매크로·이벤트
  events: Event[];
  // ③ 시장 톤
  marketTone: string;
  marketView: string;
  // ④ 핵심 레벨
  levels: Level[];
  // ⑤ 셋업 후보
  setupCandidates: string;
  // ⑥ 리스크 한도
  riskPerTrade: string;
  maxConcurrent: string;
  weeklyDDStop: string;
  // ⑦ 한 줄 의지
  mantra: string;
};

const blank: Plan = {
  weekStart: "",
  recapPnlR: "",
  recapTrades: "",
  recapWinRate: "",
  recapBreaches: "",
  recapLesson: "",
  events: [
    { date: "", title: "", impact: "" },
    { date: "", title: "", impact: "" },
  ],
  marketTone: "",
  marketView: "",
  levels: [
    { asset: "", bias: "", entry: "", stop: "", target: "", note: "" },
    { asset: "", bias: "", entry: "", stop: "", target: "", note: "" },
  ],
  setupCandidates: "",
  riskPerTrade: "1",
  maxConcurrent: "3",
  weeklyDDStop: "5",
  mantra: "",
};

function thisMonday() {
  const d = new Date();
  const day = d.getDay(); // 0 sun, 1 mon
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d.toISOString().slice(0, 10);
}

export function WeeklyPlan() {
  const [plan, setPlan] = useState<Plan>(blank);
  const [hydrated, setHydrated] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<Plan>;
        setPlan((p) => ({ ...p, ...parsed }));
      } else {
        setPlan((p) => ({ ...p, weekStart: thisMonday() }));
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
    } catch {
      // ignore
    }
  }, [plan, hydrated]);

  const set = <K extends keyof Plan>(key: K, val: Plan[K]) =>
    setPlan((p) => ({ ...p, [key]: val }));

  // Events ─────────────────────────
  const addEvent = () =>
    set("events", [...plan.events, { date: "", title: "", impact: "" }]);
  const removeEvent = (i: number) =>
    set(
      "events",
      plan.events.filter((_, idx) => idx !== i),
    );
  const updateEvent = (i: number, patch: Partial<Event>) =>
    set(
      "events",
      plan.events.map((e, idx) => (idx === i ? { ...e, ...patch } : e)),
    );

  // Levels ─────────────────────────
  const addLevel = () =>
    set("levels", [
      ...plan.levels,
      { asset: "", bias: "", entry: "", stop: "", target: "", note: "" },
    ]);
  const removeLevel = (i: number) =>
    set(
      "levels",
      plan.levels.filter((_, idx) => idx !== i),
    );
  const updateLevel = (i: number, patch: Partial<Level>) =>
    set(
      "levels",
      plan.levels.map((l, idx) => (idx === i ? { ...l, ...patch } : l)),
    );

  const reset = () => {
    if (!confirm("주간 플랜을 초기화할까요? 현재 내용은 사라집니다.")) return;
    setPlan({ ...blank, weekStart: thisMonday() });
  };

  const buildMarkdown = useCallback(() => {
    const eventRows = plan.events
      .filter((e) => e.title || e.date)
      .map((e) => `| ${e.date || "—"} | ${e.title || "—"} | ${e.impact || "—"} |`)
      .join("\n");

    const levelRows = plan.levels
      .filter((l) => l.asset)
      .map(
        (l) =>
          `| ${l.asset} | ${l.bias || "—"} | ${l.entry || "—"} | ${l.stop || "—"} | ${l.target || "—"} | ${l.note || "—"} |`,
      )
      .join("\n");

    return `# 주간 트레이딩 플랜 — ${plan.weekStart || "(주 시작일)"}

## ① 지난 주 회고

- **P&L (R)**: ${plan.recapPnlR || "—"}R
- **매매 횟수**: ${plan.recapTrades || "—"}
- **승률**: ${plan.recapWinRate || "—"}%
- **시스템 위반 횟수**: ${plan.recapBreaches || "—"}
- **가장 큰 학습**:
${plan.recapLesson ? plan.recapLesson.split("\n").map((l) => `  > ${l}`).join("\n") : "  > —"}

## ② 이번 주 매크로·이벤트

${
  eventRows
    ? `| 날짜 | 이벤트 | 예상 영향 |
|---|---|---|
${eventRows}`
    : "_등록된 이벤트 없음_"
}

## ③ 시장 톤

- **톤**: ${plan.marketTone || "—"}
- **시각**:
${plan.marketView ? plan.marketView.split("\n").map((l) => `  > ${l}`).join("\n") : "  > —"}

## ④ 핵심 자산 레벨

${
  levelRows
    ? `| 자산 | 방향 | 진입 후보 | 손절 | 목표 | 비고 |
|---|---|---|---|---|---|
${levelRows}`
    : "_등록된 레벨 없음_"
}

## ⑤ 셋업 후보

${plan.setupCandidates ? plan.setupCandidates.split("\n").map((l) => `- ${l}`).join("\n") : "- —"}

## ⑥ 리스크 한도

- **1R = 자본의** ${plan.riskPerTrade || "—"}%
- **동시 보유 최대**: ${plan.maxConcurrent || "—"}개
- **주간 손실 상한 (트리거 시 매매 중지)**: ${plan.weeklyDDStop || "—"}%

## ⑦ 이번 주 의지

> ${plan.mantra || "—"}

---
*Generated by Victor Alpha — Weekly Trading Plan*
`;
  }, [plan]);

  const copyMd = async () => {
    try {
      await navigator.clipboard.writeText(buildMarkdown());
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      alert("복사 실패. 브라우저가 클립보드를 차단했을 수 있습니다.");
    }
  };

  const print = () => window.print();

  if (!hydrated) {
    return (
      <div className="rounded-md border border-border bg-surface p-8 text-center text-fg-muted">
        불러오는 중…
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Week start ───────────────────────────── */}
      <section className="rounded-md border border-border bg-surface p-6">
        <Field
          label="주 시작일 (월요일)"
          type="date"
          value={plan.weekStart}
          onChange={(v) => set("weekStart", v)}
        />
      </section>

      {/* ① Recap ────────────────────────────── */}
      <section className="rounded-md border border-border bg-surface p-6">
        <header className="mb-5">
          <h2 className="font-display text-xl font-bold tracking-tight">
            ① 지난 주 회고
          </h2>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-fg-muted">
            일요일 저녁 / 월요일 아침
          </p>
        </header>
        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="P&L (R 단위)"
            placeholder="+3.5 또는 -2.0"
            value={plan.recapPnlR}
            onChange={(v) => set("recapPnlR", v)}
            suffix={<span className="text-meta text-fg-muted">R</span>}
          />
          <Field
            label="매매 횟수"
            value={plan.recapTrades}
            onChange={(v) => set("recapTrades", v)}
          />
          <Field
            label="승률"
            value={plan.recapWinRate}
            onChange={(v) => set("recapWinRate", v)}
            suffix={<span className="text-meta text-fg-muted">%</span>}
          />
          <Field
            label="시스템 위반 횟수"
            placeholder="0이 목표"
            value={plan.recapBreaches}
            onChange={(v) => set("recapBreaches", v)}
          />
          <div className="md:col-span-2">
            <Textarea
              label="가장 큰 학습 (1~3줄)"
              placeholder="지난 주 매매에서 가장 강하게 배운 것"
              value={plan.recapLesson}
              onChange={(v) => set("recapLesson", v)}
              rows={3}
            />
          </div>
        </div>
      </section>

      {/* ② Events ────────────────────────────── */}
      <section className="rounded-md border border-border bg-surface p-6">
        <header className="mb-5 flex items-baseline justify-between">
          <h2 className="font-display text-xl font-bold tracking-tight">
            ② 이번 주 매크로·이벤트
          </h2>
          <button
            type="button"
            onClick={addEvent}
            className="rounded-md border border-border px-3 py-1 text-[12px] font-semibold text-fg-muted hover:border-accent hover:text-accent"
          >
            + 이벤트 추가
          </button>
        </header>
        <p className="mb-4 text-[13px] text-fg-muted">
          FOMC · CPI · NFP · 실적 발표 · 토큰 언락 등
        </p>
        <ul className="space-y-3">
          {plan.events.map((e, i) => (
            <li
              key={i}
              className="grid gap-2 rounded-md border border-border bg-bg p-3 md:grid-cols-[120px_1fr_140px_auto]"
            >
              <input
                type="date"
                value={e.date}
                onChange={(ev) => updateEvent(i, { date: ev.target.value })}
                className="rounded border border-border bg-surface px-2 py-1.5 text-[13px] outline-none focus:border-accent"
                aria-label="이벤트 날짜"
              />
              <input
                type="text"
                value={e.title}
                placeholder="FOMC, 4월 CPI 발표, etc"
                onChange={(ev) => updateEvent(i, { title: ev.target.value })}
                className="rounded border border-border bg-surface px-2 py-1.5 text-[14px] outline-none focus:border-accent"
                aria-label="이벤트 제목"
              />
              <input
                type="text"
                value={e.impact}
                placeholder="예상 영향 (상/중/하)"
                onChange={(ev) => updateEvent(i, { impact: ev.target.value })}
                className="rounded border border-border bg-surface px-2 py-1.5 text-[13px] outline-none focus:border-accent"
                aria-label="예상 영향"
              />
              <button
                type="button"
                onClick={() => removeEvent(i)}
                className="rounded border border-border px-2 py-1 text-[12px] text-fg-muted hover:border-down hover:text-down"
                aria-label="이벤트 삭제"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* ③ Market tone ─────────────────────── */}
      <section className="rounded-md border border-border bg-surface p-6">
        <header className="mb-5">
          <h2 className="font-display text-xl font-bold tracking-tight">
            ③ 시장 톤
          </h2>
        </header>
        <div className="space-y-4">
          <Field
            label="이번 주 톤"
            placeholder="추세 / 횡보 / 변동성 ↑ / 매크로 대기"
            value={plan.marketTone}
            onChange={(v) => set("marketTone", v)}
          />
          <Textarea
            label="시각 (3~5줄)"
            placeholder="지수·BTC·코스피·USD·금 등 자산군별 톤과 그렇게 본 근거"
            value={plan.marketView}
            onChange={(v) => set("marketView", v)}
            rows={4}
          />
        </div>
      </section>

      {/* ④ Levels ────────────────────────── */}
      <section className="rounded-md border border-border bg-surface p-6">
        <header className="mb-5 flex items-baseline justify-between">
          <h2 className="font-display text-xl font-bold tracking-tight">
            ④ 핵심 자산 레벨
          </h2>
          <button
            type="button"
            onClick={addLevel}
            className="rounded-md border border-border px-3 py-1 text-[12px] font-semibold text-fg-muted hover:border-accent hover:text-accent"
          >
            + 자산 추가
          </button>
        </header>
        <p className="mb-4 text-[13px] text-fg-muted">
          이번 주 봐야 할 자산 3~5개와 핵심 레벨
        </p>
        <ul className="space-y-3">
          {plan.levels.map((l, i) => (
            <li
              key={i}
              className="rounded-md border border-border bg-bg p-3"
            >
              <div className="grid gap-2 md:grid-cols-[100px_80px_1fr_1fr_1fr_auto]">
                <input
                  type="text"
                  value={l.asset}
                  placeholder="BTC"
                  onChange={(e) => updateLevel(i, { asset: e.target.value })}
                  className="rounded border border-border bg-surface px-2 py-1.5 text-[13px] font-semibold outline-none focus:border-accent"
                />
                <input
                  type="text"
                  value={l.bias}
                  placeholder="L/S/관망"
                  onChange={(e) => updateLevel(i, { bias: e.target.value })}
                  className="rounded border border-border bg-surface px-2 py-1.5 text-[13px] outline-none focus:border-accent"
                />
                <input
                  type="text"
                  value={l.entry}
                  placeholder="진입 후보"
                  onChange={(e) => updateLevel(i, { entry: e.target.value })}
                  className="rounded border border-border bg-surface px-2 py-1.5 text-[13px] font-mono outline-none focus:border-accent"
                />
                <input
                  type="text"
                  value={l.stop}
                  placeholder="손절"
                  onChange={(e) => updateLevel(i, { stop: e.target.value })}
                  className="rounded border border-border bg-surface px-2 py-1.5 text-[13px] font-mono outline-none focus:border-accent"
                />
                <input
                  type="text"
                  value={l.target}
                  placeholder="목표"
                  onChange={(e) => updateLevel(i, { target: e.target.value })}
                  className="rounded border border-border bg-surface px-2 py-1.5 text-[13px] font-mono outline-none focus:border-accent"
                />
                <button
                  type="button"
                  onClick={() => removeLevel(i)}
                  className="rounded border border-border px-2 py-1 text-[12px] text-fg-muted hover:border-down hover:text-down"
                  aria-label="자산 삭제"
                >
                  ✕
                </button>
              </div>
              <input
                type="text"
                value={l.note}
                placeholder="비고: 셋업·트리거·시나리오 한 줄"
                onChange={(e) => updateLevel(i, { note: e.target.value })}
                className="mt-2 w-full rounded border border-border bg-surface px-2 py-1.5 text-[13px] outline-none focus:border-accent"
              />
            </li>
          ))}
        </ul>
      </section>

      {/* ⑤ Setups ──────────────────────────── */}
      <section className="rounded-md border border-border bg-surface p-6">
        <header className="mb-5">
          <h2 className="font-display text-xl font-bold tracking-tight">
            ⑤ 셋업 후보
          </h2>
        </header>
        <Textarea
          label="이번 주에 노릴 셋업 (한 줄에 하나씩)"
          placeholder={
            "추세추종 — BTC 일봉 EMA200 위 + 4시간 RSI50 돌파\n돌파 — 코스피 7,500 박스 상단 돌파 시\n매크로 반응 — 5/12 CPI 발표 직후 시장 반응 추종"
          }
          value={plan.setupCandidates}
          onChange={(v) => set("setupCandidates", v)}
          rows={5}
        />
      </section>

      {/* ⑥ Risk ────────────────────────────── */}
      <section className="rounded-md border border-border bg-surface p-6">
        <header className="mb-5">
          <h2 className="font-display text-xl font-bold tracking-tight">
            ⑥ 리스크 한도
          </h2>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-fg-muted">
            한 주 시작 전에 못 박아 두기
          </p>
        </header>
        <div className="grid gap-4 md:grid-cols-3">
          <Field
            label="1R = 자본의"
            value={plan.riskPerTrade}
            onChange={(v) => set("riskPerTrade", v)}
            suffix={<span className="text-meta text-fg-muted">%</span>}
            hint="권장 0.5~2%"
          />
          <Field
            label="동시 보유 최대"
            value={plan.maxConcurrent}
            onChange={(v) => set("maxConcurrent", v)}
            suffix={<span className="text-meta text-fg-muted">개</span>}
            hint="상관도 높은 종목은 1개로 묶음"
          />
          <Field
            label="주간 손실 상한"
            value={plan.weeklyDDStop}
            onChange={(v) => set("weeklyDDStop", v)}
            suffix={<span className="text-meta text-fg-muted">%</span>}
            hint="이거 넘으면 주말까지 매매 중지"
          />
        </div>
      </section>

      {/* ⑦ Mantra ──────────────────────────── */}
      <section className="rounded-md border border-border bg-surface p-6">
        <header className="mb-5">
          <h2 className="font-display text-xl font-bold tracking-tight">
            ⑦ 이번 주 의지 (한 줄)
          </h2>
        </header>
        <input
          type="text"
          value={plan.mantra}
          placeholder="예: '시스템 위반 0회'  /  '사이즈 키우지 않는다'  /  'CPI 직전 진입 금지'"
          onChange={(e) => set("mantra", e.target.value)}
          className="w-full rounded-md border border-border bg-bg px-4 py-3 font-display text-[18px] italic outline-none focus:border-accent"
        />
      </section>

      {/* Actions ────────────────────────────── */}
      <section className="sticky bottom-4 z-10 rounded-md border border-border bg-surface-warm p-4 shadow-sm print:hidden">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={copyMd}
            className="rounded-md bg-accent px-4 py-2 text-pill text-white hover:bg-accent-hover"
          >
            {copied ? "✓ 복사됨" : "Markdown 복사"}
          </button>
          <button
            type="button"
            onClick={print}
            className="rounded-md border border-ink px-4 py-2 text-pill text-fg hover:border-accent"
          >
            인쇄 / PDF
          </button>
          <button
            type="button"
            onClick={reset}
            className="ml-auto rounded-md border border-border px-4 py-2 text-pill text-fg-muted hover:border-down hover:text-down"
          >
            초기화
          </button>
        </div>
        <p className="mt-2 text-[12px] text-fg-muted">
          입력값은 자동으로 브라우저에 저장됩니다. 다른 기기로 옮기려면 Markdown
          복사 후 본인 노트에 보관하세요.
        </p>
      </section>
    </div>
  );
}

function Field({
  label,
  hint,
  value,
  onChange,
  type = "text",
  placeholder,
  suffix,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  suffix?: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-meta font-semibold text-fg">{label}</label>
      {hint && <p className="text-[12px] text-fg-muted">{hint}</p>}
      <div className="mt-1.5 flex items-center gap-2 rounded-md border border-border bg-surface focus-within:border-accent">
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent px-3 py-2 font-serif-body text-[15px] outline-none"
        />
        {suffix && <div className="pr-3">{suffix}</div>}
      </div>
    </div>
  );
}

function Textarea({
  label,
  placeholder,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <div>
      <label className="block text-meta font-semibold text-fg">{label}</label>
      <textarea
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full break-keep rounded-md border border-border bg-surface px-3 py-2 font-serif-body text-[15px] leading-[1.6] outline-none focus:border-accent"
      />
    </div>
  );
}
