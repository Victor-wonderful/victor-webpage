import { fetchStablecoinMcap } from "@/lib/widgets/stablecap";

function fmtBn(n: number) {
  if (!n) return "—";
  const bn = n / 1_000_000_000;
  if (bn >= 100) return `$${bn.toFixed(0)}B`;
  if (bn >= 1) return `$${bn.toFixed(1)}B`;
  return `$${(n / 1_000_000).toFixed(0)}M`;
}

function fmtPct(v: number) {
  return `${v >= 0 ? "+" : ""}${v.toFixed(2)}%`;
}

function hint(v: number) {
  if (v >= 1) return "스테이블 시총 확장 — 시장 유입 자금 ↑, 위험자산 우호.";
  if (v <= -1) return "스테이블 시총 위축 — 유동성 회수, 변동성 위험.";
  return "안정 — 유의미한 자금 이동 없음.";
}

export async function StablecapCard() {
  const r = await fetchStablecoinMcap();
  const upTone =
    r.total7dDeltaPct >= 0 ? "text-emerald-500" : "text-rose-500";
  return (
    <article className="flex h-full flex-col gap-4 border border-border bg-surface-warm/40 p-6">
      <p className="text-eyebrow text-accent">Stablecoin Mcap</p>

      <div>
        <p className="font-display text-4xl font-extrabold leading-none tabular-nums">
          {fmtBn(r.total)}
        </p>
        <p
          className={`mt-2 text-meta tabular-nums ${upTone}`}
        >
          7일: {fmtPct(r.total7dDeltaPct)}
        </p>
      </div>

      <ul className="space-y-2">
        {r.coins.map((c) => (
          <li
            key={c.symbol}
            className="flex items-baseline justify-between border-b border-border/60 pb-2 last:border-b-0"
          >
            <span className="font-display text-base font-bold">{c.symbol}</span>
            <div className="flex items-baseline gap-3 text-meta tabular-nums">
              <span className="text-fg-muted">{fmtBn(c.marketCap)}</span>
              <span
                className={`font-mono font-bold ${
                  c.change7dPct >= 0 ? "text-emerald-500" : "text-rose-500"
                }`}
              >
                {fmtPct(c.change7dPct)}
              </span>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-auto border-t border-border/60 pt-3 text-meta text-fg-muted">
        {hint(r.total7dDeltaPct)}
      </p>
      <p className="text-[11px] uppercase tracking-[0.18em] text-fg-muted">
        via CoinGecko · 7d 시총 변화
      </p>
    </article>
  );
}
