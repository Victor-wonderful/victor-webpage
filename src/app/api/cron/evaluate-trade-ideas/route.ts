/**
 * Vercel Cron — auto-evaluate expired trade ideas.
 *
 * Triggered by Vercel daily (UTC 00:00 = KST 09:00). See vercel.json crons.
 * Vercel injects Authorization: Bearer ${CRON_SECRET} on cron requests.
 *
 * The actual evaluation logic lives in @/lib/admin/evaluate-trade-ideas
 * and is shared with the admin manual-trigger endpoint.
 */

import { NextResponse } from "next/server";
import { evaluatePendingTradeIdeas } from "@/lib/admin/evaluate-trade-ideas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { count, results } = await evaluatePendingTradeIdeas();
  return NextResponse.json({ ok: true, count, results });
}
