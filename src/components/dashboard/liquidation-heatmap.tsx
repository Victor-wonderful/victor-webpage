"use client";

import { useState } from "react";

const TARGETS: { label: string; symbol: string }[] = [
  { label: "BTC", symbol: "Binance_BTCUSDT" },
  { label: "ETH", symbol: "Binance_ETHUSDT" },
  { label: "SOL", symbol: "Binance_SOLUSDT" },
];

export function LiquidationHeatmap() {
  const [target, setTarget] = useState(TARGETS[0]);
  const src = `https://www.coinglass.com/pro/futures/LiquidationHeatMap?symbol=${target.symbol}&timeType=1`;

  return (
    <section className="container-page mt-12" aria-label="청산 히트맵">
      <header className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <p className="text-eyebrow text-accent">Liquidation Heatmap</p>
          <h2 className="mt-2 font-display text-[28px] font-extrabold leading-[1.1] tracking-tight md:text-[36px]">
            청산 히트맵
          </h2>
          <p className="mt-2 max-w-xl text-meta text-fg-muted">
            어느 가격대에 레버리지 포지션이 몰려있는지 — 큰 막대 부근이 자석처럼 가격을 끌어당기는 자리.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {TARGETS.map((t) => {
            const active = t.symbol === target.symbol;
            return (
              <button
                key={t.symbol}
                type="button"
                onClick={() => setTarget(t)}
                className={`rounded-full border px-3 py-1.5 text-meta transition-colors ${
                  active
                    ? "border-ink bg-ink text-bg dark:border-fg dark:bg-fg dark:text-ink"
                    : "border-ink/40 bg-transparent text-fg hover:border-accent hover:text-accent dark:border-fg/30"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </header>

      <div className="border border-border" style={{ height: "560px" }}>
        <iframe
          key={target.symbol}
          src={src}
          title={`Liquidation Heatmap ${target.label}`}
          width="100%"
          height="100%"
          loading="lazy"
          style={{ border: 0 }}
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-fg-muted">
        via Coinglass
      </p>
    </section>
  );
}
