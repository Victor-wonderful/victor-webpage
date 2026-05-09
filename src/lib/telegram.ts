/**
 * Telegram channel publisher.
 *
 * Called from the /api/telegram/publish webhook when Sanity publishes a
 * post in one of the auto-broadcast categories. Uses HTML parse mode
 * (MarkdownV2 has too many escape edge cases for Korean punctuation).
 */

import type { Post } from "@/lib/posts";
import { getCategory } from "@/lib/categories";
import { imageUrl } from "@/sanity/image";

const TELEGRAM_API = "https://api.telegram.org";

/**
 * Categories whose published posts auto-broadcast to Telegram.
 * Mirrors the Sanity webhook GROQ filter — keep in sync.
 */
export const TELEGRAM_BROADCAST_CATEGORIES = ["macro", "market", "tokens", "basics"] as const;

export type TelegramSendResult = {
  ok: true;
  messageId: number;
} | {
  ok: false;
  error: string;
};

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
 * Build the channel post caption / message body.
 * Format ("짧게" — user choice): category eyebrow → bold title → 1-line
 * summary → permalink → (optional) discussion group cue.
 *
 * The discussion line is only added when a group is actually linked
 * — detected via NEXT_PUBLIC_TELEGRAM_GROUP_URL env. Otherwise it would
 * be misleading because the channel post has no comment button.
 */
export function buildCaption(post: Post, siteUrl: string): string {
  const categoryLabel = getCategory(post.category)?.label ?? post.category;
  const summary = truncate(post.summary ?? "", SUMMARY_CAP);
  const url = `${siteUrl}/blog/${post.slug}`;
  const hasGroup = Boolean(process.env.NEXT_PUBLIC_TELEGRAM_GROUP_URL);

  const lines = [
    `[${escapeHtml(categoryLabel)}]`,
    `<b>${escapeHtml(post.title)}</b>`,
    "",
    escapeHtml(summary),
    "",
    `→ <a href="${url}">전문 보기</a>`,
  ];
  if (hasGroup) {
    lines.push("", "💬 토론은 아래 댓글 버튼으로 그룹에서");
  }
  return lines.join("\n");
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
  if (!token) throw new Error("TELEGRAM_BOT_TOKEN is not set");
  if (!chatId) throw new Error("TELEGRAM_CHANNEL_ID is not set");

  const caption = buildCaption(post, siteUrl);
  const photo = imageUrl(post.coverImage, 1280);

  if (photo) {
    const r = await tgCall<SendResponse>(token, "sendPhoto", {
      chat_id: chatId,
      photo,
      caption,
      parse_mode: "HTML",
    });
    return r.message_id;
  }

  const r = await tgCall<SendResponse>(token, "sendMessage", {
    chat_id: chatId,
    text: caption,
    parse_mode: "HTML",
    disable_web_page_preview: false,
  });
  return r.message_id;
}
