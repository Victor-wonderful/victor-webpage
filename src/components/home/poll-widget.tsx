"use client";

import { useOptimistic, useTransition } from "react";
import { useRouter } from "next/navigation";
import { castVote } from "@/lib/polls";
import { cn } from "@/lib/cn";

type Props = {
  slug: string;
  question: string;
  context?: string;
  options: string[];
  initialCounts: number[];
  initialUserVote: number | null;
  isLoggedIn: boolean;
  isClosed: boolean;
};

export function PollWidget({
  slug,
  question,
  context,
  options,
  initialCounts,
  initialUserVote,
  isLoggedIn,
  isClosed,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  type State = { counts: number[]; userVote: number | null };
  const [state, applyVote] = useOptimistic<State, number>(
    { counts: initialCounts, userVote: initialUserVote },
    (prev, picked) => {
      const next = [...prev.counts];
      if (prev.userVote != null) next[prev.userVote] = Math.max(0, next[prev.userVote] - 1);
      next[picked] = (next[picked] ?? 0) + 1;
      return { counts: next, userVote: picked };
    },
  );

  const total = state.counts.reduce((a, b) => a + b, 0);
  const showResults = state.userVote != null || isClosed;

  const onPick = (i: number) => {
    if (isClosed) return;
    if (!isLoggedIn) {
      router.push(`/login?next=${encodeURIComponent("/")}`);
      return;
    }
    if (state.userVote === i) return;
    startTransition(async () => {
      applyVote(i);
      const fd = new FormData();
      fd.set("slug", slug);
      fd.set("optionIndex", String(i));
      try {
        await castVote(fd);
      } catch (e) {
        console.error("[poll] vote failed:", e);
      }
    });
  };

  return (
    <section className="container-page mt-24">
      <div className="rounded-md border border-border bg-surface-warm p-8 md:p-10">
        <div className="flex items-baseline justify-between gap-4 flex-wrap">
          <p className="text-eyebrow text-accent">Today&apos;s Poll</p>
          <p className="text-meta text-fg-muted">
            <span className="tabular-nums">{total}</span>명 참여
            {isClosed && <span className="ml-2 text-down">· 마감</span>}
          </p>
        </div>
        <h2 className="mt-3 font-display text-2xl font-bold leading-snug tracking-tight md:text-3xl">
          {question}
        </h2>
        {context && (
          <p className="mt-3 font-serif-body text-base leading-relaxed text-fg-muted">
            {context}
          </p>
        )}

        <ul className="mt-8 space-y-3">
          {options.map((label, i) => {
            const count = state.counts[i] ?? 0;
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            const picked = state.userVote === i;
            return (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => onPick(i)}
                  disabled={pending || isClosed}
                  aria-pressed={picked}
                  className={cn(
                    "relative block w-full overflow-hidden rounded-md border px-5 py-3 text-left transition-colors",
                    picked
                      ? "border-accent bg-accent/10"
                      : "border-border bg-bg hover:border-accent",
                    isClosed && "cursor-default",
                    pending && "opacity-80",
                  )}
                >
                  {/* Progress bar (behind text) */}
                  {showResults && (
                    <span
                      className={cn(
                        "absolute inset-y-0 left-0 -z-0 transition-[width] duration-500",
                        picked ? "bg-accent/25" : "bg-surface dark:bg-fg/10",
                      )}
                      style={{ width: `${pct}%` }}
                      aria-hidden="true"
                    />
                  )}

                  <span className="relative z-10 flex items-center justify-between gap-3">
                    <span className="flex items-center gap-3 min-w-0">
                      <span
                        className={cn(
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                          picked
                            ? "border-accent bg-accent text-white"
                            : "border-fg-muted bg-transparent",
                        )}
                        aria-hidden="true"
                      >
                        {picked && (
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-3 w-3"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </span>
                      <span className="truncate font-serif-body font-semibold text-fg">
                        {label}
                      </span>
                    </span>
                    {showResults && (
                      <span className="shrink-0 font-mono text-meta tabular-nums text-fg-muted">
                        {pct}% · {count}
                      </span>
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {!isLoggedIn && !isClosed && (
          <p className="mt-5 text-meta text-fg-muted">
            로그인하시면 투표에 참여할 수 있습니다.
          </p>
        )}
        {state.userVote != null && !isClosed && (
          <p className="mt-5 text-meta text-fg-muted">
            ✓ 투표하셨습니다. 다른 항목을 클릭해 변경할 수 있습니다.
          </p>
        )}
      </div>
    </section>
  );
}
