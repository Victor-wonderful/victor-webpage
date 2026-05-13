/**
 * AI cover-image generator for Sanity posts.
 *
 * Flow:
 *   1. Studio Document Action posts { documentId, title, summary } here
 *      with an x-studio-secret header.
 *   2. We build a Korean-crypto-trading-editorial prompt and request
 *      a Flux-generated image from Pollinations.AI (free, no auth).
 *   3. Download the generated image, upload to Sanity as an asset,
 *      patch the post.coverImage reference, return success.
 *
 * Env required (server, Vercel):
 *   - SANITY_API_TOKEN   — already set, writeClient uses it
 *   - STUDIO_AI_SECRET   — shared secret; Studio sends as header
 *
 * No paid API keys needed. Pollinations.AI serves Flux-Schnell images
 * by URL; we just GET the URL and the body IS the PNG. They cache by
 * prompt, so we add a fresh `seed` each call to get a different image
 * for the same title (useful when the first result isn't ideal).
 *
 * Vercel timeout extended to 60s — Flux usually finishes in 5–15s,
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

function buildPollinationsUrl(prompt: string, seed: number): string {
  const params = new URLSearchParams({
    width: "1792",
    height: "1024",
    model: "flux",
    nologo: "true",
    enhance: "true",
    seed: String(seed),
  });
  // Path-encode the prompt; URLSearchParams handles the rest.
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?${params.toString()}`;
}

export async function POST(req: Request) {
  const secret = process.env.STUDIO_AI_SECRET;
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
  const seed = Math.floor(Math.random() * 1_000_000_000);
  const imageUrl = buildPollinationsUrl(prompt, seed);

  // 1. Generate + download in one step (Pollinations responds with the image body).
  let buffer: Buffer;
  let contentType = "image/jpeg";
  try {
    const imgRes = await fetch(imageUrl, {
      // Pollinations may take 5–15s. Allow up to 50s before bailing.
      signal: AbortSignal.timeout(50_000),
    });
    if (!imgRes.ok) {
      const text = await imgRes.text().catch(() => "");
      return NextResponse.json(
        {
          ok: false,
          error: `Pollinations ${imgRes.status}: ${text.slice(0, 200)}`,
        },
        { status: 502 },
      );
    }
    contentType = imgRes.headers.get("content-type") ?? contentType;
    buffer = Buffer.from(await imgRes.arrayBuffer());
    if (buffer.byteLength < 1024) {
      return NextResponse.json(
        { ok: false, error: "image too small — likely an error response" },
        { status: 502 },
      );
    }
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: `image fetch failed: ${(e as Error).message}` },
      { status: 502 },
    );
  }

  // 2. Upload to Sanity assets.
  let assetId: string;
  try {
    const ext = contentType.includes("png") ? "png" : "jpg";
    const asset = await writeClient.assets.upload("image", buffer, {
      filename: `ai-cover-${Date.now()}.${ext}`,
      contentType,
    });
    assetId = asset._id;
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: `sanity upload failed: ${(e as Error).message}` },
      { status: 502 },
    );
  }

  // 3. Patch the post's coverImage.
  //    Sanity stores draft documents under id "drafts.{id}" — patch the
  //    draft if it exists, otherwise the published doc.
  const draftId = documentId.startsWith("drafts.")
    ? documentId
    : `drafts.${documentId}`;
  const publishedId = documentId.replace(/^drafts\./, "");

  const coverImage = {
    _type: "image" as const,
    asset: { _type: "reference" as const, _ref: assetId },
  };

  try {
    await writeClient
      .patch(draftId)
      .set({ coverImage })
      .commit({ autoGenerateArrayKeys: true })
      .catch(async () => {
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

  return NextResponse.json({ ok: true, assetId, seed });
}
