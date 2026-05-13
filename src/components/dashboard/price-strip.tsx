import { fetchSimplePrices, type SimplePrice } from "@/lib/widgets/simple-price";

function formatUsd(n: number) {
  if (!n) return "—";
  if (n < 1) return `$${n.toFixed(4)}`;
  if (n < 100) return `$${n.toFixed(2)}`;
  return `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}
function formatKrw(n: number) {
  if (!n) return "—";
  if (n < 100) return `₩${n.toFixed(2)}`;
  return `₩${Math.round(n).toLocaleString("ko-KR")}`;
}

function PriceCard({ p }: { p: SimplePrice }) {
  const up = p.change24h >= 0;
  return (
    <article className="flex flex-col gap-1 border border-border bg-surface-warm/40 p-5">
      <div className="flex items-baseline justify-between">
        <span className="font-display text-lg font-bold tabular-nums">
          {p.symbol}
        </span>
        <span className="text-meta text-fg-muted">{p.name}</span>
      </div>
      <p className="mt-2 font-display text-3xl font-extrabold tabular-nums leading-none">
        {formatUsd(p.usd)}
      </p>
      <div className="mt-1 flex items-baseline justify-between text-meta tabular-nums">
        <span className="text-fg-muted">{formatKrw(p.krw)}</span>
        <span
          className={`font-mono text-sm font-bold ${
            up ? "text-emerald-500" : "text-rose-500"
          }`}
        >
          {up ? "▲" : "▼"} {Math.abs(p.change24h).toFixed(2)}%
        </span>
      </div>
    </article>
  );
}

export async function PriceStrip() {
  const prices = await fetchSimplePrices(["bitcoin", "ethereum", "solana"]);
  return (
    <section className="container-page mt-8" aria-label="시세 카드">
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {prices.map((p) => (
          <PriceCard key={p.id} p={p} />
        ))}
      </div>
    </section>
  );
}
