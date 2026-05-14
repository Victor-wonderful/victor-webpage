/**
 * One-shot: create the "입문 가이드" (slug: learn) category document in Sanity.
 *
 * Usage (from worktree root, .env.local must contain SANITY_API_TOKEN +
 * NEXT_PUBLIC_SANITY_PROJECT_ID with write scope):
 *
 *   npx tsx seed-learn-category.mts
 *
 * Idempotent: if a category with slug=learn already exists, the script
 * just updates its title/description/eyebrow and exits.
 *
 * Why a script instead of "click Add in Studio":
 *   - Slug + eyebrow + description are all locked in src/lib/categories.ts,
 *     so we want them in Sanity to match exactly.
 *   - Re-running is safe — same _id, just patches fields.
 */

import { readFileSync } from "node:fs";
import { createClient } from "@sanity/client";

function loadEnvLocal() {
  try {
    const raw = readFileSync(".env.local", "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq <= 0) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // ignore
  }
}
loadEnvLocal();

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2024-01-01";
const token = process.env.SANITY_API_TOKEN;

if (!projectId) {
  console.error("✘ NEXT_PUBLIC_SANITY_PROJECT_ID not set in .env.local");
  process.exit(1);
}
if (!token) {
  console.error("✘ SANITY_API_TOKEN not set in .env.local (needs write scope)");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

const SLUG = "learn";
const TITLE = "입문 가이드";
const EYEBROW = "Learn";
const DESCRIPTION =
  "코인이 처음인 분들이 진짜 알아야 할 것들. 차트 보는 법, 거래소 기초, 지갑·보안, 첫 매매 전 체크 — 한 편씩 읽어도 완결.";

// Stable _id derived from slug so re-runs target the same doc.
const DOC_ID = `category-${SLUG}`;

async function run() {
  // Also rename the existing basics category in one go (label only).
  // basics 슬러그·_id 는 그대로 — 라벨만 "월가의 전설" 로.
  const basicsExisting = await client.fetch<{ _id: string } | null>(
    `*[_type == "category" && slug.current == "basics"][0]{ _id }`,
  );

  if (basicsExisting?._id) {
    await client
      .patch(basicsExisting._id)
      .set({
        title: "월가의 전설",
        eyebrow: "Wall Street Legends",
        description:
          "Livermore·Soros·Tudor Jones·Dalio·Druckenmiller의 원칙을 암호화폐에 적용하는 100편 시리즈 — 필자의 출판 도서를 블로그로 연재합니다.",
      })
      .commit();
    console.log(`✓ Renamed basics category to "월가의 전설" (${basicsExisting._id})`);
  } else {
    console.log(`! No existing basics category found — skipping rename.`);
  }

  // Create or update the learn category.
  await client.createOrReplace({
    _id: DOC_ID,
    _type: "category",
    title: TITLE,
    slug: { _type: "slug", current: SLUG },
    eyebrow: EYEBROW,
    description: DESCRIPTION,
  });

  console.log(`✓ Upserted category "${TITLE}" (slug=${SLUG}, _id=${DOC_ID})`);
  console.log(`\nNext: open Sanity Studio and verify both categories show.`);
  console.log(`  https://victor-alpha.sanity.studio`);
}

run().catch((err) => {
  console.error("✘ Seed failed:", err);
  process.exit(1);
});
