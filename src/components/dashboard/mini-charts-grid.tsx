"use client";

import { useEffect, useRef } from "react";

// TradingView mini symbol overview embed — one per coin.
// Shows ticker, price, % change, and a 1M sparkline. Tiny and free.

type Theme = "light" | "dark";

const COINS: { symbol: string; label: string }[] = [
  { symbol: "BINANCE:BTCUSDT", label: "BTC" },
  { symbol: "BINANCE:ETHUSDT", label: "ETH" },
  { symbol: "BINANCE:SOLUSDT", label: "SOL" },
  { symbol: "BINANCE:BNBUSDT", label: "BNB" },
  { symbol: "BINANCE:XRPUSDT", label: "XRP" },
  { symbol: "BINANCE:ADAUSDT", label: "ADA" },
];

function detectTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function MiniChart({ symbol, label }: { symbol: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.innerHTML = "";
    const inner = document.createElement("div");
    inner.className = "tradingview-widget-container__widget";
    inner.style.height = "100%";
    inner.style.width = "100%";
    el.appendChild(inner);

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
    script.async = true;
    script.type = "text/javascript";
    script.innerHTML = JSON.stringify({
      symbol,
      width: "100%",
      height: "100%",
      locale: "kr",
      dateRange: "1M",
      colorTheme: detectTheme(),
      isTransparent: true,
      autosize: true,
      largeChartUrl: "",
    });
    el.appendChild(script);

    return () => {
      el.innerHTML = "";
    };
  }, [symbol]);

  return (
    <article className="flex flex-col gap-2 border border-border bg-surface-warm/40 p-3">
      <p className="font-display text-sm font-bold tabular-nums">{label}</p>
      <div
        ref={ref}
        className="tradingview-widget-container"
        style={{ height: "180px", width: "100%" }}
      />
    </article>
  );
}

export function MiniChartsGrid() {
  return (
    <section className="container-page mt-12" aria-label="주요 코인 미니 차트">
      <header className="mb-4">
        <p className="text-eyebrow text-accent">Watchlist · 1M</p>
        <h2 className="mt-2 font-display text-[24px] font-extrabold leading-[1.1] tracking-tight md:text-[28px]">
          주요 코인 한눈에
        </h2>
        <p className="mt-1 max-w-xl text-meta text-fg-muted">
          BTC · ETH · SOL · BNB · XRP · ADA — 어디가 강하고 어디가 흔들리는지 1분 비교.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {COINS.map((c) => (
          <MiniChart key={c.symbol} symbol={c.symbol} label={c.label} />
        ))}
      </div>
    </section>
  );
}
