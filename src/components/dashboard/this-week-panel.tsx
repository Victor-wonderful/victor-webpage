import { getUpcomingMacroEvents } from "@/lib/widgets/calendar";

const KIND_COLOR: Record<string, string> = {
  FOMC: "bg-rose-500/15 text-rose-500",
  CPI: "bg-orange-400/15 text-orange-400",
  PPI: "bg-amber-500/15 text-amber-600",
  "고용": "bg-sky-500/15 text-sky-500",
};

function dCount(d: number) {
  if (d === 0) return { label: "오늘", tone: "text-rose-500" };
  if (d === 1) return { label: "내일", tone: "text-orange-400" };
  return { label: `D-${d}`, tone: "text-fg-muted" };
}

export function ThisWeekPanel() {
  const events = getUpcomingMacroEvents(8);
  return (
    <section className="container-page mt-12" aria-label="이번주 매크로 일정">
      <header className="mb-6">
        <p className="text-eyebrow text-accent">This Week · Macro</p>
        <h2 className="mt-2 font-display text-[28px] font-extrabold leading-[1.1] tracking-tight md:text-[36px]">
          다가오는 매크로 이벤트
        </h2>
        <p className="mt-2 max-w-xl text-meta text-fg-muted">
          FOMC · CPI · PPI · 고용 — 발표 시각은 KST. 직전 24시간 변동성 확대 주의.
        </p>
      </header>

      <ul className="divide-y divide-border border-y border-border">
        {events.map((e) => {
          const d = dCount(e.daysUntil);
          const impactTone =
            e.impact === "high" ? "text-rose-500" : "text-fg-muted";
          return (
            <li
              key={e.startsAt}
              className="flex flex-col gap-2 py-4 md:flex-row md:items-baseline md:gap-6"
            >
              <div className="flex w-32 shrink-0 items-baseline gap-3 tabular-nums">
                <span
                  className={`font-mono text-sm font-bold ${d.tone}`}
                >
                  {d.label}
                </span>
                <span className="text-meta text-fg-muted">{e.hourStr}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-sm px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] ${
                      KIND_COLOR[e.kind] ?? "bg-fg-muted/15 text-fg-muted"
                    }`}
                  >
                    {e.kind}
                  </span>
                  <span
                    className={`text-meta uppercase tracking-wider ${impactTone}`}
                  >
                    {e.impact === "high" ? "High" : "Med"}
                  </span>
                </div>
                <p className="mt-1 font-serif-body text-base font-bold leading-snug">
                  {e.title}
                </p>
                {e.note && (
                  <p className="mt-1 text-meta text-fg-muted">{e.note}</p>
                )}
              </div>
              <p className="shrink-0 text-meta text-fg-muted tabular-nums">
                {e.dateStr}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
