// Server component — pulls live data with ISR (60s).
import { fetchMovers, type Coin } from "@/lib/widgets/movers";

function formatKrw(p: number) {
  if (p < 0.01) return `₩${p.toFixed(6)}`;
  if (p < 1) return `₩${p.toFixed(4)}`;
  if (p < 100) return `₩${p.toFixed(2)}`;
  return `₩${Math.round(p).toLocaleString("ko-KR")}`;
}
function formatUsd(p: number) {
  if (p < 0.01) return `$${p.toFixed(8)}`;
  if (p < 1) return `$${p.toFixed(4)}`;
  if (p < 100) return `$${p.toFixed(2)}`;
  return `$${p.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

function Row({ coin, kind }: { coin: Coin; kind: "up" | "down" }) {
  const tone = kind === "up" ? "text-emerald-500" : "text-rose-500";
  const arrow = kind === "up" ? "▲" : "▼";
  return (
    <li className="flex items-center justify-between gap-4 border-b border-border/60 py-3 last:border-b-0">
      <div className="flex min-w-0 items-baseline gap-3">
        <span className="font-display text-base font-bold tabular-nums">{coin.symbol}</span>
        <span className="truncate text-meta text-fg-muted">{coin.name}</span>
      </div>
      <div className="flex shrink-0 items-baseline gap-4 tabular-nums">
        <div className="text-right">
          <p className="text-meta">{formatKrw(coin.priceKrw)}</p>
          <p className="text-[11px] text-fg-muted">{formatUsd(coin.priceUsd)}</p>
        </div>
        <span className={`w-20 text-right font-mono text-sm font-bold ${tone}`}>
          {arrow} {Math.abs(coin.change24h).toFixed(1)}%
        </span>
      </div>
    </li>
  );
}

export async function MoversBoard() {
  const { gainers, losers } = await fetchMovers();
  return (
    <section className="container-page mt-24" aria-label="급등 급락 코인 랭킹">
      <header className="mb-8 flex items-baseline justify-between">
        <div>
          <p className="text-eyebrow text-accent">Movers · 24h</p>
          <h2 className="mt-3 font-display text-[40px] font-extrabold leading-[1.02] tracking-tight md:text-[48px]">
            급등 / 급락 TOP 5
          </h2>
        </div>
        <p className="text-meta text-fg-muted">via CoinGecko · KRW</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <article className="border border-border bg-surface-warm/40 p-6">
          <p className="mb-4 text-eyebrow text-emerald-500">▲ Gainers</p>
          <ul>
            {gainers.map((c) => (
              <Row key={c.symbol} coin={c} kind="up" />
            ))}
          </ul>
        </article>

        <article className="border border-border bg-surface-warm/40 p-6">
          <p className="mb-4 text-eyebrow text-rose-500">▼ Losers</p>
          <ul>
            {losers.map((c) => (
              <Row key={c.symbol} coin={c} kind="down" />
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
