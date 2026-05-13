// BTC spot ETF daily net flow.
// Uses SoSoValue's public endpoint (no auth required for basic series).
// Returns the most recent N days.

export type EtfFlowPoint = {
  date: string; // YYYY-MM-DD
  netFlowUsd: number; // can be negative (outflow)
};

export type EtfFlowResult = {
  latest: EtfFlowPoint | null;
  series: EtfFlowPoint[];
  total5dUsd: number;
};

// SoSoValue public ETF dashboard endpoint. If the schema changes, we degrade gracefully.
const URL_SOSOVALUE =
  "https://api.sosovalue.com/openapi/v2/etf/historicalInflowChart";

type SosoRow = {
  date?: string;
  ts?: number;
  // SoSoValue uses different keys across endpoints — accept several
  totalNetInflow?: string | number;
  netInflow?: string | number;
  value?: string | number;
};

type SosoResp = { data?: { list?: SosoRow[] } | SosoRow[] };

function pickNum(...vals: (string | number | undefined)[]): number {
  for (const v of vals) {
    if (v === undefined || v === null) continue;
    const n = typeof v === "string" ? Number(v) : v;
    if (Number.isFinite(n)) return n;
  }
  return 0;
}

export async function fetchBtcEtfFlow(days = 5): Promise<EtfFlowResult> {
  const empty: EtfFlowResult = { latest: null, series: [], total5dUsd: 0 };
  try {
    const res = await fetch(URL_SOSOVALUE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "us-btc-spot" }),
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error("sosovalue");
    const json = (await res.json()) as SosoResp;
    const rawList = Array.isArray(json.data)
      ? json.data
      : (json.data?.list ?? []);

    const series: EtfFlowPoint[] = rawList
      .map((r) => ({
        date:
          r.date ??
          (r.ts ? new Date(r.ts).toISOString().slice(0, 10) : ""),
        netFlowUsd: pickNum(r.totalNetInflow, r.netInflow, r.value),
      }))
      .filter((p) => p.date)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-days);

    const total5dUsd = series.reduce((s, p) => s + p.netFlowUsd, 0);
    const latest = series.length > 0 ? series[series.length - 1] : null;

    return { latest, series, total5dUsd };
  } catch {
    return empty;
  }
}
