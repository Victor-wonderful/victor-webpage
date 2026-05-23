/**
 * Admin-only manual trigger — evaluates pending trade ideas immediately.
 *
 * Used by the "결과 평가" button in /admin. Gated by getAdminUser() (same
 * gate as /admin pages), so no CRON_SECRET is required.
 */
import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin/auth";
import { evaluatePendingTradeIdeas } from "@/lib/admin/evaluate-trade-ideas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const { count, results } = await evaluatePendingTradeIdeas();
    return NextResponse.json({ ok: true, count, results });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: (e as Error).message },
      { status: 500 },
    );
  }
}
