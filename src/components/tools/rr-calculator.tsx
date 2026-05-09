"use client";

import { useMemo, useState } from "react";

/**
 * R:R + 손익분기 승률 계산기
 * - 진입·손절·목표 → R:R, 손익분기 승률, 기대 EV(R 단위)
 * - 추정 승률 입력 시 100회 매매 기대 손익까지 시뮬
 * - 거래 수수료(왕복) 반영해 실효 R:R 함께 표시
 */

type Side = "long" | "short";

const fmt = new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 8 });
const fmt2 = new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 2 });
const pct = (n: number) => `${fmt2.format(n)}%`;
const ratio = (n: number) => `1:${fmt2.format(n)}`;

function num(v: string): number {
  const x = parseFloat(v.replace(/,/g, ""));
  return Number.isFinite(x) ? x : 0;
}

export function RRCalculator() {
  const [side, setSide] = useState<Side>("long");
  const [entry, setEntry] = useState("80000");
  const [stop, setStop] = useState("78500");
  const [target, setTarget] = useState("83500");
  const [fee, setFee] = useState("0.05"); // 단방향 % (왕복 = ×2)
  const [winRate, setWinRate] = useState("55"); // 추정 승률 (선택)

  const calc = useMemo(() => {
    const E = num(entry);
    const S = num(stop);
    const T = num(target);
    const f = num(fee) / 100; // 단방향 비율
    const wr = num(winRate) / 100;

    if (E <= 0 || S <= 0 || T <= 0) return null;

    const validDirection =
      (side === "long" && S < E && T > E) ||
      (side === "short" && S > E && T < E);

    const riskDist = Math.abs(E - S);
    const rewardDist = Math.abs(T - E);
    if (riskDist === 0) return null;

    const riskPct = (riskDist / E) * 100;
    const rewardPct = (rewardDist / E) * 100;

    // Gross R:R
    const rr = rewardDist / riskDist;

    // Net R:R after round-trip fee. 수수료는 명목가의 %로 가정.
    // 효과: reward에서 2f×E 차감, risk에는 2f×E 추가.
    const feeAbs = 2 * f * E; // 양방향 수수료 절대값
    const netReward = Math.max(0, rewardDist - feeAbs);
    const netRisk = riskDist + feeAbs;
    const netRR = netReward / netRisk;

    // Breakeven win rate: W = 1 / (1 + R)
    const beWR = 1 / (1 + rr);
    const beWRNet = 1 / (1 + netRR);

    // Expected value per trade (R units, gross)
    let evR: number | null = null;
    let ev100: number | null = null;
    let edge: number | null = null;
    if (winRate !== "") {
      evR = wr * rr - (1 - wr);
      ev100 = evR * 100;
      edge = wr - beWR;
    }

    // Verdict
    let level: "ok" | "ok-strong" | "warn" | "bad";
    let verdictTitle: string;
    let verdictMsg: string;
    if (rr >= 3) {
      level = "ok-strong";
      verdictTitle = "✅ 우수한 손익비";
      verdictMsg = `R:R ${ratio(rr)} — 본전 승률 ${pct(beWR * 100)}만 넘기면 양의 EV.`;
    } else if (rr >= 2) {
      level = "ok";
      verdictTitle = "✅ 양호한 손익비";
      verdictMsg = `R:R ${ratio(rr)} — 본전 승률 ${pct(beWR * 100)}.`;
    } else if (rr >= 1) {
      level = "warn";
      verdictTitle = "⚠️ 손익비 부족";
      verdictMsg = `R:R ${ratio(rr)} — 본전 승률 ${pct(beWR * 100)} 이상 필요. 셋업 점검 권장.`;
    } else {
      level = "bad";
      verdictTitle = "🚨 손익비 1:1 미만";
      verdictMsg = `R:R ${ratio(rr)} — 손실이 이익보다 큽니다. 진입 비추천.`;
    }

    return {
      validDirection,
      riskDist,
      rewardDist,
      riskPct,
      rewardPct,
      rr,
      netRR,
      beWR,
      beWRNet,
      evR,
      ev100,
      edge,
      level,
      verdictTitle,
      verdictMsg,
      hasFee: f > 0,
    };
  }, [entry, stop, target, fee, winRate, side]);

  const verdictCls =
    calc?.level === "ok-strong"
      ? "border-up/40 bg-up/10 text-up"
      : calc?.level === "ok"
        ? "border-up/40 bg-up/10 text-up"
        : calc?.level === "warn"
          ? "border-warning/40 bg-warning/10 text-warning"
          : calc?.level === "bad"
            ? "border-down/40 bg-down/10 text-down"
            : "border-border bg-surface text-fg-muted";

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
      {/* Inputs ────────────────────────────────────── */}
      <div className="space-y-5">
        <div className="space-y-1.5">
          <label className="block text-meta text-fg-muted">방향</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setSide("long")}
              className={`flex-1 rounded-md border px-3 py-2 text-sm font-semibold ${
                side === "long"
                  ? "border-up bg-up/10 text-up"
                  : "border-border bg-surface text-fg-muted hover:border-accent"
              }`}
            >
              🟢 Long
            </button>
            <button
              type="button"
              onClick={() => setSide("short")}
              className={`flex-1 rounded-md border px-3 py-2 text-sm font-semibold ${
                side === "short"
                  ? "border-down bg-down/10 text-down"
                  : "border-border bg-surface text-fg-muted hover:border-accent"
              }`}
            >
              🔴 Short
            </button>
          </div>
        </div>

        <Field label="진입가" value={entry} onChange={setEntry} />
        <Field
          label="손절가"
          hint={side === "long" ? "진입가보다 아래" : "진입가보다 위"}
          value={stop}
          onChange={setStop}
        />
        <Field
          label="목표가"
          hint={side === "long" ? "진입가보다 위" : "진입가보다 아래"}
          value={target}
          onChange={setTarget}
        />
        <Field
          label="거래 수수료 (단방향)"
          hint="왕복 자동 계산 (선물 taker 보통 0.04~0.1%)"
          value={fee}
          onChange={setFee}
          suffix={<span className="text-meta text-fg-muted">%</span>}
        />
        <Field
          label="추정 승률 (선택)"
          hint="이 셋업의 과거 승률. 100회 시뮬용"
          value={winRate}
          onChange={setWinRate}
          suffix={<span className="text-meta text-fg-muted">%</span>}
        />
      </div>

      {/* Output ────────────────────────────────────── */}
      <div className="space-y-5">
        <aside
          className={`rounded-md border p-5 transition-colors ${verdictCls}`}
          aria-live="polite"
        >
          <p className="font-mono text-[11px] uppercase tracking-wider opacity-70">
            손익비 판정
          </p>
          <h3 className="mt-2 break-keep font-display text-2xl font-extrabold leading-tight">
            {calc?.verdictTitle ?? "입력값을 채워 주세요"}
          </h3>
          {calc && (
            <p className="mt-2 break-keep font-serif-body text-[14px] leading-[1.6]">
              {calc.verdictMsg}
            </p>
          )}
        </aside>

        {calc && (
          <>
            {!calc.validDirection && (
              <p className="rounded border border-down/40 bg-down/10 px-3 py-2 text-[13px] text-down">
                🚨 방향 모순: {side === "long" ? "롱이면 손절 < 진입 < 목표여야 합니다" : "숏이면 목표 < 진입 < 손절이어야 합니다"}.
              </p>
            )}

            <div className="rounded-md border border-border bg-surface p-6">
              <p className="text-eyebrow text-accent">계산 결과</p>

              <dl className="mt-4 space-y-4 font-serif-body text-[15px] leading-[1.6]">
                <Row
                  label="Reward 거리"
                  value={`${fmt.format(calc.rewardDist)} · ${pct(calc.rewardPct)}`}
                />
                <Row
                  label="Risk 거리"
                  value={`${fmt.format(calc.riskDist)} · ${pct(calc.riskPct)}`}
                />
                <hr className="border-border" />
                <Row
                  label="R:R (Gross)"
                  value={ratio(calc.rr)}
                  emphasize
                />
                {calc.hasFee && (
                  <Row
                    label="R:R (Net, 수수료 반영)"
                    value={ratio(calc.netRR)}
                    hint="왕복 수수료가 reward를 깎고 risk를 늘림"
                  />
                )}
                <hr className="border-border" />
                <Row
                  label="손익분기 승률 (Gross)"
                  value={pct(calc.beWR * 100)}
                  emphasize
                  hint="이 R:R에서 본전을 맞추는 승률"
                />
                {calc.hasFee && (
                  <Row
                    label="손익분기 승률 (Net)"
                    value={pct(calc.beWRNet * 100)}
                  />
                )}
              </dl>
            </div>

            {/* Simulation ─────────────────────────── */}
            {calc.evR !== null && calc.ev100 !== null && calc.edge !== null && (
              <div className="rounded-md border border-border bg-surface-warm p-6">
                <p className="text-eyebrow text-accent">100회 매매 시뮬</p>
                <h4 className="mt-2 font-display text-lg font-bold">
                  추정 승률 {winRate}% 기준
                </h4>

                <dl className="mt-4 space-y-3 font-serif-body text-[14px] leading-[1.6]">
                  <Row
                    label="기대 EV (트레이드당)"
                    value={`${calc.evR >= 0 ? "+" : ""}${fmt2.format(calc.evR)}R`}
                    emphasize={calc.evR > 0}
                  />
                  <Row
                    label="기대 EV (100회 누적)"
                    value={`${calc.ev100 >= 0 ? "+" : ""}${fmt2.format(calc.ev100)}R`}
                    emphasize={calc.ev100 > 0}
                    hint="1R = 자본의 리스크 단위"
                  />
                  <Row
                    label="에지 (승률 - 본전 승률)"
                    value={`${calc.edge >= 0 ? "+" : ""}${pct(calc.edge * 100)}`}
                    emphasize={calc.edge > 0}
                  />
                </dl>

                {calc.edge < 0 ? (
                  <p className="mt-4 rounded border border-down/40 bg-down/10 px-3 py-2 text-[13px] text-down">
                    🚨 추정 승률이 본전 승률 미만 — 장기적으로 손실 누적.
                  </p>
                ) : calc.edge < 0.05 ? (
                  <p className="mt-4 rounded border border-warning/40 bg-warning/10 px-3 py-2 text-[13px] text-warning">
                    ⚠️ 에지가 5% 미만 — 슬리피지·심리 비용에 잠식될 수 있음.
                  </p>
                ) : (
                  <p className="mt-4 rounded border border-up/40 bg-up/10 px-3 py-2 text-[13px] text-up">
                    ✅ 양의 에지 — 동일 셋업 반복 시 통계적 우위.
                  </p>
                )}

                <p className="mt-4 break-keep border-t border-border pt-3 text-[12px] italic text-fg-muted">
                  주의: 추정 승률은 같은 셋업을 30회 이상 트래킹한 데이터여야
                  의미가 있습니다. 표본 10회 이하의 승률은 랜덤성과 구분되지
                  않습니다.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

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
