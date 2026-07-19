/**
 * Telegram channel publisher.
 *
 * Called from the /api/telegram/publish webhook when Sanity publishes a
 * post in one of the auto-broadcast categories. Uses HTML parse mode
 * (MarkdownV2 has too many escape edge cases for Korean punctuation).
 */

import type { Post } from "@/lib/posts";
import type { TradeIdea } from "@/lib/trade-ideas";
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
 * Per-category opinion poll pools. Categories not listed → no poll.
 * Polls are anonymous, single-choice, attached as a separate message right
 * after the cover photo. Each category holds SEVERAL polls; one is picked
 * deterministically by the channel message id (see pollForPost) so the group
 * doesn't see the same question every time but re-deliveries stay stable.
 * Tone: casual + a bit provocative (편 가르기) to pull replies.
 */
const CATEGORY_POLLS: Partial<Record<CategorySlugLocal, { question: string; options: string[] }[]>> = {
  macro: [
    { question: "오늘 BTC 방향은? (24h 관점)", options: ["📈 위", "📉 아래", "↔️ 횡보"] },
    { question: "지금 현금 비중, 어느 정도세요?", options: ["🈳 거의 현금", "⚖️ 반반", "🔥 풀매수"] },
    { question: "이번 지표 발표, 시장 반응은?", options: ["🟢 호재", "🔴 악재", "😐 이미 반영"] },
  ],
  market: [
    { question: "이번 주 시장 시나리오는?", options: ["🟢 강세", "🔴 약세", "🟡 중립"] },
    { question: "이번 주 돈은 어디로?", options: ["🅰️ 알트", "₿ BTC", "💵 현금 대기"] },
    { question: "지금 심리, 공포 vs 탐욕?", options: ["😱 공포", "🤑 탐욕", "😐 중립"] },
  ],
  tokens: [
    { question: "이 분석에 동의하시나요?", options: ["👍 동의", "🤔 부분 동의", "👎 반대"] },
    { question: "이 토큰, 지금 들어간다면?", options: ["🟢 분할 매수", "⏳ 좀 더 기다림", "🚫 관심 없음"] },
    { question: "6개월 뒤 이 토큰은?", options: ["🚀 상승", "📉 하락", "🦀 횡보"] },
  ],
  strategy: [
    { question: "이 전략 적용해보시겠어요?", options: ["✅ 적용", "🧪 백테스트부터", "⛔ 안 함"] },
    { question: "당신의 매매 스타일은?", options: ["⚡ 스캘핑", "🌊 스윙", "📅 장기"] },
    { question: "손절, 칼같이 지키시나요?", options: ["🗡️ 칼손절", "😅 가끔 놓침", "🙈 잘 못 지킴"] },
  ],
  learn: [
    { question: "이 개념, 알고 계셨나요?", options: ["💡 알고 있었음", "🆕 처음 알았음", "🤔 헷갈렸음"] },
    { question: "트레이딩에서 제일 어려운 건?", options: ["📊 차트 분석", "🧠 멘탈 관리", "💰 자금 관리"] },
  ],
  basics: [
    { question: "이 원칙, 실전에서 지키시나요?", options: ["✅ 지킴", "😬 가끔", "❌ 잘 못 지킴"] },
    { question: "투자 공부, 주로 어떻게?", options: ["📚 책", "🎥 영상", "💬 커뮤니티"] },
  ],
};

/**
 * Resolve which poll (if any) to attach to a post:
 *   1. post.telegramPoll === false  → no poll
 *   2. post.telegramPoll === { question, options } → custom poll
 *   3. fall back to CATEGORY_POLLS[category], picking one by `seed` (channel
 *      message id) so the pool rotates but is stable across webhook retries
 *   4. otherwise undefined (no poll)
 */
function pollForPost(post: Post, seed: number) {
  if (post.telegramPoll === false) return undefined;
  if (post.telegramPoll && typeof post.telegramPoll === "object") {
    return post.telegramPoll;
  }
  const pool = CATEGORY_POLLS[post.category as CategorySlugLocal];
  if (!pool || pool.length === 0) return undefined;
  return pool[Math.abs(seed) % pool.length];
}

/**
 * Discussion-starter prompts posted by the bot as a reply into each post's
 * comment thread (the auto-forwarded channel message in the linked group).
 * Purpose: convert a silent auto-forward into a conversation — the "bot half"
 * of the seeding playbook. One prompt is picked deterministically by the
 * channel message id so the same post always gets the same question (and
 * re-deliveries never vary it).
 */
const CATEGORY_DISCUSSION_PROMPTS: Record<CategorySlugLocal, string[]> = {
  macro: [
    "오늘 여러분 포지션은? 롱 / 숏 / 관망 — 이유도 한 줄 부탁해요 👇",
    "이 지지선 깨지면 비중 줄이시겠어요? 손절 라인 어디 잡으셨나요?",
    "지표 앞두고 현금 비중 얼마나 두시나요? 편하게 공유해주세요 👇",
    "이번 발표, 호재일까요 악재일까요? 근거까지 걸어봅시다 👇",
    "'이건 확실하다' 싶은 시나리오 하나만 걸어보실래요? 나중에 복기해요 👇",
  ],
  market: [
    "이번 주 시나리오, 강세 / 약세 / 중립 어디에 거시겠어요? 👇",
    "이번 주 가장 주목하는 종목 하나만 꼽는다면?",
    "알트 시즌 온다 vs 아직이다 — 어느 편이세요? 👇",
    "이번 주 '이 종목만은 담는다' 하나 꼽아주세요 👇",
  ],
  tokens: [
    "이 분석에 동의하세요? 반대 근거 있으면 댓글로 붙여주세요 👇",
    "진입한다면 어느 가격대에서 분할하실 건가요?",
    "반대 의견 환영 — 이 분석에서 제일 약한 고리는 어디라고 보세요? 👇",
    "이 토큰, 6개월 뒤 웃을까 울까요? 이유도 함께 👇",
  ],
  strategy: [
    "이 전략, 실제 라이브에서 써보신 분 후기 궁금합니다 👇",
    "어떤 종목·타임프레임에 제일 잘 맞을까요? 의견 나눠주세요.",
    "이 전략, 어떤 장에서 제일 크게 깨질까요? 약점 같이 찾아봐요 👇",
    "여러분만의 진입 규칙 하나만 공유해주실래요? 👇",
  ],
  learn: [
    "이 개념, 처음 배울 때 어디서 제일 헷갈리셨어요? 👇",
    "실전에서 이거 적용하다 실수한 경험 있으신 분?",
    "이거 모르고 손해 본 적 있으신 분… 저부터요 👇",
  ],
  basics: [
    "이 대목, 실전에서 지키기 어떤가요? 여러분 경험 나눠주세요 👇",
    "책에서 가장 와닿은 원칙 하나만 꼽는다면?",
    "머리론 알지만 실전에선 제일 안 지켜지는 원칙, 뭔가요? 👇",
  ],
};

const TRADE_IDEA_DISCUSSION_PROMPTS = [
  "이 셋업 타셨나요? 진입 / 관망 편하게 공유해주세요 👇",
  "손절·목표 라인 여러분이면 어디 두시겠어요?",
  "이 셋업, 어디가 무효화 지점이라고 보세요? 반대 시나리오도 환영 👇",
  "지금 진입 vs 눌림 기다림 — 여러분이면? 👇",
];

/**
 * Pick a discussion prompt for a post category. `seed` (the channel message id)
 * makes the choice deterministic and stable across webhook re-deliveries.
 * Returns undefined for unknown categories (caller skips commenting).
 */
export function pickDiscussionPrompt(
  category: string,
  seed: number,
): string | undefined {
  const pool = CATEGORY_DISCUSSION_PROMPTS[category as CategorySlugLocal];
  if (!pool || pool.length === 0) return undefined;
  return pool[Math.abs(seed) % pool.length];
}

/** Discussion prompt for a trade-idea thread. */
export function pickTradeIdeaDiscussionPrompt(seed: number): string {
  return TRADE_IDEA_DISCUSSION_PROMPTS[
    Math.abs(seed) % TRADE_IDEA_DISCUSSION_PROMPTS.length
  ];
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

  // Always surface the blog link in the caption body — not only for private
  // URLs. The inline-keyboard CTA button carries the link on direct bot sends
  // (channel + mirror group), but Telegram STRIPS the inline keyboard when it
  // auto-forwards a channel post into its linked discussion group. Without a
  // caption-level link, the discussion-group copy has no way back to the site.
  lines.push("", `🔗 전문 보기: ${url}`);

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
  // Telegram limits callback_data to 64 bytes. "vote:down:" is 10 bytes,
  // leaving 54 bytes for the key. Truncate long slugs — the callback handler
  // uses a prefix range query so partial slugs still resolve correctly.
  const cbKey = post.slug.length <= 54 ? post.slug : post.slug.slice(0, 54);
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
 * Always sendPhoto: the image is resolvePhotoUrl(post) — coverImage, else the
 * first body image, else the category banner. The /api/telegram/publish route
 * gates on coverImage BEFORE calling this, so in normal operation `photo` is
 * the real article cover (the fallbacks are a last resort, not the norm).
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

  // 2) Secondary: mirror to the community group. Its caption gets an extra
  //    footer linking back to the VA channel + discussion group, so members of
  //    that community can find their way over (the channel/discussion copies
  //    don't need this footer — it's only useful in the outside group).
  //    Failures here MUST NOT throw — the channel publish already succeeded and
  //    Sanity should not retry.
  if (groupChatId) {
    const mirrorCaption =
      caption + "\n\n📢 채널 @victor_alpha2026 · 💬 토론방 @victor_alpha2026_chat";
    const groupPayload: Record<string, unknown> = {
      chat_id: groupChatId,
      photo,
      caption: mirrorCaption,
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
  const pollDef = pollForPost(post, r.message_id);
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

// ─────────────────────────────────────────────────────────────────────
// Trade Idea (오늘의 셋업) broadcaster

function fmtPrice(n: number): string {
  return `$${n.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
}

function fmtKstShort(iso?: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  const kst = new Date(d.getTime() + 9 * 3600 * 1000);
  const mm = String(kst.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(kst.getUTCDate()).padStart(2, "0");
  const hh = String(kst.getUTCHours()).padStart(2, "0");
  const mi = String(kst.getUTCMinutes()).padStart(2, "0");
  return `${mm}/${dd} ${hh}:${mi} KST`;
}

export function buildTradeIdeaCaption(
  idea: TradeIdea,
  siteUrl: string,
): string {
  const dirIcon = idea.direction === "Long" ? "📈" : "📉";
  const dirLabel = idea.direction === "Long" ? "롱" : "숏";
  const tp1 = idea.takeProfits?.[0];
  const rrLine = idea.rr ? ` (${idea.rr.toFixed(2)}R)` : "";

  const lines: string[] = [
    `🎯 <b>오늘의 셋업</b> · ${escapeHtml(idea.symbol)} ${dirIcon} ${escapeHtml(dirLabel)}`,
    `<b>${escapeHtml(idea.title)}</b>`,
    "",
    `▶ 진입 <b>${fmtPrice(idea.entry)}</b>`,
    `🛑 손절 ${fmtPrice(idea.stopLoss)}`,
  ];
  if (tp1) lines.push(`🎯 목표 ${fmtPrice(tp1)}${rrLine}`);
  if (idea.validUntil) lines.push(`⏱ 유효 ~${fmtKstShort(idea.validUntil)}`);
  lines.push("", escapeHtml(truncate(idea.thesis, 220)));
  lines.push("", `⚠ <b>무효화</b>: ${escapeHtml(idea.invalidationCondition)}`);

  // Site URL fallback (only when not public — public URL goes into inline button)
  const url = `${siteUrl}/today/${idea.slug}`;
  if (!isPublicUrl(url)) lines.push("", `→ ${url}`);

  return lines.join("\n");
}

export function buildTradeIdeaReplyMarkup(idea: TradeIdea, siteUrl: string) {
  const url = `${siteUrl}/today/${idea.slug}`;
  if (!isPublicUrl(url)) return undefined;
  return {
    inline_keyboard: [[{ text: "📊 셋업 상세 보기", url }]],
  };
}

/**
 * Send a trade idea to the configured Telegram channel + group.
 * Text-only sendMessage (no cover image per user decision).
 * Returns the channel message id for dedup tracking.
 */
export async function sendTradeIdeaToTelegram(
  idea: TradeIdea,
  siteUrl: string,
): Promise<number> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHANNEL_ID;
  const groupChatId = process.env.TELEGRAM_GROUP_CHAT_ID;
  if (!token) throw new Error("TELEGRAM_BOT_TOKEN is not set");
  if (!chatId) throw new Error("TELEGRAM_CHANNEL_ID is not set");

  const text = buildTradeIdeaCaption(idea, siteUrl);
  const reply_markup = buildTradeIdeaReplyMarkup(idea, siteUrl);

  const channelPayload: Record<string, unknown> = {
    chat_id: chatId,
    text,
    parse_mode: "HTML",
    disable_web_page_preview: true,
  };
  if (reply_markup) channelPayload.reply_markup = reply_markup;
  const r = await tgCall<SendResponse>(token, "sendMessage", channelPayload);

  if (groupChatId) {
    try {
      const groupPayload: Record<string, unknown> = {
        chat_id: groupChatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      };
      if (reply_markup) groupPayload.reply_markup = reply_markup;
      await tgCall<SendResponse>(token, "sendMessage", groupPayload);
    } catch (e) {
      console.warn(
        `[telegram] trade-idea group mirror failed for ${idea.slug}: ${(e as Error).message}`,
      );
    }
  }

  return r.message_id;
}
