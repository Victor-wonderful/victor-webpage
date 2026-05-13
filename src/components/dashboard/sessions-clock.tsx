"use client";

import { useEffect, useState } from "react";

// Global market session clock — shows which trading sessions are currently open in KST.
// 24h crypto markets don't close, but session activity affects volatility (Asia open, EU open, US open).

type Session = {
  name: string;
  region: string;
  // KST hours [openHourInclusive, closeHourExclusive)
  // Sessions that wrap past midnight are split into two ranges.
  ranges: [number, number][];
  color: string;
};

const SESSIONS: Session[] = [
  {
    name: "Sydney",
    region: "Asia/Sydney",
    ranges: [[6, 15]],
    color: "bg-amber-400/80",
  },
  {
    name: "Tokyo",
    region: "Asia/Tokyo",
    ranges: [[9, 18]],
    color: "bg-rose-400/80",
  },
  {
    name: "London",
    region: "Europe/London",
    ranges: [[16, 24], [0, 1]],
    color: "bg-sky-400/80",
  },
  {
    name: "New York",
    region: "America/New_York",
    ranges: [[22, 24], [0, 7]],
    color: "bg-emerald-400/80",
  },
];

function kstHour(): { h: number; m: number } {
  const now = new Date();
  const kstMs = now.getTime() + 9 * 3600 * 1000;
  const d = new Date(kstMs);
  return { h: d.getUTCHours(), m: d.getUTCMinutes() };
}

function isOpen(s: Session, h: number) {
  return s.ranges.some(([a, b]) => h >= a && h < b);
}

export function SessionsClock() {
  const [time, setTime] = useState<{ h: number; m: number }>({ h: 0, m: 0 });

  useEffect(() => {
    setTime(kstHour());
    const t = setInterval(() => setTime(kstHour()), 30_000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="container-page mt-12" aria-label="시장 세션 시계">
      <header className="mb-6">
        <p className="text-eyebrow text-accent">Sessions · KST</p>
        <h2 className="mt-2 font-display text-[28px] font-extrabold leading-[1.1] tracking-tight md:text-[36px]">
          글로벌 마켓 세션
        </h2>
        <p className="mt-2 max-w-xl text-meta text-fg-muted">
          크립토는 24시간이지만 세션이 겹치는 시간(런던 오픈 16:00·뉴욕 오픈 22:30 KST)에 변동성이 집중됩니다.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SESSIONS.map((s) => {
          const open = isOpen(s, time.h);
          return (
            <article
              key={s.name}
              className={`flex flex-col gap-2 border p-5 ${
                open
                  ? "border-accent bg-accent/5"
                  : "border-border bg-surface-warm/40"
              }`}
            >
              <div className="flex items-baseline justify-between">
                <p className="font-display text-lg font-bold">{s.name}</p>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    open
                      ? "bg-emerald-500/15 text-emerald-500"
                      : "bg-fg-muted/15 text-fg-muted"
                  }`}
                >
                  {open ? "OPEN" : "CLOSED"}
                </span>
              </div>
              <p className="text-meta text-fg-muted">{s.region}</p>
              <p className="mt-2 text-meta tabular-nums">
                KST{" "}
                {s.ranges
                  .map(
                    ([a, b]) =>
                      `${String(a).padStart(2, "0")}:00–${String(b === 24 ? 24 : b).padStart(2, "0")}:00`,
                  )
                  .join(" / ")}
              </p>
              <span className={`mt-2 h-1 ${s.color}`} />
            </article>
          );
        })}
      </div>

      <p className="mt-4 text-meta text-fg-muted tabular-nums">
        현재 KST {String(time.h).padStart(2, "0")}:
        {String(time.m).padStart(2, "0")}
      </p>
    </section>
  );
}
