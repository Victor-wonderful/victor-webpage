import { fetchFundingRates, type FundingRow } from "@/lib/widgets/funding";

function fmtPct(v: number, digits = 4) {
  return `${v >= 0 ? "+" : ""}${v.toFixed(digits)}%`;
}

function Row({ r, kind }: { r: FundingRow; kind: "top" | "bottom" }) {
  const tone =
    kind === "top"
      ? r.ratePct > 0.05
        ? "text-rose-500"
        : "text-orange-400"
      : r.ratePct < -0.05
        ? "text-sky-500"
        : "text-emerald-500";
  return (
    <li className="flex items-baseline justify-between gap-4 border-b border-border/60 py-2 text-meta tabular-nums last:border-b-0">
      <span className="font-display text-base font-bold">{r.symbol}</span>
      <div className="flex items-baseline gap-3">
        <span className={`font-mono text-sm font-bold ${tone}`}>
          {fmtPct(r.ratePct)}
        </span>
        <span className="w-24 text-right text-fg-muted">
          연 {fmtPct(r.annualizedPct, 0)}
        </span>
      </div>
    </li>
  );
}

export async function FundingRateTable() {
  const { top, bottom } = await fetchFundingRates(10);
  return (
    <section className="container-page mt-12" aria-label="펀딩비 히트맵">
      <header className="mb-6 flex items-baseline justify-between">
        <div>
          <p className="text-eyebrow text-accent">Funding Rate · 8h</p>
          <h2 className="mt-2 font-display text-[28px] font-extrabold leading-[1.1] tracking-tight md:text-[36px]">
            과열 / 역배 코인
          </h2>
        </div>
        <p className="text-meta text-fg-muted">via Binance USDT-perp</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <article className="border border-border bg-surface-warm/40 p-6">
          <p className="mb-4 text-eyebrow text-rose-500">▲ 롱 과열 (펀딩비 ↑)</p>
          {top.length === 0 ? (
            <p className="text-meta text-fg-muted">데이터 없음.</p>
          ) : (
            <ul>
              {top.map((r) => (
                <Row key={r.symbol} r={r} kind="top" />
              ))}
            </ul>
          )}
          <p className="mt-4 text-meta text-fg-muted">
            펀딩비 양수가 클수록 롱 포지션이 비용을 더 많이 지불 — 단기 역추세 후보.
          </p>
        </article>

        <article className="border border-border bg-surface-warm/40 p-6">
          <p className="mb-4 text-eyebrow text-emerald-500">▼ 숏 과열 (펀딩비 ↓)</p>
          {bottom.length === 0 ? (
            <p className="text-meta text-fg-muted">데이터 없음.</p>
          ) : (
            <ul>
              {bottom.map((r) => (
                <Row key={r.symbol} r={r} kind="bottom" />
              ))}
            </ul>
          )}
          <p className="mt-4 text-meta text-fg-muted">
            펀딩비 음수가 클수록 숏 포지션이 비용을 더 많이 지불 — 숏 스퀴즈 가능.
          </p>
        </article>
      </div>
    </section>
  );
}
