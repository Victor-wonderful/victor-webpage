/**
 * Shared trade-idea evaluator.
 *
 * Both the daily Vercel cron (/api/cron/evaluate-trade-ideas) and the
 * admin-only manual trigger (/api/admin/evaluate-trade-ideas) call this.
 *
 * Picks active-but-validUntil-passed (or already expired) ideas with no
 * result.outcome, fetches Binance 1H klines between publishedAt~validUntil,
 * judges SL/TP1 touch, patches result + status.
 */
import "server-only";
import { writeClient } from "@/sanity/client";

type IdeaRow = {
  _id: string;
  slug: string;
  title: string;
  symbol: string;
  direction: "Long" | "Short";
  entry: number;
  stopLoss: number;
  takeProfits?: number[];
  publishedAt: string;
  validUntil: string;
  status: string;
};

export type EvaluationResultRow = {
  slug: string;
  outcome?: "win" | "loss" | "breakeven";
  pnlR?: number;
  closedPrice?: number;
  skipped?: string;
  error?: string;
};

const QUERY = /* groq */ `
  *[_type == "tradeIdea"
    && !defined(result.outcome)
    && defined(validUntil)
    && (status == "expired" || (status == "active" && validUntil < now()))
  ]{
    _id, "slug": slug.current, title, symbol, direction, entry, stopLoss,
    takeProfits, publishedAt, validUntil, status
  } | order(publishedAt asc)
`;

export async function evaluatePendingTradeIdeas(): Promise<{
  count: number;
  results: EvaluationResultRow[];
}> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ideas = (await (writeClient.fetch as any)(QUERY)) as IdeaRow[];
  const results: EvaluationResultRow[] = [];

  for (const idea of ideas) {
    try {
      const evaluated = await evaluate(idea);
      if (!evaluated) {
        results.push({ slug: idea.slug, skipped: "no kline data" });
        continue;
      }
      await writeClient
        .patch(idea._id)
        .set({
          status: idea.status === "active" ? "expired" : idea.status,
          result: {
            ...evaluated,
            autoEvaluated: true,
            evaluatedAt: new Date().toISOString(),
          },
        })
        .commit();
      results.push({
        slug: idea.slug,
        outcome: evaluated.outcome,
        pnlR: evaluated.pnlR,
        closedPrice: evaluated.closedPrice,
      });
    } catch (e) {
      results.push({ slug: idea.slug, error: (e as Error).message });
    }
  }

  return { count: ideas.length, results };
}

async function evaluate(idea: IdeaRow) {
  const { symbol, direction, entry, stopLoss, takeProfits, publishedAt, validUntil } = idea;
  const tp1 = Array.isArray(takeProfits) && takeProfits.length > 0 ? takeProfits[0] : null;
  const startMs = new Date(publishedAt).getTime();
  const endMs = new Date(validUntil).getTime();
  if (!Number.isFinite(startMs) || !Number.isFinite(endMs) || endMs <= startMs) {
    throw new Error(`invalid time range ${publishedAt} → ${validUntil}`);
  }

  const klines = await fetchKlines(symbol, "1h", startMs, endMs);
  if (klines.length === 0) return null;

  let slHit = false;
  let tpHit = false;
  for (const k of klines) {
    const high = Number(k[2]);
    const low = Number(k[3]);
    if (direction === "Long") {
      if (low <= stopLoss) slHit = true;
      if (tp1 != null && high >= tp1) tpHit = true;
    } else {
      if (high >= stopLoss) slHit = true;
      if (tp1 != null && low <= tp1) tpHit = true;
    }
    if (slHit && tpHit) break;
  }

  const lastClose = Number(klines[klines.length - 1][4]);
  const risk = Math.abs(entry - stopLoss);
  const closedAt = new Date(endMs).toISOString();

  if (slHit && !tpHit) {
    return { closedAt, closedPrice: stopLoss, outcome: "loss" as const, pnlR: -1 };
  }
  if (tpHit && !slHit && tp1 != null) {
    return {
      closedAt,
      closedPrice: tp1,
      outcome: "win" as const,
      pnlR: Math.round((Math.abs(tp1 - entry) / risk) * 100) / 100,
    };
  }
  if (slHit && tpHit) {
    return {
      closedAt,
      closedPrice: stopLoss,
      outcome: "loss" as const,
      pnlR: -1,
      notesAfter:
        "기간 내 SL·TP1 모두 도달 — 시간 순서 미상이라 보수적으로 SL 우선. 회고에서 검증 필요.",
    };
  }

  const move = direction === "Long" ? lastClose - entry : entry - lastClose;
  const pnlR = Math.round((move / risk) * 100) / 100;
  return {
    closedAt,
    closedPrice: lastClose,
    outcome: "breakeven" as const,
    pnlR,
    notesAfter: "기간 내 SL·TP1 미도달. validUntil 시점 마감가 기준 부분 평가.",
  };
}

async function fetchKlines(
  symbol: string,
  interval: string,
  startMs: number,
  endMs: number,
): Promise<unknown[][]> {
  const url = new URL("https://api.binance.com/api/v3/klines");
  url.searchParams.set("symbol", symbol);
  url.searchParams.set("interval", interval);
  url.searchParams.set("startTime", String(startMs));
  url.searchParams.set("endTime", String(endMs));
  url.searchParams.set("limit", "1000");
  const res = await fetch(url, { signal: AbortSignal.timeout(20_000) });
  if (!res.ok) {
    throw new Error(`binance ${res.status}`);
  }
  return (await res.json()) as unknown[][];
}
