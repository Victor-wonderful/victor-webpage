import { cn } from "@/lib/cn";

/**
 * Editorial candlestick chart placeholder — SVG only, no deps.
 * - Deterministic seeded random walk (same `seed` → same chart)
 * - Magazine palette: ink background, cream up-candles, accent down-candles
 * - Caption corner ("BTC/USDT · 1H") for magazine credit feel
 */

type Variant = "hero" | "card" | "wide";

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeed(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

type Candle = { o: number; h: number; l: number; c: number };

function generateCandles(seed: string, count: number): Candle[] {
  const rng = mulberry32(hashSeed(seed));
  const out: Candle[] = [];
  let price = 100 + rng() * 40;
  for (let i = 0; i < count; i++) {
    const drift = (rng() - 0.48) * 6;
    const volatility = 1 + rng() * 4;
    const o = price;
    const c = Math.max(20, o + drift);
    const h = Math.max(o, c) + rng() * volatility;
    const l = Math.min(o, c) - rng() * volatility;
    out.push({ o, h, l, c });
    price = c;
  }
  return out;
}

const VARIANTS: Record<
  Variant,
  { count: number; aspect: string; padding: number; caption?: boolean }
> = {
  hero: { count: 64, aspect: "aspect-[21/9]", padding: 24, caption: true },
  wide: { count: 48, aspect: "aspect-[16/9]", padding: 20, caption: true },
  card: { count: 28, aspect: "aspect-[4/3]", padding: 14 },
};

const SYMBOLS = ["BTC/USDT · 1H", "ETH/USDT · 4H", "KOSPI · 1D", "NQ1! · 15m", "SOL/USDT · 1H"];

export function ChartPlaceholder({
  seed,
  variant = "card",
  caption,
  className,
}: {
  seed: string;
  variant?: Variant;
  caption?: string;
  className?: string;
}) {
  const cfg = VARIANTS[variant];
  const candles = generateCandles(seed, cfg.count);

  // Use a fixed viewBox; SVG will scale to container via aspect-ratio class
  const VBW = 1000;
  const VBH = variant === "hero" ? 430 : variant === "wide" ? 562 : 750;
  const pad = cfg.padding * (VBW / 800); // proportional padding

  const xs = candles.map((_, i) => pad + (i * (VBW - 2 * pad)) / (candles.length - 1));
  const allHigh = Math.max(...candles.map((c) => c.h));
  const allLow = Math.min(...candles.map((c) => c.l));
  const range = allHigh - allLow || 1;
  const yScale = (v: number) =>
    pad + ((allHigh - v) / range) * (VBH - 2 * pad);
  const candleW = ((VBW - 2 * pad) / candles.length) * 0.62;

  // Auto-pick a caption symbol from seed
  const autoCaption =
    caption ?? SYMBOLS[hashSeed(seed) % SYMBOLS.length];

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden bg-ink",
        cfg.aspect,
        className,
      )}
    >
      <svg
        viewBox={`0 0 ${VBW} ${VBH}`}
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        {/* Grid */}
        <g stroke="rgb(237 231 216 / 0.07)" strokeWidth="1">
          {[0.2, 0.4, 0.6, 0.8].map((t) => (
            <line key={`h${t}`} x1={0} x2={VBW} y1={t * VBH} y2={t * VBH} />
          ))}
          {[0.2, 0.4, 0.6, 0.8].map((t) => (
            <line key={`v${t}`} y1={0} y2={VBH} x1={t * VBW} x2={t * VBW} />
          ))}
        </g>
        {/* Price area gradient (subtle) */}
        <defs>
          <linearGradient id={`gp-${seed}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgb(232 93 47)" stopOpacity="0.12" />
            <stop offset="100%" stopColor="rgb(232 93 47)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={
            `M ${xs[0]} ${yScale(candles[0].c)} ` +
            candles
              .slice(1)
              .map((c, i) => `L ${xs[i + 1]} ${yScale(c.c)}`)
              .join(" ") +
            ` L ${xs[xs.length - 1]} ${VBH - pad} L ${xs[0]} ${VBH - pad} Z`
          }
          fill={`url(#gp-${seed})`}
        />
        {/* Candles */}
        {candles.map((c, i) => {
          const up = c.c >= c.o;
          const color = up ? "rgb(237 231 216)" : "rgb(232 93 47)";
          const x = xs[i];
          const top = yScale(Math.max(c.o, c.c));
          const bottom = yScale(Math.min(c.o, c.c));
          return (
            <g key={i} stroke={color} fill={color}>
              <line
                x1={x}
                x2={x}
                y1={yScale(c.h)}
                y2={yScale(c.l)}
                strokeWidth="1.4"
              />
              <rect
                x={x - candleW / 2}
                y={top}
                width={candleW}
                height={Math.max(1.2, bottom - top)}
                rx="0.5"
              />
            </g>
          );
        })}
        {/* Trend line over closes */}
        <path
          d={
            `M ${xs[0]} ${yScale(candles[0].c)} ` +
            candles
              .slice(1)
              .map((c, i) => `L ${xs[i + 1]} ${yScale(c.c)}`)
              .join(" ")
          }
          fill="none"
          stroke="rgb(237 231 216 / 0.55)"
          strokeWidth="1.2"
        />
      </svg>

      {/* Magazine caption */}
      {cfg.caption && (
        <div className="absolute left-4 top-4 flex items-center gap-2 text-bg/85 sm:left-6 sm:top-6">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          <span className="text-eyebrow">{autoCaption}</span>
        </div>
      )}
    </div>
  );
}
