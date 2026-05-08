// Custom Korean macro calendar — server component, no external API.
// Source: hand-curated list in src/lib/widgets/calendar.ts (update monthly).

import { getUpcomingMacroEvents } from "@/lib/widgets/calendar";

const KIND_COLOR: Record<string, string> = {
  FOMC: "bg-rose-500/15 text-rose-500",
  CPI: "bg-orange-400/15 text-orange-400",
  PPI: "bg-amber-500/15 text-amber-600",
  "고용": "bg-sky-500/15 text-sky-500",
};

function dCountdown(d: number) {
  if (d === 0) return { label: "오늘", tone: "text-rose-500" };
  if (d === 1) return { label: "내일", tone: "text-orange-400" };
  return { label: `D-${d}`, tone: "text-fg-muted" };
}

export function MacroCalendar() {
  const events = getUpcomingMacroEvents(5);
  return (
    <article className="flex h-full flex-col gap-4 border border-border bg-surface-warm/40 p-6">
      <p className="text-eyebrow text-accent">Macro Calendar · KST</p>

      <ul className="flex-1 space-y-4">
        {events.map((e) => {
          const d = dCountdown(e.daysUntil);
          return (
            <li key={e.startsAt} className="border-b border-border/60 pb-3 last:border-b-0">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-meta text-fg-muted">{e.dateStr} · {e.hourStr}</span>
                <span className={`font-mono text-xs font-bold tabular-nums ${d.tone}`}>{d.label}</span>
              </div>
              <div className="mt-1 flex items-baseline justify-between gap-2">
                <p className="min-w-0 flex-1 truncate font-serif-body text-base font-bold leading-snug">
                  {e.title}
                </p>
                <span className={`shrink-0 rounded-sm px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] ${KIND_COLOR[e.kind] ?? "bg-fg-muted/15 text-fg-muted"}`}>
                  {e.kind}
                </span>
              </div>
              {e.note && (
                <p className="mt-1 text-meta text-fg-muted">{e.note}</p>
              )}
            </li>
          );
        })}
      </ul>

      <p className="mt-auto text-[11px] uppercase tracking-[0.18em] text-fg-muted">
        직접 큐레이션 · FOMC · CPI · PPI · 고용
      </p>
    </article>
  );
}
