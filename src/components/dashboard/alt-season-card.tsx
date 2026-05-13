import { fetchAltSeasonIndex } from "@/lib/widgets/alt-season";

function tone(v: number) {
  if (v >= 75) return "text-emerald-500";
  if (v >= 50) return "text-lime-500";
  if (v >= 25) return "text-fg-muted";
  return "text-orange-400";
}

function hint(v: number) {
  if (v >= 75) return "알트 시즌 — 자금이 BTC 밖으로 빠르게 회전 중.";
  if (v >= 50) return "알트 우위 분위기 — 선별 알트 강세.";
  if (v >= 25) return "중립 — 섹터 로테이션 가능 구간.";
  return "비트코인 시즌 — 알트 변동성 ↓, BTC 비중 ↑ 권장.";
}

export async function AltSeasonCard() {
  const r = await fetchAltSeasonIndex();
  const pct = r.index;
  return (
    <article className="flex h-full flex-col gap-4 border border-border bg-surface-warm/40 p-6">
      <p className="text-eyebrow text-accent">Alt Season Index</p>

      <div>
        <p
          className={`font-display text-5xl font-extrabold leading-none tabular-nums ${tone(
            pct,
          )}`}
        >
          {pct}
          <span className="text-2xl text-fg-muted">/100</span>
        </p>
        <p className="mt-2 text-meta text-fg-muted">{r.label}</p>
      </div>

      <div>
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-fg-muted/15">
          <div
            className="h-full bg-accent"
            style={{ width: `${Math.max(0, Math.min(100, pct))}%` }}
          />
        </div>
        <div className="mt-1 flex justify-between text-[10px] uppercase tracking-[0.12em] text-fg-muted">
          <span>BTC 시즌</span>
          <span>중립</span>
          <span>알트 시즌</span>
        </div>
      </div>

      <p className="text-meta text-fg-muted">
        Top 50 알트 중 90일 누적으로 BTC를 이긴 코인:{" "}
        <span className="text-fg">
          {r.outperformers}/{r.totalCompared}
        </span>
        <br />
        BTC 90일 변동:{" "}
        <span className="text-fg tabular-nums">
          {r.btcChange90d >= 0 ? "+" : ""}
          {r.btcChange90d.toFixed(1)}%
        </span>
      </p>

      <p className="mt-auto border-t border-border/60 pt-3 text-meta text-fg-muted">
        {hint(pct)}
      </p>
      <p className="text-[11px] uppercase tracking-[0.18em] text-fg-muted">
        via CoinGecko · 자체 산정 (90d, Top 50)
      </p>
    </article>
  );
}
