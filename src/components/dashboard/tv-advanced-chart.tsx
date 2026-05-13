"use client";

import { useEffect, useRef, useState } from "react";

// TradingView Advanced Chart embed (pure widget only — no outer section).
// Render inside a parent grid so a sidebar can sit next to it.

type Theme = "light" | "dark";

const PRESETS: { label: string; symbol: string }[] = [
  { label: "BTC/USDT", symbol: "BINANCE:BTCUSDT" },
  { label: "ETH/USDT", symbol: "BINANCE:ETHUSDT" },
  { label: "SOL/USDT", symbol: "BINANCE:SOLUSDT" },
  { label: "BTC.D", symbol: "CRYPTOCAP:BTC.D" },
  { label: "TOTAL2", symbol: "CRYPTOCAP:TOTAL2" },
];

function detectTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function TvAdvancedChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [symbol, setSymbol] = useState(PRESETS[0].symbol);
  const [customSymbol, setCustomSymbol] = useState("");

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.innerHTML = "";
    const inner = document.createElement("div");
    inner.className = "tradingview-widget-container__widget";
    inner.style.height = "100%";
    inner.style.width = "100%";
    el.appendChild(inner);

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;
    script.type = "text/javascript";
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol,
      interval: "240",
      timezone: "Asia/Seoul",
      theme: detectTheme(),
      style: "1",
      locale: "kr",
      enable_publishing: false,
      withdateranges: true,
      hide_side_toolbar: false,
      allow_symbol_change: true,
      details: true,
      support_host: "https://www.tradingview.com",
    });
    el.appendChild(script);

    return () => {
      el.innerHTML = "";
    };
  }, [symbol]);

  function applyCustom(e: React.FormEvent) {
    e.preventDefault();
    const v = customSymbol.trim().toUpperCase();
    if (!v) return;
    const next = v.includes(":") ? v : `BINANCE:${v}`;
    setSymbol(next);
  }

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {PRESETS.map((p) => {
          const active = symbol === p.symbol;
          return (
            <button
              key={p.symbol}
              type="button"
              onClick={() => setSymbol(p.symbol)}
              className={`rounded-full border px-3 py-1.5 text-meta transition-colors ${
                active
                  ? "border-ink bg-ink text-bg dark:border-fg dark:bg-fg dark:text-ink"
                  : "border-ink/40 bg-transparent text-fg hover:border-accent hover:text-accent dark:border-fg/30"
              }`}
            >
              {p.label}
            </button>
          );
        })}
        <form onSubmit={applyCustom} className="flex items-center gap-1">
          <input
            type="text"
            value={customSymbol}
            onChange={(e) => setCustomSymbol(e.target.value)}
            placeholder="심볼 입력 (예: DOGEUSDT)"
            className="w-44 rounded-full border border-border bg-transparent px-3 py-1.5 text-meta placeholder:text-fg-muted/70 focus:border-accent focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-full border border-border px-3 py-1.5 text-meta text-fg-muted hover:border-accent hover:text-accent"
          >
            적용
          </button>
        </form>
      </div>

      <div
        ref={containerRef}
        className="tradingview-widget-container flex-1 border border-border"
        style={{ minHeight: "560px", width: "100%" }}
      />
      <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-fg-muted">
        via TradingView · 인터벌 4H 기본 · 차트 내부에서 자유롭게 변경 가능
      </p>
    </div>
  );
}
