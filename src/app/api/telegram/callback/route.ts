/**
 * Telegram bot webhook — handles callback_query from inline 👍/👎 buttons.
 *
 * Flow:
 *   1. User taps 👍 or 👎 under a channel/group post.
 *   2. Telegram POSTs an Update with callback_query to this route.
 *   3. We parse callback_data ("vote:up:<slug>" or "vote:down:<slug>"),
 *      look up the post in Sanity, dedup per Telegram user_id, increment
 *      the counter, and edit the message's reply_markup with new counts.
 *   4. answerCallbackQuery dismisses the spinner in the user's UI.
 *
 * Setup (one-time):
 *   curl "https://api.telegram.org/bot<TOKEN>/setWebhook" \
 *     -d "url=https://victor-alpha-neon.vercel.app/api/telegram/callback" \
 *     -d "allowed_updates=[\"callback_query\"]"
 *
 * Security: Telegram has no signed-webhook mechanism, so we restrict by:
 *   - URL path is opaque (this file path = the secret)
 *   - Only accept callback_data with our `vote:` prefix
 *   - All Sanity writes go through SANITY_API_TOKEN (server-only)
 */

import { NextResponse } from "next/server";
import { writeClient } from "@/sanity/client";
import {
  buildReplyMarkup,
  pickDiscussionPrompt,
  pickTradeIdeaDiscussionPrompt,
} from "@/lib/telegram";
import type { Post } from "@/lib/posts";
import { SITE } from "@/lib/site";

export const runtime = "nodejs";

type CallbackQuery = {
  id: string;
  from: { id: number; username?: string; first_name?: string };
  message?: {
    message_id: number;
    chat: { id: number };
  };
  data?: string;
};

/**
 * A message update. We only act on `is_automatic_forward` messages — the copy
 * Telegram auto-posts into the linked discussion group when the channel
 * publishes. `forward_origin.message_id` (or the legacy `forward_from_message_id`)
 * is the ORIGINAL channel message id, which equals the `telegramMessageId` we
 * stored on the post when broadcasting.
 */
type TgMessage = {
  message_id: number;
  chat: { id: number };
  is_automatic_forward?: boolean;
  sender_chat?: { id: number };
  forward_from_chat?: { id: number };
  forward_from_message_id?: number;
  forward_origin?: { message_id?: number; chat?: { id: number } };
};

type Update = { callback_query?: CallbackQuery; message?: TgMessage };

async function tgCall<T>(method: string, body: unknown): Promise<T> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error("TELEGRAM_BOT_TOKEN not set");
  const res = await fetch(
    `https://api.telegram.org/bot${token}/${method}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );
  const json = (await res.json()) as { ok: boolean; description?: string; result?: T };
  if (!json.ok) {
    throw new Error(`telegram ${method}: ${json.description ?? "unknown"}`);
  }
  return json.result as T;
}

async function answer(callbackId: string, text?: string) {
  try {
    await tgCall("answerCallbackQuery", { callback_query_id: callbackId, text });
  } catch {
    // ignore — spinner will eventually clear on Telegram's side
  }
}

/**
 * When the channel auto-forwards a new post into the linked discussion group,
 * drop one category-aware discussion prompt as a reply into that post's thread.
 * This "wakes up" the otherwise-silent comment thread.
 *
 * MUST always resolve to a 200 (never throw): a non-200 makes Telegram retry
 * the update, which would double-post the prompt. Dedup is enforced by the
 * `telegramThreadSeeded` flag on the Sanity doc.
 */
async function handleAutoForward(msg: TgMessage): Promise<NextResponse> {
  // Only auto-forwards originating from OUR channel. Telegram may carry the
  // channel identity in any of sender_chat / forward_from_chat / forward_origin.chat
  // depending on API version, so accept a match on any of them (don't rely on
  // sender_chat alone — that silently skipped real forwards).
  const channelId = process.env.TELEGRAM_CHANNEL_ID;
  const chan = Number(channelId);
  const fromOurChannel =
    !!channelId &&
    (msg.sender_chat?.id === chan ||
      msg.forward_from_chat?.id === chan ||
      msg.forward_origin?.chat?.id === chan);
  if (!fromOurChannel) {
    return NextResponse.json({ ok: true, skipped: "not our channel forward" });
  }

  const channelMsgId = msg.forward_origin?.message_id ?? msg.forward_from_message_id;
  if (!channelMsgId) {
    return NextResponse.json({ ok: true, skipped: "no origin message id" });
  }

  try {
    // Try post first, then trade idea — both store telegramMessageId.
    const post = await writeClient.fetch<
      { _id: string; category: string; telegramThreadSeeded?: boolean } | null
    >(
      `*[_type=="post" && telegramMessageId == $mid][0]{ _id, category, telegramThreadSeeded }`,
      { mid: channelMsgId },
    );

    let docId: string | undefined;
    let prompt: string | undefined;

    if (post) {
      if (post.telegramThreadSeeded) {
        return NextResponse.json({ ok: true, skipped: "already seeded" });
      }
      docId = post._id;
      prompt = pickDiscussionPrompt(post.category, channelMsgId);
    } else {
      const idea = await writeClient.fetch<
        { _id: string; telegramThreadSeeded?: boolean } | null
      >(
        `*[_type=="tradeIdea" && telegramMessageId == $mid][0]{ _id, telegramThreadSeeded }`,
        { mid: channelMsgId },
      );
      if (idea) {
        if (idea.telegramThreadSeeded) {
          return NextResponse.json({ ok: true, skipped: "already seeded" });
        }
        docId = idea._id;
        prompt = pickTradeIdeaDiscussionPrompt(channelMsgId);
      }
    }

    if (!docId || !prompt) {
      return NextResponse.json({ ok: true, skipped: "no matching doc/prompt" });
    }

    await tgCall("sendMessage", {
      chat_id: msg.chat.id,
      text: prompt,
      // reply_to_message_id (classic, universally supported) — places the
      // prompt as a comment inside the post's discussion thread.
      reply_to_message_id: msg.message_id,
      disable_notification: true,
    });

    // Mark seeded AFTER a successful send so a send failure lets a retry try again.
    await writeClient.patch(docId).set({ telegramThreadSeeded: true }).commit();

    return NextResponse.json({ ok: true, seeded: docId });
  } catch (e) {
    console.warn(`[telegram/callback] auto-forward seed failed: ${(e as Error).message}`);
    // Still 200 — a retry would risk a double-post, and the flag isn't set yet
    // so the next genuine forward for a different post is unaffected.
    return NextResponse.json({ ok: true, skipped: "seed error (swallowed)" });
  }
}

export async function POST(req: Request) {
  let update: Update;
  try {
    update = (await req.json()) as Update;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 });
  }

  // Channel → linked-group auto-forward: seed the post's discussion thread.
  if (update.message?.is_automatic_forward) {
    return handleAutoForward(update.message);
  }

  const cb = update.callback_query;
  if (!cb?.data || !cb.message) {
    return NextResponse.json({ ok: true, skipped: "not a callback_query" });
  }

  // Parse "vote:up:<slug>" or "vote:down:<slug>"
  const m = cb.data.match(/^vote:(up|down):(.+)$/);
  if (!m) {
    await answer(cb.id);
    return NextResponse.json({ ok: true, skipped: "unrecognized callback" });
  }
  const [, voteType, slug] = m;
  const userId = cb.from.id;

  // Look up post by slug. When the slug was truncated to 54 chars to fit
  // Telegram's 64-byte callback_data limit, use a prefix range query:
  // slug >= key && slug < key + "{" covers all strings starting with key
  // ("{" is ASCII 123, one above "z"/122, safe for alphanumeric+hyphen slugs).
  type PostWithVotes = Post & {
    _id: string;
    tgUpvotes?: number;
    tgDownvotes?: number;
    tgVoters?: { userId: number; vote: "up" | "down" }[];
  };
  const slugEnd = slug + "{";
  const post = await writeClient.fetch<PostWithVotes | null>(
    `*[_type=="post" && slug.current >= $slug && slug.current < $slugEnd][0]{
      _id, title, summary, "slug": slug.current, category,
      "coverImage": coverImage, "bodyImages": bodyImages,
      tgUpvotes, tgDownvotes, tgVoters, meta
    }`,
    { slug, slugEnd },
  );
  if (!post) {
    await answer(cb.id, "글을 찾을 수 없어요");
    return NextResponse.json({ ok: true, skipped: "post not found" });
  }

  // Dedup: if user already voted, ignore (one vote per user, no flip)
  const voters = post.tgVoters ?? [];
  const existing = voters.find((v) => v.userId === userId);
  if (existing) {
    await answer(cb.id, existing.vote === voteType ? "이미 투표했어요" : "이미 반대로 투표했어요");
    return NextResponse.json({ ok: true, skipped: "already voted" });
  }

  // Increment counter + record voter
  const newUp = (post.tgUpvotes ?? 0) + (voteType === "up" ? 1 : 0);
  const newDown = (post.tgDownvotes ?? 0) + (voteType === "down" ? 1 : 0);
  await writeClient
    .patch(post._id)
    .set({ tgUpvotes: newUp, tgDownvotes: newDown })
    .append("tgVoters", [
      { _key: `v-${userId}-${Date.now()}`, userId, vote: voteType },
    ])
    .commit({ autoGenerateArrayKeys: true });

  // Edit the message reply_markup with new counts. We do this for the source
  // message only — if the post was mirrored to both channel and group, the
  // OTHER copy will keep its stale counts. This is acceptable: users see the
  // count of the copy they interacted with.
  try {
    const newMarkup = buildReplyMarkup(post, SITE.url, { up: newUp, down: newDown });
    if (newMarkup) {
      await tgCall("editMessageReplyMarkup", {
        chat_id: cb.message.chat.id,
        message_id: cb.message.message_id,
        reply_markup: newMarkup,
      });
    }
  } catch (e) {
    console.warn(`[telegram/callback] editMessageReplyMarkup failed: ${(e as Error).message}`);
  }

  await answer(cb.id, voteType === "up" ? "👍 감사합니다!" : "👎 의견 잘 받았어요");
  return NextResponse.json({ ok: true, up: newUp, down: newDown });
}
