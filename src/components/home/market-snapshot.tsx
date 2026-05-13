// Server component — pulls live data with ISR.
import { fetchFng, type FngPoint } from "@/lib/widgets/fng";
import { fetchDominance } from "@/lib/widgets/dominance";
import { MacroCalendar } from "@/components/home/macro-calendar";

function fngColor(v: number) {
  if (v < 25) return "text-rose-500";
  if (v < 45) return "text-orange-400";
  if (v < 55) return "text-fg-muted";
  if (v < 75) return "text-lime-500";
  return "text-emerald-500";
}

function fngLabelKo(label: string) {
  const map: Record<string, string> = {
    "Extreme Fear": "극단적 공포",
    "Fear": "공포",
    "Neutral": "중립",
    "Greed": "탐욕",
    "Extreme Greed": "극단적 탐욕",
  };
  return map[label] ?? label;
}

function fngHint(v: number) {
  if (v < 25) return "투매 분위기 — 역발상 매수 관점에서 관심 구간.";
  if (v < 45) return "공포 우세 — 추세 약화, 분할 매수 검토 구간.";
  if (v < 55) return "심리 균형 — 큰 베팅보단 셋업 검증.";
  if (v < 75) return "탐욕 우세 — 추격 매수보단 익절·관망 비중 ↑.";
  return "과열 — 단기 조정 위험 ↑, 리스크 관리 우선.";
}

function Sparkline({ history, color }: { history: FngPoint[]; color: string }) {
  if (history.length < 2) return null;
  const W = 200;
  const H = 50;
  const PAD = 4;
  const xs = history.map((_, i) => PAD + (i * (W - PAD * 2)) / (history.length - 1));
  const min = Math.min(...history.map((p) => p.value));
  const max = Math.max(...history.map((p) => p.value));
  const range = Math.max(1, max - min);
  const ys = history.map((p) => H - PAD - ((p.value - min) / range) * (H - PAD * 2));
  const d = xs.map((x, i) => `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${ys[i].toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none">
      <path d={d} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={color} />
      <circle cx={xs[xs.length - 1]} cy={ys[ys.length - 1]} r="3" className={color} fill="currentColor" />
    </svg>
  );
}

function ScaleStrip({ value }: { value: number }) {
  const segments = [
    { to: 25, cls: "bg-rose-500/70", label: "극공포" },
    { to: 45, cls: "bg-orange-400/70", label: "공포" },
    { to: 55, cls: "bg-fg-muted/40", label: "중립" },
    { to: 75, cls: "bg-lime-500/70", label: "탐욕" },
    { to: 100, cls: "bg-emerald-500/70", label: "극탐욕" },
  ];
  return (
    <div>
      <div className="relative flex h-2 w-full overflow-hidden rounded-full">
        {segments.map((s, i) => (
          <div
            key={i}
            className={s.cls}
            style={{ width: `${(s.to - (segments[i - 1]?.to ?? 0))}%` }}
          />
        ))}
        {/* marker */}
        <div
          className="pointer-events-none absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${value}%` }}
        >
          <div className="h-3 w-1 rounded-full bg-fg" />
        </div>
      </div>
      <div className="mt-1 grid grid-cols-5 gap-px text-[10px] uppercase tracking-[0.12em] text-fg-muted">
        {segments.map((s) => (
          <span key={s.label} className="text-center">{s.label}</span>
        ))}
      </div>
    </div>
  );
}

export async function FearGreedCard() {
  const fng = await fetchFng();
  const angle = (fng.value / 100) * 180;
  const weekDelta = fng.value - fng.weekAgo;
  return (
    <article className="flex h-full flex-col gap-5 border border-border bg-surface-warm/40 p-6">
      <p className="text-eyebrow text-accent">Fear &amp; Greed</p>

      {/* Top: gauge + big number */}
      <div className="flex items-end gap-4">
        <svg viewBox="0 0 120 70" className="h-16 w-28 shrink-0">
          <path d="M10 60 A 50 50 0 0 1 110 60" fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="8" className="text-fg-muted" />
          <path
            d={`M10 60 A 50 50 0 0 1 ${10 + 50 * (1 - Math.cos((angle * Math.PI) / 180))} ${60 - 50 * Math.sin((angle * Math.PI) / 180)}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            className={fngColor(fng.value)}
          />
        </svg>
        <div>
          <p className={`font-display text-4xl font-extrabold leading-none tabular-nums ${fngColor(fng.value)}`}>{fng.value}</p>
          <p className="mt-1 text-meta text-fg-muted">
            {fngLabelKo(fng.label)} · 어제 {fng.change > 0 ? "+" : ""}{fng.change}
          </p>
        </div>
      </div>

      {/* Mid: scale strip */}
      <ScaleStrip value={fng.value} />

      {/* Mid-Bottom: sparkline */}
      <div>
        <p className="mb-1 text-[11px] uppercase tracking-[0.18em] text-fg-muted">최근 7일</p>
        <Sparkline history={fng.history} color={fngColor(fng.value)} />
        <div className="mt-1 flex items-baseline justify-between text-meta text-fg-muted">
          <span>1주 전 {fng.weekAgo}</span>
          <span className={`tabular-nums ${weekDelta > 0 ? "text-emerald-500" : weekDelta < 0 ? "text-rose-500" : ""}`}>
            {weekDelta > 0 ? "+" : ""}{weekDelta}
          </span>
        </div>
      </div>

      {/* Bottom: hint */}
      <p className="border-t border-border/60 pt-3 text-meta text-fg-muted">
        {fngHint(fng.value)}
      </p>

      <p className="mt-auto text-[11px] uppercase tracking-[0.18em] text-fg-muted">via alternative.me</p>
    </article>
  );
}

function dominanceHint(btc: number) {
  if (btc >= 60) return "BTC 우위장 — 알트 자금 BTC로 회귀.";
  if (btc >= 55) return "BTC 우위 — 알트는 선별 접근.";
  if (btc >= 50) return "균형 구간 — 섹터 로테이션 가능.";
  return "알트 우위 — 알트 시즌 가능성 모니터링.";
}

export async function DominanceCard() {
  const dom = await fetchDominance();
  return (
    <article className="flex h-full flex-col gap-5 border border-border bg-surface-warm/40 p-6">
      <p className="text-eyebrow text-accent">BTC Dominance</p>

      {/* Top: big number */}
      <div>
        <p className="font-display text-5xl font-extrabold leading-none tabular-nums">
          {dom.btc.toFixed(1)}<span className="text-2xl text-fg-muted">%</span>
        </p>
        <p className="mt-2 text-meta text-fg-muted">전체 시총 중 BTC 비중</p>
      </div>

      {/* Mid: stacked bar */}
      <div>
        <div className="flex h-3 w-full overflow-hidden rounded-full bg-fg-muted/15">
          <div className="bg-accent" style={{ width: `${dom.btc}%` }} title={`BTC ${dom.btc.toFixed(1)}%`} />
          <div className="bg-sky-500" style={{ width: `${dom.eth}%` }} title={`ETH ${dom.eth.toFixed(1)}%`} />
          <div className="bg-emerald-500/70" style={{ width: `${dom.stables}%` }} title={`Stables ${dom.stables.toFixed(1)}%`} />
          <div className="bg-fg-muted/40" style={{ width: `${dom.others}%` }} title={`Others ${dom.others.toFixed(1)}%`} />
        </div>
        <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-meta tabular-nums">
          <li className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-sm bg-accent" />
            <span className="text-fg-muted">BTC</span>
            <span className="ml-auto">{dom.btc.toFixed(1)}%</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-sm bg-sky-500" />
            <span className="text-fg-muted">ETH</span>
            <span className="ml-auto">{dom.eth.toFixed(1)}%</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-sm bg-emerald-500/70" />
            <span className="text-fg-muted">Stables</span>
            <span className="ml-auto">{dom.stables.toFixed(1)}%</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-sm bg-fg-muted/40" />
            <span className="text-fg-muted">기타</span>
            <span className="ml-auto">{dom.others.toFixed(1)}%</span>
          </li>
        </ul>
      </div>

      {/* Mid-Bottom: BTC vs ETH ratio mini-vis */}
      <div>
        <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-fg-muted">BTC : ETH 비율</p>
        <div className="flex items-center gap-3">
          <span className="font-display text-2xl font-extrabold tabular-nums">{(dom.btc / dom.eth).toFixed(2)}<span className="ml-1 text-base text-fg-muted">×</span></span>
          <span className="text-meta text-fg-muted">{dom.btc >= dom.eth * 4 ? "BTC 압도" : dom.btc >= dom.eth * 3 ? "BTC 우위" : "균형"}</span>
        </div>
      </div>

      {/* Bottom: hint */}
      <p className="border-t border-border/60 pt-3 text-meta text-fg-muted">
        {dominanceHint(dom.btc)}
      </p>

      <p className="mt-auto text-[11px] uppercase tracking-[0.18em] text-fg-muted">via CoinGecko</p>
    </article>
  );
}

export function MarketSnapshot() {
  return (
    <section className="container-page mt-12" aria-label="시장 스냅샷">
      <div className="grid items-stretch gap-4 md:grid-cols-3">
        <FearGreedCard />
        <DominanceCard />
        <MacroCalendar />
      </div>
    </section>
  );
}
