import { fetchLongShortRatio, type LongShortPoint } from "@/lib/widgets/long-short";

function fmtPctPts(v: number) {
  if (Math.abs(v) < 0.05) return "변동 없음";
  return `${v >= 0 ? "+" : ""}${v.toFixed(1)}pp`;
}

function hint(p: LongShortPoint) {
  const longShare = p.longPct * 100;
  if (longShare >= 65) return "롱 과열 — 역추세 단기 후보, 청산 캐스케이드 주의.";
  if (longShare >= 58) return "롱 우위 — 추세 추종 우호, 다만 펀딩비 동반 점검.";
  if (longShare <= 35) return "숏 과열 — 숏 스퀴즈 가능, 매수 우호 구간.";
  if (longShare <= 42) return "숏 우위 — 단기 약세 심리, 바운스 트레이드 후보.";
  return "균형 — 명확한 포지셔닝 쏠림 없음.";
}

function Sparkline({ series }: { series: LongShortPoint[] }) {
  if (series.length < 2) return null;
  const W = 200;
  const H = 36;
  const PAD = 2;
  const xs = series.map(
    (_, i) => PAD + (i * (W - PAD * 2)) / (series.length - 1),
  );
  const vals = series.map((p) => p.longPct * 100);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const range = Math.max(1, max - min);
  const ys = vals.map(
    (v) => H - PAD - ((v - min) / range) * (H - PAD * 2),
  );
  const d = xs
    .map((x, i) => `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${ys[i].toFixed(1)}`)
    .join(" ");
  const last = series[series.length - 1];
  const tone =
    last.longPct >= 0.58
      ? "text-emerald-500"
      : last.longPct <= 0.42
        ? "text-rose-500"
        : "text-fg-muted";
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none">
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={tone}
      />
      <circle
        cx={xs[xs.length - 1]}
        cy={ys[ys.length - 1]}
        r="3"
        className={tone}
        fill="currentColor"
      />
    </svg>
  );
}

export async function LongShortCard() {
  const r = await fetchLongShortRatio("BTCUSDT");

  if (!r.latest) {
    return (
      <article className="flex h-full flex-col gap-3 border border-border bg-surface-warm/40 p-6">
        <p className="text-eyebrow text-accent">Long/Short · BTC</p>
        <p className="text-meta text-fg-muted">데이터를 가져오지 못했습니다.</p>
      </article>
    );
  }

  const longPct = r.latest.longPct * 100;
  const shortPct = r.latest.shortPct * 100;
  const ratio = r.latest.ratio;

  return (
    <article className="flex h-full flex-col gap-4 border border-border bg-surface-warm/40 p-6">
      <p className="text-eyebrow text-accent">Long/Short · BTC</p>

      {/* Big ratio */}
      <div>
        <p className="font-display text-4xl font-extrabold leading-none tabular-nums">
          {ratio.toFixed(2)}
          <span className="ml-1 text-2xl text-fg-muted">×</span>
        </p>
        <p className="mt-2 text-meta text-fg-muted">롱/숏 계좌 비율 (Binance perp)</p>
      </div>

      {/* Stacked bar */}
      <div>
        <div className="flex h-3 w-full overflow-hidden rounded-full bg-fg-muted/15">
          <div
            className="bg-emerald-500/80"
            style={{ width: `${longPct}%` }}
            title={`Long ${longPct.toFixed(1)}%`}
          />
          <div
            className="bg-rose-500/80"
            style={{ width: `${shortPct}%` }}
            title={`Short ${shortPct.toFixed(1)}%`}
          />
        </div>
        <ul className="mt-3 grid grid-cols-1 gap-x-4 gap-y-1 text-meta tabular-nums xl:grid-cols-2">
          <li className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-sm bg-emerald-500/80" />
            <span className="text-fg-muted">Long</span>
            <span className="ml-auto">{longPct.toFixed(1)}%</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-sm bg-rose-500/80" />
            <span className="text-fg-muted">Short</span>
            <span className="ml-auto">{shortPct.toFixed(1)}%</span>
          </li>
        </ul>
      </div>

      {/* 24h trend */}
      <div>
        <p className="mb-1 text-[11px] uppercase tracking-[0.18em] text-fg-muted">
          최근 24시간 · Long 비중
        </p>
        <Sparkline series={r.series} />
        <p
          className={`mt-1 text-meta tabular-nums ${
            r.deltaLongPct > 0
              ? "text-emerald-500"
              : r.deltaLongPct < 0
                ? "text-rose-500"
                : "text-fg-muted"
          }`}
        >
          24h 변화: {fmtPctPts(r.deltaLongPct)}
        </p>
      </div>

      <p className="mt-auto border-t border-border/60 pt-3 text-meta text-fg-muted">
        {hint(r.latest)}
      </p>
      <p className="text-[11px] uppercase tracking-[0.18em] text-fg-muted">
        via Binance · global account ratio
      </p>
    </article>
  );
}
