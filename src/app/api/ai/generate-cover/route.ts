/**
 * AI cover-image generator for Sanity posts.
 *
 * Flow:
 *   1. Studio Document Action posts { documentId, title, summary } here
 *      with an x-studio-secret header.
 *   2. We build a Korean-crypto-trading-editorial prompt and call
 *      OpenAI DALL-E 3.
 *   3. Download the generated PNG, upload to Sanity as an asset,
 *      patch the post.coverImage reference, return success.
 *
 * Env required (server, Vercel):
 *   - OPENAI_API_KEY           — DALL-E 3 access
 *   - SANITY_API_TOKEN         — already set, writeClient uses it
 *   - STUDIO_AI_SECRET         — shared secret; Studio sends as header
 *
 * Vercel timeout extended to 60s — DALL-E 3 commonly takes 5–15s,
 * plus upload latency.
 */

import { NextResponse } from "next/server";
import { writeClient } from "@/sanity/client";

export const runtime = "nodejs";
export const maxDuration = 60;

type Body = {
  documentId?: string;
  title?: string;
  summary?: string;
};

function buildPrompt(title: string, summary: string | undefined): string {
  const summaryLine = summary?.trim()
    ? ` Article gist: ${summary.trim()}.`
    : "";
  return [
    `Editorial cover illustration for a Korean cryptocurrency / trading article titled "${title}".`,
    summaryLine,
    `Style: minimalist professional financial magazine aesthetic, dark navy and ink with warm orange accents, high-contrast.`,
    `Composition: abstract candlestick or chart motifs, subtle grid or terminal feel, modern editorial layout.`,
    `Constraints: no readable text, no logos, no real ticker symbols, no UI screenshots, no human faces.`,
  ].join(" ");
}

export async function POST(req: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  const secret = process.env.STUDIO_AI_SECRET;
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, error: "OPENAI_API_KEY not configured" },
      { status: 500 },
    );
  }
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "STUDIO_AI_SECRET not configured" },
      { status: 500 },
    );
  }

  const provided = req.headers.get("x-studio-secret");
  if (provided !== secret) {
    return NextResponse.json(
      { ok: false, error: "unauthorized" },
      { status: 401 },
    );
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 });
  }

  const { documentId, title, summary } = body;
  if (!documentId || !title) {
    return NextResponse.json(
      { ok: false, error: "documentId and title required" },
      { status: 400 },
    );
  }

  const prompt = buildPrompt(title, summary);

  // 1. Generate via DALL-E 3
  let imageUrl: string;
  try {
    const dalleRes = await fetch(
      "https://api.openai.com/v1/images/generations",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt,
          size: "1792x1024",
          quality: "standard",
          n: 1,
        }),
      },
    );
    if (!dalleRes.ok) {
      const errBody = await dalleRes.text();
      return NextResponse.json(
        { ok: false, error: `OpenAI ${dalleRes.status}: ${errBody.slice(0, 200)}` },
        { status: 502 },
      );
    }
    const dalleJson = (await dalleRes.json()) as {
      data?: { url?: string }[];
    };
    const url = dalleJson.data?.[0]?.url;
    if (!url) {
      return NextResponse.json(
        { ok: false, error: "OpenAI returned no image url" },
        { status: 502 },
      );
    }
    imageUrl = url;
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: `OpenAI fetch failed: ${(e as Error).message}` },
      { status: 502 },
    );
  }

  // 2. Download the PNG
  let buffer: Buffer;
  try {
    const imgRes = await fetch(imageUrl);
    if (!imgRes.ok) {
      return NextResponse.json(
        { ok: false, error: `image download ${imgRes.status}` },
        { status: 502 },
      );
    }
    buffer = Buffer.from(await imgRes.arrayBuffer());
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: `image download failed: ${(e as Error).message}` },
      { status: 502 },
    );
  }

  // 3. Upload to Sanity assets
  let assetId: string;
  try {
    const asset = await writeClient.assets.upload("image", buffer, {
      filename: `ai-cover-${Date.now()}.png`,
      contentType: "image/png",
    });
    assetId = asset._id;
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: `sanity upload failed: ${(e as Error).message}` },
      { status: 502 },
    );
  }

  // 4. Patch the post's coverImage.
  //    Sanity stores draft documents under id "drafts.{id}" — we patch
  //    whichever exists. Try the draft first, fall back to published.
  const draftId = documentId.startsWith("drafts.")
    ? documentId
    : `drafts.${documentId}`;
  const publishedId = documentId.replace(/^drafts\./, "");

  const coverImage = {
    _type: "image" as const,
    asset: { _type: "reference" as const, _ref: assetId },
  };

  try {
    // Optimistic patch on draft (creates if needed via createIfNotExists path)
    await writeClient
      .patch(draftId)
      .set({ coverImage })
      .commit({ autoGenerateArrayKeys: true })
      .catch(async () => {
        // If draft doesn't exist, patch the published doc directly
        await writeClient
          .patch(publishedId)
          .set({ coverImage })
          .commit({ autoGenerateArrayKeys: true });
      });
  } catch (e) {
    return NextResponse.json(
      {
        ok: false,
        error: `patch failed: ${(e as Error).message}`,
        assetId,
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, assetId });
}
