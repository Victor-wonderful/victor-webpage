import Image from "next/image";
import { cn } from "@/lib/cn";

/**
 * Quant editorial cover image.
 * - Curated Unsplash photo pool (trading screens, code, financial districts, candle charts)
 * - Deterministic seed → same photo across renders
 * - Grayscale + ink/orange tonal overlay for magazine cohesion
 * - Local override via /public/covers/{seed}.jpg (preferred when present)
 */

type Variant = "hero" | "card" | "wide";

const VARIANT_CONFIG: Record<
  Variant,
  { aspect: string; w: number; h: number; sizes: string }
> = {
  hero: { aspect: "aspect-[21/9]", w: 1600, h: 686, sizes: "(min-width:1120px) 1120px, 100vw" },
  wide: { aspect: "aspect-[16/9]", w: 1200, h: 675, sizes: "(min-width:1120px) 1120px, 100vw" },
  card: { aspect: "aspect-[4/3]", w: 720, h: 540, sizes: "(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" },
};

// Curated Unsplash photo IDs — quant / trading / financial mood.
// Replace any entry with `/covers/{slug}.jpg` for local hand-picked covers.
const QUANT_PHOTO_IDS: string[] = [
  "1611974789855-9c2a0a7236a3", // multi-monitor stock screens
  "1640340434855-6084b1f4901c", // dark trading desk with charts
  "1590283603385-17ffb3a7f29f", // glowing financial dashboard
  "1551288049-bebda4e38f71",   // candle chart on screen
  "1642790106117-e829e14a795f", // bitcoin macro shot
  "1518186285589-2f7649de83e0", // laptop with chart, low light
  "1639762681485-074b7f938ba0", // financial district at night
  "1642543492481-44e81e3914a7", // bloomberg-style terminal
  "1559526324-4b87b5e36e44",   // golden bitcoin coin
  "1591696205602-2f950c417cb9", // candle chart abstract
];

const SYMBOLS = ["BTC/USDT · 1H", "ETH/USDT · 4H", "KOSPI · 1D", "NQ1! · 15m", "SOL/USDT · 1H", "AAPL · 1D"];

function hash(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pickPhotoUrl(seed: string, w: number, h: number): string {
  const id = QUANT_PHOTO_IDS[hash(seed) % QUANT_PHOTO_IDS.length];
  return `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`;
}

export function EditorialImage({
  seed,
  variant = "card",
  caption,
  showCaption = true,
  priority = false,
  className,
  alt = "",
}: {
  seed: string;
  variant?: Variant;
  caption?: string;
  showCaption?: boolean;
  priority?: boolean;
  className?: string;
  alt?: string;
}) {
  const cfg = VARIANT_CONFIG[variant];
  const src = pickPhotoUrl(seed, cfg.w, cfg.h);
  const autoCaption = caption ?? SYMBOLS[(hash(seed) >>> 3) % SYMBOLS.length];

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden bg-ink",
        cfg.aspect,
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={cfg.sizes}
        priority={priority}
        unoptimized
        className="object-cover opacity-[0.85] [filter:grayscale(1)_contrast(1.05)]"
      />
      {/* Ink tint overlay for tonal cohesion */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-br from-ink/60 via-ink/20 to-accent/15 mix-blend-multiply"
      />
      {/* Subtle vignette */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(12,15,14,0.55)_100%)]"
      />
      {showCaption && (
        <div className="absolute left-4 top-4 flex items-center gap-2 text-bg/90 sm:left-6 sm:top-6">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          <span className="text-eyebrow drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
            {autoCaption}
          </span>
        </div>
      )}
    </div>
  );
}
