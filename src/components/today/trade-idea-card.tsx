import Link from "next/link";
import {
  type TradeIdea,
  computeRR,
  effectiveStatus,
  formatKstDateTime,
  formatPrice,
  STATUS_LABEL,
} from "@/lib/trade-ideas";

/**
 * TradeIdeaCard — /today 보드와 detail 페이지 모두에서 쓰는 단일 카드.
 * variant:
 *   - "board" : /today 리스트 / 홈 위젯에서 사용. 클릭 시 /today/[slug]
 *   - "detail" : /today/[slug] 페이지 본체. 링크 X, thesisLong + invalidationCondition 풀 노출
 *   - "compact" : 홈 위젯에서 1개만 강조할 때 (사용 안 해도 됨)
 */
export function TradeIdeaCard({
  idea,
  variant = "board",
}: {
  idea: TradeIdea;
  variant?: "board" | "detail" | "compact";
}) {
  const status = effectiveStatus(idea);
  const rr = computeRR(idea);
  const validUntilLabel = formatKstDateTime(idea.validUntil);
  const isLong = idea.direction === "Long";
  const isClosed =
    status === "expired" ||
    status === "triggered_tp" ||
    status === "triggered_sl" ||
    status === "manually_closed";

  const directionColor = isLong
    ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
    : "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30";

  const statusBadge = STATUS_LABEL[status];
  const statusColor =
    status === "active"
      ? "border-accent/40 text-accent"
      : status === "triggered_tp"
        ? "border-emerald-500/40 text-emerald-700 dark:text-emerald-300"
        : status === "triggered_sl"
          ? "border-rose-500/40 text-rose-700 dark:text-rose-300"
          : "border-ink/20 text-fg-muted";

  const cardClasses = `relative overflow-hidden rounded-md border p-6 md:p-8 ${
    isClosed
      ? "border-ink/15 bg-surface-warm opacity-80"
      : "border-accent/40 bg-surface-warm"
  }`;

  // ── inner shared content ───────────────────────────────
  const Inner = (
    <>
      <div className="absolute left-0 top-0 h-full w-1 bg-accent" aria-hidden />

      <header className="flex flex-wrap items-center justify-between gap-3">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] uppercase tracking-wider ${statusColor}`}
        >
          <span aria-hidden>{statusBadge.dot}</span> {statusBadge.label}
        </span>
        {validUntilLabel && status === "active" && (
          <span className="font-mono text-[11px] text-fg-muted">
            ~ {validUntilLabel} KST
          </span>
        )}
      </header>

      <div className="mt-4 flex flex-wrap items-baseline gap-3">
        <span className="font-display text-[24px] font-extrabold tracking-tight md:text-[28px]">
          {idea.symbol}
        </span>
        <span
          className={`rounded-full border px-3 py-1 text-pill font-semibold ${directionColor}`}
        >
          {idea.direction}
        </span>
        {typeof rr === "number" && (
          <span className="font-mono text-meta text-fg-muted">
            R:R <span className="text-fg">{rr.toFixed(2)}</span>
          </span>
        )}
      </div>

      <p className="mt-4 break-keep font-serif-body text-[15px] leading-[1.7] text-fg md:text-[16px]">
        {idea.thesis}
      </p>

      <dl className="mt-5 grid grid-cols-3 gap-4 border-t border-ink/10 pt-4">
        <div>
          <dt className="text-[11px] uppercase tracking-[0.18em] text-fg-muted">
            진입
          </dt>
          <dd className="mt-1 font-mono text-base font-bold tracking-tight tabular-nums">
            {formatPrice(idea.entry)}
          </dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-[0.18em] text-fg-muted">
            손절
          </dt>
          <dd className="mt-1 font-mono text-base font-bold tracking-tight tabular-nums text-rose-600 dark:text-rose-400">
            {formatPrice(idea.stopLoss)}
          </dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-[0.18em] text-fg-muted">
            익절 {idea.takeProfits && idea.takeProfits.length > 1 ? "1차" : ""}
          </dt>
          <dd className="mt-1 font-mono text-base font-bold tracking-tight tabular-nums text-emerald-600 dark:text-emerald-400">
            {formatPrice(idea.takeProfits?.[0])}
          </dd>
        </div>
      </dl>

      {/* Detail-only blocks */}
      {variant === "detail" && (
        <>
          {idea.takeProfits && idea.takeProfits.length > 1 && (
            <div className="mt-3 flex flex-wrap gap-2 text-meta text-fg-muted">
              <span>전체 익절:</span>
              {idea.takeProfits.map((tp, i) => (
                <span key={i} className="font-mono tabular-nums text-fg">
                  {i + 1}차 {formatPrice(tp)}
                </span>
              ))}
            </div>
          )}

          <p className="mt-5 rounded border-l-2 border-rose-500/50 bg-surface px-3 py-2 text-meta text-fg-muted">
            <span className="mr-1 font-medium text-fg">무효화 조건</span>·{" "}
            {idea.invalidationCondition}
          </p>

          {idea.thesisLong && (
            <div className="mt-6 break-keep font-serif-body text-[15px] leading-[1.7] text-fg md:text-[16px] whitespace-pre-line">
              {idea.thesisLong}
            </div>
          )}

          {idea.relatedMacroPost && (
            <p className="mt-6 text-meta">
              <span className="text-fg-muted">관련 시황 →</span>{" "}
              <Link
                href={`/blog/${idea.relatedMacroPost.slug}`}
                className="text-accent hover:underline"
              >
                {idea.relatedMacroPost.title}
              </Link>
            </p>
          )}

          {idea.result && status !== "active" && (
            <section className="mt-8 rounded border border-ink/15 bg-surface p-4">
              <p className="text-eyebrow text-fg-muted">결과 기록</p>
              <dl className="mt-3 grid grid-cols-2 gap-3 text-meta md:grid-cols-4">
                {idea.result.closedAt && (
                  <div>
                    <dt className="text-[11px] uppercase tracking-wider text-fg-muted">
                      마감
                    </dt>
                    <dd className="mt-0.5 font-mono">
                      {formatKstDateTime(idea.result.closedAt)}
                    </dd>
                  </div>
                )}
                {typeof idea.result.closedPrice === "number" && (
                  <div>
                    <dt className="text-[11px] uppercase tracking-wider text-fg-muted">
                      마감가
                    </dt>
                    <dd className="mt-0.5 font-mono tabular-nums">
                      {formatPrice(idea.result.closedPrice)}
                    </dd>
                  </div>
                )}
                {idea.result.outcome && (
                  <div>
                    <dt className="text-[11px] uppercase tracking-wider text-fg-muted">
                      결과
                    </dt>
                    <dd className="mt-0.5 font-medium">
                      {idea.result.outcome === "win"
                        ? "✅ 승"
                        : idea.result.outcome === "loss"
                          ? "❌ 패"
                          : "본전"}
                    </dd>
                  </div>
                )}
                {typeof idea.result.pnlR === "number" && (
                  <div>
                    <dt className="text-[11px] uppercase tracking-wider text-fg-muted">
                      PnL
                    </dt>
                    <dd className="mt-0.5 font-mono tabular-nums">
                      {idea.result.pnlR > 0 ? "+" : ""}
                      {idea.result.pnlR.toFixed(2)}R
                    </dd>
                  </div>
                )}
              </dl>
              {idea.result.notesAfter && (
                <p className="mt-3 break-keep text-meta italic text-fg-muted">
                  &ldquo;{idea.result.notesAfter}&rdquo;
                </p>
              )}
            </section>
          )}
        </>
      )}

      <p className="mt-5 border-t border-ink/10 pt-3 text-[11px] leading-relaxed text-fg-muted">
        ※ 교육용 · 필자의 매매 기록 · <strong>매매 추천 아님</strong> · 투자 책임은 본인 (DYOR)
      </p>
    </>
  );

  if (variant === "detail") {
    return <article className={cardClasses}>{Inner}</article>;
  }

  return (
    <Link
      href={`/today/${idea.slug}`}
      className={`block transition-colors hover:bg-surface ${cardClasses}`}
    >
      {Inner}
    </Link>
  );
}
