"use client";

import { useState, useMemo } from "react";

/**
 * 복리 수익률·손실 회복 계산기
 * 3 모드:
 *   ① 복리 성장 — 시작 자본 + 월 수익률 + 기간 → 종료 자본
 *   ② 손실 회복 — -X% 손실 후 본전까지 필요한 수익률
 *   ③ 목표 역산 — 목표 자본까지 필요한 월 수익률
 */

const fmt0 = new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 });
const fmt2 = new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 2 });
const pct = (n: number | undefined) => (n == null ? "—" : `${fmt2.format(n)}%`);

function num(v: string): number {
  const x = parseFloat(v.replace(/,/g, ""));
  return Number.isFinite(x) ? x : 0;
}

type Mode = "growth" | "recovery" | "target";

export function CompoundCalculator() {
  const [mode, setMode] = useState<Mode>("growth");

  // Growth mode inputs
  const [startCapital, setStartCapital] = useState("10000");
  const [monthlyReturn, setMonthlyReturn] = useState("3");
  const [months, setMonths] = useState("12");

  // Recovery mode inputs
  const [lossPct, setLossPct] = useState("30");

  // Target mode inputs
  const [tStart, setTStart] = useState("10000");
  const [tGoal, setTGoal] = useState("100000");
  const [tMonths, setTMonths] = useState("36");

  return (
    <div className="space-y-6">
      {/* Mode tabs */}
      <div className="flex flex-wrap gap-2">
        {(
          [
            ["growth", "① 복리 성장"],
            ["recovery", "② 손실 회복"],
            ["target", "③ 목표 역산"],
          ] as const
        ).map(([val, label]) => (
          <button
            key={val}
            type="button"
            onClick={() => setMode(val)}
            className={`rounded-md border px-4 py-2 text-sm font-semibold transition-colors ${
              mode === val
                ? "border-accent bg-accent/10 text-accent"
                : "border-border bg-surface text-fg-muted hover:border-accent"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === "growth" && (
        <GrowthMode
          startCapital={startCapital}
          setStartCapital={setStartCapital}
          monthlyReturn={monthlyReturn}
          setMonthlyReturn={setMonthlyReturn}
          months={months}
          setMonths={setMonths}
        />
      )}

      {mode === "recovery" && (
        <RecoveryMode lossPct={lossPct} setLossPct={setLossPct} />
      )}

      {mode === "target" && (
        <TargetMode
          tStart={tStart}
          setTStart={setTStart}
          tGoal={tGoal}
          setTGoal={setTGoal}
          tMonths={tMonths}
          setTMonths={setTMonths}
        />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   ① 복리 성장 모드
   ═══════════════════════════════════════════════════ */

function GrowthMode({
  startCapital,
  setStartCapital,
  monthlyReturn,
  setMonthlyReturn,
  months,
  setMonths,
}: {
  startCapital: string;
  setStartCapital: (v: string) => void;
  monthlyReturn: string;
  setMonthlyReturn: (v: string) => void;
  months: string;
  setMonths: (v: string) => void;
}) {
  const calc = useMemo(() => {
    const C = num(startCapital);
    const r = num(monthlyReturn) / 100;
    const m = Math.max(0, Math.floor(num(months)));

    if (C <= 0 || m <= 0) return null;

    const finalCapital = C * Math.pow(1 + r, m);
    const totalReturn = ((finalCapital - C) / C) * 100;
    const annualReturnEquivalent = (Math.pow(1 + r, 12) - 1) * 100;
    const naiveSum = r * m * 100; // 단순 합산 — 비교용
    const compoundBonus = totalReturn - naiveSum;

    // 매월 자본 누적 (최대 60개월만)
    const trail: number[] = [];
    let cur = C;
    const trailLen = Math.min(m, 60);
    for (let i = 0; i <= trailLen; i++) {
      trail.push(cur);
      cur = cur * (1 + r);
    }

    return {
      finalCapital,
      totalReturn,
      annualReturnEquivalent,
      naiveSum,
      compoundBonus,
      trail,
      trailLen,
      C,
      r,
      m,
    };
  }, [startCapital, monthlyReturn, months]);

  const isLoss = num(monthlyReturn) < 0;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
      <div className="space-y-5">
        <Field
          label="시작 자본"
          value={startCapital}
          onChange={setStartCapital}
        />
        <Field
          label="월 수익률"
          hint="평균 월 수익률. 마이너스 입력 시 복리 손실 계산"
          value={monthlyReturn}
          onChange={setMonthlyReturn}
          suffix={<span className="text-meta text-fg-muted">%</span>}
        />
        <Field
          label="기간"
          value={months}
          onChange={setMonths}
          suffix={<span className="text-meta text-fg-muted">개월</span>}
        />

        <div className="rounded-md border border-border bg-surface-warm p-4">
          <p className="text-eyebrow text-accent">참고 — 월 수익률 감각</p>
          <ul className="mt-2 space-y-1 text-[12px] text-fg-muted">
            <li>· 1% / 월 → 12.7% / 년</li>
            <li>· 3% / 월 → 42.6% / 년</li>
            <li>· 5% / 월 → 79.6% / 년</li>
            <li>· 10% / 월 → 213.8% / 년 (지속 거의 불가)</li>
          </ul>
        </div>
      </div>

      <div className="space-y-5">
        <div className="rounded-md border border-border bg-surface p-6">
          <p className="text-eyebrow text-accent">결과</p>

          {!calc ? (
            <p className="mt-4 text-fg-muted">입력값을 채워 주세요.</p>
          ) : (
            <>
              <h3 className="mt-2 break-keep font-display text-3xl font-extrabold leading-tight">
                {fmt0.format(calc.finalCapital)}
              </h3>
              <p className="mt-1 font-mono text-[13px] text-fg-muted">
                {calc.m}개월 후 종료 자본
              </p>

              <dl className="mt-6 space-y-3 font-serif-body text-[15px] leading-[1.6]">
                <Row
                  label="총 수익률"
                  value={`${calc.totalReturn >= 0 ? "+" : ""}${pct(calc.totalReturn)}`}
                  emphasize
                />
                <Row
                  label="연 수익률 환산 (CAGR-like)"
                  value={`${calc.annualReturnEquivalent >= 0 ? "+" : ""}${pct(calc.annualReturnEquivalent)}`}
                />
                <hr className="border-border" />
                <Row
                  label="단순 합산 (참고)"
                  value={pct(calc.naiveSum)}
                  hint="월 수익률 × 개월 — 복리 효과 미반영"
                />
                <Row
                  label="복리 보너스 (-페널티)"
                  value={`${calc.compoundBonus >= 0 ? "+" : ""}${pct(calc.compoundBonus)}`}
                  emphasize
                  hint={
                    calc.compoundBonus >= 0
                      ? "복리로 단순 합산 대비 추가 수익"
                      : "음수 복리로 단순 합산보다 더 깎임"
                  }
                />
              </dl>
            </>
          )}
        </div>

        {calc && calc.trail.length > 1 && (
          <div className="rounded-md border border-border bg-surface p-5">
            <p className="text-eyebrow text-accent">자본 추이</p>
            <p className="mt-1 text-[12px] text-fg-muted">
              {calc.m > 60 ? "최대 60개월까지 표시" : `${calc.m}개월`}
            </p>

            <div className="mt-4 flex h-32 items-end gap-[2px]">
              {calc.trail.map((v, i) => {
                const minVal = Math.min(...calc.trail);
                const maxVal = Math.max(...calc.trail);
                const range = maxVal - minVal || 1;
                const h = ((v - minVal) / range) * 100;
                return (
                  <div
                    key={i}
                    title={`${i}개월: ${fmt0.format(v)}`}
                    className={`flex-1 rounded-t-sm ${
                      isLoss ? "bg-down/40" : "bg-accent/40"
                    }`}
                    style={{ height: `${Math.max(h, 2)}%` }}
                  />
                );
              })}
            </div>
            <div className="mt-2 flex justify-between text-[11px] text-fg-muted">
              <span>0개월</span>
              <span>{calc.trailLen}개월</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   ② 손실 회복 모드
   ═══════════════════════════════════════════════════ */

function RecoveryMode({
  lossPct,
  setLossPct,
}: {
  lossPct: string;
  setLossPct: (v: string) => void;
}) {
  const calc = useMemo(() => {
    const L = num(lossPct);
    if (L <= 0 || L >= 100) return null;

    // -L% 손실 후 본전 회복에 필요한 수익률
    const requiredReturn = (1 / (1 - L / 100) - 1) * 100;
    const remainingFraction = 1 - L / 100;

    return { L, requiredReturn, remainingFraction };
  }, [lossPct]);

  // Reference table
  const referenceLosses = [10, 20, 30, 40, 50, 60, 70, 80, 90];

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
      <div className="space-y-5">
        <Field
          label="손실 비율"
          hint="자본 대비 손실 % (예: -30% 손실이면 30 입력)"
          value={lossPct}
          onChange={setLossPct}
          suffix={<span className="text-meta text-fg-muted">%</span>}
        />

        <div className="rounded-md border-l-4 border-warning bg-warning/5 p-4">
          <p className="text-eyebrow text-warning">손실의 비대칭성</p>
          <p className="mt-2 break-keep font-serif-body text-[14px] leading-[1.6] text-fg">
            손실은 회복보다 항상 더 많은 수익률을 요구합니다.
            -50% 손실은 +100% 수익이 있어야 본전입니다.
            이 비대칭성이 리스크 관리의 수학적 근거입니다.
          </p>
        </div>
      </div>

      <div className="space-y-5">
        <div className="rounded-md border border-border bg-surface p-6">
          <p className="text-eyebrow text-accent">결과</p>

          {!calc ? (
            <p className="mt-4 text-fg-muted">손실 비율을 1~99 사이로 입력하세요.</p>
          ) : (
            <>
              <h3 className="mt-2 break-keep font-display text-3xl font-extrabold leading-tight text-down">
                +{pct(calc.requiredReturn)}
              </h3>
              <p className="mt-1 font-mono text-[13px] text-fg-muted">
                -{pct(calc.L)} 손실 후 본전 회복에 필요한 수익률
              </p>

              <dl className="mt-6 space-y-3 font-serif-body text-[15px] leading-[1.6]">
                <Row
                  label="자본 잔존 비율"
                  value={pct(calc.remainingFraction * 100)}
                  hint={`100 → ${fmt2.format(calc.remainingFraction * 100)}로 줄어든 상태`}
                />
                <Row
                  label="필요 수익률 (단순 1회)"
                  value={`+${pct(calc.requiredReturn)}`}
                  emphasize
                />
                <Row
                  label="월 3% 복리로 회복 시"
                  value={`${Math.ceil(Math.log(1 / (1 - calc.L / 100)) / Math.log(1.03))}개월`}
                  hint="현실적 평균 월 수익률 가정"
                />
                <Row
                  label="월 5% 복리로 회복 시"
                  value={`${Math.ceil(Math.log(1 / (1 - calc.L / 100)) / Math.log(1.05))}개월`}
                  hint="공격적 가정"
                />
              </dl>
            </>
          )}
        </div>

        <div className="rounded-md border border-border bg-surface-warm p-5">
          <p className="text-eyebrow text-accent">참고 표 — 손실 vs 필요 회복</p>
          <table className="mt-3 w-full text-[13px]">
            <thead>
              <tr className="border-b border-border text-fg-muted">
                <th className="py-1.5 text-left font-semibold">손실</th>
                <th className="py-1.5 text-right font-semibold">필요 회복</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              {referenceLosses.map((L) => {
                const req = (1 / (1 - L / 100) - 1) * 100;
                return (
                  <tr key={L} className="border-b border-border last:border-0">
                    <td className="py-1.5 text-down">-{L}%</td>
                    <td className="py-1.5 text-right">+{fmt2.format(req)}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   ③ 목표 역산 모드
   ═══════════════════════════════════════════════════ */

function TargetMode({
  tStart,
  setTStart,
  tGoal,
  setTGoal,
  tMonths,
  setTMonths,
}: {
  tStart: string;
  setTStart: (v: string) => void;
  tGoal: string;
  setTGoal: (v: string) => void;
  tMonths: string;
  setTMonths: (v: string) => void;
}) {
  const calc = useMemo(() => {
    const C = num(tStart);
    const G = num(tGoal);
    const m = Math.max(0, Math.floor(num(tMonths)));

    if (C <= 0 || G <= 0 || m <= 0) return null;
    if (G <= C) return { C, G, m, error: "목표가 시작 자본보다 작거나 같습니다." };

    // (1 + r)^m = G/C  →  r = (G/C)^(1/m) - 1
    const monthlyR = (Math.pow(G / C, 1 / m) - 1) * 100;
    const annualR = (Math.pow(G / C, 12 / m) - 1) * 100;
    const totalGrowthPct = ((G - C) / C) * 100;

    let realismLabel: string;
    let realismLevel: "ok" | "warn" | "bad";
    if (monthlyR <= 2) {
      realismLabel = "✅ 현실적 — 보수적 운용 가능";
      realismLevel = "ok";
    } else if (monthlyR <= 4) {
      realismLabel = "✅ 도전적이지만 가능 — 시스템·리스크 관리 필수";
      realismLevel = "ok";
    } else if (monthlyR <= 7) {
      realismLabel = "⚠️ 매우 어려움 — 상위 5% 트레이더 수준";
      realismLevel = "warn";
    } else {
      realismLabel = "🚨 비현실적 — 기간을 늘리거나 목표를 낮추는 게 합리적";
      realismLevel = "bad";
    }

    return {
      C,
      G,
      m,
      monthlyR,
      annualR,
      totalGrowthPct,
      realismLabel,
      realismLevel,
    };
  }, [tStart, tGoal, tMonths]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
      <div className="space-y-5">
        <Field label="시작 자본" value={tStart} onChange={setTStart} />
        <Field label="목표 자본" value={tGoal} onChange={setTGoal} />
        <Field
          label="기간"
          value={tMonths}
          onChange={setTMonths}
          suffix={<span className="text-meta text-fg-muted">개월</span>}
        />

        <div className="rounded-md border border-border bg-surface-warm p-4">
          <p className="text-eyebrow text-accent">현실적 월 수익률</p>
          <ul className="mt-2 space-y-1 text-[12px] text-fg-muted">
            <li>· 1~2% / 월 — 보수적, 지속 가능</li>
            <li>· 3~4% / 월 — 도전적, 시스템 트레이더</li>
            <li>· 5~7% / 월 — 상위권, 변동성 큼</li>
            <li>· 8%+ / 월 — 단기 가능, 장기 지속 거의 불가</li>
          </ul>
        </div>
      </div>

      <div className="space-y-5">
        <div className="rounded-md border border-border bg-surface p-6">
          <p className="text-eyebrow text-accent">결과</p>

          {!calc ? (
            <p className="mt-4 text-fg-muted">입력값을 채워 주세요.</p>
          ) : "error" in calc && calc.error ? (
            <p className="mt-4 text-down">⚠️ {calc.error}</p>
          ) : "monthlyR" in calc ? (
            <>
              <h3 className="mt-2 break-keep font-display text-3xl font-extrabold leading-tight">
                +{pct(calc.monthlyR)}/월
              </h3>
              <p className="mt-1 font-mono text-[13px] text-fg-muted">
                {fmt0.format(calc.C)} → {fmt0.format(calc.G)} ({calc.m}개월)에 필요
              </p>

              <dl className="mt-6 space-y-3 font-serif-body text-[15px] leading-[1.6]">
                <Row
                  label="필요 월 수익률"
                  value={`+${pct(calc.monthlyR)}`}
                  emphasize
                />
                <Row
                  label="연 환산 수익률"
                  value={`+${pct(calc.annualR)}`}
                />
                <Row
                  label="총 성장률"
                  value={`+${pct(calc.totalGrowthPct)}`}
                />
              </dl>

              <div
                className={`mt-6 rounded-md border p-4 ${
                  calc.realismLevel === "ok"
                    ? "border-up/40 bg-up/10 text-up"
                    : calc.realismLevel === "warn"
                      ? "border-warning/40 bg-warning/10 text-warning"
                      : "border-down/40 bg-down/10 text-down"
                }`}
              >
                <p className="font-mono text-[11px] uppercase tracking-wider opacity-70">
                  현실성 평가
                </p>
                <p className="mt-1 font-display text-[15px] font-bold">
                  {calc.realismLabel}
                </p>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   공용 인풋 / 결과 행
   ═══════════════════════════════════════════════════ */

function Field({
  label,
  hint,
  value,
  onChange,
  suffix,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  suffix?: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-meta font-semibold text-fg">{label}</label>
      {hint && <p className="text-[12px] text-fg-muted">{hint}</p>}
      <div className="flex items-center gap-2 rounded-md border border-border bg-surface focus-within:border-accent">
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent px-3 py-2 font-mono text-[15px] outline-none"
        />
        {suffix && <div className="pr-3">{suffix}</div>}
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  hint,
  emphasize,
}: {
  label: string;
  value: string;
  hint?: string;
  emphasize?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <div className="min-w-0">
        <dt className="text-[13px] text-fg-muted">{label}</dt>
        {hint && <p className="text-[11px] text-fg-muted/70">{hint}</p>}
      </div>
      <dd
        className={`shrink-0 font-mono ${
          emphasize ? "text-[18px] font-bold text-accent" : "text-[15px] text-fg"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
