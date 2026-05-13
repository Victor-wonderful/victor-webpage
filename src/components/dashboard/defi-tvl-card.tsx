import { fetchDefiTvl } from "@/lib/widgets/defi-tvl";

function fmtBn(n: number) {
  if (!n) return "—";
  const bn = n / 1_000_000_000;
  if (bn >= 100) return `$${bn.toFixed(0)}B`;
  if (bn >= 10) return `$${bn.toFixed(1)}B`;
  if (bn >= 1) return `$${bn.toFixed(2)}B`;
  return `$${(n / 1_000_000).toFixed(0)}M`;
}

function fmtPct(v: number) {
  return `${v >= 0 ? "+" : ""}${v.toFixed(2)}%`;
}

function tone(v: number) {
  if (v > 1) return "text-emerald-500";
  if (v < -1) return "text-rose-500";
  return "text-fg-muted";
}

function hint(delta7d: number) {
  if (delta7d > 5) return "TVL 급증 — DeFi 활성, risk-on 환경.";
  if (delta7d > 1) return "TVL 상승 — 자금 유입 우호.";
  if (delta7d < -5) return "TVL 급락 — 디레버리징, risk-off 신호.";
  if (delta7d < -1) return "TVL 하락 — DeFi 자금 이탈.";
  return "TVL 보합 — 의미있는 자금 이동 없음.";
}

function Sparkline({ series }: { series: { date: number; tvl: number }[] }) {
  if (series.length < 2) return null;
  const W = 400;
  const H = 90;
  const PAD = 4;
  const vals = series.map((p) => p.tvl);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const range = Math.max(1, max - min);
  const xs = series.map(
    (_, i) => PAD + (i * (W - PAD * 2)) / (series.length - 1),
  );
  const ys = vals.map((v) => H - PAD - ((v - min) / range) * (H - PAD * 2));
  const d = xs
    .map((x, i) => `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${ys[i].toFixed(1)}`)
    .join(" ");
  const areaPath = `${d} L ${xs[xs.length - 1].toFixed(1)} ${H} L ${xs[0].toFixed(1)} ${H} Z`;
  const t = vals[vals.length - 1] >= vals[0] ? "text-emerald-500" : "text-rose-500";
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none">
      <path d={areaPath} className={t} fill="currentColor" opacity={0.08} />
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={t}
      />
      <circle
        cx={xs[xs.length - 1]}
        cy={ys[ys.length - 1]}
        r="4"
        className={t}
        fill="currentColor"
      />
    </svg>
  );
}

export async function DefiTvlCard() {
  const r = await fetchDefiTvl();

  if (!r.total) {
    return (
      <article className="flex h-full flex-col gap-3 border border-border bg-surface-warm/40 p-6">
        <p className="text-eyebrow text-accent">DeFi TVL · DefiLlama</p>
        <p className="text-meta text-fg-muted">데이터를 가져오지 못했습니다.</p>
      </article>
    );
  }

  return (
    <article className="flex flex-col gap-6 border border-border bg-surface-warm/40 p-6">
      <header className="flex flex-wrap items-baseline justify-between gap-3">
        <p className="text-eyebrow text-accent">DeFi TVL · DefiLlama</p>
        <p className="text-meta text-fg-muted">{hint(r.delta7dPct)}</p>
      </header>

      <div className="grid items-start gap-8 lg:grid-cols-[1fr_1.4fr_1fr]">
        {/* Col 1: Headline + deltas */}
        <div className="flex flex-col gap-4">
          <div>
            <p className="font-display text-5xl font-extrabold leading-none tabular-nums">
              {fmtBn(r.total)}
            </p>
            <p className="mt-2 text-meta text-fg-muted">전체 DeFi 잠긴 자금 (USD)</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-fg-muted">24h</p>
              <p
                className={`mt-1 font-mono text-lg font-bold tabular-nums ${tone(r.delta24hPct)}`}
              >
                {fmtPct(r.delta24hPct)}
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-fg-muted">7d</p>
              <p
                className={`mt-1 font-mono text-lg font-bold tabular-nums ${tone(r.delta7dPct)}`}
              >
                {fmtPct(r.delta7dPct)}
              </p>
            </div>
          </div>
        </div>

        {/* Col 2: 30d trend */}
        <div className="flex flex-col gap-2">
          <p className="text-[11px] uppercase tracking-[0.18em] text-fg-muted">
            최근 30일 추이
          </p>
          <Sparkline series={r.series} />
          <div className="flex justify-between text-[11px] tabular-nums text-fg-muted">
            <span>30일 전 {fmtBn(r.series[0]?.tvl ?? 0)}</span>
            <span>오늘 {fmtBn(r.total)}</span>
          </div>
        </div>

        {/* Col 3: Top chains */}
        <div>
          <p className="mb-3 text-[11px] uppercase tracking-[0.18em] text-fg-muted">
            체인별 TVL 상위 5
          </p>
          <ul className="space-y-1.5">
            {r.topChains.map((c) => {
              const pct = r.total > 0 ? (c.tvl / r.total) * 100 : 0;
              return (
                <li
                  key={c.name}
                  className="flex items-baseline justify-between gap-3 text-meta tabular-nums"
                >
                  <span className="font-display font-bold">{c.name}</span>
                  <span className="text-fg-muted">
                    {fmtBn(c.tvl)}{" "}
                    <span className="text-[11px]">({pct.toFixed(1)}%)</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <p className="border-t border-border/60 pt-3 text-[11px] uppercase tracking-[0.18em] text-fg-muted">
        via DefiLlama
      </p>
    </article>
  );
}
