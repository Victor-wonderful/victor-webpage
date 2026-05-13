"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

/**
 * Freshness indicator + auto-refresh.
 *
 * Receives the page render timestamp from the server component, then on the
 * client:
 *   1. Ticks a "X초 전 / N분 전" label every second.
 *   2. Calls router.refresh() every 60s, which re-runs the server component
 *      tree. Server fetchers honor their own revalidate windows — anything
 *      whose cache has expired pulls fresh, others stay cached.
 *   3. Exposes a manual refresh button.
 */
export function AutoRefreshBar({ renderedAt }: { renderedAt: number }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [now, setNow] = useState<number>(() => renderedAt);

  // Mount → start the seconds-elapsed tick.
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  // Auto-refresh every 60s.
  useEffect(() => {
    const t = setInterval(() => {
      startTransition(() => {
        router.refresh();
      });
    }, 60_000);
    return () => clearInterval(t);
  }, [router]);

  const secondsAgo = Math.max(0, Math.floor((now - renderedAt) / 1000));
  let label: string;
  if (secondsAgo < 5) label = "방금 전";
  else if (secondsAgo < 60) label = `${secondsAgo}초 전`;
  else if (secondsAgo < 3600) {
    const m = Math.floor(secondsAgo / 60);
    const s = secondsAgo % 60;
    label = s === 0 ? `${m}분 전` : `${m}분 ${s}초 전`;
  } else {
    label = `${Math.floor(secondsAgo / 3600)}시간 전`;
  }

  function handleRefresh() {
    startTransition(() => {
      router.refresh();
    });
  }

  const dotTone =
    secondsAgo < 90
      ? "bg-emerald-500"
      : secondsAgo < 300
        ? "bg-amber-400"
        : "bg-rose-500";

  return (
    <div className="flex flex-wrap items-center gap-3 text-meta text-fg-muted">
      <span className="flex items-center gap-2">
        <span
          className={`relative inline-flex h-2 w-2 rounded-full ${dotTone}`}
        >
          {secondsAgo < 90 && (
            <span
              className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${dotTone}`}
            />
          )}
        </span>
        마지막 갱신:{" "}
        <span className="text-fg tabular-nums">{label}</span>
      </span>
      <span aria-hidden>·</span>
      <span>60초마다 자동 갱신</span>
      <button
        type="button"
        onClick={handleRefresh}
        disabled={isPending}
        className="rounded-full border border-border bg-transparent px-3 py-1 text-meta text-fg hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "갱신 중…" : "지금 새로고침"}
      </button>
    </div>
  );
}
