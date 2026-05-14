/**
 * One-shot: seed a sample tradeIdea document so /today and the home widget
 * have something to render during dev. Idempotent on slug.
 *
 * Usage (from worktree root, .env.local must contain SANITY_API_TOKEN +
 * NEXT_PUBLIC_SANITY_PROJECT_ID with write scope):
 *
 *   npx tsx seed-trade-idea-sample.mts
 *
 * Notes:
 *   - status: "active"
 *   - validUntil: 24h from now (so it doesn't immediately expire on the board)
 *   - This is a SAMPLE for visual verification only. Delete or close it
 *     before going to production.
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

const SLUG = "sample-btc-200dma-pullback";
const DOC_ID = `tradeIdea-${SLUG}`;

const now = new Date();
const validUntil = new Date(now.getTime() + 24 * 60 * 60 * 1000); // +24h

const doc = {
  _id: DOC_ID,
  _type: "tradeIdea",
  title: "BTCUSDT Long · 67,000 진입 (200DMA 풀백)",
  slug: { _type: "slug", current: SLUG },
  publishedAt: now.toISOString(),
  status: "active",
  symbol: "BTCUSDT",
  direction: "Long",
  entry: 67000,
  stopLoss: 65500,
  takeProfits: [70000, 72500],
  rr: 2.0,
  validUntil: validUntil.toISOString(),
  thesis:
    "200DMA(67,250) 위 첫 풀백. 거래량은 줄지만 펀딩비는 중립으로 정상화. 67,000은 5월 6일 스윙 저점과 일치 — 손절 근거 명확.",
  thesisLong:
    "지난주 71k에서 거부 후 4일째 조정 중이지만 200DMA를 한 번도 일중 종가 기준으로 깬 적 없음. 4시간 봉 RSI 42로 과매도 직전, 다이버전스 형성. 진입은 67,000 지정가, 손절은 65,500 (200DMA 1.5% 아래). 1차 익절 70,000은 직전 단기 고점, 2차 72,500은 ATH 직전 저항.\n\nBTC 도미넌스가 동시에 빠지면 알트로 자금 이동 신호 — 그 경우 1차에서 절반 익절 후 잔량은 그대로.",
  invalidationCondition:
    "1H 종가가 65,500 아래로 마감 시. 또는 4H 종가가 200DMA 아래로 마감 시 조기 손절.",
  tags: ["BTC", "Long", "200DMA"],
};

async function run() {
  await client.createOrReplace(doc);
  console.log(`✓ Seeded sample tradeIdea (slug=${SLUG}, _id=${DOC_ID})`);
  console.log(`  Status: active, valid until ${validUntil.toISOString()}`);
  console.log(`\nVerify:`);
  console.log(`  http://localhost:3001/today`);
  console.log(`  http://localhost:3001/today/${SLUG}`);
  console.log(`  http://localhost:3001/  (Promise 01 아래 카드)`);
  console.log(`\nWhen done testing, delete this doc in Studio or close via status field.`);
}

run().catch((err) => {
  console.error("✘ Seed failed:", err);
  process.exit(1);
});
