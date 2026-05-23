"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ResultRow = {
  slug: string;
  outcome?: "win" | "loss" | "breakeven";
  pnlR?: number;
  closedPrice?: number;
  skipped?: string;
  error?: string;
};

type ApiResponse = {
  ok: boolean;
  count?: number;
  results?: ResultRow[];
  error?: string;
};

export function EvaluateTradeIdeasButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);

  async function run() {
    setBusy(true);
    setResponse(null);
    try {
      const res = await fetch("/api/admin/evaluate-trade-ideas", {
        method: "POST",
      });
      const data = (await res.json()) as ApiResponse;
      setResponse(data);
      // Refresh server data so any visible board reflects the new outcomes.
      router.refresh();
    } catch (e) {
      setResponse({ ok: false, error: (e as Error).message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-3 rounded-md border border-border bg-surface-warm p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div className="min-w-0">
          <p className="text-eyebrow text-fg-muted">오늘의 셋업 · 결과 평가</p>
          <p className="mt-1 text-meta text-fg-muted">
            만료된 셋업 중 결과가 비어 있는 건만 Binance 1H 캔들로 SL/TP1 도달
            여부를 판정해 자동 채웁니다.
          </p>
        </div>
        <button
          type="button"
          onClick={run}
          disabled={busy}
          className="shrink-0 rounded-md border border-border bg-bg px-4 py-2 text-meta font-medium hover:bg-surface-warm disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? "평가 중…" : "결과 평가 실행"}
        </button>
      </div>

      {response && (
        <div className="mt-4 border-t border-border pt-3">
          {response.ok ? (
            <>
              <p className="text-meta text-fg">
                처리: <strong>{response.count ?? 0}</strong>건
              </p>
              {Array.isArray(response.results) && response.results.length > 0 && (
                <ul className="mt-2 space-y-1 text-meta">
                  {response.results.map((r) => (
                    <li key={r.slug} className="font-mono text-[12px]">
                      {r.error ? (
                        <span className="text-rose-700 dark:text-rose-300">
                          {r.slug} — 오류: {r.error}
                        </span>
                      ) : r.skipped ? (
                        <span className="text-fg-muted">
                          {r.slug} — 스킵: {r.skipped}
                        </span>
                      ) : (
                        <span>
                          <span
                            className={
                              r.outcome === "win"
                                ? "text-emerald-700 dark:text-emerald-300"
                                : r.outcome === "loss"
                                  ? "text-rose-700 dark:text-rose-300"
                                  : "text-fg-muted"
                            }
                          >
                            {r.outcome === "win"
                              ? "승"
                              : r.outcome === "loss"
                                ? "패"
                                : "본전"}
                          </span>
                          {typeof r.pnlR === "number" && (
                            <span className="ml-1">
                              {r.pnlR > 0 ? "+" : ""}
                              {r.pnlR.toFixed(2)}R
                            </span>
                          )}
                          <span className="ml-2 text-fg-muted">{r.slug}</span>
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
              {response.count === 0 && (
                <p className="mt-1 text-meta text-fg-muted">평가 대기 건이 없습니다.</p>
              )}
            </>
          ) : (
            <p className="text-meta text-rose-700 dark:text-rose-300">
              실패: {response.error ?? "unknown"}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
