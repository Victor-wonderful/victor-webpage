import { fetchKimchiPremium } from "@/lib/widgets/kimchi";

function fmtPct(v: number) {
  return `${v >= 0 ? "+" : ""}${v.toFixed(2)}%`;
}

function tone(v: number) {
  if (v >= 4) return "text-rose-500";
  if (v >= 2) return "text-orange-400";
  if (v <= -2) return "text-sky-500";
  return "text-emerald-500";
}

function hint(v: number) {
  if (v >= 4) return "한국 과열 — 차익거래·역내 차익 매물 유입 가능성.";
  if (v >= 2) return "프리미엄 형성 — FOMO 단계 의심.";
  if (v <= -2) return "역프 — 한국 매물 쏠림 또는 USD 강세 신호.";
  return "정상 범위 — 글로벌 동조.";
}

export async function KimchiCard() {
  const data = await fetchKimchiPremium();
  if (data.length === 0) {
    return (
      <article className="flex h-full flex-col gap-3 border border-border bg-surface-warm/40 p-6">
        <p className="text-eyebrow text-accent">김치 프리미엄</p>
        <p className="text-meta text-fg-muted">데이터를 가져오지 못했습니다.</p>
      </article>
    );
  }

  const btc = data.find((d) => d.symbol === "BTC") ?? data[0];

  return (
    <article className="flex h-full flex-col gap-4 border border-border bg-surface-warm/40 p-6">
      <p className="text-eyebrow text-accent">김치 프리미엄</p>

      <div className="flex flex-col gap-1">
        <p
          className={`font-display text-4xl font-extrabold leading-none tabular-nums ${tone(
            btc.premiumPct,
          )}`}
        >
          {fmtPct(btc.premiumPct)}
        </p>
        <p className="text-[11px] uppercase tracking-[0.18em] text-fg-muted tabular-nums">
          USDT/KRW {btc.usdKrwRate.toFixed(0)}
        </p>
      </div>

      <ul className="space-y-2">
        {data.map((d) => (
          <li
            key={d.symbol}
            className="flex items-baseline justify-between border-b border-border/60 pb-2 last:border-b-0"
          >
            <span className="font-display text-base font-bold tabular-nums">
              {d.symbol}
            </span>
            <div className="flex items-baseline gap-3 text-meta tabular-nums">
              <span className="text-fg-muted">
                ₩{Math.round(d.upbitKrw).toLocaleString("ko-KR")}
              </span>
              <span className={`font-mono font-bold ${tone(d.premiumPct)}`}>
                {fmtPct(d.premiumPct)}
              </span>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-auto border-t border-border/60 pt-3 text-meta text-fg-muted">
        {hint(btc.premiumPct)}
      </p>
      <p className="text-[11px] uppercase tracking-[0.18em] text-fg-muted">
        via Upbit · Binance · USDT/KRW market rate
      </p>
    </article>
  );
}
