/**
 * Sanity webhook → Telegram channel publisher.
 *
 * Triggered by a Sanity webhook configured in the project console with:
 *   URL:     https://<site>/api/telegram/publish
 *   Filter:  (_type == "post" && category->slug.current in
 *              ["macro","market","tokens","learn","basics","strategy"])
 *            || _type == "tradeIdea"
 *   Filter:  !(_id in path("drafts.**"))
 *   Project: { _id, _type, "slug": slug.current }
 *   Secret:  matches SANITY_WEBHOOK_SECRET in this server's env
 *
 * Keep the Sanity Console filter category list in sync with
 * TELEGRAM_BROADCAST_CATEGORIES in @/lib/telegram. If they drift, posts
 * in the missing category silently never broadcast.
 *
 * Behavior:
 *   - Verifies HMAC signature (`@sanity/webhook` isValidSignature)
 *   - Dispatches by _type: "post" → sendPostToTelegram, "tradeIdea" → sendTradeIdeaToTelegram
 *   - Skips drafts and non-broadcast categories (200 + skip reason)
 *   - Skips if telegramSentAt already set (dedup against Sanity retries)
 *   - For tradeIdea: only "active" status is broadcast
 *   - Sends to channel, then patches telegramSentAt + telegramMessageId
 */

import { NextResponse } from "next/server";
import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import { writeClient } from "@/sanity/client";
import { POST_PROJECTION } from "@/sanity/queries";
import type { Post } from "@/lib/posts";
import type { TradeIdea } from "@/lib/trade-ideas";
import { SITE } from "@/lib/site";
import {
  sendPostToTelegram,
  sendTradeIdeaToTelegram,
  TELEGRAM_BROADCAST_CATEGORIES,
} from "@/lib/telegram";

export const runtime = "nodejs";

type Payload = { _id?: string; _type?: string; slug?: string };

function isBroadcastCategory(slug: string): boolean {
  return (TELEGRAM_BROADCAST_CATEGORIES as readonly string[]).includes(slug);
}

export async function POST(req: Request) {
  const secret = process.env.SANITY_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "SANITY_WEBHOOK_SECRET not configured" },
      { status: 500 },
    );
  }

  const signature = req.headers.get(SIGNATURE_HEADER_NAME);
  const rawBody = await req.text();

  if (!signature || !(await isValidSignature(rawBody, signature, secret))) {
    return NextResponse.json(
      { ok: false, error: "invalid signature" },
      { status: 401 },
    );
  }

  let payload: Payload;
  try {
    payload = JSON.parse(rawBody) as Payload;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 });
  }

  const { _id } = payload;
  if (!_id) {
    return NextResponse.json({ ok: false, error: "missing _id" }, { status: 400 });
  }

  // Skip drafts (filter should already exclude, but defense-in-depth)
  if (_id.startsWith("drafts.")) {
    return NextResponse.json({ ok: true, skipped: "draft" });
  }

  const docType = payload._type;

  // ── TradeIdea branch ────────────────────────────────────────────
  if (docType === "tradeIdea") {
    const idea = await writeClient.fetch<
      (TradeIdea & { telegramSentAt?: string }) | null
    >(
      `*[_id == $id][0]{
        "slug": slug.current, title, publishedAt, status,
        symbol, direction, entry, stopLoss, takeProfits, rr, validUntil,
        thesis, invalidationCondition, tags, telegramSentAt
      }`,
      { id: _id },
    );
    if (!idea) {
      return NextResponse.json({ ok: true, skipped: "trade-idea not found" });
    }
    if (idea.status !== "active") {
      return NextResponse.json({ ok: true, skipped: `status=${idea.status}` });
    }
    if (idea.telegramSentAt) {
      return NextResponse.json({ ok: true, skipped: "already sent" });
    }
    try {
      const messageId = await sendTradeIdeaToTelegram(idea, SITE.url);
      await writeClient
        .patch(_id)
        .set({
          telegramSentAt: new Date().toISOString(),
          telegramMessageId: messageId,
        })
        .commit();
      return NextResponse.json({ ok: true, type: "tradeIdea", messageId });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[telegram/publish] trade-idea send failed:", msg);
      return NextResponse.json({ ok: false, error: msg }, { status: 500 });
    }
  }

  // ── Post branch (default) ──────────────────────────────────────
  const post = await writeClient.fetch<
    (Post & { telegramSentAt?: string }) | null
  >(`*[_id == $id][0]{ ${POST_PROJECTION}, telegramSentAt, telegramPoll }`, { id: _id });

  if (!post) {
    return NextResponse.json({ ok: true, skipped: "post not found" });
  }
  if (!isBroadcastCategory(post.category)) {
    return NextResponse.json({ ok: true, skipped: `category=${post.category}` });
  }
  if (post.telegramSentAt) {
    return NextResponse.json({ ok: true, skipped: "already sent" });
  }

  try {
    const messageId = await sendPostToTelegram(post, SITE.url);
    await writeClient
      .patch(_id)
      .set({
        telegramSentAt: new Date().toISOString(),
        telegramMessageId: messageId,
      })
      .commit();
    return NextResponse.json({ ok: true, type: "post", messageId });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[telegram/publish] send failed:", msg);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
