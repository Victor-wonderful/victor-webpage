/**
 * Trade Idea data layer — Sanity GROQ.
 * Plan Part C Phase 2 (옵션 1).
 *
 * 상태 머신:
 *   draft → active → (expired | triggered_tp | triggered_sl | manually_closed)
 *
 * 활성(/today 노출) 판정 = status == "active" && (validUntil 없음 OR validUntil > now)
 * 만료 자동 판정은 UI 단계에서 (Sanity 데이터는 그대로, 라이터/사용자가 정정)
 */

import { client } from "@/sanity/client";

export type TradeIdeaStatus =
  | "draft"
  | "active"
  | "expired"
  | "triggered_tp"
  | "triggered_sl"
  | "manually_closed";

export type TradeIdeaOutcome = "win" | "loss" | "breakeven";

export type TradeIdeaResult = {
  closedAt?: string;
  closedPrice?: number;
  outcome?: TradeIdeaOutcome;
  pnlR?: number;
  notesAfter?: string;
};

export type TradeIdea = {
  slug: string;
  title: string;
  publishedAt: string;
  status: TradeIdeaStatus;
  symbol: string;
  direction: "Long" | "Short";
  entry: number;
  stopLoss: number;
  takeProfits?: number[];
  rr?: number;
  validUntil?: string;
  thesis: string;
  thesisLong?: string;
  invalidationCondition: string;
  relatedMacroPost?: { slug: string; title: string } | null;
  result?: TradeIdeaResult;
  tags?: string[];
};

const TRADE_IDEA_PROJECTION = /* groq */ `
  "slug": slug.current,
  title,
  "publishedAt": publishedAt,
  status,
  symbol,
  direction,
  entry,
  stopLoss,
  takeProfits,
  rr,
  validUntil,
  thesis,
  thesisLong,
  invalidationCondition,
  "relatedMacroPost": relatedMacroPost->{
    "slug": slug.current,
    title
  },
  result,
  tags
`;

const activeTradeIdeasQuery = `
  *[_type == "tradeIdea" && status == "active" && (
    !defined(validUntil) || validUntil > now()
  )] | order(publishedAt desc) {
    ${TRADE_IDEA_PROJECTION}
  }
`;

const allTradeIdeasQuery = `
  *[_type == "tradeIdea" && defined(slug.current)] | order(publishedAt desc) {
    ${TRADE_IDEA_PROJECTION}
  }
`;

const tradeIdeaBySlugQuery = `
  *[_type == "tradeIdea" && slug.current == $slug][0] {
    ${TRADE_IDEA_PROJECTION}
  }
`;

const allTradeIdeaSlugsQuery = `
  *[_type == "tradeIdea" && defined(slug.current)].slug.current
`;

function fetchSanity<T>(query: string, params?: Record<string, unknown>): Promise<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (client.fetch as any)(query, params ?? {}) as Promise<T>;
}

/** /today board: status=active and not yet expired */
export async function getActiveTradeIdeas(): Promise<TradeIdea[]> {
  return fetchSanity<TradeIdea[]>(activeTradeIdeasQuery);
}

/** /today/archive: everything (active + closed + expired) */
export async function getAllTradeIdeas(): Promise<TradeIdea[]> {
  return fetchSanity<TradeIdea[]>(allTradeIdeasQuery);
}

export async function getTradeIdeaBySlug(slug: string): Promise<TradeIdea | null> {
  return fetchSanity<TradeIdea | null>(tradeIdeaBySlugQuery, { slug });
}

export async function getAllTradeIdeaSlugs(): Promise<string[]> {
  return fetchSanity<string[]>(allTradeIdeaSlugsQuery);
}

// ── Display helpers ─────────────────────────────────────────

/**
 * Treat a status==active idea as "expired" if validUntil already passed.
 * Sanity-side query also filters this; this is the client/SSR-time check
 * for individual records (e.g. detail page).
 */
export function isExpiredByTime(idea: TradeIdea): boolean {
  if (!idea.validUntil) return false;
  const t = new Date(idea.validUntil).getTime();
  if (Number.isNaN(t)) return false;
  return t < Date.now();
}

export function effectiveStatus(idea: TradeIdea): TradeIdeaStatus {
  if (idea.status === "active" && isExpiredByTime(idea)) return "expired";
  return idea.status;
}

/**
 * Compute R:R from entry/stop/first-take when not stored.
 * Returns null if math is undefined (zero risk distance).
 */
export function computeRR(idea: TradeIdea): number | null {
  if (typeof idea.rr === "number" && !Number.isNaN(idea.rr)) return idea.rr;
  const tp1 = idea.takeProfits?.[0];
  if (typeof tp1 !== "number") return null;
  const risk = Math.abs(idea.entry - idea.stopLoss);
  const reward = Math.abs(tp1 - idea.entry);
  if (risk === 0) return null;
  return Math.round((reward / risk) * 100) / 100;
}

export function formatPrice(n?: number): string {
  if (typeof n !== "number" || Number.isNaN(n)) return "—";
  if (n >= 1000) return n.toLocaleString("ko-KR");
  if (n >= 1) return n.toLocaleString("ko-KR", { maximumFractionDigits: 4 });
  return n.toLocaleString("ko-KR", { maximumFractionDigits: 6 });
}

export function formatKstDateTime(iso?: string): string | null {
  if (!iso) return null;
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleString("ko-KR", {
      timeZone: "Asia/Seoul",
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch {
    return null;
  }
}

export const STATUS_LABEL: Record<TradeIdeaStatus, { label: string; dot: string }> = {
  draft: { label: "초안", dot: "📝" },
  active: { label: "활성", dot: "🟢" },
  expired: { label: "만료", dot: "⏰" },
  triggered_tp: { label: "익절 체결", dot: "✅" },
  triggered_sl: { label: "손절 체결", dot: "❌" },
  manually_closed: { label: "수동 마감", dot: "⚪" },
};
