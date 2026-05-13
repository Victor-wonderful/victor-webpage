import {
  fetchTechnicalsSnapshot,
  type TechnicalRow,
} from "@/lib/widgets/technicals";

function fmtPrice(n: number) {
  if (!n) return "—";
  if (n < 1) return `$${n.toFixed(4)}`;
  if (n < 100) return `$${n.toFixed(2)}`;
  return `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

function fmtKrw(n: number) {
  if (!n) return "—";
  if (n < 100) return `₩${n.toFixed(2)}`;
  if (n < 10000) return `₩${Math.round(n).toLocaleString("ko-KR")}`;
  return `₩${Math.round(n).toLocaleString("ko-KR")}`;
}

function fmtRsi(v: number | null) {
  return v == null ? "—" : v.toFixed(0);
}

function fmtPct(v: number | null) {
  if (v == null) return "—";
  return `${v >= 0 ? "+" : ""}${v.toFixed(3)}%`;
}

function trendTone(t: TechnicalRow["trend"]) {
  if (t === "up") return "text-emerald-500";
  if (t === "down") return "text-rose-500";
  return "text-fg-muted";
}

function trendIcon(t: TechnicalRow["trend"]) {
  if (t === "up") return "▲";
  if (t === "down") return "▼";
  return "→";
}

function rsiTone(v: number | null) {
  if (v == null) return "text-fg-muted";
  if (v >= 70) return "text-rose-500";
  if (v >= 55) return "text-emerald-500";
  if (v >= 45) return "text-fg-muted";
  if (v >= 30) return "text-orange-400";
  return "text-sky-500";
}

function ma200Tone(p: TechnicalRow["ma200Position"]) {
  if (p === "above") return "text-emerald-500";
  if (p === "below") return "text-rose-500";
  return "text-fg-muted";
}

function ma200Label(p: TechnicalRow["ma200Position"]) {
  if (p === "above") return "위";
  if (p === "below") return "아래";
  return "—";
}

function fundingTone(v: number | null) {
  if (v == null) return "text-fg-muted";
  if (v > 0.05) return "text-rose-500";
  if (v < -0.05) return "text-sky-500";
  return "text-fg-muted";
}

export async function TechnicalsTable() {
  const rows = await fetchTechnicalsSnapshot();

  return (
    <article
      className="flex h-full flex-col gap-4 border border-border bg-surface-warm/40 p-6"
      aria-label="기술적 시그널 표"
    >
      <header className="flex items-baseline justify-between gap-3">
        <div>
          <p className="text-eyebrow text-accent">Technicals · 1D</p>
          <h3 className="mt-1 font-display text-xl font-extrabold leading-[1.1] tracking-tight md:text-2xl">
            지금 기술적 상태
          </h3>
        </div>
        <p className="text-[11px] uppercase tracking-[0.18em] text-fg-muted">
          via Binance
        </p>
      </header>

      <div className="-mx-2 overflow-x-auto">
        <table className="w-full min-w-[640px] text-meta">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-[0.12em] text-fg-muted">
              <th className="px-2 py-2 font-mono font-normal">코인</th>
              <th className="px-2 py-2 font-mono font-normal">현재가</th>
              <th className="px-2 py-2 font-mono font-normal">추세 1D</th>
              <th className="px-2 py-2 font-mono font-normal">RSI 14</th>
              <th className="px-2 py-2 font-mono font-normal">200DMA</th>
              <th className="px-2 py-2 font-mono font-normal">펀딩비</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {rows.map((r) => (
              <tr key={r.symbol} className="align-baseline">
                <td className="px-2 py-3 font-display text-base font-bold">
                  {r.symbol}
                </td>
                <td className="px-2 py-3 tabular-nums">
                  <div>{fmtPrice(r.close)}</div>
                  <div className="text-[11px] text-fg-muted">{fmtKrw(r.closeKrw)}</div>
                </td>
                <td className={`px-2 py-3 font-mono font-bold ${trendTone(r.trend)}`}>
                  {trendIcon(r.trend)}{" "}
                  {r.trend === "up" ? "상승" : r.trend === "down" ? "하락" : "횡보"}
                </td>
                <td className={`px-2 py-3 font-mono tabular-nums ${rsiTone(r.rsi14)}`}>
                  {fmtRsi(r.rsi14)}{" "}
                  <span className="text-[11px] text-fg-muted">{r.rsiLabel}</span>
                </td>
                <td className={`px-2 py-3 font-mono ${ma200Tone(r.ma200Position)}`}>
                  {ma200Label(r.ma200Position)}
                </td>
                <td className={`px-2 py-3 font-mono tabular-nums ${fundingTone(r.fundingPct)}`}>
                  {fmtPct(r.fundingPct)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="space-y-2 border-t border-border/60 pt-4 text-meta text-fg-muted">
        {rows.map((r) => (
          <li key={`tk-${r.symbol}`} className="flex gap-3">
            <span className="w-10 shrink-0 font-display font-bold text-fg">
              {r.symbol}
            </span>
            <span className="break-keep">{r.takeaway}</span>
          </li>
        ))}
      </ul>

      <p className="mt-auto text-[11px] uppercase tracking-[0.18em] text-fg-muted">
        Binance 1D close · EMA 21 / RSI 14 / SMA 200 · 펀딩비는 USDT-perp
      </p>
    </article>
  );
}
