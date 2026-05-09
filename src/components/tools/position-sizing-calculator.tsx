"use client";

import { useMemo, useState } from "react";

/**
 * Position Sizing Calculator
 * 입력: 자본금, 리스크%, 진입가, 손절가, 레버리지(선택)
 * 출력: 1R 금액, 손절 거리, 권장 수량, 명목가치, 필요 마진, 마진 사용률, 위험 신호
 */

type Side = "long" | "short";

const fmt = new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 8 });
const fmt2 = new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 2 });
const pct = (n: number) => `${fmt2.format(n)}%`;

function n(v: string): number {
  const x = parseFloat(v.replace(/,/g, ""));
  return Number.isFinite(x) ? x : 0;
}

export function PositionSizingCalculator() {
  const [capital, setCapital] = useState("10000");
  const [riskPct, setRiskPct] = useState("1");
  const [entry, setEntry] = useState("80000");
  const [stop, setStop] = useState("78500");
  const [leverage, setLeverage] = useState("1");
  const [side, setSide] = useState<Side>("long");
  const [unit, setUnit] = useState<"USDT" | "KRW">("USDT");

  const calc = useMemo(() => {
    const C = n(capital);
    const r = n(riskPct) / 100;
    const E = n(entry);
    const S = n(stop);
    const L = Math.max(1, n(leverage));

    if (C <= 0 || r <= 0 || E <= 0 || S <= 0) return null;

    // Validate side direction
    const validDirection =
      (side === "long" && S < E) || (side === "short" && S > E);

    const oneR = C * r; // 손실 한도
    const stopDist = Math.abs(E - S);
    const stopPct = (stopDist / E) * 100;

    if (stopDist === 0) return null;

    const qty = oneR / stopDist; // 수량 (계약 수)
    const notional = qty * E; // 명목가치
    const margin = notional / L; // 필요 마진
    const marginUsage = (margin / C) * 100; // 자본 대비 마진 사용률

    // Liquidation rough estimate (simple linear, no funding/fees):
    // long: liq ≈ entry × (1 - 1/L)
    // short: liq ≈ entry × (1 + 1/L)
    const liq =
      L > 1
        ? side === "long"
          ? E * (1 - 1 / L)
          : E * (1 + 1 / L)
        : null;

    // 안전 마진: 손절 거리 vs 청산 거리
    const liqDistPct = liq ? (Math.abs(E - liq) / E) * 100 : null;

    return {
      oneR,
      stopDist,
      stopPct,
      qty,
      notional,
      margin,
      marginUsage,
      liq,
      liqDistPct,
      validDirection,
      C,
      L,
    };
  }, [capital, riskPct, entry, stop, leverage, side]);

  const warnings: { level: "warn" | "alert"; msg: string }[] = [];
  if (calc) {
    if (!calc.validDirection) {
      warnings.push({
        level: "alert",
        msg:
          side === "long"
            ? "롱 진입인데 손절가가 진입가보다 위에 있습니다. 방향을 확인하세요."
            : "숏 진입인데 손절가가 진입가보다 아래에 있습니다. 방향을 확인하세요.",
      });
    }
    if (calc.marginUsage > 80) {
      warnings.push({
        level: "alert",
        msg: `필요 마진이 자본의 ${pct(calc.marginUsage)} — 청산 위험. 레버리지·수량 축소 권장.`,
      });
    } else if (calc.marginUsage > 50) {
      warnings.push({
        level: "warn",
        msg: `필요 마진이 자본의 ${pct(calc.marginUsage)} — 부담 큰 포지션입니다.`,
      });
    }
    if (calc.stopPct < 0.3) {
      warnings.push({
        level: "warn",
        msg: `손절 거리 ${pct(calc.stopPct)} — 너무 타이트해 노이즈에 자주 걸릴 수 있습니다.`,
      });
    }
    if (calc.stopPct > 10) {
      warnings.push({
        level: "warn",
        msg: `손절 거리 ${pct(calc.stopPct)} — 너무 넓어 1R이 비싸집니다. 셋업 재점검.`,
      });
    }
    if (calc.liqDistPct && calc.stopPct > calc.liqDistPct * 0.7) {
      warnings.push({
        level: "alert",
        msg: `손절가가 청산가에 매우 가깝습니다 (${pct(calc.stopPct)} vs 청산 ${pct(calc.liqDistPct)}). 레버리지 낮추세요.`,
      });
    }
  }

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
              🟢 Long (롱)
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
              🔴 Short (숏)
            </button>
          </div>
        </div>

        <Field
          label="자본금"
          hint="계좌 총 평가액"
          value={capital}
          onChange={setCapital}
          suffix={
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as "USDT" | "KRW")}
              className="rounded border border-border bg-surface px-2 py-1 text-meta"
            >
              <option value="USDT">USDT</option>
              <option value="KRW">KRW</option>
            </select>
          }
        />

        <Field
          label="리스크 %"
          hint="이 트레이드에 거는 자본 비율 (보통 0.5~2%)"
          value={riskPct}
          onChange={setRiskPct}
          suffix={<span className="text-meta text-fg-muted">%</span>}
        />

        <Field
          label="진입가"
          value={entry}
          onChange={setEntry}
          suffix={<span className="text-meta text-fg-muted">{unit}</span>}
        />

        <Field
          label="손절가"
          hint={side === "long" ? "진입가보다 아래" : "진입가보다 위"}
          value={stop}
          onChange={setStop}
          suffix={<span className="text-meta text-fg-muted">{unit}</span>}
        />

        <Field
          label="레버리지"
          hint="현물이면 1, 선물이면 2~10 권장"
          value={leverage}
          onChange={setLeverage}
          suffix={<span className="text-meta text-fg-muted">×</span>}
        />
      </div>

      {/* Output ────────────────────────────────────── */}
      <div className="rounded-md border border-border bg-surface p-6">
        <p className="text-eyebrow text-accent">결과</p>
        <h3 className="mt-2 break-keep font-display text-2xl font-bold">
          이 트레이드 권장 포지션
        </h3>

        {!calc ? (
          <p className="mt-6 text-fg-muted">입력값을 채워 주세요.</p>
        ) : (
          <>
            <dl className="mt-6 space-y-4 font-serif-body text-[15px] leading-[1.6]">
              <Row
                label="1R 금액 (최대 손실 한도)"
                value={`${fmt2.format(calc.oneR)} ${unit}`}
                emphasize
              />
              <Row
                label="손절 거리"
                value={`${fmt.format(calc.stopDist)} ${unit} · ${pct(calc.stopPct)}`}
              />
              <hr className="border-border" />
              <Row
                label="권장 수량"
                value={fmt.format(calc.qty)}
                emphasize
                hint="entry 대비 계약 수 / 코인 개수"
              />
              <Row
                label="명목가치"
                value={`${fmt2.format(calc.notional)} ${unit}`}
                hint="수량 × 진입가"
              />
              <Row
                label="필요 마진"
                value={`${fmt2.format(calc.margin)} ${unit}`}
                hint={`레버리지 ${calc.L}× 기준`}
              />
              <Row
                label="자본 대비 마진 사용률"
                value={pct(calc.marginUsage)}
                emphasize={calc.marginUsage > 50}
              />
              {calc.liq !== null && calc.liqDistPct !== null && (
                <Row
                  label="대략 청산가 (수수료·펀딩 미반영)"
                  value={`${fmt.format(calc.liq)} ${unit} · 거리 ${pct(calc.liqDistPct)}`}
                />
              )}
            </dl>

            {warnings.length > 0 && (
              <div className="mt-6 space-y-2">
                {warnings.map((w, i) => (
                  <p
                    key={i}
                    className={`rounded border px-3 py-2 text-[13px] leading-[1.5] ${
                      w.level === "alert"
                        ? "border-down/40 bg-down/10 text-down"
                        : "border-warning/40 bg-warning/10 text-warning"
                    }`}
                  >
                    {w.level === "alert" ? "🚨 " : "⚠️ "} {w.msg}
                  </p>
                ))}
              </div>
            )}

            <p className="mt-6 break-keep border-t border-border pt-4 text-[12px] italic text-fg-muted">
              청산가는 거래소·자산별로 정확한 마진 모드(격리/교차)와 펀딩비·수수료에
              따라 달라집니다. 본 계산은 단순 선형 추정치이며, 실제 진입 전 거래소
              화면의 청산가를 한 번 더 확인하세요.
            </p>
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
