import { fetchBtcEtfFlow, type EtfFlowPoint } from "@/lib/widgets/etf-flow";

function fmtMillion(n: number) {
  if (!n) return "$0";
  const m = n / 1_000_000;
  const sign = n >= 0 ? "+" : "−";
  const abs = Math.abs(m);
  if (abs >= 1000) return `${sign}$${(abs / 1000).toFixed(2)}B`;
  return `${sign}$${abs.toFixed(0)}M`;
}

function Bar({ p, maxAbs }: { p: EtfFlowPoint; maxAbs: number }) {
  const up = p.netFlowUsd >= 0;
  const pct = maxAbs > 0 ? (Math.abs(p.netFlowUsd) / maxAbs) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="w-20 shrink-0 text-meta text-fg-muted tabular-nums">
        {p.date.slice(5)}
      </span>
      <div className="relative flex h-5 flex-1 items-center bg-fg-muted/10">
        <div
          className={`h-full ${up ? "bg-emerald-500/70" : "bg-rose-500/70"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span
        className={`w-24 shrink-0 text-right font-mono text-sm font-bold tabular-nums ${
          up ? "text-emerald-500" : "text-rose-500"
        }`}
      >
        {fmtMillion(p.netFlowUsd)}
      </span>
    </div>
  );
}

export async function EtfFlowCard() {
  const r = await fetchBtcEtfFlow(5);
  const maxAbs = Math.max(0, ...r.series.map((p) => Math.abs(p.netFlowUsd)));
  return (
    <article className="flex h-full flex-col gap-4 border border-border bg-surface-warm/40 p-6">
      <p className="text-eyebrow text-accent">BTC Spot ETF · 순유입</p>

      {r.series.length === 0 ? (
        <div className="flex flex-1 flex-col gap-3">
          <p className="font-display text-2xl font-bold leading-snug">
            데이터 일시 미연결
          </p>
          <p className="text-meta text-fg-muted">
            BTC 현물 ETF 순유입 데이터는 무료 공개 API가 부족합니다. 아래
            외부 대시보드에서 일일·누적 자금흐름을 직접 확인하세요.
          </p>
          <ul className="mt-1 space-y-2 text-meta">
            <li>
              <a
                href="https://farside.co.uk/btc/"
                target="_blank"
                rel="noreferrer"
                className="text-accent hover:underline"
              >
                Farside Investors — Daily Flows ↗
              </a>
            </li>
            <li>
              <a
                href="https://sosovalue.com/assets/etf/us-btc-spot"
                target="_blank"
                rel="noreferrer"
                className="text-accent hover:underline"
              >
                SoSoValue — US BTC Spot ETF ↗
              </a>
            </li>
            <li>
              <a
                href="https://www.coinglass.com/bitcoin-etf-flow-all"
                target="_blank"
                rel="noreferrer"
                className="text-accent hover:underline"
              >
                Coinglass — ETF Flow ↗
              </a>
            </li>
          </ul>
        </div>
      ) : (
        <>
          <div>
            <p
              className={`font-display text-3xl font-extrabold leading-none tabular-nums ${
                (r.latest?.netFlowUsd ?? 0) >= 0
                  ? "text-emerald-500"
                  : "text-rose-500"
              }`}
            >
              {fmtMillion(r.latest?.netFlowUsd ?? 0)}
            </p>
            <p className="mt-2 text-meta text-fg-muted">
              최근 영업일 ({r.latest?.date ?? "—"}) · 5일 누적{" "}
              <span className="text-fg tabular-nums">
                {fmtMillion(r.total5dUsd)}
              </span>
            </p>
          </div>

          <div className="space-y-2">
            {r.series.map((p) => (
              <Bar key={p.date} p={p} maxAbs={maxAbs} />
            ))}
          </div>
        </>
      )}

      <p className="mt-auto text-[11px] uppercase tracking-[0.18em] text-fg-muted">
        via SoSoValue
      </p>
    </article>
  );
}
