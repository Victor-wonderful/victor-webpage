/**
 * Telegram channel publisher.
 *
 * Called from the /api/telegram/publish webhook when Sanity publishes a
 * post in one of the auto-broadcast categories. Uses HTML parse mode
 * (MarkdownV2 has too many escape edge cases for Korean punctuation).
 */

import type { Post } from "@/lib/posts";
import { type CategorySlug } from "@/lib/categories";
import { imageUrl } from "@/sanity/image";

const TELEGRAM_API = "https://api.telegram.org";

/**
 * Curated Unsplash photo IDs per category — same pool as the EditorialImage
 * component but pinned per category for predictable Telegram banners.
 * Replace any entry with a hand-picked image when desired.
 */
const CATEGORY_BANNER_PHOTO_IDS: Record<CategorySlug, string> = {
  macro: "1642543492481-44e81e3914a7",       // bloomberg-style terminal
  market: "1611974789855-9c2a0a7236a3",      // multi-monitor stock screens
  tokens: "1559526324-4b87b5e36e44",         // golden bitcoin coin
  learn: "1554224155-6726b3ff858f",          // notebook + pen, learning vibe
  basics: "1518186285589-2f7649de83e0",      // laptop with chart, low light
  strategy: "1640340434855-6084b1f4901c",    // dark trading desk
};

function categoryBannerUrl(category: CategorySlug, w = 1280, h = 720): string {
  const id = CATEGORY_BANNER_PHOTO_IDS[category] ?? CATEGORY_BANNER_PHOTO_IDS.macro;
  return `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`;
}

/**
 * Resolve the photo URL Telegram should show, in priority order:
 *   1. coverImage (manually uploaded in Studio)
 *   2. first bodyImages entry
 *   3. category default banner (Unsplash, deterministic per category)
 * Always returns a string — telegram.sendPhoto can be called unconditionally.
 */
export function resolvePhotoUrl(post: Post): string {
  const cover = imageUrl(post.coverImage, 1280);
  if (cover) return cover;
  const firstBody = post.bodyImages?.[0];
  if (firstBody) {
    const url = imageUrl(firstBody, 1280);
    if (url) return url;
  }
  return categoryBannerUrl(post.category);
}

/**
 * Categories whose published posts auto-broadcast to Telegram.
 * Mirrors the Sanity webhook GROQ filter — keep in sync.
 */
export const TELEGRAM_BROADCAST_CATEGORIES = [
  "macro",
  "market",
  "tokens",
  "learn",
  "basics",
  "strategy",
] as const;

/**
 * Per-category presentation overrides for Telegram captions.
 * - icon:     leading emoji for category header line
 * - label:    category short label shown on first line
 * - cta:      inline keyboard button text
 * - metaLine: builder for the optional meta sub-line (returns "" when no useful meta)
 */
type CategorySlugLocal =
  | "macro"
  | "market"
  | "tokens"
  | "learn"
  | "basics"
  | "strategy";

const CATEGORY_TG_PRESENTATION: Record<
  CategorySlugLocal,
  {
    icon: string;
    label: string;
    cta: string;
    metaLine: (m: import("./posts").PostMeta | undefined) => string;
  }
> = {
  macro: {
    icon: "📰",
    label: "오늘의 매크로",
    cta: "📰 시황 전문 보기",
    metaLine: (m) => {
      const parts: string[] = [];
      if (m?.event) parts.push(String(m.event));
      if (m?.region) parts.push(String(m.region));
      if (m?.impact) parts.push(`임팩트 ${m.impact}`);
      return parts.join(" · ");
    },
  },
  market: {
    icon: "📊",
    label: "이번 주 시장",
    cta: "📊 인사이트 읽기",
    metaLine: (m) => {
      const parts: string[] = [];
      if (m?.timeframe) parts.push(String(m.timeframe));
      if (m?.sentiment) parts.push(String(m.sentiment));
      return parts.join(" · ");
    },
  },
  tokens: {
    icon: "🔎",
    label: "토큰 심층분석",
    cta: "🔎 분석 보러 가기",
    metaLine: (m) => {
      const parts: string[] = [];
      if (m?.symbol) parts.push(String(m.symbol));
      if (m?.timeframe) parts.push(String(m.timeframe));
      if (m?.sentiment) parts.push(String(m.sentiment));
      return parts.join(" · ");
    },
  },
  learn: {
    icon: "🎓",
    label: "입문 가이드",
    cta: "🎓 가이드 읽기",
    metaLine: (m) => {
      const parts: string[] = [];
      if (m?.level) parts.push(String(m.level));
      if (m?.readMinutes) parts.push(`${m.readMinutes}분 읽기`);
      return parts.join(" · ");
    },
  },
  basics: {
    icon: "📚",
    label: "월가의 전설",
    cta: "📚 시리즈 읽기",
    metaLine: (m) => {
      const parts: string[] = [];
      if (m?.bookChapter) parts.push(String(m.bookChapter));
      if (m?.level) parts.push(String(m.level));
      if (m?.readMinutes) parts.push(`${m.readMinutes}분 읽기`);
      return parts.join(" · ");
    },
  },
  strategy: {
    icon: "⚡",
    label: "전략 노트",
    cta: "⚡ 전략 보러 가기",
    metaLine: (m) => {
      const parts: string[] = [];
      if (m?.strategyType) parts.push(String(m.strategyType));
      if (m?.winRate !== undefined && m?.winRate !== "") parts.push(`승률 ${m.winRate}`);
      if (m?.mdd !== undefined && m?.mdd !== "") parts.push(`MDD ${m.mdd}`);
      return parts.join(" · ");
    },
  },
};

function presentationFor(category: string) {
  return (
    CATEGORY_TG_PRESENTATION[category as CategorySlugLocal] ??
    CATEGORY_TG_PRESENTATION.macro
  );
}

export type TelegramSendResult = {
  ok: true;
  messageId: number;
} | {
  ok: false;
  error: string;
};

/**
 * Per-category opinion poll definitions. Categories not listed → no poll.
 * Polls are non-anonymous=false (anonymous), single-choice, attached as a
 * separate message right after the cover photo.
 */
const CATEGORY_POLLS: Partial<Record<CategorySlugLocal, { question: string; options: string[] }>> = {
  macro: {
    question: "오늘 BTC 방향은? (24h 관점)",
    options: ["📈 위", "📉 아래", "↔️ 횡보"],
  },
  market: {
    question: "이번 주 시장 시나리오는?",
    options: ["🟢 강세", "🔴 약세", "🟡 중립"],
  },
  tokens: {
    question: "이 분석에 동의하시나요?",
    options: ["👍 동의", "🤔 부분 동의", "👎 반대"],
  },
  strategy: {
    question: "이 전략 적용해보시겠어요?",
    options: ["✅ 적용", "🧪 백테스트부터", "⛔ 안 함"],
  },
};

function pollForCategory(category: string) {
  return CATEGORY_POLLS[category as CategorySlugLocal];
}

const SUMMARY_CAP = 110;

/** Escape characters that have meaning in Telegram HTML parse mode. */
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max - 1).trimEnd() + "…";
}

/**
 * Telegram rejects inline keyboard buttons whose URL points to localhost
 * or private hosts. We detect that and fall back to embedding the URL in
 * the caption (auto-linkified by Telegram clients) instead of a button.
 */
function isPublicUrl(u: string): boolean {
  try {
    const parsed = new URL(u);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return false;
    const host = parsed.hostname;
    if (host === "localhost" || host === "127.0.0.1" || host === "0.0.0.0") return false;
    if (/^192\.168\./.test(host) || /^10\./.test(host) || /^172\.(1[6-9]|2\d|3[0-1])\./.test(host)) return false;
    return true;
  } catch {
    return false;
  }
}

/**
 * Build the channel post caption.
 *  - Public site URL: caption is text-only (link is rendered as inline button)
 *  - Local/private:    caption embeds the URL as a plain line (Telegram
 *                      auto-linkifies http(s) but keeps the page openable
 *                      from a browser context if not from the mobile app)
 *
 * Format ("짧게" — user choice):
 *   [카테고리]
 *   <b>제목</b>
 *
 *   요약 한 줄
 *   [→ url, only when no inline button is possible]
 */
export function buildCaption(post: Post, siteUrl: string): string {
  const pres = presentationFor(post.category);
  const summary = truncate(post.summary ?? "", SUMMARY_CAP);
  const url = `${siteUrl}/blog/${post.slug}`;
  const metaLine = pres.metaLine(post.meta);

  // Header: "📰 <b>오늘의 매크로</b> · CPI · 미국 · 임팩트 중"
  const header =
    `${pres.icon} <b>${escapeHtml(pres.label)}</b>` +
    (metaLine ? ` · ${escapeHtml(metaLine)}` : "");

  const lines = [
    header,
    `<b>${escapeHtml(post.title)}</b>`,
    "",
    escapeHtml(summary),
  ];

  if (!isPublicUrl(url)) {
    lines.push("", `→ ${url}`);
  }

  return lines.join("\n");
}

/**
 * Inline keyboard with the post permalink as a primary button.
 * Returns null when the site URL isn't public (Telegram rejects those).
 */
export function buildReplyMarkup(
  post: Post,
  siteUrl: string,
  counts?: { up?: number; down?: number },
) {
  const url = `${siteUrl}/blog/${post.slug}`;
  if (!isPublicUrl(url)) return undefined;
  const pres = presentationFor(post.category);
  const up = counts?.up ?? 0;
  const down = counts?.down ?? 0;
  // Sanity post ids are namespaced ("post-<slug>"). We use the slug as the
  // callback payload key to keep it under Telegram's 64-byte callback_data
  // budget while remaining a stable identifier.
  const cbKey = post.slug;
  const buttons: Array<Array<{ text: string; url?: string; callback_data?: string }>> = [
    [
      { text: `👍 ${up}`, callback_data: `vote:up:${cbKey}` },
      { text: `👎 ${down}`, callback_data: `vote:down:${cbKey}` },
    ],
    [{ text: pres.cta, url }],
  ];
  return { inline_keyboard: buttons };
}

/** POST helper around fetch. */
async function tgCall<T>(token: string, method: string, body: unknown): Promise<T> {
  const res = await fetch(`${TELEGRAM_API}/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = (await res.json()) as { ok: boolean; description?: string; result?: T };
  if (!json.ok) {
    throw new Error(`telegram ${method}: ${json.description ?? "unknown error"}`);
  }
  return json.result as T;
}

type SendResponse = { message_id: number };

/**
 * Send a single post to the configured Telegram channel.
 *
 * - With coverImage: sendPhoto with caption.
 * - Without:         sendMessage with text.
 *
 * Returns the channel message id on success (used for dedup tracking).
 * Throws on Telegram API error so the caller (webhook) can return 5xx
 * and let Sanity retry.
 */
export async function sendPostToTelegram(
  post: Post,
  siteUrl: string,
): Promise<number> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHANNEL_ID;
  const groupChatId = process.env.TELEGRAM_GROUP_CHAT_ID;
  if (!token) throw new Error("TELEGRAM_BOT_TOKEN is not set");
  if (!chatId) throw new Error("TELEGRAM_CHANNEL_ID is not set");

  const caption = buildCaption(post, siteUrl);
  const photo = resolvePhotoUrl(post);
  const reply_markup = buildReplyMarkup(post, siteUrl);

  // 1) Primary: send to the announcement channel (return its message_id for
  //    dedup tracking).
  const channelPayload: Record<string, unknown> = {
    chat_id: chatId,
    photo,
    caption,
    parse_mode: "HTML",
  };
  if (reply_markup) channelPayload.reply_markup = reply_markup;
  const r = await tgCall<SendResponse>(token, "sendPhoto", channelPayload);

  // 2) Secondary: mirror to the community group's General topic when
  //    TELEGRAM_GROUP_CHAT_ID is configured. Failures here MUST NOT throw —
  //    the channel publish already succeeded and Sanity should not retry.
  if (groupChatId) {
    const groupPayload: Record<string, unknown> = {
      chat_id: groupChatId,
      photo,
      caption,
      parse_mode: "HTML",
    };
    if (reply_markup) groupPayload.reply_markup = reply_markup;
    try {
      await tgCall<SendResponse>(token, "sendPhoto", groupPayload);
    } catch (e) {
      console.warn(
        `[telegram] group mirror failed for ${post.slug}: ${(e as Error).message}`,
      );
    }
  }

  // 3) Opinion poll — attached as a second message for categories where
  //    audience reaction has analytical value (macro/market/tokens/strategy).
  //    Educational categories (basics/learn) skip the poll to avoid noise.
  //    Failures swallowed for the same reason as the group mirror.
  const pollDef = pollForCategory(post.category);
  if (pollDef) {
    const pollPayloadBase = {
      question: pollDef.question,
      options: pollDef.options.map((text) => ({ text })),
      is_anonymous: true,
      allows_multiple_answers: false,
      type: "regular",
    };
    // Channel poll
    try {
      await tgCall<SendResponse>(token, "sendPoll", {
        chat_id: chatId,
        ...pollPayloadBase,
      });
    } catch (e) {
      console.warn(
        `[telegram] channel poll failed for ${post.slug}: ${(e as Error).message}`,
      );
    }
    // Group poll (only if group configured)
    if (groupChatId) {
      try {
        await tgCall<SendResponse>(token, "sendPoll", {
          chat_id: groupChatId,
          ...pollPayloadBase,
        });
      } catch (e) {
        console.warn(
          `[telegram] group poll failed for ${post.slug}: ${(e as Error).message}`,
        );
      }
    }
  }

  return r.message_id;
}
